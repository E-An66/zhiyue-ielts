(function () {
  "use strict";
  window.createStudyCloud = function (api) {
    const config = window.STUDY_CLOUD_CONFIG;
    const client = window.supabase.createClient(config.url, config.key);
    const model = window.StudySyncModel;
    let user = null, base = {}, running = false, timer, ready = false, flushingMedia = false;
    const legacyKey = "zhiyue-reader-v1";
    let prefix = "zhiyue-cloud:loggedout:";
    const read = (key, fallback) => {
      try { return JSON.parse(localStorage.getItem(prefix + key)) ?? fallback; } catch { return fallback; }
    };
    const write = (key, value) => localStorage.setItem(prefix + key, JSON.stringify(value));
    const clone = value => JSON.parse(JSON.stringify(value));
    const panel = document.createElement("dialog");
    panel.className = "cloud-dialog";
    panel.innerHTML = `<form id="cloudLogin"><h2>我的学习账号</h2><label>账号<input name="username" autocomplete="username" type="email" placeholder="账号邮箱" required></label><label>密码<input name="password" type="password" autocomplete="current-password" required></label><p id="cloudMessage" role="status"></p><button class="button primary" type="submit">登录</button></form><div id="cloudAccount" hidden><h2>我的学习账号</h2><p id="cloudAccountName"></p><p id="cloudAccountStatus" role="status"></p><button class="button primary" id="cloudSyncNow">立即同步</button><button class="button ghost" id="cloudConflicts">导出冲突副本</button><button class="button ghost" id="cloudLogout">退出账号</button><button class="button ghost" id="cloudClose">关闭</button></div>`;
    document.body.append(panel);
    const button = document.createElement("button");
    button.className = "cloud-status-button";
    button.textContent = "登录 / 云同步";
    document.querySelector(".sidebar-bottom").prepend(button);
    const mobile = document.createElement("button");
    mobile.className = "cloud-mobile-button";
    mobile.setAttribute("aria-label", "账号与同步状态");
    document.body.append(mobile);
    const status = message => {
      button.textContent = message;
      mobile.textContent = message;
      panel.querySelector("#cloudAccountStatus").textContent = message;
    };
    const open = () => { if (!panel.open) panel.showModal(); };
    button.onclick = mobile.onclick = open;
    const gate = value => document.body.classList.toggle("cloud-locked", value);
    panel.addEventListener("cancel", event => { if (!user) event.preventDefault(); });
    panel.querySelector("#cloudClose").onclick = () => panel.close();
    const storeConflicts = conflicts => {
      if (!conflicts.length) return;
      const previous = read("conflicts", []);
      for (const item of conflicts) {
        if (!previous.some(old => model.same(old.local, item.local) && old.path === item.path)) {
          previous.push({ ...item, at: new Date().toISOString() });
        }
      }
      write("conflicts", previous);
      api.toast("检测到同时修改，已保留冲突副本，可在账号中导出");
    };
    panel.querySelector("#cloudConflicts").onclick = () => {
      const blob = new Blob([JSON.stringify(read("conflicts", []), null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); link.download = "study-conflicts.json"; link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    };
    async function sync(force = false) {
      if (!user || !ready || running) return;
      if (!navigator.onLine) return status("离线 · 已保存在本机");
      if (api.busy()) {
        if (force) api.toast("当前练习结束或离开后会同步，内容已保存在本机");
        return;
      }
      running = true; status("同步中…");
      try {
        for (let attempt = 0; attempt < 5; attempt++) {
          const { data: remote, error } = await client.rpc("study_sync");
          if (error) throw error;
          const captured = clone(api.getData());
          const merged = model.merge(base, captured, remote.state);
          storeConflicts(merged.conflicts);
          let accepted = remote;
          if (!model.same(merged.state, remote.state)) {
            const result = await client.rpc("study_sync", { expected_revision: remote.revision, new_state: merged.state });
            if (result.error) throw result.error;
            if (result.data.status === "conflict") continue;
            accepted = result.data;
          }
          const final = model.merge(captured, api.getData(), accepted.state);
          storeConflicts(final.conflicts);
          base = clone(accepted.state); write("base", base);
          write("state", final.state);
          if (!model.same(final.state, api.getData())) api.apply(final.state);
          const mediaCount = read("mediaQueue", []).length;
          status("已同步 · " + (mediaCount ? `${mediaCount} 个文件待上传` : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })));
          if (!model.same(final.state, accepted.state)) schedule();
          return;
        }
        throw new Error("同步竞争，请稍后重试");
      } catch (error) {
        status("未同步 · 本机记录已保留");
        if (force) api.toast("同步失败：" + error.message);
      } finally { running = false; }
    }
    function schedule() { clearTimeout(timer); timer = setTimeout(() => sync(), 1500); }
    function changed() {
      if (!user || !ready) return;
      write("state", api.getData());
      status(navigator.onLine ? "待同步 · 本机已保存" : "离线 · 已保存在本机");
      schedule();
    }
    async function accept(session) {
      if (!session) {
        user = null; ready = false; gate(true); open(); return;
      }
      user = session.user;
      prefix = "zhiyue-cloud:" + user.id + ":";
      let catalogue = read("catalogue", null);
      if (navigator.onLine) {
        const result = await client.from("study_private_catalogue").select("catalogue").eq("user_id", user.id).single();
        if (!result.error) { catalogue = result.data.catalogue; write("catalogue", catalogue); }
      }
      if (!catalogue) {
        user = null; gate(true); open();
        panel.querySelector("#cloudMessage").textContent = "私人词库加载失败，请联网后重新登录";
        return;
      }
      for (const key of ["LISTENING_777_VOCAB", "READING_NOTES", "LISTENING_NOTES", "EXPRESSION_SEEDS", "LISTENING_ANSWER_BANK", "OCT08_AUDIT"]) {
        if (catalogue[key]) window[key] = catalogue[key];
      }
      base = read("base", {});
      const cache = read("state", null);
      if (cache) api.apply(cache);
      else {
        const legacy = localStorage.getItem(legacyKey);
        if (legacy) localStorage.setItem(prefix + "legacy-backup", legacy);
        write("state", api.getData());
      }
      ready = true; gate(false);
      panel.querySelector("#cloudAccountName").textContent = user.email;
      api.refresh();
      panel.querySelector("#cloudLogin").hidden = true;
      panel.querySelector("#cloudAccount").hidden = false;
      panel.close();
      status(navigator.onLine ? "等待同步" : "离线 · 已保存在本机");
      await sync();
      if (!read("mediaMigrated", false)) {
        const keys = await api.assetKeys();
        write("mediaQueue", [...new Set([...read("mediaQueue", []), ...keys])]);
        write("mediaMigrated", true);
      }
      await flushMedia();
    }
    panel.querySelector("#cloudLogin").onsubmit = async event => {
      event.preventDefault();
      const form = event.target, submit = form.querySelector("button");
      const message = panel.querySelector("#cloudMessage");
      submit.disabled = true; message.textContent = "正在登录…";
      try {
        const result = await client.auth.signInWithPassword({ email: form.username.value.trim(), password: form.password.value });
        if (result.error) throw result.error;
        form.password.value = ""; message.textContent = "";
        await accept(result.data.session);
      } catch { message.textContent = "登录失败，请检查密码和网络"; }
      finally { submit.disabled = false; }
    };
    panel.querySelector("#cloudSyncNow").onclick = () => sync(true);
    panel.querySelector("#cloudLogout").onclick = async () => {
      if (running || api.busy()) { api.toast("请先结束练习，等待同步完成后退出"); return; }
      await sync(true);
      const pending = !model.same(base, api.getData()) || read("mediaQueue", []).length;
      if (pending && !confirm("尚有本机内容未上传，退出后仍会保留在这台设备，继续退出？")) return;
      await client.auth.signOut({ scope: "local" });
      user = null; ready = false; gate(true);
      panel.querySelector("#cloudLogin").hidden = false;
      panel.querySelector("#cloudAccount").hidden = true;
      status("登录 / 云同步"); open();
    };
    const mediaPath = (key, version) => `${user.id}/${encodeURIComponent(key)}--${version}`;
    async function upload(key, blob, version = api.getData().assetVersions?.[key] || "legacy") {
      if (!user) return;
      const queue = read("mediaQueue", []);
      if (!queue.includes(key)) { queue.push(key); write("mediaQueue", queue); }
      const versions = read("mediaVersions", {}); versions[key] = version; write("mediaVersions", versions);
      if (!navigator.onLine) return;
      if (blob.size > 50 * 1024 * 1024) { api.toast("文件超过免费方案 50MB 限制，仅保留本机副本"); return; }
      const { error } = await client.storage.from("study-private").upload(mediaPath(key, version), blob, { upsert: true, contentType: blob.type || "application/octet-stream" });
      if (!error && read("mediaVersions", {})[key] === version) write("mediaQueue", read("mediaQueue", []).filter(item => item !== key));
      else api.toast("文件尚未上传，本机副本已保留");
    }
    async function download(key) {
      if (!user || !navigator.onLine) return null;
      const { data, error } = await client.storage.from("study-private").download(mediaPath(key, api.getData().assetVersions?.[key] || "legacy"));
      return error ? null : data;
    }
    async function flushMedia() {
      if (!user || !navigator.onLine || flushingMedia) return;
      flushingMedia = true;
      try {
        for (const key of read("mediaQueue", [])) {
          if (!user) break;
          const blob = await api.localAsset(key);
          const version = read("mediaVersions", {})[key] || "legacy";
          if (blob) await upload(key, blob, version);
        }
      } catch { status("文件待上传 · 本机已保存"); }
      finally { flushingMedia = false; }
    }
    gate(true);
    client.auth.getSession().then(result => accept(result.data.session)).catch(() => { status("请登录"); open(); });
    window.addEventListener("online", () => { sync(); flushMedia(); });
    window.addEventListener("focus", () => { sync(); flushMedia(); });
    setInterval(() => { if (!document.hidden) { sync(); flushMedia(); } }, 20000);
    return { changed, sync, upload, download, flushMedia };
  };
})();
