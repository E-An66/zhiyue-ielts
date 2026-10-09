(function () {
  "use strict";
  const BUILD = "20261009-batch1";
  const button = document.querySelector("#checkUpdate");
  const label = document.querySelector("#updateStatus");
  const banner = document.querySelector("#updateBanner");
  let registration, ready = false, checking = false, lastCheck = 0;
  function showReady() {
    ready = true;
    banner.hidden = false;
    button.querySelector("span").textContent = "刷新到新版";
    label.textContent = "新版已就绪，学习记录保留";
  }
  function workerVersion() {
    return new Promise(resolve => {
      const worker = navigator.serviceWorker.controller || registration?.active;
      if (!worker) return resolve(null);
      const channel = new MessageChannel();
      const timer = setTimeout(() => {channel.port1.close();resolve(null);}, 2000);
      channel.port1.onmessage = e => {clearTimeout(timer);channel.port1.close();resolve(e.data?.build || null);};
      worker.postMessage({type:"GET_BUILD"},[channel.port2]);
    });
  }
  async function compare() {
    const build = await workerVersion();
    if (build && build !== BUILD) showReady();
    return build;
  }
  async function check(manual = false) {
    if (ready && manual) return location.reload();
    if (checking || (!manual && Date.now()-lastCheck<60000)) return;
    if (!navigator.onLine) {if(manual)label.textContent="当前离线，联网后再检查";return;}
    checking=true;lastCheck=Date.now();button.disabled=true;
    if(manual)label.textContent="正在检查更新…";
    try {
      registration ||= await navigator.serviceWorker.register("./service-worker.js",{updateViaCache:"none"});
      await registration.update();
      const pending = registration.installing || registration.waiting;
      if (pending && pending.state !== "activated" && pending.state !== "redundant") {
        await new Promise(resolve => {
          const done=()=>{clearTimeout(timer);pending.removeEventListener("statechange",changed);resolve();};
          const changed=()=>{if(["activated","redundant"].includes(pending.state))done();};
          const timer=setTimeout(done,12000);pending.addEventListener("statechange",changed);changed();
        });
      }
      const build=await compare();
      if(manual&&!ready)label.textContent=registration.installing?"新版正在下载，稍后再检查":build===BUILD?"已是最新版":"暂未确认版本，请稍后重试";
    } catch {if(manual)label.textContent="检查失败，请联网后重试";}
    finally {checking=false;button.disabled=false;}
  }
  document.querySelector("#applyUpdate").addEventListener("click",()=>location.reload());
  if (!("serviceWorker" in navigator) || location.protocol === "file:") {
    button.disabled=true;label.textContent="本地文件模式";return;
  }
  button.addEventListener("click",()=>check(true));
  navigator.serviceWorker.addEventListener("controllerchange",compare);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)check();});
  window.addEventListener("online",()=>check());
  check();
})();
