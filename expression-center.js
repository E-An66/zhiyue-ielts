(function () {
  "use strict";
  const names = { listening: "听力", speaking: "口语", reading: "阅读", writing: "写作" };
  const dateKey = time => new Date(time).toLocaleDateString("en-CA");
  window.createExpressionCenter = function (api) {
    const { getData, save, icon, escapeHtml: esc, navigate, toast, speak, putAsset, getAsset } = api;
    const data = () => getData();
    data().expressionProgress ||= {};
    data().expressionEnabled ||= {};
    data().expressionPlan ||= { listening: 2, speaking: 2, reading: 3, writing: 2 };
    data().expressionSessions ||= {};
    data().expressionEntries ||= {};
    data().expressionLog ||= [];
    data().expressionDrafts ||= {};
    const scheduler = FSRS.fsrs({ request_retention: .9, enable_fuzz: false, enable_short_term: true, maximum_interval: 365 });
    let skill = "all", source = "all", status = "all", query = "", active = "reading";
    let recorder, stream, recordTimer, pending = false, generation = 0, audioUrl;
    const items = () => {
      const map = new Map(window.EXPRESSION_SEEDS.map(e => [e.id, e]));
      for (const e of Object.values(data().expressionEntries)) map.set(e.id, e);
      return [...map.values()];
    };
    const key = (k, id) => `${k}:${id}`;
    const enabled = (e, k) => data().expressionEnabled[key(k, e.id)] ?? e.defaultSkills.includes(k);
    const progress = (e, k) => data().expressionProgress[key(k, e.id)];
    function counts(k) {
      const all = items().filter(e => enabled(e, k));
      const fresh = all.filter(e => !progress(e, k));
      const due = all.filter(e => progress(e, k)?.nextAt <= Date.now());
      const learned = Object.entries(data().expressionProgress).filter(([id,p]) => id.startsWith(k+":") && dateKey(p.learnedAt) === dateKey(Date.now())).length;
      const reviewed = new Set(data().expressionLog.filter(e => e.skill === k && e.kind === "review" && dateKey(e.at) === dateKey(Date.now())).map(e => e.id)).size;
      return { all, fresh, due, learned, reviewed, remaining: Math.min(fresh.length, Math.max(0, data().expressionPlan[k] - learned)) };
    }
    function interval(at) {
      const mins = Math.max(0, Math.ceil((+new Date(at) - Date.now()) / 60000));
      return mins < 1 ? "现在" : mins < 60 ? `${mins} 分钟后` : mins < 1440 ? `${Math.ceil(mins/60)} 小时后` : `${Math.round(mins/1440)} 天后`;
    }
    function card(e, k) {
      const p = progress(e, k);
      return p ? { ...p.card, due: new Date(p.card.due), last_review: p.card.last_review ? new Date(p.card.last_review) : undefined } : FSRS.createEmptyCard(new Date());
    }
    function head(title, subtitle, actions = "") {
      return `<header class="lc-heading"><div><p class="lc-eyebrow">知阅 IELTS</p><h1>${title}</h1><p>${subtitle}</p></div><div class="lc-actions">${actions}</div></header>`;
    }
    const button = (action, label, disabled = false) => `<button type="button" class="button" data-ex="${action}" ${disabled ? "disabled" : ""}>${label}</button>`;
    function open(k = "all") { skill = k; source = "all"; status = "all"; query = ""; navigate("expressions"); }
    function modes(k, expression = true) {
      return `<div class="ex-modes" role="tablist" aria-label="学习内容"><button role="tab" aria-selected="${!expression}" data-ex-words="${k === "all" ? "reading" : k}">单词</button><button role="tab" aria-selected="${expression}" data-ex-open="${k}">同义表达</button></div>`;
    }
    function scope(e) { return (source === "all" || e.source === source) && `${e.left} ${e.right} ${e.meaning} ${e.source}`.toLowerCase().includes(query.toLowerCase()); }
    function filtered() {
      return items().filter(e => scope(e) && (skill === "all" || status === "all" ||
        status === "enabled" && enabled(e, skill) || status === "new" && enabled(e, skill) && !progress(e, skill) ||
        status === "due" && enabled(e, skill) && progress(e, skill)?.nextAt <= Date.now()));
    }
    function audio(text) { return `<button class="icon-button" data-speak="${esc(text)}" title="听发音" aria-label="朗读 ${esc(text)}">${icon("volume")}</button>`; }
    function pair(e) {
      return `<div class="ex-pair"><div><small>笔记表达 A</small><strong>${esc(e.left)}</strong>${audio(e.left)}</div><span aria-hidden="true">↔</span><div><small>笔记表达 B</small><strong>${esc(e.right)}</strong>${audio(e.right.replace(/\//g, "; "))}</div></div><p>${esc(e.meaning)}</p>${e.reference?.startsWith("https://")?`<p><a href="${esc(e.reference)}" target="_blank" rel="noopener noreferrer">词义核对来源</a></p>`:""}<p class="ex-caution">${esc(e.note)}</p>${e.practiceLeft ? `<div class="ex-example"><small>${esc(e.practiceLabel)}</small><p>${esc(e.practiceLeft)} ↔ ${esc(e.practiceRight)}</p></div>` : ""}`;
    }
    function rows() {
      return filtered().map(e => `<article class="ex-row"><div class="ex-row-head"><span>${esc(e.source)} · ${esc(e.relation)}</span><button class="icon-button" data-ex-edit="${esc(e.id)}" aria-label="编辑表达" title="编辑表达">${icon("pen")}</button></div><div class="ex-row-pair"><strong>${esc(e.left)}</strong><span>↔</span><strong>${esc(e.right)}</strong></div><p>${esc(e.meaning)}</p><div class="ex-enables">${Object.entries(names).map(([k,name]) => {const p=progress(e,k);return `<label><input type="checkbox" data-ex-enable="${esc(e.id)}" data-skill="${k}" ${enabled(e,k)?"checked":""}>${name}<small>${!enabled(e,k)?"未启用":!p?"未学":interval(p.nextAt)}</small></label>`;}).join("")}</div><details><summary>语境与发音</summary><small>${esc(e.provenance)}</small>${pair(e)}</details></article>`).join("") || `<div class="empty-state"><p>没有符合条件的表达</p></div>`;
    }
    function actions() {
      if (skill === "all") return `<span>${items().length} 组共享表达</span>`;
      const c = counts(skill), n = Math.min(c.remaining, c.fresh.filter(scope).length), due = c.due.filter(scope).length;
      return `<div class="lc-actions"><button class="button primary" data-ex-start="new" data-skill="${skill}" ${!n?"disabled":""}>${icon("plus")}新学 ${n} 组</button><button class="button" data-ex-start="review" data-skill="${skill}" ${!due?"disabled":""}>${icon("refresh")}复习 ${due} 组</button></div><span>已启用 ${c.all.length} 组 · 今日新学 ${c.learned} / ${data().expressionPlan[skill]}</span>`;
    }
    function library() {
      return `<section class="page lc-page ex-page">${head("同义表达库",skill === "all" ? "全部科目 · 共享资料" : `${names[skill]} · ${["listening","reading"].includes(skill)?"识别与理解":"主动表达"}`,`${button("add",icon("plus")+"添加表达")}${button("export",icon("download")+"导出资料")}`)}<div class="lc-tabs" role="tablist" aria-label="表达科目">${[["all","全部"],...Object.entries(names)].map(([k,n])=>`<button role="tab" aria-selected="${skill===k}" class="${skill===k?"active":""}" data-ex-skill="${k}">${n}</button>`).join("")}</div>${modes(skill)}${resume(skill)}<div class="lc-library-actions" id="exActions">${actions()}</div><div class="lc-filters"><input id="exSearch" type="search" value="${esc(query)}" placeholder="搜索表达、含义或来源" aria-label="搜索表达"><select id="exSource" aria-label="文章来源"><option value="all">全部来源</option>${[...new Set(items().map(e=>e.source))].map(s=>`<option value="${esc(s)}" ${source===s?"selected":""}>${esc(s)}</option>`).join("")}</select><select id="exStatus" aria-label="表达状态" ${skill==="all"?"disabled":""}>${[["all","全部资料"],["enabled","已启用"],["new","未学"],["due","到期复习"]].map(([k,n])=>`<option value="${k}" ${status===k?"selected":""}>${n}</option>`).join("")}</select></div><div id="exRows">${rows()}</div><div id="exEditorHost"></div></section>`;
    }
    function refreshList() { document.querySelector("#exRows").innerHTML=rows(); document.querySelector("#exActions").innerHTML=actions(); }
    function resume(k) {
      const sessions = k === "all" ? Object.values(data().expressionSessions) : [data().expressionSessions[k]].filter(Boolean);
      return sessions.map(s => `<div class="lc-resume"><span>${names[s.skill]} · 同义表达${s.kind==="new"?"新学":"复习"}进度已保存</span><button class="button" data-ex-resume="${s.skill}">继续表达学习</button></div>`).join("");
    }
    function homeBlock(k) {
      const c=counts(k);
      return `<div class="ex-deck"><button class="text-button" data-ex-open="${k}">同义表达 ${icon("chevron")}</button><p>可新学 ${c.remaining} 组 · 到期 ${c.due.length} 组</p><div class="lc-actions"><button class="button" data-ex-start="new" data-skill="${k}" ${!c.remaining?"disabled":""}>新学表达</button><button class="button" data-ex-start="review" data-skill="${k}" ${!c.due.length?"disabled":""}>复习表达</button></div>${data().expressionSessions[k]?resume(k):""}</div>`;
    }
    function summary() {
      const cs=Object.keys(names).map(counts);
      return `<p class="ex-summary">同义表达 · 今日新学 ${cs.reduce((n,c)=>n+c.learned,0)} 组 · 已复习 ${cs.reduce((n,c)=>n+c.reviewed,0)} 组 · 到期 ${cs.reduce((n,c)=>n+c.due.length,0)} 组</p>`;
    }
    function dueBetween(start,end) {
      return Object.keys(names).flatMap(k=>counts(k).all.map(e=>progress(e,k))).filter(p=>p && p.nextAt>=start && p.nextAt<end).length;
    }
    function planFields() {
      return `<h2 class="ex-plan-title">同义表达每日新学</h2>${Object.entries(names).map(([k,n])=>`<label><strong>${n}表达</strong><input type="number" name="expression-${k}" min="0" max="30" step="1" required value="${data().expressionPlan[k]}"><span>组</span></label>`).join("")}`;
    }
    function savePlan(form) {for(const k of Object.keys(names))data().expressionPlan[k]=Math.max(0,Math.min(30,Math.floor(Number(form.get(`expression-${k}`))||0)));}
    function history() {
      return `<section class="lc-band"><h2>同义表达学习记录</h2><div class="lc-history">${data().expressionLog.slice(-20).reverse().map(l=>`<div><span>${new Date(l.at).toLocaleString("zh-CN")}</span><strong>${esc(items().find(e=>e.id===l.id)?.left||"表达")}</strong><span>${names[l.skill]} · ${l.kind==="new"?"新学":"复习"}</span></div>`).join("")||"还没有表达学习记录"}</div></section>`;
    }
    function start(kind,k) {
      active=k;
      if(data().expressionSessions[k]) {toast("继续该科目未完成的表达学习");navigate("expression-review");return;}
      const c=counts(k), scoped=api.route()==="expressions" && skill===k;
      const selected=(kind==="new"?c.fresh:c.due).filter(e=>!scoped||scope(e)).sort((a,b)=>(progress(a,k)?.nextAt||0)-(progress(b,k)?.nextAt||0)).slice(0,kind==="new"?Math.min(3,c.remaining):10);
      if(!selected.length)return toast("当前没有可学习的表达，请检查启用科目、筛选或今日额度");
      for (const e of selected) delete data().expressionDrafts[key(k,e.id)];
      data().expressionSessions[k]={skill:k,kind,ids:selected.map(e=>e.id),index:0,phase:kind==="new"?"intro":"recall",revealed:false};
      save();navigate("expression-review");
    }
    const sessionData=()=>data().expressionSessions[active];
    const current=()=>items().find(e=>e.id===sessionData()?.ids[sessionData().index]);
    function session() {
      const s=sessionData(),e=current();
      if(!s||!e)return `<section class="page lc-page">${head("本组表达已完成","复习时间已保存")}${button("home","返回今日学习")}${button("library","返回表达库")}</section>`;
      const p=progress(e,active),reverse=(p?.reviews||0)%2===1, a=e.practiceLeft||e.left,b=e.practiceRight||e.right;
      const prompt=reverse?b:a,target=reverse?a:b,intro=s.phase==="intro", draft=data().expressionDrafts[key(active,e.id)]||"";
      const prompts={reading:"回想对应表达与共同含义",listening:"听另一种表达，回想它与当前表达的关系",speaking:"用英语表达这个意思，再换一种说法",writing:"保留原意，换一种表达"};
      const choices=scheduler.repeat(card(e,active),new Date());
      return `<section class="page lc-page ex-page ex-session">${head(`${names[active]} · 同义表达`,`${intro?"认识表达":"主动回忆"} · ${s.index+1} / ${s.ids.length}`,button("home","稍后继续"))}<progress value="${s.index}" max="${s.ids.length}"></progress><section class="ex-training"><p class="ex-meta">${esc(e.source)} · ${esc(e.relation)}</p>${intro?pair(e):`<p>${prompts[active]}</p><h2>${esc(active==="speaking"?e.meaning:prompt)}</h2>${e.practiceLabel?`<small>${esc(e.practiceLabel)}</small>`:""}${active==="listening"?`<button class="button" data-ex="listen">${icon("volume")}播放另一种表达</button><small class="ex-tts">合成语音练习，非真题录音</small>`:""}<label class="ex-draft-label">${active==="writing"?"我的改写":active==="speaking"?"口头表达提纲（可选）":"我的回想（可选）"}<textarea id="exDraft" maxlength="4000">${esc(draft)}</textarea></label>${active==="speaking"?`<div class="lc-actions">${button("record",icon("mic")+"开始录音")}${button("stop",icon("x")+"停止录音",true)}</div><p id="exRecordStatus" role="status"></p><audio id="exRecording" controls hidden></audio><a id="exDownload" hidden download="expression-recording">下载录音</a><small class="ex-tts">录音仅存本机 · 自评练习，无自动评分</small>`:""}`}${intro?button("next","开始回想"):!s.revealed?button("reveal","查看参考与语境"):`<div class="ex-reference"><h3>参考对照</h3>${pair(e)}<p class="ex-meta">${active==="speaking"||active==="writing"?"参考不是唯一答案 · 本次为自评，不代表雅思评分":"按实际回想情况自评"}</p><div class="ex-checks"><label><input type="checkbox">共同含义与范围一致</label><label><input type="checkbox">词性、结构与搭配合适</label></div></div><div class="lc-ratings">${[[1,"忘记"],[2,"模糊"],[3,"记得"],[4,"轻松"]].map(([r,n])=>`<button data-ex-rate="${r}"><strong>${n}</strong><small>${interval(choices[r].card.due)}</small></button>`).join("")}</div>`}</section></section>`;
    }
    function rate(r) {
      const s=sessionData(),e=current();if(!s?.revealed||!e||![1,2,3,4].includes(r))return;
      const now=new Date(),p=progress(e,active),result=scheduler.next(card(e,active),now,r);
      data().expressionProgress[key(active,e.id)]={card:result.card,nextAt:+result.card.due,learnedAt:p?.learnedAt||+now,reviews:(p?.reviews||0)+1};
      data().expressionLog.push({id:e.id,skill:active,kind:p?"review":"new",at:+now,rating:r});
      if(r===1&&s.ids.filter(id=>id===e.id).length<3)s.ids.push(e.id);
      s.index++;s.revealed=false;s.phase="recall";
      if(s.index>=s.ids.length)delete data().expressionSessions[active];
      else if(s.kind==="new"&&!progress(current(),active))s.phase="intro";
      save();leave();navigate("expression-review");
    }
    function editor(id) {
      const e=items().find(e=>e.id===id)||{id:"",left:"",right:"",meaning:"",source:"个人积累",relation:"语境改述",note:"",provenance:"个人笔记",practiceLeft:"",practiceRight:"",defaultSkills:[]};
      document.querySelector("#exEditorHost").innerHTML=`<dialog id="exEditor"><form id="exEditForm" data-id="${esc(e.id)}"><h2>${id?"编辑":"添加"}表达</h2>${[["left","表达 A"],["right","表达 B"],["meaning","共同含义"],["source","文章 / 主题"],["note","语境与使用限制"]].map(([k,n])=>`<label>${n}<textarea name="${k}" maxlength="${k==="note"?2000:500}" ${k!=="note"?"required":""}>${esc(e[k])}</textarea></label>`).join("")}<label>关系类型<select name="relation">${["近义表达","短语改写","句式变化","解释性改述","语境改述","语境对应"].map(t=>`<option ${t===e.relation?"selected":""}>${t}</option>`).join("")}</select></label><fieldset><legend>启用科目</legend>${Object.entries(names).map(([k,n])=>`<label><input type="checkbox" name="skill" value="${k}" ${id?enabled(e,k)?"checked":"":skill===k?"checked":""}>${n}</label>`).join("")}</fieldset><div class="lc-actions"><button class="button primary" type="submit">保存表达</button>${button("cancel","取消")}</div></form></dialog>`;
      document.querySelector("#exEditor").showModal();
    }
    async function hydrate() {
      if(api.route()!=="expression-review"||active!=="speaking"||!current())return;
      const token=++generation,k=key(active,current().id),blob=await getAsset(`expression:${k}`);
      if(token!==generation||!blob||!document.querySelector("#exRecording"))return;
      if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(blob);
      const player=document.querySelector("#exRecording");player.src=audioUrl;player.hidden=false;
      const link=document.querySelector("#exDownload");link.href=audioUrl;link.hidden=false;
    }
    function stop() {clearTimeout(recordTimer);if(recorder?.state==="recording")recorder.stop();stream?.getTracks().forEach(t=>t.stop());stream=null;}
    function leave() {generation++;pending=false;stop();if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=null;}
    async function record() {
      if(pending||recorder?.state==="recording"||!current())return;
      if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)return toast("此浏览器不支持录音，可使用文字提纲练习");
      const token=++generation,k=key(active,current().id);pending=true;
      try {
        const acquired=await navigator.mediaDevices.getUserMedia({audio:true});
        if(token!==generation){acquired.getTracks().forEach(t=>t.stop());return;}
        stream=acquired;
        const mime=["audio/webm;codecs=opus","audio/mp4","audio/webm"].find(t=>MediaRecorder.isTypeSupported(t));
        const r=new MediaRecorder(stream,mime?{mimeType:mime}:undefined),chunks=[];recorder=r;
        r.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
        r.onstop=async()=>{const blob=new Blob(chunks,{type:r.mimeType});if(!blob.size)return;
          try{await putAsset(`expression:${k}`,blob);if(api.route()==="expression-review"&&current()&&key(active,current().id)===k){await hydrate();document.querySelector("#exRecordStatus").textContent="录音已保存到本机";}}
          catch{toast("录音保存失败，请下载备份");if(document.querySelector("#exDownload")){audioUrl=URL.createObjectURL(blob);const link=document.querySelector("#exDownload");link.href=audioUrl;link.hidden=false;}}
        };
        r.start();document.querySelector('[data-ex="record"]').disabled=true;document.querySelector('[data-ex="stop"]').disabled=false;
        document.querySelector("#exRecordStatus").textContent="正在录音 · 最长 2 分钟";
        recordTimer=setTimeout(()=>{stop();recordButtons();},120000);
      } catch {stream?.getTracks().forEach(t=>t.stop());toast("未能开启麦克风，你仍可口头练习或填写提纲");} finally {pending=false;}
    }
    function recordButtons(){const b=document.querySelector('[data-ex="record"]'),s=document.querySelector('[data-ex="stop"]');if(b)b.disabled=false;if(s)s.disabled=true;}
    document.addEventListener("click",e=>{
      const el=e.target.closest("[data-ex],[data-ex-open],[data-ex-skill],[data-ex-words],[data-ex-start],[data-ex-rate],[data-ex-resume],[data-ex-edit]");if(!el)return;
      if(el.dataset.exOpen)return open(el.dataset.exOpen);
      if(el.dataset.exSkill)return open(el.dataset.exSkill);
      if(el.dataset.exWords)return api.openWords(el.dataset.exWords);
      if(el.dataset.exStart)return start(el.dataset.exStart,el.dataset.skill);
      if(el.dataset.exResume){active=el.dataset.exResume;return navigate("expression-review");}
      if(el.dataset.exRate)return rate(Number(el.dataset.exRate));
      if(el.dataset.exEdit)return editor(el.dataset.exEdit);
      const action=el.dataset.ex,s=sessionData();
      if(action==="home")return navigate("study");if(action==="library")return open(active);
      if(action==="add")return editor();if(action==="cancel")return document.querySelector("#exEditor").close();
      if(action==="next"&&s){s.phase="recall";save();return navigate("expression-review");}
      if(action==="reveal"&&s){s.revealed=true;save();leave();return navigate("expression-review");}
      if(action==="listen"){const item=current();return speak((progress(item,active)?.reviews||0)%2===1?(item.practiceLeft||item.left):(item.practiceRight||item.right));}
      if(action==="record")return record();if(action==="stop"){stop();recordButtons();return;}
      if(action==="export"){const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,expressions:items()},null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="ielts-expressions.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
    });
    document.addEventListener("input",e=>{
      if(e.target.id==="exSearch"){query=e.target.value;refreshList();}
      if(e.target.id==="exDraft"&&current()){data().expressionDrafts[key(active,current().id)]=e.target.value;save();}
    });
    document.addEventListener("change",e=>{
      if(e.target.dataset.exEnable){data().expressionEnabled[key(e.target.dataset.skill,e.target.dataset.exEnable)]=e.target.checked;save();refreshList();}
      if(e.target.id==="exSource"){source=e.target.value;refreshList();}
      if(e.target.id==="exStatus"){status=e.target.value;refreshList();}
    });
    document.addEventListener("submit",e=>{
      if(e.target.id!=="exEditForm")return;e.preventDefault();const form=new FormData(e.target),id=e.target.dataset.id||`custom-${crypto.randomUUID()}`;
      const old=items().find(item=>item.id===id),entry={...old,id,defaultSkills:old?.defaultSkills||[],provenance:old?.provenance||"个人笔记"};
      for(const field of ["left","right","meaning","source","note","relation"])entry[field]=String(form.get(field)||"").trim();
      if(!entry.left||!entry.right||!entry.meaning||!entry.source)return toast("请填写两边表达、共同含义和来源");
      // A changed expression must not retain an unrelated generated practice pair.
      if(old&&(old.left!==entry.left||old.right!==entry.right)){entry.practiceLeft="";entry.practiceRight="";entry.practiceLabel="";}
      data().expressionEntries[id]=entry;for(const k of Object.keys(names))data().expressionEnabled[key(k,id)]=form.getAll("skill").includes(k);
      save();document.querySelector("#exEditor").close();navigate("expressions");toast("表达已保存到本机");
    });
    window.addEventListener("pagehide",leave);
    return {library,session,open,modes,homeBlock,summary,planFields,savePlan,history,dueBetween,leave,hydrate,counts};
  };
})();
