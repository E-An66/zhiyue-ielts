(function () {
  "use strict";
  window.createPracticeStudio = function (api) {
    const {getData,save,icon,escapeHtml:esc,navigate,speak,toast,putAsset,getAsset,align} = api;
    const data=()=>getData(); data().studioMaterials||=[];data().studioNotes||={};data().oralAnswers||={};
    let selected=data().studioCursor?.id||"", sentence=data().studioCursor?.sentence||0, mode=data().studioCursor?.mode||"listen", revealed=false, speed=1, repeats=1, playerUrl="", recordingUrl="", recorder=null, stream=null, recognition=null, recording=false, pendingMic=false, elapsed=0,timer=null,clipStop=null,playGeneration=0;
    let part="1",questionIndex=0, currentPromptKey="", route="", audioHydration=0;
    const sources=()=>[...data().studioMaterials,...api.listeningSources(),...data().articles.map(a=>({id:`article:${a.id}`,title:a.title,source:"阅读文章",segments:a.body.flatMap(p=>{const el=document.createElement("div");el.innerHTML=p;return el.textContent.split(/(?<=[.!?])\s+/).filter(Boolean).map(text=>({text}));})}))];
    function material(){return sources().find(s=>s.id===selected)||sources()[0];}
    const noteKey=()=>`${material().id}:${sentence}`;
    const note=()=>data().studioNotes[noteKey()]||{};
    function setNote(patch){data().studioNotes[noteKey()]={...note(),...patch};save();}
    const button=(a,label,primary=false)=>`<button class="button ${primary?"primary":""}" data-st="${a}">${label}</button>`;
    const heading=(title,sub,actions="")=>`<header class="lc-heading"><div><p class="lc-eyebrow">知阅 IELTS</p><h1>${title}</h1><p>${sub}</p></div><div class="lc-actions">${actions}</div></header>`;
    function tokens(text){return text.split(/([A-Za-z]+(?:['’-][A-Za-z]+)*)/).map((t,i)=>i%2?`<button class="st-token" data-st-word="${esc(t)}">${esc(t)}</button>`:esc(t)).join("");}
    function comparison(reference,attempt){return align(reference,attempt).items.map(t=>`<span class="st-diff ${t.type}" title="${t.type==="missing"?"漏写":t.type==="extra"?"多写":t.type==="replace"?`你写的是 ${esc(t.spoken)}`:"正确"}">${esc(t.expected||t.spoken)}</span>`).join(" ");}
    function render(){
      const m=material();selected=m.id;sentence=Math.min(sentence,m.segments.length-1);data().studioCursor={id:selected,sentence,mode};save();const segment=m.segments[sentence],n=note();
      const done=m.segments.filter((_,i)=>data().studioNotes[`${m.id}:${i}`]?.complete).length;
      return `<section class="page lc-page st-page">${heading("精听精读",`${done} / ${m.segments.length} 句已完成`,button("import",`${icon("upload")}导入材料`))}<div class="st-material-bar"><label>材料<select id="stMaterial">${sources().map(s=>`<option value="${esc(s.id)}" ${s.id===m.id?"selected":""}>${esc(s.title)} · ${esc(s.source||"个人导入")}</option>`).join("")}</select></label><div class="lc-tabs" aria-label="训练模式"><button data-st-mode="listen" class="${mode==="listen"?"active":""}">${icon("headphones")}精听听写</button><button data-st-mode="read" class="${mode==="read"?"active":""}">${icon("book")}逐句精读</button></div></div>
        <div class="st-workspace"><aside class="st-sentences" aria-label="句子目录">${m.segments.map((s,i)=>`<button data-st-sentence="${i}" class="${sentence===i?"active":""}"><b>${String(i+1).padStart(2,"0")}</b><span>${mode==="read"?esc(s.text):`第 ${i+1} 句${s.start!=null?` · ${formatTime(s.start)}`:""}`}</span>${data().studioNotes[`${m.id}:${i}`]?.complete?icon("check"):""}</button>`).join("")}</aside>
        <main class="st-main"><div class="lc-section-head"><h2>${esc(m.title)}</h2><span>${sentence+1} / ${m.segments.length}</span></div><p class="st-audio-source">${m.audioKey?"已导入原始音频":mode==="listen"?"示例文本 · 浏览器合成发音":"英文原文"}</p>
        ${m.audioKey?`<audio id="stAudio" controls preload="metadata"></audio><div class="st-ab"><label>A <input id="stA" type="number" min="0" step="0.1" value="${segment.start??0}"></label><button class="icon-button" data-st="mark-a" title="设当前时间为起点" aria-label="设起点">${icon("back")}</button><label>B <input id="stB" type="number" min="0" step="0.1" value="${segment.end??0}"></label><button class="icon-button" data-st="mark-b" title="设当前时间为终点" aria-label="设终点">${icon("chevron")}</button>${button("save-ab","保存句子范围")}</div>`:""}
        <div class="st-player-controls">${button("play",`${icon("play")}播放本句`,true)}${button("stop",`${icon("pause")}停止`)}<label>速度<select id="stSpeed">${[.5,.75,1,1.25,1.5].map(v=>`<option ${speed===v?"selected":""} value="${v}">${v}×</option>`).join("")}</select></label><label>循环<select id="stRepeats">${[1,2,3,5].map(v=>`<option ${repeats===v?"selected":""} value="${v}">${v} 次</option>`).join("")}</select></label></div>
        ${mode==="read"?`<div class="st-reader-text">${tokens(segment.text)}</div>${segment.translation?`<p class="st-translation">${esc(segment.translation)}</p>`:""}<label class="st-field">我的理解<textarea id="stUnderstanding" placeholder="这一句表达了什么？">${esc(n.understanding||"")}</textarea></label>`:`<form id="stDictationForm"><label class="st-field">听写<textarea id="stDraft" spellcheck="false" placeholder="写下听到的内容">${esc(n.draft||"")}</textarea></label><div class="lc-actions"><button class="button primary" type="submit">核对听写</button>${button("reveal",revealed?"隐藏原文":"查看原文")}</div></form>${revealed?`<div class="st-correction"><div>${comparison(segment.text,n.draft||"")}</div><div class="st-diff-key"><span>绿色：正确</span><span>红色：漏写或写错</span><span>划线：多写</span></div><p class="st-reader-text">${tokens(segment.text)}</p>${segment.translation?`<p>${esc(segment.translation)}</p>`:""}</div>`:""}`}
        <label class="st-field">${mode==="read"?"搭配 / 句子结构笔记":"错因 / 跟读笔记"}<textarea id="stNotes" rows="2" placeholder="记下值得回看的地方">${esc(n.notes||"")}</textarea></label><div class="st-bottom"><button class="icon-button" data-st="prev" ${sentence===0?"disabled":""} aria-label="上一句">${icon("back")}</button><label><input type="checkbox" id="stComplete" ${n.complete?"checked":""}>本句已完成</label><button class="button primary" data-st="next" ${sentence===m.segments.length-1?"disabled":""}>下一句 ${icon("chevron")}</button></div></main></div>${importDialog()}${wordDialog()}</section>`;
    }
    function importDialog(){return `<dialog id="stImportDialog" class="import-dialog"><form method="dialog" class="dialog-header"><h2>导入精听精读材料</h2><button class="icon-button" aria-label="关闭">${icon("x")}</button></form><form id="stImportForm" class="import-form"><label>标题<input id="stTitle" required maxlength="100"></label><div class="field-row"><label>音频（可选）<input type="file" id="stAudioFile" accept="audio/*,video/mp4"></label><label>字幕 / 文本（可选）<input type="file" id="stTextFile" accept=".srt,.vtt,.txt"></label></div><label>英文原文<textarea id="stText" placeholder="Paste the transcript or article here..."></textarea></label><footer class="dialog-actions"><button class="button primary" type="submit">保存材料</button></footer></form></dialog>`;}
    function wordDialog(){return `<dialog id="stWordDialog" class="import-dialog"><form method="dialog" class="dialog-header"><h2>收藏词汇</h2><button class="icon-button" aria-label="关闭">${icon("x")}</button></form><form id="stWordForm" class="import-form"><label>单词或短语<input id="stWord" required maxlength="100"></label><label>中文释义<input id="stMeaning" required maxlength="300"></label><label>词库<select id="stWordSkill"><option value="listening">听力</option><option value="speaking">口语</option><option value="reading">阅读</option><option value="writing">写作</option></select></label><footer class="dialog-actions"><button class="button primary" type="submit">加入新学</button></footer></form></dialog>`;}
    function formatTime(s){return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;}
    function parseText(text){
      const source=text.replace(/^\uFEFF/,"").trim(), blocks=source.split(/\r?\n\s*\r?\n/), stamp=/(\d{1,2}:)?(\d{2}):(\d{2})[,.](\d{3})/;
      const parseStamp=s=>{const m=s.match(stamp);return m ? Number((m[1]||"0:").replace(":",""))*3600+Number(m[2])*60+Number(m[3])+Number(m[4])/1000 : null;};
      const subs=blocks.filter(b=>b.includes("-->")).map(b=>{const lines=b.split(/\r?\n/),i=lines.findIndex(l=>l.includes("-->")),range=lines[i].split("-->");return {text:lines.slice(i+1).join(" ").replace(/<[^>]*>/g,""),start:parseStamp(range[0]),end:parseStamp(range[1])};}).filter(s=>s.text&&s.start!=null&&s.end>s.start);
      if(subs.length)return subs;
      return source.split(/\r?\n|(?<=[.!?])\s+/).map(text=>({text:text.trim()})).filter(s=>s.text);
    }
    function stopPlayback(){playGeneration++;clearTimeout(clipStop);clipStop=null;document.querySelector("#stAudio")?.pause();if("speechSynthesis"in window)speechSynthesis.cancel();}
    function play(){
      stopPlayback();const m=material(),s=m.segments[sentence],generation=playGeneration;let left=repeats;
      const audio=document.querySelector("#stAudio");
      if(audio){
        const a=Number(document.querySelector("#stA").value),b=Number(document.querySelector("#stB").value);
        if(!(b>a)||!Number.isFinite(audio.duration)||b>audio.duration+.2)return toast("请先为本句设置有效的 A、B 时间范围");
        let inClip=false;
        const finish=()=>{if(generation!==playGeneration||!inClip)return;inClip=false;clearTimeout(clipStop);audio.pause();left--;if(left>0)clipStop=setTimeout(once,600);else audio.ontimeupdate=null;};
        const once=()=>{if(generation!==playGeneration)return;inClip=true;audio.currentTime=a;audio.playbackRate=speed;audio.play().then(()=>{if(generation===playGeneration&&inClip)clipStop=setTimeout(finish,(b-a)/speed*1000);}).catch(()=>{inClip=false;toast("音频暂时无法播放");});};
        audio.ontimeupdate=()=>{if(audio.currentTime>=b-.03)finish();};once();
      }else{
        if(!("speechSynthesis"in window))return toast("当前浏览器不支持合成发音，请导入音频");
        const once=()=>{if(generation!==playGeneration)return;const u=new SpeechSynthesisUtterance(s.text);u.lang="en-GB";u.rate=speed;u.onend=()=>{left--;if(left>0)clipStop=setTimeout(once,600);};speechSynthesis.speak(u);};once();
      }
    }
    async function hydrate(nextRoute){
      route=nextRoute;
      const generation=++audioHydration;
      if(playerUrl){URL.revokeObjectURL(playerUrl);playerUrl="";}
      if(nextRoute==="studio"&&material().audioKey){const blob=await getAsset(material().audioKey);if(generation!==audioHydration)return;const audio=document.querySelector("#stAudio");if(blob&&audio){playerUrl=URL.createObjectURL(blob);audio.src=playerUrl;}}
      if(nextRoute==="speaking"){
        const key=promptKey();currentPromptKey=key;const blob=await getAsset(`oral:${key}`);if(generation!==audioHydration)return;
        if(recordingUrl){URL.revokeObjectURL(recordingUrl);recordingUrl="";}
        if(blob){recordingUrl=URL.createObjectURL(blob);showRecording(recordingUrl,blob.type);}
      }
    }
    function promptKey(){return `${part}:${questionIndex}`;}
    function currentQuestion(){return api.speakingParts[part].questions[questionIndex];}
    function oral(){
      const p=api.speakingParts[part],key=promptKey(),entry=data().oralAnswers[key]||{};
      return `<section class="page lc-page">${heading("口语题目与录音","Part 1–3 · 每次练好一道题")}<div class="lc-tabs">${Object.keys(api.speakingParts).map(k=>`<button data-st-part="${k}" class="${part===k?"active":""}">Part ${k}</button>`).join("")}</div><div class="st-oral-layout"><main><div class="st-question-nav">${p.questions.map((q,i)=>`<button data-st-question="${i}" class="${questionIndex===i?"active":""}" aria-label="第 ${i+1} 题">${i+1}</button>`).join("")}</div><h2 class="st-oral-question">${esc(currentQuestion())}</h2>${p.cue?`<ul class="st-cue">${p.cue.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>`:""}<div class="lc-actions"><button class="button" data-speak="${esc(currentQuestion())}">${icon("volume")}听题目</button><span class="lc-note">${esc(p.guide)}</span></div><div class="st-recorder"><span id="stRecordTime">00:00</span><button class="button primary" id="stRecord" data-st="record">${icon("mic")}开始录音</button><button class="button" id="stStopRecord" data-st="stop-record" disabled>${icon("pause")}结束录音</button></div><p id="stRecordStatus" role="status"></p><div id="stRecording"></div><label class="st-field">回答转写 / 草稿<textarea id="stOralText" placeholder="可直接输入；浏览器支持时也可在录音中转写">${esc(entry.text||"")}</textarea></label><label class="st-recognize"><input type="checkbox" id="stRecognition">录音时启用浏览器语音转写</label><div class="lc-actions">${button("oral-check","检查表达与结构")}${button("oral-save","保存回答")}</div><div id="stOralFeedback"></div></main><aside class="st-oral-aside"><h3>回听自查</h3>${["直接回答了问题","补充了原因或例子","停顿后能继续表达","发音和词尾清楚"].map((t,i)=>`<label><input type="checkbox" data-st-self="${i}" ${(entry.checks||[]).includes(String(i))?"checked":""}>${t}</label>`).join("")}<label class="st-field">下次要改的一点<textarea id="stOralNote" rows="3">${esc(entry.note||"")}</textarea></label><p class="lc-note">录音可回听和下载。转写可能有误，先核对文字；文本自查不评定发音或雅思分数。</p></aside></div></section>`;
    }
    function persistOral(){const text=document.querySelector("#stOralText"),note=document.querySelector("#stOralNote");if(!text)return;data().oralAnswers[promptKey()]={...data().oralAnswers[promptKey()],text:text.value,note:note?.value||"",checks:Array.from(document.querySelectorAll("[data-st-self]:checked")).map(e=>e.dataset.stSelf)};save();}
    function showRecording(url,type=recorder?.mimeType||""){const host=document.querySelector("#stRecording");if(!host)return;host.innerHTML=`<audio controls src="${url}"></audio><a class="button" href="${url}" download="speaking-part-${part}-${questionIndex+1}.${type.includes("mp4")?"m4a":"webm"}">${icon("download")}下载录音</a>`;}
    async function record(){
      if(recording||pendingMic)return;if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)return toast("此浏览器不能录音，请用 Safari 或 Chrome 打开 HTTPS 网址");
      pendingMic=true;const key=promptKey();currentPromptKey=key;const generation=audioHydration;
      try{
        const acquired=await navigator.mediaDevices.getUserMedia({audio:true});
        if(route!=="speaking"||generation!==audioHydration){acquired.getTracks().forEach(t=>t.stop());return;}
        stream=acquired;const mime=["audio/webm;codecs=opus","audio/mp4","audio/webm"].find(t=>MediaRecorder.isTypeSupported(t));recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);const chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
        const localRecorder=recorder;
        recorder.onstop=async()=>{const blob=new Blob(chunks,{type:localRecorder.mimeType});if(!blob.size)return;try{await putAsset(`oral:${key}`,blob);data().oralAnswers[key]={...data().oralAnswers[key],audioType:blob.type,recordedAt:Date.now()};save();if(route==="speaking"&&promptKey()===key){if(recordingUrl)URL.revokeObjectURL(recordingUrl);recordingUrl=URL.createObjectURL(blob);showRecording(recordingUrl);toast("录音已保存");}}catch{toast("录音保存失败，请保持页面并下载录音");if(route==="speaking"){recordingUrl=URL.createObjectURL(blob);showRecording(recordingUrl);}}};
        recorder.start();recording=true;elapsed=0;document.querySelector("#stRecord").disabled=true;document.querySelector("#stStopRecord").disabled=false;document.querySelector("#stRecordStatus").textContent="正在录音";
        timer=setInterval(()=>{elapsed++;const el=document.querySelector("#stRecordTime");if(el)el.textContent=formatTime(elapsed);if(elapsed>=600)stopRecording();},1000);
        const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
        if(document.querySelector("#stRecognition").checked){
          if(!Recognition)toast("浏览器不支持转写，录音仍在继续");
          else{recognition=new Recognition();recognition.lang="en-GB";recognition.continuous=true;recognition.interimResults=true;const existing=document.querySelector("#stOralText").value;recognition.onresult=e=>{if(route!=="speaking"||key!==promptKey())return;document.querySelector("#stOralText").value=[existing,...Array.from(e.results).map(r=>r[0].transcript)].filter(Boolean).join(" ");persistOral();};recognition.onerror=()=>toast("转写不可用，录音仍在继续");try{recognition.start();}catch{toast("转写未启动，录音仍在继续");}}
        }
      }catch{toast("未能使用麦克风，请检查浏览器录音权限");stream?.getTracks().forEach(t=>t.stop());}finally{pendingMic=false;}
    }
    function stopRecording(){if(recorder?.state==="recording")recorder.stop();stream?.getTracks().forEach(t=>t.stop());stream=null;try{recognition?.stop();}catch{}recognition=null;recording=false;clearInterval(timer);timer=null;document.querySelector("#stRecord")?.removeAttribute("disabled");document.querySelector("#stStopRecord")?.setAttribute("disabled","");const status=document.querySelector("#stRecordStatus");if(status)status.textContent="录音结束";persistOral();}
    function oralCheck(){persistOral();const text=document.querySelector("#stOralText").value,words=text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)||[];if(!words.length)return toast("先输入或转写你的回答");const feedback=[];
      if(!/\b(because|since|for example|for instance|such as)\b/i.test(text))feedback.push("可以补充一个原因或具体例子，让回答更充分。");
      if(words.length<20)feedback.push("当前回答较短，可再补充一个细节。");
      if(/\bi am agree\b/i.test(text))feedback.push('“I am agree” 改为 “I agree”。');
      if(/\bdiscuss about\b/i.test(text))feedback.push('“discuss about” 通常改为 “discuss”。');
      if(/\bmore better\b/i.test(text))feedback.push('“more better” 改为 “better”。');
      document.querySelector("#stOralFeedback").innerHTML=`<div class="st-feedback"><strong>文本自查 · ${words.length} 词</strong><ul>${feedback.map(t=>`<li>${t}</li>`).join("")||"<li>未发现内置规则覆盖的问题。结合录音再检查内容和停顿。</li>"}</ul><small>这是有限的文本规则检查，不是完整语法批改。</small></div>`;
    }
    function leave(){stopPlayback();stopRecording();audioHydration++;route="";if(playerUrl)URL.revokeObjectURL(playerUrl);playerUrl="";}
    document.addEventListener("click",e=>{
      const word=e.target.closest("[data-st-word]");if(word){document.querySelector("#stWord").value=word.dataset.stWord;const d=api.detail(word.dataset.stWord);document.querySelector("#stMeaning").value=d?.meaning||"";document.querySelector("#stWordSkill").value=mode==="listen"?"listening":"reading";document.querySelector("#stWordDialog").showModal();return;}
      const partEl=e.target.closest("[data-st-part]"),q=e.target.closest("[data-st-question]");if(partEl||q){persistOral();stopRecording();if(partEl){part=partEl.dataset.stPart;questionIndex=0;}else questionIndex=Number(q.dataset.stQuestion);navigate("speaking");return;}
      const el=e.target.closest("[data-st],[data-st-mode],[data-st-sentence]");if(!el)return;
      if(el.dataset.stMode){stopPlayback();mode=el.dataset.stMode;revealed=false;navigate("studio");return;}if(el.dataset.stSentence){stopPlayback();sentence=Number(el.dataset.stSentence);revealed=false;navigate("studio");return;}
      switch(el.dataset.st){
        case "import":document.querySelector("#stImportDialog").showModal();break;
        case "play":play();break;case "stop":stopPlayback();break;
        case "mark-a":document.querySelector("#stA").value=(document.querySelector("#stAudio").currentTime||0).toFixed(1);break;
        case "mark-b":document.querySelector("#stB").value=(document.querySelector("#stAudio").currentTime||0).toFixed(1);break;
        case "save-ab":{const a=Number(document.querySelector("#stA").value),b=Number(document.querySelector("#stB").value);if(!(b>a)||a<0)return toast("终点需要大于起点");const m=data().studioMaterials.find(m=>m.id===selected);if(m){m.segments[sentence].start=a;m.segments[sentence].end=b;save();toast("句子范围已保存");}break;}
        case "prev":case "next":stopPlayback();sentence=Math.max(0,Math.min(material().segments.length-1,sentence+(el.dataset.st==="next"?1:-1)));revealed=false;navigate("studio");break;
        case "reveal":revealed=!revealed;navigate("studio");break;
        case "record":record();break;case "stop-record":stopRecording();break;case "oral-save":persistOral();toast("回答与自查记录已保存");break;case "oral-check":oralCheck();break;
      }
    });
    document.addEventListener("input",e=>{const fields={stDraft:"draft",stUnderstanding:"understanding",stNotes:"notes"};if(fields[e.target.id])setNote({[fields[e.target.id]]:e.target.value});if(["stOralText","stOralNote"].includes(e.target.id))persistOral();});
    document.addEventListener("change",e=>{if(e.target.id==="stMaterial"){stopPlayback();selected=e.target.value;sentence=0;revealed=false;navigate("studio");}if(e.target.id==="stSpeed"){stopPlayback();speed=Number(e.target.value);}if(e.target.id==="stRepeats")repeats=Number(e.target.value);if(e.target.id==="stComplete"){setNote({complete:e.target.checked});const m=material();document.querySelector(".lc-heading > div > p:last-child").textContent=`${m.segments.filter((_,i)=>data().studioNotes[`${m.id}:${i}`]?.complete).length} / ${m.segments.length} 句已完成`;}if(e.target.dataset.stSelf!==undefined)persistOral();});
    document.addEventListener("submit",async e=>{
      if(e.target.id==="stDictationForm"){e.preventDefault();setNote({draft:document.querySelector("#stDraft").value});revealed=true;navigate("studio");}
      if(e.target.id==="stImportForm"){
        e.preventDefault();const submit=e.target.querySelector('[type="submit"]');submit.disabled=true;
        try{const audio=document.querySelector("#stAudioFile").files[0],textFile=document.querySelector("#stTextFile").files[0],text=textFile?await textFile.text():document.querySelector("#stText").value;const segments=parseText(text);if(!segments.length)return toast("请粘贴原文或选择字幕文件");const id=`studio-${Date.now()}`;if(audio)await putAsset(`studio:${id}`,audio);data().studioMaterials.unshift({id,title:document.querySelector("#stTitle").value.trim(),source:"个人导入",audioKey:audio?`studio:${id}`:null,segments});save();selected=id;sentence=0;revealed=false;navigate("studio");toast("材料已保存");}catch{toast("保存失败，请检查文件和浏览器空间");}finally{submit.disabled=false;}
      }
      if(e.target.id==="stWordForm"){
        e.preventDefault();const word=document.querySelector("#stWord").value.trim(),meaning=document.querySelector("#stMeaning").value.trim(),skill=document.querySelector("#stWordSkill").value;if(!word||!meaning)return;
        if(api.wordsForSkill(skill).some(w=>w.word.toLowerCase()===word.toLowerCase()))return toast("该词已在此科词库中");
        data().words.push({id:`studio-word-${Date.now()}`,word,meaning,skill,phonetic:api.detail(word)?.phonetic||"",example:material().segments[sentence].text,source:"精听精读",reviews:0,exams:["语境收藏"],addedAt:Date.now()});save();document.querySelector("#stWordDialog").close();toast("已加入未学词汇");
      }
    });
    return {render,oral,hydrate,leave,parseText};
  };
})();
