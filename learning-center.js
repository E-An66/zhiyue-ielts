(function () {
  "use strict";
  const DAY = 86400000;
  const skills = { listening: ["听力", "headphones"], speaking: ["口语", "mic"], reading: ["阅读", "book"], writing: ["写作", "pen"] };
  const dateKey = time => { const d = new Date(time); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  window.createLearningCenter = function (api) {
    const { getData, save: saveState, wordsForSkill, icon, escapeHtml: esc, navigate, speak, toast } = api;
    const scheduler = FSRS.fsrs({ request_retention: .9, enable_fuzz: false, enable_short_term: true, maximum_interval: 365 });
    let skill = "listening", filter = "all", query = "", day = "all", page = 0, answer = "", checked = false, correct = false;
    const data = () => getData();
    data().learningPlan ||= { listening: 10, speaking: 5, reading: 5, writing: 5 };
    data().studyLog ||= [];
    data().learningSessions ||= {};
    if(data().learningSession)data().learningSessions[data().learningSession.skill]=data().learningSession;
    function save(){if(data().learningSession)data().learningSessions[data().learningSession.skill]=data().learningSession;saveState();}
    function progress(word) {
      const old = data().vocabProgress[word.id] || {};
      const started = !!(old.card || old.learnedAt || old.reviews || word.reviews || old.status === "mastered");
      return { ...old, started, reviews: old.reviews || word.reviews || 0, nextAt: old.nextAt || (started ? Date.now() : 0) };
    }
    function cardFor(word, now = new Date()) {
      const p = progress(word);
      if (p.card) return { ...p.card, due: new Date(p.card.due), last_review: p.card.last_review ? new Date(p.card.last_review) : undefined };
      const card = FSRS.createEmptyCard(now);
      if (p.started) Object.assign(card, { state: FSRS.State.Review, reps: p.reviews || 1, stability: 1, difficulty: 5, last_review: new Date(Math.min(p.nextAt - DAY, now.getTime() - DAY)), due: new Date(p.nextAt) });
      return card;
    }
    function counts(key) {
      const words = wordsForSkill(key), today = dateKey(Date.now());
      const fresh = words.filter(w => !progress(w).started);
      const due = words.filter(w => progress(w).started && progress(w).nextAt <= Date.now());
      const learned = words.filter(w => progress(w).learnedAt && dateKey(progress(w).learnedAt) === today).length;
      const reviewed = new Set(data().studyLog.filter(e => e.kind === "review" && e.skill === key && dateKey(e.at) === today).map(e => e.id)).size;
      const quota = Math.max(0, Number(data().learningPlan[key]) || 0);
      return { words, fresh, due, learned, reviewed, quota, remaining: Math.min(fresh.length, Math.max(0, quota-learned)), started: words.length-fresh.length };
    }
    function interval(time) {
      const delta = Math.max(0, +new Date(time)-Date.now());
      if (delta < 60000) return "现在";
      if (delta < 3600000) return `${Math.ceil(delta/60000)} 分钟后`;
      if (delta < DAY) return `${Math.round(delta/3600000)} 小时后`;
      return `${Math.round(delta/DAY)} 天后`;
    }
    function status(w) { const p=progress(w); return !p.started ? "未学" : p.nextAt<=Date.now() ? "待复习" : p.card?.state===FSRS.State.Learning || p.card?.state===FSRS.State.Relearning ? "巩固中" : "已学"; }
    function btn(action,label,primary=false,disabled=false) { return `<button class="button ${primary?"primary":""}" data-lc="${action}" ${disabled?"disabled":""}>${label}</button>`; }
    function head(title,detail,actions="") { return `<header class="lc-heading"><div><p class="lc-eyebrow">知阅 IELTS</p><h1>${title}</h1><p>${detail}</p></div><div class="lc-actions">${actions}</div></header>`; }
    function tabs() { return `<div class="lc-tabs" role="tablist" aria-label="词汇科目">${Object.entries(skills).map(([k,[name,i]])=>`<button role="tab" aria-selected="${k===skill}" data-lc-skill="${k}" class="${k===skill?"active":""}">${icon(i)}${name}<small>${wordsForSkill(k).length}</small></button>`).join("")}</div>`; }
    function calendar() {
      const now=new Date(); now.setHours(0,0,0,0);
      return `<div class="lc-calendar">${Array.from({length:7},(_,i)=>{
        const d=new Date(now); d.setDate(d.getDate()+i); const end=new Date(d); end.setDate(end.getDate()+1);
        const n=Object.keys(skills).flatMap(k=>wordsForSkill(k)).filter(w=>progress(w).started && progress(w).nextAt<+end && (i===0 || progress(w).nextAt>=+d)).length;
        return `<div><span>${i===0?"今天":`${d.getMonth()+1}/${d.getDate()}`}</span><strong>${n}</strong><small>词到期</small></div>`;
      }).join("")}</div>`;
    }
    function home() {
      const totals=Object.keys(skills).map(counts), due=totals.reduce((n,c)=>n+c.due.length,0), learned=totals.reduce((n,c)=>n+c.learned,0), reviewed=totals.reduce((n,c)=>n+c.reviewed,0);
      const ongoing=Object.values(data().learningSessions);
      return `<section class="page lc-page">${head("今天，从单词开始",new Date().toLocaleDateString("zh-CN",{month:"long",day:"numeric",weekday:"long"}),btn("plan",`${icon("settings")}学习计划`))}
        <div class="lc-dayline"><div><span>今日新学</span><strong>${learned}<small> 词</small></strong></div><div><span>今日已复习</span><strong>${reviewed}<small> 词</small></strong></div><div><span>到期待复习</span><strong>${due}<small> 词</small></strong></div></div>
        ${ongoing.map(s=>`<div class="lc-resume"><span>${skills[s.skill][0]} · ${s.kind==="new"?"新学":"复习"}进度已保存</span><button class="button primary" data-lc="resume" data-session-skill="${s.skill}">继续上次学习</button></div>`).join("")}
        <div class="lc-decks">${Object.entries(skills).map(([k,[name,i]])=>{const c=counts(k); return `<article class="lc-deck" data-skill="${k}"><div class="lc-deck-title">${icon(i)}<h2>${name}词汇</h2><button class="icon-button" data-lc-open="${k}" title="打开${name}词库" aria-label="打开${name}词库">${icon("chevron")}</button></div><div class="lc-deck-numbers"><div><b>${c.remaining}</b><span>今日可新学</span></div><div><b>${c.due.length}</b><span>到期复习</span></div></div><progress max="${Math.max(1,c.words.length)}" value="${c.started}"></progress><p class="lc-deck-caption">已学 ${c.started} / ${c.words.length} · 今日新学 ${c.learned} / ${c.quota}</p><div class="lc-actions"><button class="button primary" data-lc-start="new" data-skill="${k}" ${!c.remaining?"disabled":""}>${icon("plus")}新学</button><button class="button" data-lc-start="review" data-skill="${k}" ${!c.due.length?"disabled":""}>${icon("refresh")}复习</button>${!c.words.length?`<button class="text-button" data-lc-import="${k}">导入词表</button>`:""}</div></article>`;}).join("")}</div>
        <section class="lc-band"><div class="lc-section-head"><h2>未来 7 天的复习</h2><span>根据当前记录，随学习更新</span></div>${calendar()}</section>
        <section class="lc-band"><div class="lc-section-head"><h2>运用今天学到的词</h2></div><div class="lc-practice-links">${[["studio","headphones","精听精读"],["speaking","mic","口语题目与录音"],["practice","file","刷题与写作"]].map(([r,i,t])=>`<button data-route="${r}">${icon(i)}<strong>${t}</strong>${icon("chevron")}</button>`).join("")}</div></section></section>`;
    }
    function listWords() {
      return wordsForSkill(skill).filter(w=>{
        const p=progress(w), match=filter==="all" || filter==="new"&&!p.started || filter==="due"&&p.started&&p.nextAt<=Date.now() || filter==="learned"&&p.started;
        return match && (day==="all" || String(w.day)===day) && `${w.word} ${w.meaning}`.toLowerCase().includes(query.toLowerCase());
      });
    }
    function rows() {
      const all=listWords(); page=Math.min(page,Math.max(0,Math.ceil(all.length/40)-1));
      const items=all.slice(page*40,page*40+40);
      return `<div class="lc-word-list">${items.length?items.map(w=>`<article class="lc-word-row"><div><button class="lc-word-speak" data-speak="${esc(w.word)}">${esc(w.word)} ${icon("volume")}</button><small>${esc(w.phonetic||"")}</small></div><p>${esc(w.meaning)}</p><div><span class="lc-status">${status(w)}</span><small>${progress(w).started?interval(progress(w).nextAt):"等待新学"}</small></div></article>`).join(""):`<div class="empty-state">${icon("book")}<p>${filter==="due"?"当前没有到期词汇":filter==="new"?"当前没有未学词汇":"没有匹配的词汇"}</p>${!wordsForSkill(skill).length?`<button class="button primary" data-lc-import="${skill}">导入${skills[skill][0]}词表</button>`:""}</div>`}</div><div class="lc-pagination">${btn("prev",icon("back"),false,page===0)}<span>${all.length} 词 · ${page+1} / ${Math.max(1,Math.ceil(all.length/40))}</span>${btn("next",icon("chevron"),false,(page+1)*40>=all.length)}</div>`;
    }
    function library() {
      const c=counts(skill);
      return `<section class="page lc-page">${head("四科词库",`今日已新学 ${c.learned} 词 · 已复习 ${c.reviewed} 词`,`<button class="button" data-lc-import="${skill}">${icon("upload")}导入</button>${btn("export",`${icon("download")}导出`)}`)}${tabs()}<div class="lc-library-actions"><div class="lc-actions"><button class="button primary" data-lc-start="new" data-skill="${skill}" ${!c.remaining?"disabled":""}>${icon("plus")}新学 ${c.remaining}</button><button class="button" data-lc-start="review" data-skill="${skill}" ${!c.due.length?"disabled":""}>${icon("refresh")}复习 ${c.due.length}</button></div><span>已学 ${c.started} / ${c.words.length}</span></div><div class="lc-filters"><input id="lcSearch" value="${esc(query)}" type="search" placeholder="搜索单词或释义" aria-label="搜索词汇"><select id="lcFilter" aria-label="学习状态">${[["all","全部"],["new","未学"],["due","到期复习"],["learned","已学"]].map(([v,l])=>`<option value="${v}" ${filter===v?"selected":""}>${l}</option>`).join("")}</select>${skill==="listening"?`<select id="lcDay" aria-label="主题"><option value="all">全部主题</option>${(window.LISTENING_777_VOCAB?.days||[]).map(d=>`<option value="${d.day}" ${day===String(d.day)?"selected":""}>Day ${d.day} · ${esc(d.topic)}</option>`).join("")}</select>`:""}</div><div id="lcRows">${rows()}</div></section>`;
    }
    function start(kind,key) {
      const existing=data().learningSessions[key];
      if(existing) { skill=key;data().learningSession=existing;answer="";checked=false;save();toast(`继续未完成的${skills[skill][0]}学习组`);return navigate("review"); }
      if(api.route()!=="vocabulary")day="all";
      skill=key; const c=counts(key);
      const candidates=(kind==="new"?c.fresh:c.due).filter(w=>day==="all"||String(w.day)===day);
      const selected=candidates.sort((a,b)=>progress(a).nextAt-progress(b).nextAt).slice(0,kind==="new"?Math.min(5,c.remaining):20);
      if(!selected.length) return toast(kind==="new"?"当前主题没有可新学词汇，或今日额度已完成":"当前主题没有到期词汇");
      data().learningSession={skill:key,kind,ids:selected.map(w=>w.id),index:0,phase:kind==="new"?"intro":"recall",done:0};
      answer=""; checked=false; save(); navigate("review");
    }
    function sessionWord(s) { return wordsForSkill(s.skill).find(w=>w.id===s.ids[s.index]); }
    function session() {
      const s=data().learningSession;
      if(!s) return `<section class="page lc-page">${head("本组完成","下一次复习已根据回忆表现安排")}${calendar()}<div class="lc-complete">${icon("check")}<h2>休息一下，再继续</h2><div class="lc-actions">${btn("home","返回今日背词",true)}${btn("library","查看词库")}</div></div></section>`;
      const w=sessionWord(s); if(!w) { data().learningSession=null; save(); return session(); }
      const intro=s.phase==="intro", p=progress(w), direction= s.skill==="listening" && p.reviews%2===1 ? "audio" : s.skill==="reading" ? "meaning" : "spelling";
      const revealed=intro||checked;
      const choices=scheduler.repeat(cardFor(w),new Date());
      const context=w.example||api.detail(w.word)?.example||"";
      return `<section class="page lc-page lc-session">${head(`${skills[s.skill][0]} · ${s.kind==="new"?"新学":"复习"}`,`${intro?"听读认识":"主动回忆"} · ${s.index+1} / ${s.ids.length}`,btn("home",`${icon("back")}稍后继续`))}<progress max="${s.ids.length}" value="${s.index}"></progress><article class="lc-flashcard"><div class="lc-section-head"><span>${intro?"认识单词":direction==="audio"?"听音拼写":direction==="meaning"?"英文想中文":"中文想英文"}</span><span>${esc(w.topic||"")}</span></div>
        ${intro?`<h2>${esc(w.word)}</h2><p class="lc-phonetic">${esc(w.phonetic||"")}</p><p class="lc-definition">${esc(w.meaning)}</p>`:direction==="audio"?`<button class="lc-audio" data-speak="${esc(w.word)}" aria-label="播放待学单词">${icon("volume")}</button>`:`<h2 class="${direction!=="meaning"?"lc-chinese":""}">${esc(direction==="meaning"?w.word:w.meaning)}</h2>`}
        ${intro?`<button class="button" data-speak="${esc(w.word)}">${icon("volume")}听发音</button>${context?`<blockquote>${esc(context)}</blockquote>`:""}${btn("intro-next",s.index+1===s.ids.length?"开始回想测试":"下一个",true)}`:`<form id="lcAnswerForm"><label>${direction==="meaning"?"回想中文意思":"写出英文"}<input id="lcAnswer" value="${esc(answer)}" autocomplete="off" autocapitalize="off" spellcheck="false" ${checked?"readonly":""} placeholder="${direction==="meaning"?"可输入或在心里回想":"Type the word"}"></label>${!checked?`<div class="lc-actions"><button class="button primary" type="submit">${direction==="meaning"?"查看释义":"检查答案"}</button><button class="button" type="button" data-lc="forgot">想不起来</button></div>`:""}</form>`}
        ${!intro&&checked?`<div class="lc-answer ${correct?"correct":"incorrect"}"><strong>${esc(w.word)}</strong><p>${esc(w.meaning)}</p><button class="icon-button" data-speak="${esc(w.word)}" aria-label="听答案发音">${icon("volume")}</button><small>${direction==="meaning"?"按自己的回想结果选择":correct?"拼写正确":"先看清拼写，再听读一遍"}</small></div><div class="lc-ratings">${[[1,"忘记"],[2,"模糊"],[3,"记得"],[4,"轻松"]].map(([r,t])=>`<button data-lc-rate="${r}" ${!correct&&direction!=="meaning"&&r>1?"disabled":""}><strong>${t}</strong><small>${interval(choices[r].card.due)}</small></button>`).join("")}</div>`:""}</article></section>`;
    }
    function rate(r) {
      const s=data().learningSession,w=s&&sessionWord(s); if(!w||!checked) return;
      const previous=progress(w), now=new Date(), result=scheduler.next(cardFor(w,now),now,r);
      data().vocabProgress[w.id]={...previous,started:true,card:result.card,nextAt:+result.card.due,learnedAt:previous.learnedAt||(!previous.started?+now:undefined),reviews:previous.reviews+1,status:result.card.state===FSRS.State.Review?"learned":"learning"};
      data().studyLog.push({id:w.id,skill:s.skill,kind:!previous.started?"new":"review",at:+now,rating:r});
      // Short-term failures return later in this group; their FSRS due date still persists.
      if(r===1 && s.ids.filter(id=>id===w.id).length<3) s.ids.push(w.id);
      s.index++; s.done++; if(s.index>=s.ids.length) {delete data().learningSessions[s.skill];data().learningSession=null;}
      answer="";checked=false;save();navigate("review");
    }
    function plan() {
      return `<section class="page lc-page">${head("学习计划","先完成到期复习，再按精力安排新学",btn("home",`${icon("back")}返回`))}<form id="lcPlanForm" class="lc-plan-form">${Object.entries(skills).map(([k,[name,i]])=>`<label>${icon(i)}<strong>${name}每日新学</strong><input type="number" name="${k}" min="0" max="100" step="1" required value="${data().learningPlan[k]}"><span>词</span></label>`).join("")}<button class="button primary" type="submit">保存计划</button></form><section class="lc-band"><h2>复习安排</h2>${calendar()}<p class="lc-note">到期量包含之前积累的词，可能高于每日新学量。忘记会缩短间隔，记得会逐渐延长；已学词不会永久退出复习。目标记忆保持率为 90%，这是一项调度目标，不是学习效果保证。</p></section><section class="lc-band"><h2>实际学习记录</h2><div class="lc-history">${data().studyLog.slice(-20).reverse().map(e=>`<div><span>${new Date(e.at).toLocaleString("zh-CN")}</span><strong>${esc(wordsForSkill(e.skill).find(w=>w.id===e.id)?.word||"已移除词汇")}</strong><span>${skills[e.skill][0]} · ${e.kind==="new"?"新学":"复习"}</span></div>`).join("")||"还没有学习记录"}</div></section></section>`;
    }
    function exportWords(){ const rows=[["word","meaning","phonetic"],...wordsForSkill(skill).map(w=>[w.word,w.meaning,w.phonetic||""])];const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));a.download=`知阅-${skills[skill][0]}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
    document.addEventListener("click",e=>{
      const el=e.target.closest("[data-lc],[data-lc-start],[data-lc-skill],[data-lc-open],[data-lc-import],[data-lc-rate]");if(!el) return;
      if(el.dataset.lcStart) return start(el.dataset.lcStart,el.dataset.skill);
      if(el.dataset.lcSkill||el.dataset.lcOpen){skill=el.dataset.lcSkill||el.dataset.lcOpen;day="all";query="";page=0;return navigate("vocabulary");}
      if(el.dataset.lcImport){document.querySelector("#vocabImportSkill").value=el.dataset.lcImport;document.querySelector("#vocabImportDialog").showModal();return;}
      if(el.dataset.lcRate) return rate(Number(el.dataset.lcRate));
      const action=el.dataset.lc;
      if(action==="home")return navigate("study"); if(action==="library")return navigate("vocabulary");if(action==="plan")return navigate("plan");if(action==="resume"){data().learningSession=data().learningSessions[el.dataset.sessionSkill];answer="";checked=false;save();return navigate("review");}if(action==="export")return exportWords();
      if(action==="prev"||action==="next"){page+=action==="prev"?-1:1;document.querySelector("#lcRows").innerHTML=rows();}
      if(action==="intro-next"){const s=data().learningSession;s.index++;if(s.index>=s.ids.length){s.index=0;s.phase="recall";}save();navigate("review");}
      if(action==="forgot"){checked=true;correct=false;answer=document.querySelector("#lcAnswer")?.value||"";navigate("review");}
    });
    document.addEventListener("input",e=>{if(e.target.id==="lcSearch"){query=e.target.value;page=0;document.querySelector("#lcRows").innerHTML=rows();}if(e.target.id==="lcAnswer")answer=e.target.value;});
    document.addEventListener("change",e=>{if(e.target.id==="lcFilter"||e.target.id==="lcDay"){if(e.target.id==="lcFilter")filter=e.target.value;else day=e.target.value;page=0;document.querySelector("#lcRows").innerHTML=rows();}});
    document.addEventListener("submit",e=>{
      if(e.target.id==="lcAnswerForm"){e.preventDefault();answer=document.querySelector("#lcAnswer").value;const w=sessionWord(data().learningSession);correct=answer.trim().toLowerCase().replace(/\s+/g," ")===w.word.trim().toLowerCase();checked=true;navigate("review");}
      if(e.target.id==="lcPlanForm"){e.preventDefault();const form=new FormData(e.target);for(const k of Object.keys(skills))data().learningPlan[k]=Math.max(0,Math.min(100,Math.floor(Number(form.get(k))||0)));save();toast("每日新学计划已保存");navigate("study");}
    });
    return {home,library,session,plan,counts,progress,start,select:key=>{skill=key;day="all";},interval};
  };
})();
