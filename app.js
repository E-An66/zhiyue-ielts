(function () {
  "use strict";

  const STORAGE_KEY = "zhiyue-reader-v1";
  const EXAM_DB_NAME = "zhiyue-ielts-assets-v1";
  const EXAM_STORE = "exam-files";
  const DAY = 86400000;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

  const articleSeeds = [
    {
      id: "estonia-gardens",
      title: "Why Estonians invite strangers into their back gardens each summer",
      deck: "Why Estonians invite strangers into their back gardens each summer — Hillary Millan explores a warm northern tradition.",
      category: "文化",
      method: "直接粘贴",
      source: "BBC Travel",
      date: "8/6",
      minutes: 8,
      progress: 72,
      body: [
        "Every summer, private gardens across Estonia open their gates to visitors. What began as a small local experiment has become a national celebration of generosity and curiosity.",
        "Hosts share flowers, food and stories with people they have never met. The custom reflects an Estonian belief that a garden is not simply private property; it can also become a quiet meeting place for a community.",
        "For travellers, the invitation offers a rare view of everyday life. For local people, it creates new friendships without the pressure of a formal event."
      ]
    },
    {
      id: "holy-maid",
      title: "The 'Holy Maid of Kent' who prophesied the death of King Henry VIII",
      deck: "The remarkable story of Elizabeth Barton and the dangerous politics of Tudor England.",
      category: "历史",
      method: "直接粘贴",
      source: "History Extra",
      date: "8/6",
      minutes: 9,
      progress: 31,
      body: [
        "Elizabeth Barton rose from obscurity to become one of the most famous religious figures in Tudor England. Her visions attracted powerful supporters and eventually the attention of the king.",
        "When she opposed Henry VIII's marriage plans, prophecy became politics. Her public warnings were treated as a threat to royal authority.",
        "Her story reveals how faith, rumour and power could become inseparable in a period of profound change."
      ]
    },
    {
      id: "secret-codewords",
      title: "The secret codewords that scammers hate",
      deck: "深度伪造诈骗利用 AI 技术模仿亲人声音，导致受害者恐慌并上当，但简单的家庭密码可以防止此类诈骗。",
      category: "科技与安全",
      method: "直接粘贴",
      source: "BBC Future",
      date: "8/5",
      minutes: 5,
      progress: 46,
      body: [
        `Thomas Germain BBC / <mark class="word-mark" data-word="Serenity">Serenity</mark> Strull / Getty Images A young girl <mark class="word-mark" data-word="whispers">whispers</mark> a word in a woman's ear while the woman is on the phone. <mark class="word-mark" data-word="Deepfake scams">Deepfake scams</mark> might use your voice, but they don't know what's in your head. Five minutes of preparation could save your loved ones from <span class="phrase-mark" data-word="falling for fraud">falling for fraud</span>. “It was the most terror I've ever felt,” says Elizabeth Benz, a mother from <mark class="word-mark" data-word="Buffalo">Buffalo</mark>, New York.`,
        `In September 2025, she got a phone call. “It was my 16-year-old son, John,” she says. “He was sobbing, ‘Mom, my friend is dead. He's dead.’” She panicked, but things were about to get even worse. A stranger took the phone.`,
        `Over the course of 20 minutes, the man told her he'd just <mark class="word-mark" data-word="murdered">murdered</mark> her son's friend, and he'd do the same to John if she didn't meet him with $7,500 in a Walmart parking lot.`,
        `If you think you or your loved ones are too <mark class="word-mark" data-word="savvy">savvy</mark> to fall for a deepfake, you're wrong. AI is so good now you can no longer trust your senses, and criminals are <mark class="word-mark" data-word="perpetrating scams">perpetrating scams</mark> like these on a massive scale. Thankfully, it's a high-tech problem with a low-tech solution — one that could <span class="phrase-mark" data-word="a lifetime of regret">save you a lifetime of regret</span>.`,
        `Your family needs a <mark class="word-mark" data-word="codeword">codeword</mark> that you use to <span class="phrase-mark" data-word="verify each other's identity">verify each other's identity</span> in a crisis. The <mark class="word-mark" data-word="scammer">scammer</mark> might have your voice. They don't know your secrets.`,
        `Experts and victims say this is one of the single most important things you can do to stay safe. But the password alone isn't enough. Just ask Benz.`,
        `One of the craziest parts of her story is her family already had a password for this exact scenario when she got the scam call. “It just didn't occur to me to ask for it,” says Benz. These scams get you to an active place of panic where you can't think straight. It means you also need mental preparation.`
      ]
    },
    {
      id: "england-rice",
      title: "England to make late call on Rice for World Cup semi-final",
      deck: "England remain hopeful that Declan Rice will recover in time for a decisive match against Argentina.",
      category: "体育",
      method: "PDF 文档",
      source: "BBC Sport",
      date: "8/7",
      minutes: 7,
      progress: 18,
      body: [
        `There remains optimism the Arsenal midfielder can shake off the effects of an illness to play on Wednesday.`,
        `Rice, who suffered with a sickness bug in the lead-up to Saturday's quarter-final victory over Norway in Miami, was substituted at half-time. Head coach Thomas Tuchel admitted afterwards that Rice had spent three days in bed before the match.`,
        `As things stand, there is growing hope he will be well enough to start in Atlanta. Rice is almost certain to rule himself fit for the semi-final given the <mark class="word-mark" data-word="enormity">enormity</mark> of the occasion.`,
        `And Tuchel will wait to see how rapidly his condition improves before making a final decision on whether to pick him. England medics are set to make a <span class="phrase-mark" data-word="late call">late call</span> on his availability.`,
        `<h2>WORLD CUP 2026</h2> England captain Harry Kane says the squad are “completely together” before their World Cup semi-final against Argentina.`
      ]
    }
  ];

  const wordDetails = {
    buffalo: { word: "Buffalo", phonetic: "/ˈbʌfəloʊ/", pos: "noun", meaning: "布法罗（美国纽约州西部城市）；水牛", explanation: "A city in western New York State, located on Lake Erie; also a large animal (bison) native to North America.", example: "The buffalo once roamed the Great Plains in vast herds, but now they are mostly found in national parks.", exams: ["IELTS · 建议掌握", "TOEFL · 建议掌握", "Academic English · 建议掌握"] },
    serenity: { word: "serenity", phonetic: "/səˈrenəti/", pos: "noun", meaning: "宁静；平和", explanation: "The state of being calm, peaceful and untroubled.", example: "She enjoyed the serenity of the garden before the city woke.", exams: ["IELTS", "TOEFL", "Academic English"] },
    whispers: { word: "whisper", phonetic: "/ˈwɪspər/", pos: "verb", meaning: "低声说；耳语", explanation: "To speak very quietly using the breath but not the voice.", example: "He whispered the codeword so only his mother could hear.", exams: ["IELTS", "CET-6"] },
    "deepfake scams": { word: "deepfake scams", phonetic: "/ˈdiːpfeɪk skæmz/", pos: "phrase", meaning: "深度伪造诈骗", explanation: "Fraud that uses AI-generated audio or video to imitate a real person.", example: "Deepfake scams can reproduce a family member's voice.", exams: ["IELTS", "科技英语"] },
    "falling for fraud": { word: "falling for fraud", phonetic: "/ˈfɔːlɪŋ fər frɔːd/", pos: "phrase", meaning: "陷入诈骗；上当受骗", explanation: "Being deceived by a scam or dishonest scheme.", example: "Many elderly people are falling for fraud because they are not familiar with online scams.", exams: ["IELTS · 建议掌握", "TOEFL · 建议掌握", "CET-6 · 高频"] },
    murdered: { word: "murder", phonetic: "/ˈmɜːrdər/", pos: "verb", meaning: "谋杀；杀害", explanation: "To kill someone unlawfully and intentionally.", example: "The caller falsely claimed that someone had been murdered.", exams: ["IELTS", "CET-6"] },
    "perpetrating scams": { word: "perpetrate", phonetic: "/ˈpɜːrpətreɪt/", pos: "verb", meaning: "实施（犯罪或欺骗）", explanation: "To carry out or commit a harmful, illegal or immoral action.", example: "Criminals are perpetrating scams on a massive scale.", exams: ["IELTS", "TOEFL", "Academic English"] },
    codeword: { word: "codeword", phonetic: "/ˈkoʊdwɜːrd/", pos: "noun", meaning: "暗号；密码词", explanation: "A secret word used to confirm identity or communicate privately.", example: "Agree on a family codeword before an emergency happens.", exams: ["IELTS", "实用英语"] },
    scammer: { word: "scammer", phonetic: "/ˈskæmər/", pos: "noun", meaning: "诈骗者", explanation: "A person who commits fraud or participates in a dishonest scheme.", example: "The scammer might have your voice, but not your secret.", exams: ["IELTS", "CET-6"] },
    scam: { word: "scam", phonetic: "/skæm/", pos: "noun", meaning: "骗局；诈骗", explanation: "A dishonest plan for making money or gaining an advantage.", example: "The family recognised the phone call as a scam.", exams: ["IELTS", "CET-6"] },
    preparation: { word: "preparation", phonetic: "/ˌprepəˈreɪʃn/", pos: "noun", meaning: "准备；预备", explanation: "The action or process of getting ready for something.", example: "A few minutes of preparation can prevent panic.", exams: ["IELTS", "TOEFL"] },
    crisis: { word: "crisis", phonetic: "/ˈkraɪsɪs/", pos: "noun", meaning: "危机；紧急关头", explanation: "A time of intense difficulty, danger or uncertainty.", example: "Use the codeword to confirm identity in a crisis.", exams: ["IELTS · 高频", "CET-6"] },
    victim: { word: "victim", phonetic: "/ˈvɪktɪm/", pos: "noun", meaning: "受害者", explanation: "A person harmed, injured or deceived by an event or crime.", example: "Victims often describe a sudden feeling of panic.", exams: ["IELTS", "TOEFL", "CET-6"] },
    password: { word: "password", phonetic: "/ˈpæswɜːrd/", pos: "noun", meaning: "密码；口令", explanation: "A secret word or string used to prove identity or gain access.", example: "The family had already agreed on a password.", exams: ["IELTS", "科技英语"] },
    scenario: { word: "scenario", phonetic: "/səˈnerioʊ/", pos: "noun", meaning: "情景；可能发生的情况", explanation: "A possible situation or sequence of events, especially one being planned for.", example: "They had prepared for this exact scenario.", exams: ["IELTS · 高频", "TOEFL"] },
    panic: { word: "panic", phonetic: "/ˈpænɪk/", pos: "noun", meaning: "恐慌；惊慌", explanation: "A sudden strong feeling of fear that prevents clear thought.", example: "Scammers try to push victims into a state of panic.", exams: ["IELTS", "CET-6"] },
    identity: { word: "identity", phonetic: "/aɪˈdentəti/", pos: "noun", meaning: "身份；特征", explanation: "Who a person is, or the qualities that make them recognisable.", example: "Ask for the codeword to verify the caller's identity.", exams: ["IELTS · 高频", "TOEFL"] },
    savvy: { word: "savvy", phonetic: "/ˈsævi/", pos: "adjective", meaning: "精明的；有见识的", explanation: "Having practical knowledge and a good understanding of something.", example: "Even tech-savvy users can be caught off guard by a convincing call.", exams: ["IELTS", "TOEFL"] },
    enormity: { word: "enormity", phonetic: "/ɪˈnɔːrməti/", pos: "noun", meaning: "巨大；严重性；重要性", explanation: "The great or extreme scale, seriousness, or importance of something.", example: "The team understood the enormity of the occasion.", exams: ["IELTS", "TOEFL", "GRE"] },
    "late call": { word: "late call", phonetic: "/leɪt kɔːl/", pos: "phrase", meaning: "临近时刻才作出的决定", explanation: "A decision made shortly before an event begins.", example: "The coach will make a late call on his availability.", exams: ["体育英语", "新闻英语"] }
  };

  const relatedByWord = {
    buffalo: [
      ["buffalo wing", "领域相关", "/ˈbʌfəloʊ wɪŋ/", "布法罗辣鸡翅"], ["buffaloed", "派生词", "/ˈbʌfəloʊd/", "使困惑；恐吓"], ["bufflehead", "形近词", "/ˈbʌfəlhed/", "巨头鹊鸭"], ["water buffalo", "领域相关", "/ˈwɔːtər ˈbʌfəloʊ/", "水牛"], ["herd", "领域相关", "/hɜːrd/", "兽群"], ["prairie", "领域相关", "/ˈpreri/", "大草原"], ["New York", "领域相关", "/nuː jɔːrk/", "纽约"], ["intimidate", "同义替换", "/ɪnˈtɪmɪdeɪt/", "恐吓"], ["bamboozle", "同义替换", "/bæmˈbuːzl/", "欺骗；使迷惑"]
    ],
    default: [
      ["scam", "领域相关", "/skæm/", "骗局"], ["swindle", "同义词", "/ˈswɪndl/", "诈骗"], ["fraudulent", "派生词", "/ˈfrɔːdʒələnt/", "欺诈的"], ["deception", "领域相关", "/dɪˈsepʃn/", "欺骗"], ["gullible", "领域相关", "/ˈɡʌləbl/", "易受骗的"], ["phishing", "领域相关", "/ˈfɪʃɪŋ/", "网络钓鱼"], ["fraudster", "派生词", "/ˈfrɔːdstər/", "骗子"], ["fall for", "同义词", "/fɔːl fɔːr/", "上当"], ["bamboozle", "同义替换", "/bæmˈbuːzl/", "欺骗；使迷惑"]
    ]
  };

  function baseWords() {
    return [
      ["co-hosts", "/ˌkoʊ ˈhoʊsts/", "noun", "联合主办方；共同东道主", ["IELTS", "TOEFL", "CET-6"], 2],
      ["enormity", "/ɪˈnɔːrməti/", "noun", "巨大；严重性", ["IELTS", "TOEFL", "GRE"], 0],
      ["swindle", "/ˈswɪndl/", "verb", "诈骗", ["IELTS", "TOEFL"], 3],
      ["scam", "/skæm/", "noun", "骗局", ["IELTS", "CET-6"], 1],
      ["be deceived by", "/dɪˈsiːvd/", "phrase", "被欺骗", ["IELTS", "Academic English"], 4],
      ["fall for", "/fɔːl fɔːr/", "phrase", "上当；受骗", ["IELTS", "TOEFL"], 1],
      ["falling for fraud", "/ˈfɔːlɪŋ fər frɔːd/", "phrase", "陷入诈骗；上当受骗", ["IELTS", "TOEFL", "CET-6"], 0],
      ["bamboozle", "/bæmˈbuːzl/", "verb", "欺骗；使迷惑", ["IELTS", "TOEFL"], 2],
      ["intimidate", "/ɪnˈtɪmɪdeɪt/", "verb", "恐吓", ["IELTS", "CET-6"], 1],
      ["New York", "/nuː jɔːrk/", "noun", "纽约", ["Academic English"], 4]
    ].map((item, index) => ({ id: `seed-${index}`, word: item[0], phonetic: item[1], pos: item[2], meaning: item[3], exams: item[4], reviews: item[5], addedAt: Date.now() - index * DAY }));
  }

  function loadState() {
    const fallback = { articles: articleSeeds, words: baseWords(), notes: {}, writingDrafts: {}, examLibrary: {}, intensiveNotes: {}, intensiveReviews: [], speechReports: [], reviewed: 67, streak: 4 };
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || !Array.isArray(stored.articles) || !Array.isArray(stored.words)) return fallback;
      return Object.assign(fallback, stored);
    } catch (error) {
      return fallback;
    }
  }

  let data = loadState();
  let route = "study";
  let currentArticleId = "secret-codewords";
  let selectedWord = "Buffalo";
  let selectedSentence = "One of the craziest parts of her story is her family already had a password for this exact scenario when she got the scam call.";
  let aiTab = "word";
  let categoryFilter = "全部文章";
  let articleQuery = "";
  let vocabQuery = "";
  let reviewIndex = 0;
  let reviewRevealed = false;
  let listeningSection = "1";
  let listeningMaterialIndex = 0;
  let listeningMode = "exam";
  let listeningSentenceIndex = 0;
  let listeningSpeed = .9;
  let intensiveRevealed = false;
  const intensiveDrafts = {};
  let intensiveSource = "practice";
  let intensiveCambridgeSlot = "";
  let cambridgeVolume = "21";
  let cambridgeTest = "1";
  let cambridgeSkill = "listening";
  let examImportTarget = "";
  let examObjectUrls = [];
  let pronunciationRecognition = null;
  let pronunciationRecorder = null;
  let pronunciationStream = null;
  let pronunciationChunks = [];
  let pronunciationAudioUrl = "";
  let pronunciationTranscript = "";
  let pronunciationConfidence = 0;
  let pronunciationStartedAt = 0;
  let pronunciationShouldAssess = false;
  let writingTask = "task2";
  let speakingPart = "1";
  let speakingQuestionIndex = 0;
  let speakingSeconds = 45;
  let speakingTimer = null;
  let speechRecognition = null;
  let managedSpeech = { status: "idle", context: null, utterance: null };
  let deferredInstallPrompt = null;
  let toastTimer;

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function examSlot(volume = cambridgeVolume, test = cambridgeTest, skill = cambridgeSkill) { return `cambridge-${volume}-test-${test}-${skill}`; }
  function examLabel(slot = examSlot()) {
    const match = slot.match(/^cambridge-(\d+)-test-(\d+)-(\w+)$/);
    if (!match) return "剑雅资料";
    const skillNames = { listening: "Listening", reading: "Reading", writing: "Writing", speaking: "Speaking" };
    return `剑雅 ${match[1]} · Test ${match[2]} · ${skillNames[match[3]] || match[3]}`;
  }
  function openExamDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(EXAM_DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(EXAM_STORE)) request.result.createObjectStore(EXAM_STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function putExamAsset(key, file) {
    const db = await openExamDb();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(EXAM_STORE, "readwrite");
      transaction.objectStore(EXAM_STORE).put(file, key);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  }
  async function getExamAsset(key) {
    const db = await openExamDb();
    const result = await new Promise((resolve, reject) => {
      const request = db.transaction(EXAM_STORE, "readonly").objectStore(EXAM_STORE).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return result;
  }
  function releaseExamUrls() { examObjectUrls.forEach(url => URL.revokeObjectURL(url)); examObjectUrls = []; }
  function currentArticle() { return data.articles.find(article => article.id === currentArticleId) || data.articles[0]; }
  function hasWord(word) { return data.words.some(item => item.word.toLowerCase() === String(word).toLowerCase()); }
  function getDetail(word) {
    const cleaned = String(word || "Buffalo").trim().replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
    const key = cleaned.toLowerCase();
    const variants = [key, key.replace(/['’]s$/, ""), key.endsWith("ies") ? `${key.slice(0, -3)}y` : "", key.endsWith("s") ? key.slice(0, -1) : ""];
    const known = variants.map(item => wordDetails[item]).find(Boolean);
    if (known) return known;
    const dictionaryRow = (window.ZHONGKAO_VOCAB || []).find(row => variants.includes(String(row[0]).toLowerCase()));
    if (dictionaryRow) return { word: dictionaryRow[0], phonetic: dictionaryRow[2] || "/—/", pos: "word", meaning: dictionaryRow[1], explanation: "This is a common English word. Read the selected sentence again and decide which part of the Chinese meaning fits the context.", example: selectedSentence || `This article uses “${cleaned}” in context.`, exams: ["基础词汇", "语境复习"] };
    return { word: cleaned || word, phonetic: "/—/", pos: key.includes(" ") ? "phrase" : "word", meaning: "本地词典暂未收录中文释义", explanation: "The selected expression is shown in its original sentence below. Use the surrounding words to infer its meaning, then add it to your vocabulary list for review.", example: selectedSentence || `This article uses “${cleaned}” in context.`, exams: ["待判断"] };
  }

  function showToast(message) {
    const toast = $("#toast");
    $("span", toast).textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function setRoute(nextRoute) {
    if (nextRoute !== "speaking" && speakingTimer) { clearInterval(speakingTimer); speakingTimer = null; }
    if (nextRoute !== "speaking" && speechRecognition) { speechRecognition.stop(); speechRecognition = null; }
    if (nextRoute !== "intensive") cleanupPronunciationSession();
    if (nextRoute !== route && "speechSynthesis" in window) { speechSynthesis.cancel(); managedSpeech = { status: "idle", context: null, utterance: null }; }
    releaseExamUrls();
    route = nextRoute;
    document.body.classList.remove("focus-mode");
    $("#sidebar").classList.remove("open");
    $("#mobileScrim").classList.remove("show");
    const activeRoute = route === "reader" ? "library" : route === "review" ? "vocabulary" : route;
    $$(".nav-button[data-route]").forEach(button => button.classList.toggle("active", button.dataset.route === activeRoute));
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function header(title, subtitle, action = "") {
    return `<header class="page-header"><div class="page-title-group"><p class="eyebrow">JINGCHUAN READING</p><h1>${title}</h1><p>${subtitle}</p></div>${action}</header>`;
  }

  function renderStudy() {
    const modules = [
      { route: "listening", icon: "headphones", name: "听力", task: "12 篇素材 · Section 1–4", detail: "自由选材、套题、逐句听写、核对和跟读", time: "25 分钟", tone: "blue" },
      { route: "speaking", icon: "mic", name: "口语", task: "Part 1–3 口语训练", detail: "分题型计时回答并语音记录", time: "18 分钟", tone: "green" },
      { route: "library", icon: "library", name: "阅读", task: "精读 1 篇文章", detail: "选中生词和长句，完成语境分析", time: "20 分钟", tone: "yellow" },
      { route: "writing", icon: "pen", name: "写作", task: "Task 2 主体段", detail: "完成观点、论证和例证", time: "25 分钟", tone: "purple" }
    ];
    return `<section class="page study-page">
      ${header("今日雅思学习", "按听、说、读、写完成一轮输入与输出训练。", `<span class="goal-band">目标分数 <strong>7.0</strong></span>`)}
      <section class="study-overview card"><div><span>今日建议</span><h2>先输入，再输出</h2><p>听力与阅读积累语言，口语与写作用同一主题完成输出。预计 88 分钟。</p></div><div class="study-progress"><strong>1 / 4</strong><span>今日任务</span></div></section>
      <div class="module-grid">${modules.map((module, index) => `<article class="module-card card"><div class="module-top"><span class="module-icon ${module.tone}">${icon(module.icon)}</span><span>${module.time}</span></div><p>${module.name}</p><h3>${module.task}</h3><span>${module.detail}</span><button class="button ${index === 0 ? "primary" : "ghost"}" data-route="${module.route}">${index === 0 ? "开始今日训练" : "进入练习"}${icon("chevron")}</button></article>`).join("")}</div>
      <div class="study-bottom-grid">
        <section class="today-plan card"><div class="section-simple-head"><div><h2>今日任务</h2><p>建议按顺序完成，避免只练习熟悉的科目。</p></div><span>25%</span></div>
          <div class="plan-list">${modules.map((module, index) => `<button data-route="${module.route}"><i class="plan-check ${index === 2 ? "done" : ""}">${index === 2 ? icon("check") : index + 1}</i><span><strong>${module.name} · ${module.task}</strong><small>${module.detail}</small></span><em>${module.time}${icon("chevron")}</em></button>`).join("")}</div>
        </section>
        <aside class="study-method card"><h2>本周训练重点</h2><div class="method-focus"><span>阅读</span><strong>长难句断句</strong><p>先找主谓宾，再判断从句功能。</p></div><div class="method-focus"><span>写作</span><strong>论证展开</strong><p>每个观点至少补充一个原因和例子。</p></div><button class="text-button" data-route="analytics">查看学习记录 ${icon("chevron")}</button></aside>
      </div>
    </section>`;
  }

  function filteredArticles() {
    return data.articles.filter(article => {
      const inCategory = categoryFilter === "全部文章" || article.category === categoryFilter;
      const term = articleQuery.trim().toLowerCase();
      return inCategory && (!term || `${article.title} ${article.deck} ${article.category}`.toLowerCase().includes(term));
    });
  }

  function articleListMarkup() {
    const articles = filteredArticles();
    if (!articles.length) return `<div class="card empty-state">${icon("search")}<p>没有找到匹配的文章</p></div>`;
    return articles.map(article => `
      <article class="article-row card" data-open-article="${article.id}" tabindex="0">
        <span class="article-icon">${icon("file")}</span>
        <div class="article-copy">
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.deck)}</p>
          <div class="article-meta"><span class="badge">${escapeHtml(article.category)}</span><span>${escapeHtml(article.method)}</span><span>${article.date}</span><span>${icon("clock")}${article.minutes} 分钟</span></div>
        </div>
        <div class="article-progress"><button class="article-more" aria-label="更多">${icon("more")}</button><strong>${article.progress}%</strong><span class="mini-track"><i style="width:${article.progress}%"></i></span></div>
      </article>`).join("");
  }

  function renderLibrary() {
    const categories = ["全部文章", "科技与安全", "文化", "历史", "体育"];
    return `<section class="page library-page">
      ${header("阅读精读", "打开文章后，用鼠标选中任意单词、短语或句子即可查看解释。", `<button class="button primary" id="openImport">${icon("plus")}<span>导入文章</span></button>`)}
      <div class="reading-howto card"><span>${icon("search")}<b>阅读方法</b></span><ol><li>打开一篇文章</li><li>鼠标选中不理解的内容</li><li>在右侧查看解释并加入词汇库</li></ol></div>
      <div class="library-layout">
        <aside class="filter-rail">
          <div class="search-field">${icon("search")}<input id="librarySearch" value="${escapeHtml(articleQuery)}" placeholder="搜索文章"></div>
          <div class="filter-group"><h3>分类</h3>${categories.map(item => `<button class="filter-button ${categoryFilter === item ? "active" : ""}" data-filter="${item}"><span>${item}</span><span>${item === "全部文章" ? data.articles.length : data.articles.filter(article => article.category === item).length}</span></button>`).join("")}</div>
          <div class="reading-goal"><div class="goal-head"><strong>本周阅读</strong><span>4 / 6</span></div><div class="goal-track"><span></span></div><p>再完成 2 篇文章即可达成本周目标。</p></div>
        </aside>
        <section class="article-area">
          <div class="list-heading"><h2>全部文章 <span class="badge">${filteredArticles().length}</span></h2><select class="sort-select"><option>最近导入</option><option>阅读进度</option></select></div>
          <div class="article-list" id="articleList">${articleListMarkup()}</div>
        </section>
      </div>
    </section>`;
  }

  function articleBodyMarkup(article) {
    return article.body.map((paragraph, index) => {
      if (paragraph.startsWith("<h2>")) return `<div class="interactive-sentence" data-sentence="${escapeHtml(paragraph.replace(/<[^>]+>/g, ""))}">${paragraph}</div>`;
      return `<p class="interactive-sentence" data-sentence="${escapeHtml(paragraph.replace(/<[^>]+>/g, ""))}">${paragraph}</p>`;
    }).join("");
  }

  function wordPanelMarkup() {
    const detail = getDetail(selectedWord);
    const related = selectedWord.toLowerCase() === "buffalo" ? relatedByWord.buffalo : relatedByWord.default;
    return `<div class="word-focus">
      <div class="selection-result-label">当前选中</div><h3>${escapeHtml(detail.word)}</h3><span class="phonetic">${escapeHtml(detail.phonetic)} · ${escapeHtml(detail.pos)}</span>
      <div class="word-actions"><button class="button small ${hasWord(detail.word) ? "added-button" : "primary"}" data-add-word="${escapeHtml(detail.word)}">${icon(hasWord(detail.word) ? "check" : "bookmark")}${hasWord(detail.word) ? "已加入词汇库" : "加入词汇库"}</button><button class="button small" data-speak="${escapeHtml(detail.word)}">${icon("volume")}发音</button></div>
      <section class="ai-section"><h4>考试相关性</h4><div class="exam-tags">${detail.exams.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div><p style="margin-top:9px;color:var(--muted);font-size:10px">基于 AI 词汇难度估计，不等同于官方考试词表。</p></section>
      <section class="ai-section"><h4>中文释义</h4><p>${escapeHtml(detail.meaning)}</p></section>
      <section class="ai-section"><h4>英文解释</h4><p>${escapeHtml(detail.explanation)}</p></section>
      <section class="ai-section"><h4>新编例句</h4><p>${escapeHtml(detail.example)}</p></section>
      <section class="ai-section"><h4>相关词汇</h4><div class="related-list">${related.map(item => `<div class="related-word"><div><strong>${escapeHtml(item[0])}<em>${escapeHtml(item[1])}</em></strong><span>${escapeHtml(item[2])}</span><p>${escapeHtml(item[3])}</p></div><button data-add-related="${escapeHtml(item[0])}" aria-label="加入 ${escapeHtml(item[0])}">${icon(hasWord(item[0]) ? "check" : "plus")}</button></div>`).join("")}</div><button class="button ghost add-all" id="addAllRelated">${icon("plus")}全部加入词汇库（${related.length}）</button></section>
    </div>`;
  }

  function sentencePanelMarkup() {
    const text = selectedSentence.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    let structure = "先找到句子的主语和谓语，再确认宾语或补语；其余介词短语通常补充时间、地点或方式。";
    let grammar = "这是一个完整陈述句。阅读时先压缩为“谁做了什么”，再把修饰信息逐层加回。";
    if (/^if\b/i.test(text)) { structure = "If 引导条件状语从句，逗号后的部分是主句。"; grammar = "先理解条件，再理解条件成立时的结果。注意主从句之间的逻辑关系。"; }
    else if (/\bbut\b/i.test(text)) { structure = "句子由 but 连接两个并列分句，前后形成转折。"; grammar = "把 but 前后分别读成两个短句，再关注作者真正强调的后半句。"; }
    else if (/\bthat\b/i.test(text) || /\bwhich\b/i.test(text) || /\bwho\b/i.test(text)) { structure = "句中含有从句：that / which / who 后面的部分用于补充说明名词或完整观点。"; grammar = "先暂时跳过从句读主干，再回头判断从句修饰哪个成分。"; }
    else if (/\bwhen\b/i.test(text)) { structure = "when 引导时间状语从句，说明主句动作发生的时间或背景。"; grammar = "主句承载核心信息，when 从句提供时间线索。"; }
    const known = Object.keys(wordDetails).filter(key => key.length > 4 && text.toLowerCase().includes(key)).slice(0, 4).map(key => wordDetails[key]);
    return `<section><div class="selection-result-label">已分析你选中的 ${wordCount} 个词</div><div class="sentence-box">${escapeHtml(text)}</div>
      <section class="ai-section"><h4>结构判断</h4><div class="structure-line">${structure}</div></section>
      <section class="ai-section"><h4>理解步骤</h4><p>${grammar}</p></section>
      ${known.length ? `<section class="ai-section"><h4>句中关键词</h4><div class="sentence-keywords">${known.map(item => `<button data-word="${escapeHtml(item.word)}"><strong>${escapeHtml(item.word)}</strong><span>${escapeHtml(item.meaning)}</span></button>`).join("")}</div></section>` : ""}
      <section class="ai-section"><h4>雅思阅读提示</h4><p>不要逐词翻译。先读出主干和逻辑关系，再结合上下文确认细节；这比从第一个词翻到最后一个词更快。</p></section>
    </section>`;
  }

  function summaryPanelMarkup() {
    return `<section>
      <div class="summary-card"><strong>一句话摘要</strong><p>AI 深度伪造让声音不再可信，而预先约定的家庭密码能在紧急时刻快速验证身份。</p></div>
      <div class="summary-card"><strong>核心观点</strong><p>技术型骗局也可以用低技术方案解决；关键是提前准备，并在恐慌发生前建立验证流程。</p></div>
      <div class="summary-card"><strong>文章结构</strong><p>真实案例 → 风险解释 → 解决方案 → 为什么仍需心理预演。</p></div>
      <section class="ai-section"><h4>推荐复述</h4><p>Try explaining the article in English using: <em>deepfake, codeword, verify, panic</em>.</p></section>
    </section>`;
  }

  function notePanelMarkup(article) {
    return `<section><textarea class="note-area" id="articleNote" placeholder="写下你的理解、疑问或想复习的表达……">${escapeHtml(data.notes[article.id] || "")}</textarea><button class="button primary full" style="margin-top:10px" id="saveNote">${icon("note")}保存笔记</button><section class="ai-section"><h4>自动整理</h4><p>保存后，笔记会和这篇文章一起保留，方便在资料库中继续阅读。</p></section></section>`;
  }

  function aiPanelMarkup(article) {
    const panels = { word: wordPanelMarkup(), sentence: sentencePanelMarkup(), summary: summaryPanelMarkup(), note: notePanelMarkup(article) };
    return `<aside class="ai-panel" id="aiPanel"><div class="ai-sticky">
      <header class="ai-header"><div class="ai-title"><div><span class="ai-mark">${icon("spark")}</span><div><h2>词句解释</h2><p>鼠标选中内容后自动更新</p></div></div><span class="ai-tag">阅读辅助</span></div>
      <div class="ai-tabs"><button class="ai-tab ${aiTab === "word" ? "active" : ""}" data-ai-tab="word">单词 / 短语</button><button class="ai-tab ${aiTab === "sentence" ? "active" : ""}" data-ai-tab="sentence">句子</button><button class="ai-tab ${aiTab === "summary" ? "active" : ""}" data-ai-tab="summary">全文摘要</button><button class="ai-tab ${aiTab === "note" ? "active" : ""}" data-ai-tab="note">笔记</button></div></header>
      <div class="ai-content">${panels[aiTab]}</div>
    </div></aside>`;
  }

  function renderReader() {
    const article = currentArticle();
    return `<section class="reader-page">
      <header class="reader-topbar"><div class="reader-heading"><button class="icon-button" data-route="library" aria-label="返回阅读列表">${icon("back")}</button><div><strong>${escapeHtml(article.title)}</strong><span>${article.minutes} 分钟 · 鼠标选词自动解释</span></div></div><div class="reader-actions"><button class="button small" id="generateNote">查看全文摘要</button><span class="read-percent">已读 <b id="readPercent">${article.progress}</b>%</span><button class="icon-button mobile-ai-toggle" id="toggleAI" aria-label="打开词句解释">${icon("spark")}</button></div></header>
      <div class="reader-grid simple-reader">
        <article class="article-document"><div class="selection-guide">${icon("search")}<span><strong>看不懂时直接选中</strong>：单词、短语和整句都可以，右侧会自动显示对应解释。</span></div><header class="article-header"><h1>${escapeHtml(article.title)}</h1><p class="article-dek">${escapeHtml(article.deck)}</p><div class="article-byline"><span class="source-dot">${escapeHtml(article.source.charAt(0))}</span><span>${escapeHtml(article.source)} · Updated August 2026</span></div></header><div class="article-body">${articleBodyMarkup(article)}</div><div class="article-end"><div><strong>读完了这篇文章？</strong><span>标记完成后会更新阅读统计。</span></div><button class="button primary" id="markComplete">${icon("check")}标记为已读</button></div></article>
        ${aiPanelMarkup(article)}
      </div>
    </section>`;
  }

  function filteredWords() {
    const query = vocabQuery.trim().toLowerCase();
    return data.words.filter(item => !query || `${item.word} ${item.meaning} ${item.exams.join(" ")}`.toLowerCase().includes(query));
  }

  function wordTableMarkup() {
    const words = filteredWords();
    if (!words.length) return `<tr><td colspan="6"><div class="empty-state">${icon("search")}<p>没有找到匹配的词汇</p></div></td></tr>`;
    return words.map(item => `<tr><td class="word-cell"><strong>${escapeHtml(item.word)}</strong><span>${escapeHtml(item.phonetic)} · ${escapeHtml(item.pos)}</span></td><td>${escapeHtml(item.meaning)}</td><td><div class="tag-row">${item.exams.map(tag => `<span class="badge">${escapeHtml(tag)}</span>`).join("")}</div></td><td>${item.reviews || 0} 次</td><td>${item.reviews ? "3 天后" : "今天"}</td><td><button class="table-action" data-delete-word="${item.id}" aria-label="删除">${icon("trash")}</button></td></tr>`).join("");
  }

  function renderVocabulary() {
    const reviewed = data.words.filter(word => word.reviews > 0).length;
    return `<section class="page vocab-page">
      ${header("词汇库", "从真实阅读上下文沉淀的个人词汇资产。", `<button class="button primary" id="startReview">${icon("refresh")}开始复习</button>`)}
      <div class="vocab-toolbar"><div class="search-field">${icon("search")}<input id="vocabSearch" value="${escapeHtml(vocabQuery)}" placeholder="搜索单词或释义"></div><div class="toolbar-actions"><button class="button">全部考试范围</button><button class="button" id="exportWords">导出词汇</button></div></div>
      <section class="vocab-summary card"><div class="summary-stat"><span>累计词汇</span><strong>${data.words.length}</strong></div><div class="summary-stat"><span>今日新增</span><strong>10</strong></div><div class="summary-stat"><span>已开始复习</span><strong>${reviewed}</strong></div><div class="summary-stat"><span>熟练掌握</span><strong>${Math.max(1, Math.round(reviewed * .4))}</strong></div></section>
      <section class="word-table-wrap card"><table class="word-table"><thead><tr><th>单词</th><th>中文释义</th><th>考试范围</th><th>复习次数</th><th>下次复习</th><th></th></tr></thead><tbody id="wordTableBody">${wordTableMarkup()}</tbody></table></section>
    </section>`;
  }

  const listeningSections = {
    "1": {
      label: "SECTION 1", title: "Community course registration", scene: "日常双人对话 · 表格信息", accent: "British", voiceLang: "en-GB", skill: "姓名、日期、时间、费用与拼写",
      segments: [
        ["Receptionist", "Good morning, Westbridge Community Centre. How can I help?"],
        ["Caller", "I'd like to join the evening photography course that was advertised online."],
        ["Receptionist", "Certainly. The next course begins on Tuesday the twelfth of September, and classes start at half past six."],
        ["Caller", "That suits me. Is the full course still eighty-five pounds?"],
        ["Receptionist", "Yes, and that includes the use of a camera. You only need to bring a notebook."],
        ["Caller", "Great. Please put me down as Maya Collins. That's C O L L I N S."],
        ["Receptionist", "Thank you. I'll email your confirmation this afternoon."]
      ],
      questions: [
        { type: "text", prompt: "1. Which day does the course begin?", answer: "Tuesday" },
        { type: "text", prompt: "2. What is the start time?", answer: "6:30", alternatives: ["6.30", "half past six"] },
        { type: "text", prompt: "3. What is the course fee?", answer: "85 pounds", alternatives: ["£85", "85"] },
        { type: "choice", prompt: "4. What is included in the fee?", options: [["a", "A notebook"], ["b", "Use of a camera"], ["c", "Printed photographs"]], answer: "b" },
        { type: "text", prompt: "5. What is the caller's surname?", answer: "Collins" }
      ]
    },
    "2": {
      label: "SECTION 2", title: "Library orientation", scene: "生活场景独白 · 地图与规则", accent: "British", voiceLang: "en-GB", skill: "地点变化、规则和同义替换",
      segments: [
        ["Guide", "Good morning everyone. Before we begin the library tour, I need to explain two recent changes."],
        ["Guide", "The information desk has moved from the ground floor to the first floor, beside the study area."],
        ["Guide", "Group study rooms must now be booked at least twenty-four hours in advance."],
        ["Guide", "Students can reserve a room online, but visitors should ask a member of staff for help."],
        ["Guide", "The quiet zone is on the second floor, while the cafe remains opposite the main entrance."],
        ["Guide", "Finally, bags must be left in the lockers near the lift, but laptops may be taken into all study areas."]
      ],
      questions: [
        { type: "choice", prompt: "1. Where is the information desk now?", options: [["a", "Ground floor"], ["b", "First floor"], ["c", "Second floor"]], answer: "b" },
        { type: "text", prompt: "2. How early should study rooms be booked?", answer: "24 hours", alternatives: ["twenty-four hours"] },
        { type: "choice", prompt: "3. Who should ask staff for booking help?", options: [["a", "Visitors"], ["b", "Students"], ["c", "Teachers"]], answer: "a" },
        { type: "choice", prompt: "4. Where is the quiet zone?", options: [["a", "First floor"], ["b", "Second floor"], ["c", "Opposite the entrance"]], answer: "b" },
        { type: "text", prompt: "5. Where should bags be left?", answer: "lockers", alternatives: ["the lockers"] }
      ]
    },
    "3": {
      label: "SECTION 3", title: "University project discussion", scene: "教育场景多人对话 · 观点匹配", accent: "Australian", voiceLang: "en-AU", skill: "说话者观点、态度变化和任务分工",
      segments: [
        ["Tutor", "Let's review your project on urban transport. Have you agreed on a research method?"],
        ["Nina", "We first planned an online survey, but the response rate might be too low."],
        ["Owen", "So we decided to conduct short interviews at the central bus station instead."],
        ["Tutor", "Good. Make sure you include commuters of different ages, not just university students."],
        ["Nina", "I'll organise the interviews and Owen will analyse the results."],
        ["Owen", "We also moved our presentation from Monday to Thursday because the larger seminar room was unavailable."],
        ["Tutor", "That's fine. Send me your outline by Friday so I can comment on it before the presentation."]
      ],
      questions: [
        { type: "choice", prompt: "1. Which method did the students finally choose?", options: [["a", "Online survey"], ["b", "Short interviews"], ["c", "Travel diaries"]], answer: "b" },
        { type: "choice", prompt: "2. Where will they collect data?", options: [["a", "University library"], ["b", "Shopping centre"], ["c", "Central bus station"]], answer: "c" },
        { type: "choice", prompt: "3. What does the tutor warn them about?", options: [["a", "Sample variety"], ["b", "Project cost"], ["c", "Question length"]], answer: "a" },
        { type: "text", prompt: "4. Who will analyse the results?", answer: "Owen" },
        { type: "text", prompt: "5. On which day is the presentation?", answer: "Thursday" }
      ]
    },
    "4": {
      label: "SECTION 4", title: "The role of bees in modern cities", scene: "学术独白 · 笔记填空", accent: "North American", voiceLang: "en-US", skill: "学术结构、因果关系和专业词汇",
      segments: [
        ["Lecturer", "Today we'll examine why bee populations can sometimes be healthier in cities than in agricultural areas."],
        ["Lecturer", "Cities often contain a greater variety of flowering plants, which provide food across a longer season."],
        ["Lecturer", "Rooftop gardens are especially valuable because they create connected feeding sites above busy streets."],
        ["Lecturer", "By contrast, intensive farming may offer only one crop and can expose insects to pesticides."],
        ["Lecturer", "Researchers now use small electronic tags to track how far individual bees travel."],
        ["Lecturer", "The evidence suggests that urban planning should protect both large parks and small private gardens."],
        ["Lecturer", "This network of green spaces supports pollination and strengthens urban biodiversity."]
      ],
      questions: [
        { type: "text", prompt: "1. Cities provide a greater variety of ____ plants.", answer: "flowering" },
        { type: "text", prompt: "2. Rooftop gardens create connected ____ sites.", answer: "feeding" },
        { type: "text", prompt: "3. Insects on farms may be exposed to ____.", answer: "pesticides" },
        { type: "text", prompt: "4. Researchers attach small electronic ____ to bees.", answer: "tags" },
        { type: "text", prompt: "5. Green-space networks strengthen urban ____.", answer: "biodiversity" }
      ]
    }
  };

  const additionalListeningMaterials = {
    "1": [
      {
        label: "SECTION 1", title: "Hotel room booking", scene: "日常双人对话 · 住宿预订", accent: "British", voiceLang: "en-GB", skill: "日期、房型、价格和姓名拼写",
        segments: [
          ["Agent", "Good afternoon, Harbor View Hotel. How may I help you?"],
          ["Caller", "I'd like to reserve a double room for two nights, arriving on the twenty-first of October."],
          ["Agent", "We have a garden-view room for one hundred and eighteen pounds per night, including breakfast."],
          ["Caller", "That sounds fine. My train arrives late, so I probably won't reach the hotel until half past nine."],
          ["Agent", "No problem. Could I take your name, please?"],
          ["Caller", "It's Daniel Hart. The surname is H A R T."],
          ["Agent", "Thank you. We'll hold the room and send your confirmation by email."]
        ],
        questions: [
          { type: "text", prompt: "1. What type of room does the caller want?", answer: "double", alternatives: ["double room"] },
          { type: "text", prompt: "2. On what date will he arrive?", answer: "21 October", alternatives: ["21st October", "October 21"] },
          { type: "text", prompt: "3. How many nights will he stay?", answer: "2", alternatives: ["two", "two nights", "2 nights"] },
          { type: "text", prompt: "4. What is the price per night?", answer: "118 pounds", alternatives: ["£118", "118"] },
          { type: "text", prompt: "5. What is the caller's surname?", answer: "Hart" }
        ]
      },
      {
        label: "SECTION 1", title: "Bicycle rental enquiry", scene: "日常双人对话 · 租赁咨询", accent: "Australian", voiceLang: "en-AU", skill: "时间、费用、押金和地点信息",
        segments: [
          ["Assistant", "Hello, Riverside Cycles. What can I do for you?"],
          ["Student", "I'd like to hire a hybrid bicycle from Monday the fourteenth of August for three days."],
          ["Assistant", "A hybrid costs sixteen dollars a day, and a helmet is included at no extra charge."],
          ["Student", "Great. Do I need to pay a deposit?"],
          ["Assistant", "Yes, the refundable deposit is fifty dollars. You can collect the bike from our station branch."],
          ["Student", "I'll be there at a quarter past eight. Please book it under Leila Morgan."],
          ["Assistant", "Done. Remember to bring photo identification when you collect it."]
        ],
        questions: [
          { type: "text", prompt: "1. What kind of bicycle will the student hire?", answer: "hybrid", alternatives: ["hybrid bicycle", "a hybrid"] },
          { type: "text", prompt: "2. For how many days does she need it?", answer: "3", alternatives: ["three", "three days", "3 days"] },
          { type: "text", prompt: "3. What is the daily rental price?", answer: "16 dollars", alternatives: ["$16", "16"] },
          { type: "choice", prompt: "4. What is included for free?", options: [["a", "A lock"], ["b", "A helmet"], ["c", "A map"]], answer: "b" },
          { type: "text", prompt: "5. Where will she collect the bicycle?", answer: "station branch", alternatives: ["the station branch"] }
        ]
      }
    ],
    "2": [
      {
        label: "SECTION 2", title: "City museum visitor information", scene: "生活场景独白 · 参观须知", accent: "British", voiceLang: "en-GB", skill: "开放时间、入口变化、价格与参观规则",
        segments: [
          ["Guide", "Welcome to the City Museum. Before you explore the galleries, here are a few practical details."],
          ["Guide", "The museum opens at half past nine, and the new visitor entrance is on King Street."],
          ["Guide", "Adult tickets cost twelve pounds, while visitors under sixteen enter free of charge."],
          ["Guide", "Photography is allowed in most galleries, but please do not use flash."],
          ["Guide", "The free guided tour begins in the central courtyard at eleven o'clock."],
          ["Guide", "The cafe is temporarily closed, although drinks are available beside the gift shop."]
        ],
        questions: [
          { type: "text", prompt: "1. What time does the museum open?", answer: "9:30", alternatives: ["9.30", "half past nine"] },
          { type: "text", prompt: "2. Which street is the new entrance on?", answer: "King Street" },
          { type: "text", prompt: "3. How much is an adult ticket?", answer: "12 pounds", alternatives: ["£12", "12"] },
          { type: "choice", prompt: "4. What is prohibited in the galleries?", options: [["a", "Taking photographs"], ["b", "Using flash"], ["c", "Carrying a drink"]], answer: "b" },
          { type: "text", prompt: "5. Where does the guided tour begin?", answer: "central courtyard", alternatives: ["the central courtyard", "courtyard"] }
        ]
      },
      {
        label: "SECTION 2", title: "Coastal walk safety briefing", scene: "生活场景独白 · 路线说明", accent: "Australian", voiceLang: "en-AU", skill: "路线、地标、安全提醒和交通时间",
        segments: [
          ["Leader", "Today's coastal walk is eight kilometres long and should take about four hours."],
          ["Leader", "We'll start from the lighthouse car park and follow the red route markers towards the beach."],
          ["Leader", "Please take extra care near the north cliff, where the path remains slippery after rain."],
          ["Leader", "We'll stop for lunch at Fisherman's Bay, so carry enough water and a packed meal."],
          ["Leader", "After lunch, the route passes through pine woodland before reaching the old harbour."],
          ["Leader", "A return bus will leave the harbour at twenty past four. If you miss it, the next service is two hours later."]
        ],
        questions: [
          { type: "text", prompt: "1. How long is the walk?", answer: "8 kilometres", alternatives: ["eight kilometres", "8 km"] },
          { type: "text", prompt: "2. Where does the walk begin?", answer: "lighthouse car park", alternatives: ["the lighthouse car park"] },
          { type: "choice", prompt: "3. Which route markers should walkers follow?", options: [["a", "Blue"], ["b", "Red"], ["c", "Yellow"]], answer: "b" },
          { type: "text", prompt: "4. Where will the group have lunch?", answer: "Fisherman's Bay", alternatives: ["Fishermans Bay"] },
          { type: "text", prompt: "5. What time does the return bus leave?", answer: "4:20", alternatives: ["4.20", "16:20", "twenty past four"] }
        ]
      }
    ],
    "3": [
      {
        label: "SECTION 3", title: "Food-waste research presentation", scene: "教育场景多人对话 · 项目规划", accent: "British", voiceLang: "en-GB", skill: "方案调整、数据来源、任务分工与截止日期",
        segments: [
          ["Tutor", "How is your presentation on food waste progressing?"],
          ["Priya", "We decided to focus on the campus cafeteria rather than local restaurants because access will be easier."],
          ["Liam", "We'll interview kitchen staff and compare their answers with the cafeteria's weekly waste records."],
          ["Tutor", "That combination should give you both opinions and measurable data."],
          ["Priya", "I'll design the slides, and Liam will explain the results and recommendations."],
          ["Liam", "We still need to finish the introduction, but our charts are almost ready."],
          ["Tutor", "Send me the complete draft by Wednesday so I can give you feedback before Friday's presentation."]
        ],
        questions: [
          { type: "choice", prompt: "1. What will the students use as their case study?", options: [["a", "Local restaurants"], ["b", "The campus cafeteria"], ["c", "Student kitchens"]], answer: "b" },
          { type: "text", prompt: "2. Who will they interview?", answer: "kitchen staff", alternatives: ["the kitchen staff"] },
          { type: "choice", prompt: "3. What written data will they examine?", options: [["a", "Weekly waste records"], ["b", "Customer complaints"], ["c", "Food prices"]], answer: "a" },
          { type: "text", prompt: "4. Who will design the slides?", answer: "Priya" },
          { type: "text", prompt: "5. When is the complete draft due?", answer: "Wednesday" }
        ]
      },
      {
        label: "SECTION 3", title: "Wetland ecology field trip", scene: "教育场景多人对话 · 实地考察", accent: "Australian", voiceLang: "en-AU", skill: "日程变化、装备要求和研究分工",
        segments: [
          ["Tutor", "We need to finalise the wetland field trip. The weather forecast has changed, so we'll go on Sunday instead of Saturday."],
          ["Hana", "Are we still meeting outside the science building?"],
          ["Tutor", "Yes, at a quarter to eight. The coach will leave promptly at eight o'clock."],
          ["Marcus", "Should we bring cameras as well as our field notebooks?"],
          ["Tutor", "Cameras are optional, but waterproof jackets and notebooks are essential."],
          ["Hana", "Marcus and I will test the water quality. I'll record the pH readings, and he'll photograph the plant species."],
          ["Tutor", "Good. Each pair must submit a two-page summary by the following Thursday."]
        ],
        questions: [
          { type: "text", prompt: "1. On which day will the field trip take place?", answer: "Sunday" },
          { type: "text", prompt: "2. What time should students meet?", answer: "7:45", alternatives: ["7.45", "a quarter to eight"] },
          { type: "choice", prompt: "3. Which item is optional?", options: [["a", "A camera"], ["b", "A waterproof jacket"], ["c", "A field notebook"]], answer: "a" },
          { type: "text", prompt: "4. What will Hana record?", answer: "pH readings", alternatives: ["the pH readings", "pH"] },
          { type: "text", prompt: "5. How long should the summary be?", answer: "2 pages", alternatives: ["two pages", "a two-page summary"] }
        ]
      }
    ],
    "4": [
      {
        label: "SECTION 4", title: "Sleep and memory formation", scene: "学术独白 · 实验与因果关系", accent: "North American", voiceLang: "en-US", skill: "研究过程、因果链和数字信息",
        segments: [
          ["Lecturer", "Today's lecture examines how different stages of sleep influence the formation of memories."],
          ["Lecturer", "During deep sleep, recently learned information is gradually transferred into more stable long-term storage."],
          ["Lecturer", "Exposure to blue light late in the evening can delay the release of melatonin and make sleep less efficient."],
          ["Lecturer", "In one experiment, participants learned pairs of words before either sleeping or remaining awake."],
          ["Lecturer", "The group that slept recalled significantly more pairs the following morning."],
          ["Lecturer", "Short naps can also improve alertness, but researchers recommend limiting them to about twenty minutes."],
          ["Lecturer", "Overall, a consistent bedtime appears more beneficial than trying to recover all lost sleep at the weekend."]
        ],
        questions: [
          { type: "text", prompt: "1. Deep sleep moves information into long-term ____.", answer: "storage" },
          { type: "text", prompt: "2. Blue light can delay the release of ____.", answer: "melatonin" },
          { type: "text", prompt: "3. Participants learned pairs of ____.", answer: "words" },
          { type: "text", prompt: "4. Recommended naps last about ____ minutes.", answer: "20", alternatives: ["twenty"] },
          { type: "text", prompt: "5. A consistent ____ is especially beneficial.", answer: "bedtime" }
        ]
      },
      {
        label: "SECTION 4", title: "Low-carbon concrete", scene: "学术独白 · 技术与环境", accent: "British", voiceLang: "en-GB", skill: "学术定义、对比、材料名称和研究局限",
        segments: [
          ["Lecturer", "Concrete is widely used because it is strong and inexpensive, but conventional cement production releases large quantities of carbon dioxide."],
          ["Lecturer", "One solution is to replace part of the cement with industrial by-products such as fly ash."],
          ["Lecturer", "Researchers are also testing finely crushed recycled glass, which can improve the material's durability."],
          ["Lecturer", "A more experimental approach adds dormant bacteria to concrete."],
          ["Lecturer", "When water enters a small crack, the bacteria become active and produce limestone, gradually sealing the damage."],
          ["Lecturer", "This self-healing process could extend the life of bridges and reduce the need for repairs."],
          ["Lecturer", "However, high production costs remain the main barrier to using bacterial concrete on a large scale."]
        ],
        questions: [
          { type: "text", prompt: "1. Cement production releases carbon ____.", answer: "dioxide" },
          { type: "text", prompt: "2. One industrial by-product is fly ____.", answer: "ash" },
          { type: "text", prompt: "3. Recycled glass may improve concrete's ____.", answer: "durability" },
          { type: "text", prompt: "4. Active bacteria produce ____ to seal cracks.", answer: "limestone" },
          { type: "text", prompt: "5. The main barrier is high production ____.", answer: "costs", alternatives: ["cost"] }
        ]
      }
    ]
  };

  function listeningMaterials(sectionKey = listeningSection) {
    return [listeningSections[sectionKey], ...(additionalListeningMaterials[sectionKey] || [])];
  }

  function currentListening() {
    const materials = listeningMaterials();
    return materials[listeningMaterialIndex] || materials[0];
  }

  const cambridgeVolumes = [
    { number: "21", year: 2026 }, { number: "20", year: 2025 }, { number: "19", year: 2024 }, { number: "18", year: 2023 },
    { number: "17", year: 2022 }, { number: "16", year: 2021 }, { number: "15", year: 2020 }, { number: "14", year: 2019 }
  ];
  const cambridgeSkills = [
    { id: "listening", label: "Listening", hint: "4 Sections · 40 questions" },
    { id: "reading", label: "Reading", hint: "3 passages · 40 questions" },
    { id: "writing", label: "Writing", hint: "Task 1 + Task 2" },
    { id: "speaking", label: "Speaking", hint: "Part 1–3" }
  ];

  function importedListeningEntries() {
    return Object.entries(data.examLibrary || {}).filter(([slot, meta]) => slot.endsWith("-listening") && meta.transcript);
  }

  function importedListeningMaterial(slot = intensiveCambridgeSlot) {
    const meta = data.examLibrary?.[slot];
    if (!meta?.transcript) return null;
    const lines = meta.transcript.split(/\n+/).flatMap(line => line.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map(line => line.trim()).filter(Boolean);
    return {
      label: "IMPORTED", title: examLabel(slot), scene: "已购正版资料 · 本机导入", accent: "Original / browser voice", voiceLang: "en-GB", skill: "优先使用原始音频盲听，再用逐句文本定位声音问题",
      segments: (lines.length ? lines : [meta.transcript]).map((line, index) => [`S${index + 1}`, line]), questions: []
    };
  }

  function activeIntensiveMaterial() {
    if (route === "intensive" && intensiveSource === "cambridge") return importedListeningMaterial() || currentListening();
    return currentListening();
  }

  function intensiveSessionKey() {
    return intensiveSource === "cambridge" && intensiveCambridgeSlot ? intensiveCambridgeSlot : `practice-${listeningSection}-${listeningMaterialIndex}`;
  }

  function intensiveDraftKey() { return `${intensiveSessionKey()}-${listeningSentenceIndex}`; }

  const speakingParts = {
    "1": { label: "PART 1", title: "Introduction & interview", duration: 45, guide: "每题回答 20–45 秒，直接回答后补充一个原因或细节。", questions: ["What do you like most about your hometown?", "How often do you use public transport?", "Do you prefer studying alone or with other people?", "Is there a skill you would like to learn in the future?"] },
    "2": { label: "PART 2", title: "Long turn", duration: 120, guide: "准备 1 分钟，连续回答 1–2 分钟。用时间线或 PREP 结构展开。", questions: ["Describe a useful skill you learned from another person"], cue: ["what the skill was", "who taught you this skill", "how you learned it", "and explain why it is useful to you"] },
    "3": { label: "PART 3", title: "Two-way discussion", duration: 90, guide: "每题回答 45–90 秒，提出观点、解释原因、举例并考虑另一面。", questions: ["Why do some people find it difficult to learn new skills?", "Should schools focus more on practical skills?", "How has technology changed the way people learn from each other?", "Which skills will be most valuable in the future?"] }
  };

  function listeningText(section = currentListening()) { return section.segments.map(segment => segment[1]).join(" "); }
  function normalizeAnswer(value) { return String(value || "").trim().toLowerCase().replace(/[.,£]/g, "").replace(/\s+/g, " "); }
  function dictationAccuracy(reference, draft) {
    const a = normalizeAnswer(reference).split(" ").filter(Boolean), b = normalizeAnswer(draft).split(" ").filter(Boolean);
    const grid = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) grid[i][0] = i;
    for (let j = 0; j <= b.length; j++) grid[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) grid[i][j] = Math.min(grid[i - 1][j] + 1, grid[i][j - 1] + 1, grid[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return Math.max(0, Math.round((1 - grid[a.length][b.length] / Math.max(a.length, 1)) * 100));
  }

  function speechTokens(value) { return String(value || "").toLowerCase().match(/[a-z]+(?:['’][a-z]+)?|\d+/g) || []; }

  function alignSpeechWords(reference, attempt) {
    const expected = speechTokens(reference), spoken = speechTokens(attempt);
    const grid = Array.from({ length: expected.length + 1 }, () => Array(spoken.length + 1).fill(0));
    for (let i = 0; i <= expected.length; i++) grid[i][0] = i;
    for (let j = 0; j <= spoken.length; j++) grid[0][j] = j;
    for (let i = 1; i <= expected.length; i++) for (let j = 1; j <= spoken.length; j++) grid[i][j] = Math.min(grid[i - 1][j] + 1, grid[i][j - 1] + 1, grid[i - 1][j - 1] + (expected[i - 1] === spoken[j - 1] ? 0 : 1));
    const items = [];
    let i = expected.length, j = spoken.length;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && expected[i - 1] === spoken[j - 1]) { items.push({ type: "match", expected: expected[i - 1], spoken: spoken[j - 1] }); i--; j--; }
      else if (i > 0 && j > 0 && grid[i][j] === grid[i - 1][j - 1] + 1) { items.push({ type: "replace", expected: expected[i - 1], spoken: spoken[j - 1] }); i--; j--; }
      else if (i > 0 && grid[i][j] === grid[i - 1][j] + 1) { items.push({ type: "missing", expected: expected[i - 1], spoken: "" }); i--; }
      else { items.push({ type: "extra", expected: "", spoken: spoken[j - 1] }); j--; }
    }
    return { expected, spoken, items: items.reverse(), distance: grid[expected.length][spoken.length] };
  }

  function assessSpeech(reference, attempt, durationSeconds = 0, confidence = 0) {
    const alignment = alignSpeechWords(reference, attempt);
    const matches = alignment.items.filter(item => item.type === "match").length;
    const missing = alignment.items.filter(item => item.type === "missing").map(item => item.expected);
    const replacements = alignment.items.filter(item => item.type === "replace");
    const extras = alignment.items.filter(item => item.type === "extra").map(item => item.spoken);
    const accuracy = Math.round(matches / Math.max(alignment.expected.length, 1) * 100);
    const completeness = Math.round((alignment.expected.length - missing.length) / Math.max(alignment.expected.length, 1) * 100);
    const wpm = durationSeconds > 1 ? Math.round(alignment.spoken.length / durationSeconds * 60) : 0;
    const paceScore = wpm ? Math.max(20, Math.min(100, 100 - Math.abs(125 - wpm) * .8)) : Math.min(100, accuracy + 5);
    const recognitionScore = confidence ? Math.round(confidence * 100) : accuracy;
    const pronunciation = Math.round(accuracy * .72 + recognitionScore * .28);
    const overall = Math.round(accuracy * .38 + completeness * .24 + pronunciation * .23 + paceScore * .15);
    const functionWords = new Set(["a", "an", "the", "to", "of", "for", "and", "but", "is", "are", "was", "were", "can", "have", "has"]);
    const missingFunctionWords = missing.filter(word => functionWords.has(word));
    const insights = [];
    if (missingFunctionWords.length) insights.push(`漏掉功能词 ${missingFunctionWords.slice(0, 5).join("、")}，重点听弱读而不是逐词重读。`);
    if (replacements.length) insights.push(`识别替换：${replacements.slice(0, 4).map(item => `${item.expected} → ${item.spoken}`).join("；")}。先慢速辨音，再恢复原速。`);
    if (extras.length) insights.push(`多说了 ${extras.slice(0, 5).join("、")}，可能在停顿处用词填充或凭语义补词。`);
    if (wpm && wpm < 85) insights.push(`当前约 ${wpm} WPM，先按意群朗读，减少词间停顿。`);
    if (wpm > 175) insights.push(`当前约 ${wpm} WPM，语速偏快；优先保证重音和词尾清晰。`);
    if (!insights.length) insights.push("内容还原稳定。下一轮关闭文本，保持相同节奏完成脱稿复述。");
    return { reference, attempt, durationSeconds: Math.round(durationSeconds), confidence: Math.round(confidence * 100), accuracy, completeness, pronunciation, paceScore: Math.round(paceScore), overall, wpm, missing, replacements, extras, items: alignment.items, insights };
  }

  function speechAssessmentMarkup(report) {
    if (!report) return `<div class="speech-empty"><span>${icon("spark")}</span><p>录音或输入识别结果后，系统会逐词对齐并给出研判。</p></div>`;
    const diff = report.items.map(item => item.type === "match" ? `<span class="match">${escapeHtml(item.expected)}</span>` : item.type === "missing" ? `<span class="missing" title="漏词">− ${escapeHtml(item.expected)}</span>` : item.type === "extra" ? `<span class="extra" title="多词">+ ${escapeHtml(item.spoken)}</span>` : `<span class="replace" title="应为 ${escapeHtml(item.expected)}">${escapeHtml(item.spoken)} <small>→ ${escapeHtml(item.expected)}</small></span>`).join(" ");
    return `<div class="speech-score-head"><div class="overall-score"><strong>${report.overall}</strong><span>综合研判</span></div><div class="speech-metrics"><div><strong>${report.accuracy}%</strong><span>准确</span></div><div><strong>${report.completeness}%</strong><span>完整</span></div><div><strong>${report.pronunciation}%</strong><span>清晰</span></div><div><strong>${report.wpm || "—"}</strong><span>WPM</span></div></div></div><div class="word-alignment"><h4>逐词对齐</h4><p>${diff}</p></div><div class="speech-insights"><h4>针对性研判</h4><ul>${report.insights.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div><p class="score-disclaimer">这是基于浏览器语音识别、文本对齐和语速的学习诊断，不是官方 IELTS 口语分数。</p>`;
  }

  function currentSpeechReference() {
    const material = activeIntensiveMaterial();
    return material.segments[listeningSentenceIndex % material.segments.length][1];
  }

  function updatePronunciationControls(recording) {
    const start = $("#startPronunciation"), stop = $("#stopPronunciation"), status = $("#speechRecordingStatus");
    if (start) start.disabled = recording;
    if (stop) stop.disabled = !recording;
    if (status) { status.textContent = recording ? "正在听你说…" : "准备录音"; status.classList.toggle("recording", recording); }
  }

  function finishPronunciationAssessment() {
    const attempt = $("#speechAttempt")?.value.trim() || pronunciationTranscript.trim();
    if (!attempt) return showToast("没有识别到英文，请重试或手动修改识别文本");
    const duration = pronunciationStartedAt ? (Date.now() - pronunciationStartedAt) / 1000 : 0;
    const report = { ...assessSpeech(currentSpeechReference(), attempt, duration, pronunciationConfidence), id: `speech-${Date.now()}`, key: intensiveDraftKey(), createdAt: Date.now() };
    data.speechReports ||= [];
    data.speechReports.unshift(report);
    data.speechReports = data.speechReports.slice(0, 100);
    save();
    const panel = $("#speechAssessment");
    if (panel) panel.innerHTML = speechAssessmentMarkup(report);
    showToast("AI 研判已生成");
  }

  async function startPronunciationRecording() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition || !navigator.mediaDevices?.getUserMedia) return showToast("当前浏览器不支持语音识别与录音，请使用最新版 Chrome");
    try {
      pronunciationStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pronunciationChunks = []; pronunciationTranscript = ""; pronunciationConfidence = 0; pronunciationStartedAt = Date.now(); pronunciationShouldAssess = true;
      if (pronunciationAudioUrl) { URL.revokeObjectURL(pronunciationAudioUrl); pronunciationAudioUrl = ""; }
      pronunciationRecorder = new MediaRecorder(pronunciationStream);
      pronunciationRecorder.ondataavailable = event => { if (event.data.size) pronunciationChunks.push(event.data); };
      pronunciationRecorder.onstop = () => {
        if (pronunciationChunks.length && pronunciationShouldAssess) {
          pronunciationAudioUrl = URL.createObjectURL(new Blob(pronunciationChunks, { type: pronunciationRecorder.mimeType || "audio/webm" }));
          const host = $("#speechPlayback");
          if (host) { const audio = document.createElement("audio"); audio.controls = true; audio.src = pronunciationAudioUrl; host.replaceChildren(audio); }
        }
        pronunciationStream?.getTracks().forEach(track => track.stop()); pronunciationStream = null;
        if (pronunciationShouldAssess) setTimeout(finishPronunciationAssessment, 220);
      };
      pronunciationRecognition = new Recognition();
      pronunciationRecognition.lang = activeIntensiveMaterial().voiceLang || "en-GB";
      pronunciationRecognition.continuous = true;
      pronunciationRecognition.interimResults = true;
      pronunciationRecognition.onresult = resultEvent => {
        const parts = []; const confidenceValues = [];
        for (let index = 0; index < resultEvent.results.length; index++) { parts.push(resultEvent.results[index][0].transcript); if (resultEvent.results[index].isFinal) confidenceValues.push(resultEvent.results[index][0].confidence || 0); }
        pronunciationTranscript = parts.join(" ").replace(/\s+/g, " ").trim();
        if (confidenceValues.length) pronunciationConfidence = confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length;
        const field = $("#speechAttempt"); if (field) field.value = pronunciationTranscript;
      };
      pronunciationRecognition.onerror = () => showToast("语音识别中断，请检查麦克风或网络权限");
      pronunciationRecorder.start(); pronunciationRecognition.start(); updatePronunciationControls(true);
    } catch (error) { pronunciationStream?.getTracks().forEach(track => track.stop()); pronunciationStream = null; showToast("无法访问麦克风，请允许浏览器录音权限"); }
  }

  function stopPronunciationRecording() {
    pronunciationShouldAssess = true;
    try { pronunciationRecognition?.stop(); } catch (error) {}
    pronunciationRecognition = null;
    if (pronunciationRecorder?.state === "recording") pronunciationRecorder.stop();
    else { pronunciationStream?.getTracks().forEach(track => track.stop()); pronunciationStream = null; finishPronunciationAssessment(); }
    updatePronunciationControls(false);
  }

  function cleanupPronunciationSession() {
    pronunciationShouldAssess = false;
    try { pronunciationRecognition?.abort(); } catch (error) {}
    if (pronunciationRecorder?.state === "recording") try { pronunciationRecorder.stop(); } catch (error) {}
    pronunciationStream?.getTracks().forEach(track => track.stop());
    pronunciationRecognition = null; pronunciationRecorder = null; pronunciationStream = null;
    if (pronunciationAudioUrl) { URL.revokeObjectURL(pronunciationAudioUrl); pronunciationAudioUrl = ""; }
  }

  function listeningControls(prefix, title, subtitle) {
    return `<div class="listening-player"><div class="player-copy"><span>${icon("headphones")}</span><div><strong>${title}</strong><small>${subtitle}</small></div></div><div class="player-buttons"><button class="button primary" id="play${prefix}">${icon("play")}播放 / 继续</button><button class="button" id="pause${prefix}" disabled>${icon("pause")}暂停</button><button class="button" id="restart${prefix}">${icon("refresh")}重播</button></div></div>`;
  }

  function renderListeningQuestions(section) {
    return section.questions.map((question, index) => `<fieldset><legend>${question.prompt}</legend>${question.type === "choice" ? question.options.map(option => `<label><input type="radio" name="listen-q${index}" value="${option[0]}"> ${option[1]}</label>`).join("") : `<input class="listening-answer" name="listen-q${index}" autocomplete="off" placeholder="Type your answer">`}</fieldset>`).join("");
  }

  function renderListeningExam(section) {
    return `<div class="practice-layout"><main class="practice-main card"><div class="practice-kicker"><span class="badge blue">${section.label}</span><span>精选 ${section.questions.length} 题 · 模拟考试时建议只听 1 次</span></div><h2>${section.title}</h2><p class="practice-instruction">${section.scene}。先读题并预测答案词性，再播放完整录音。</p>${listeningControls("Listening", "完整录音", `${section.accent} accent · ${section.segments.length} 个语义段`)}<div class="question-list">${renderListeningQuestions(section)}</div><div id="listeningFeedback"></div><button class="button primary" id="checkListening">提交并分析答案</button></main><aside class="practice-aside"><section class="card tip-card"><h3>本节重点</h3><p>${section.skill}</p><ul><li>题目顺序与录音信息顺序一致</li><li>先判断空格需要名词、数字还是地点</li><li>检查拼写和题目要求的字数限制</li></ul></section><section class="card transcript-card"><h3>听力原文</h3><div class="hidden transcript-lines" id="listeningTranscript">${section.segments.map(segment => `<p><b>${segment[0]}</b>${segment[1]}</p>`).join("")}</div><button class="text-button" id="toggleTranscript">提交后查看原文</button></section></aside></div>`;
  }

  function listeningLibraryMarkup() {
    const materials = listeningMaterials();
    return `<div class="section-selector">${Object.values(listeningSections).map((item, index) => `<button class="${listeningSection === String(index + 1) ? "active" : ""}" data-listening-section="${index + 1}"><strong>Section ${index + 1}</strong><span>${item.scene.split(" · ")[0]}</span></button>`).join("")}</div>
      <section class="material-library"><div class="material-library-head"><div><span>当前 Section 素材库</span><strong>${materials.length} 篇可选</strong></div><small>切换后录音、题目、原文与精听分句同步更新</small></div><div class="material-selector">${materials.map((item, index) => `<button class="${listeningMaterialIndex === index ? "active" : ""}" data-listening-material="${index}"><span>素材 ${String(index + 1).padStart(2, "0")}</span><strong>${item.title}</strong><small>${item.scene.split(" · ")[1] || item.scene} · ${item.accent}</small></button>`).join("")}</div></section>`;
  }

  function renderSpeechLab(segment) {
    const report = (data.speechReports || []).find(item => item.key === intensiveDraftKey());
    return `<section class="speech-lab"><div class="speech-lab-head"><div><span>${icon("spark")}AI 跟读研判</span><h3>让我听你说，再告诉你问题在哪里</h3><p>读出当前句。浏览器会保存本次录音供回听，并用识别结果分析漏词、替换、清晰度和语速。</p></div><div class="recording-status" id="speechRecordingStatus"><i></i>准备录音</div></div><div class="speech-reference"><span>目标句</span><p>${escapeHtml(segment[1])}</p></div><div class="speech-record-controls"><button class="button primary" id="startPronunciation">${icon("mic")}开始说</button><button class="button" id="stopPronunciation" disabled>${icon("pause")}结束并研判</button><button class="button" id="analyzeSpeechText">${icon("spark")}重新分析文本</button></div><div id="speechPlayback" class="speech-playback"></div><label class="speech-attempt">识别到的内容 <span>可以手动修正识别错误后重新分析</span><textarea id="speechAttempt" placeholder="录音后会自动显示，也可以先粘贴自己的口语转写……">${escapeHtml(report?.attempt || "")}</textarea></label><div class="speech-assessment" id="speechAssessment">${speechAssessmentMarkup(report)}</div></section>`;
  }

  function renderIntensiveListening(section) {
    const segment = section.segments[listeningSentenceIndex % section.segments.length];
    const draft = intensiveDrafts[intensiveDraftKey()] || "";
    const sessionKey = intensiveSessionKey();
    const notes = data.intensiveNotes?.[sessionKey] || {};
    const accuracy = intensiveRevealed ? dictationAccuracy(segment[1], draft) : 0;
    const causes = notes.causes || [];
    const reviewCount = (data.intensiveReviews || []).filter(item => item.sessionKey === sessionKey).length;
    const originalAudio = intensiveSource === "cambridge" ? `<div class="original-audio"><div><strong>原始听力音频</strong><span>优先使用你导入的正版音频完成盲听</span></div><div id="intensiveOriginalAudio" class="asset-loading">正在读取本机音频…</div></div>` : "";
    return `<div class="intensive-layout"><main class="intensive-main card">
      <div class="intensive-method six-steps"><span class="active"><b>1</b>盲听主旨</span><span class="active"><b>2</b>逐句听写</span><span class="${intensiveRevealed ? "active" : ""}"><b>3</b>错因诊断</span><span class="${intensiveRevealed ? "active" : ""}"><b>4</b>影子跟读</span><span><b>5</b>脱稿复述</span><span><b>6</b>间隔复习</span></div>
      <section class="blind-listen"><div><h2>第一遍：不看原文，只抓场景与逻辑</h2><p>完整播放 1 次，写下人物、主题、转折和结论；不要边听边翻译。</p></div>${originalAudio}${listeningControls("Listening", intensiveSource === "cambridge" ? "浏览器朗读备份" : "盲听完整段落", `${section.label} · ${section.title}`)}<label class="gist-note">主旨回忆<textarea id="intensiveGist" placeholder="不看原文，用中文或英文写下 1–2 句主旨……">${escapeHtml(notes.gist || "")}</textarea></label></section>
      <section class="dictation-stage"><div class="dictation-head"><div><span>5–15 秒语义段</span><strong>第 ${listeningSentenceIndex + 1} / ${section.segments.length} 句</strong></div><div><button class="icon-button" data-sentence-nav="prev" aria-label="上一句">${icon("back")}</button><button class="icon-button" data-sentence-nav="next" aria-label="下一句">${icon("chevron")}</button></div></div><div class="speaker-chip">${segment[0]}</div>${listeningControls("Sentence", "播放当前句", `${listeningSpeed}× · 建议最多循环 3 次再核对`)}<label class="dictation-input">听写内容<textarea id="intensiveDraft" spellcheck="false" placeholder="按意群写下你真正听到的内容，不要凭语法猜……">${escapeHtml(draft)}</textarea></label><div class="dictation-actions"><label>速度<select id="listeningSpeed"><option value="0.75" ${listeningSpeed === .75 ? "selected" : ""}>0.75×</option><option value="0.9" ${listeningSpeed === .9 ? "selected" : ""}>0.9×</option><option value="1" ${listeningSpeed === 1 ? "selected" : ""}>1.0×</option><option value="1.15" ${listeningSpeed === 1.15 ? "selected" : ""}>1.15×</option></select></label><button class="button primary" id="compareDictation">核对听写</button></div>
      ${intensiveRevealed ? `<div class="dictation-result"><div><strong>词级还原度 ${accuracy}%</strong><span>${accuracy >= 85 ? "声音解码稳定，进入跟读和复述。" : "先找出漏听发生在声音、词汇还是注意力。"}</span></div><p>${escapeHtml(segment[1])}</p><div class="error-causes"><label><input type="checkbox" data-error-cause="连读/失爆" ${causes.includes("连读/失爆") ? "checked" : ""}> 连读 / 失爆</label><label><input type="checkbox" data-error-cause="弱读功能词" ${causes.includes("弱读功能词") ? "checked" : ""}> 弱读功能词</label><label><input type="checkbox" data-error-cause="生词" ${causes.includes("生词") ? "checked" : ""}> 生词</label><label><input type="checkbox" data-error-cause="拼写/词尾" ${causes.includes("拼写/词尾") ? "checked" : ""}> 拼写 / 词尾</label></div><div class="dictation-result-actions"><button class="button" id="shadowSentence">${icon("volume")}0.9× 跟读当前句</button><button class="button" id="addListeningReview">${icon("calendar")}加入 D1/D3/D7 复习</button></div></div>` : ""}</section>${renderSpeechLab(segment)}
      <section class="retell-stage"><div><h3>脱稿复述</h3><p>关闭原文，用自己的话复述人物、原因、变化和结果；无需逐字背诵。</p></div><textarea id="intensiveRetell" placeholder="Write a short retelling from memory...">${escapeHtml(notes.retell || "")}</textarea><button class="button" id="saveIntensiveNote">保存本次复述</button></section>
      </main><aside class="practice-aside"><section class="card science-card"><span>循证训练流程</span><h3>先测试记忆，再获得反馈</h3><p>听写训练声音解码，跟读强化音素与词界识别，脱稿复述检验真实理解；同一句不建议无目标地无限循环。</p><div><a href="https://doi.org/10.20566/18801919_5_7" target="_blank" rel="noreferrer">听写 + 跟读研究</a><a href="https://eric.ed.gov/?id=EJ1479870" target="_blank" rel="noreferrer">2025 跟读研究</a></div></section><section class="card tip-card"><h3>本素材复习队列</h3><p><b>${reviewCount}</b> 个错句已加入。建议在第 1、3、7 天重新盲听和复述，答对后再拉长间隔。</p></section><section class="card tip-card"><h3>真正完成的标准</h3><p>重新播放时能直接听出词界与重音，不看原文能说明核心信息，并能以接近原速跟读。</p></section></aside></div>`;
  }

  function renderListening() {
    const section = currentListening();
    return `<section class="page practice-page">${header("听力套题", "Section 1–4 · 选择素材后按考试方式完成")}${listeningLibraryMarkup()}${renderListeningExam(section)}</section>`;
  }

  function renderIntensiveHub() {
    const imported = importedListeningEntries();
    if (intensiveSource === "cambridge" && !intensiveCambridgeSlot && imported.length) intensiveCambridgeSlot = imported[0][0];
    const section = activeIntensiveMaterial();
    const importedSelector = imported.length ? `<div class="imported-listening-selector">${imported.map(([slot]) => `<button class="${intensiveCambridgeSlot === slot ? "active" : ""}" data-intensive-import="${slot}"><span>本机资料</span><strong>${examLabel(slot)}</strong></button>`).join("")}</div>` : `<div class="empty-import card"><span>${icon("upload")}</span><div><h3>还没有可精听的剑雅原文</h3><p>先到剑雅资料库导入你拥有的 Listening 音频和原文。</p></div><button class="button primary" data-route="cambridge">去导入资料</button></div>`;
    return `<section class="page practice-page intensive-hub">${header("AI 精听与听写", "听写批改、录音回听、逐词对齐、口语研判与间隔复习", `<button class="button" data-route="cambridge">${icon("upload")}导入音频 / 原文</button>`)}
      <div class="source-switch"><button class="${intensiveSource === "practice" ? "active" : ""}" data-intensive-source="practice">内置训练素材</button><button class="${intensiveSource === "cambridge" ? "active" : ""}" data-intensive-source="cambridge">已导入剑雅资料 <span>${imported.length}</span></button></div>
      ${intensiveSource === "practice" ? listeningLibraryMarkup() : importedSelector}
      ${intensiveSource === "practice" || imported.length ? renderIntensiveListening(section) : ""}</section>`;
  }

  function renderCambridge() {
    const currentVolume = cambridgeVolumes.find(item => item.number === cambridgeVolume) || cambridgeVolumes[0];
    const skill = cambridgeSkills.find(item => item.id === cambridgeSkill) || cambridgeSkills[0];
    const slot = examSlot();
    const meta = data.examLibrary?.[slot];
    const readyCount = Object.keys(data.examLibrary || {}).filter(key => key.startsWith(`cambridge-${cambridgeVolume}-`)).length;
    const matrix = ["1", "2", "3", "4"].map(test => `<div class="exam-matrix-row"><strong>Test ${test}</strong>${cambridgeSkills.map(item => { const key = examSlot(cambridgeVolume, test, item.id); const ready = Boolean(data.examLibrary?.[key]); return `<button class="${ready ? "ready" : ""} ${cambridgeTest === test && cambridgeSkill === item.id ? "selected" : ""}" data-exam-cell="${test}|${item.id}"><span>${ready ? icon("check") : icon("upload")}</span>${item.label}</button>`; }).join("")}</div>`).join("");
    const assetPanel = meta ? `<div class="asset-status-grid"><div><span>${icon("file")}</span><p><strong>题目文件</strong><small>${escapeHtml(meta.paperName || "未导入")}</small></p></div><div><span>${icon("headphones")}</span><p><strong>音视频</strong><small>${escapeHtml(meta.mediaName || "未导入")}</small></p></div><div><span>${icon("note")}</span><p><strong>文本 / 原文</strong><small>${meta.transcript ? `${meta.transcript.trim().split(/\s+/).length} words` : "未导入"}</small></p></div></div><div class="local-assets"><div id="examPaperHost" class="asset-host"></div><div id="examMediaHost" class="asset-host"></div>${meta.transcript ? `<details class="owned-transcript"><summary>查看已导入文本</summary><p>${escapeHtml(meta.transcript)}</p></details>` : ""}</div><div class="exam-primary-actions"><button class="button" id="openExamImport">${icon("refresh")}更新本机资料</button>${cambridgeSkill === "listening" && meta.transcript ? `<button class="button primary" id="sendExamToIntensive">${icon("target")}送入精听听写</button>` : ""}</div>` : `<div class="copyright-lock"><span>${icon("file")}</span><div><h3>此槽位尚未导入资料</h3><p>剑雅试题、答案和音频受版权保护。请从正版书或 Cambridge One 获取后，导入到当前浏览器。</p></div><button class="button primary" id="openExamImport">${icon("upload")}导入我拥有的资料</button></div>`;
    return `<section class="page exam-library-page">${header("剑雅真题资料库", "剑雅 14–21 · Test 1–4 · 听说读写本地管理", `<a class="button" href="https://shop.cambridge.org/english/exam/ielts" target="_blank" rel="noreferrer">Cambridge 官方入口</a>`)}
      <div class="copyright-banner"><span>${icon("file")}</span><div><strong>目录完整，内容按版权状态加载</strong><p>这里提供选择、导入和训练工具，不会从网络复制盗版真题。你导入的文件只保存在本机浏览器。</p></div></div>
      <section class="exam-filters card"><div><label>选择册数</label><div class="volume-selector">${cambridgeVolumes.map(item => `<button class="${cambridgeVolume === item.number ? "active" : ""}" data-cambridge-volume="${item.number}"><strong>剑 ${item.number}</strong><span>${item.year}</span></button>`).join("")}</div></div><div class="test-skill-row"><div><label>选择套题</label><div class="test-selector">${["1", "2", "3", "4"].map(test => `<button class="${cambridgeTest === test ? "active" : ""}" data-cambridge-test="${test}">Test ${test}</button>`).join("")}</div></div><div><label>选择科目</label><div class="skill-selector">${cambridgeSkills.map(item => `<button class="${cambridgeSkill === item.id ? "active" : ""}" data-cambridge-skill="${item.id}"><strong>${item.label}</strong><span>${item.hint}</span></button>`).join("")}</div></div></div></section>
      <div class="exam-workspace"><main class="exam-detail card"><div class="practice-kicker"><span class="badge blue">剑雅 ${currentVolume.number} · ${currentVolume.year}</span><span>本册已导入 ${readyCount} / 16 个科目槽位</span></div><h2>Test ${cambridgeTest} · ${skill.label}</h2><p>${skill.hint}。选择题目文件、音视频和文本后即可在本机集中训练。</p>${assetPanel}</main><aside class="practice-aside"><section class="card tip-card"><h3>官方公开样题</h3><p>IELTS 官网提供可合法使用的 Academic Listening、Reading、Writing 和 Speaking 样题。</p><a class="button" href="https://ielts.org/take-a-test/preparation-resources/sample-test-questions/academic-test" target="_blank" rel="noreferrer">打开官方样题</a></section><section class="card tip-card"><h3>最新版本</h3><p>剑雅 21 于 2026 年 7 月出版；每册包含 4 套完整试卷，配套数字资源由 Cambridge One 提供。</p></section></aside></div>
      <section class="exam-matrix card"><div><h2>剑雅 ${cambridgeVolume} 完整目录</h2><p>绿色表示已在本机导入；点击任一格直接切换。</p></div>${matrix}</section></section>`;
  }

  function renderSpeaking() {
    const part = speakingParts[speakingPart];
    const prompt = part.questions[speakingQuestionIndex % part.questions.length];
    const minutes = String(Math.floor(speakingSeconds / 60)).padStart(2, "0"), seconds = String(speakingSeconds % 60).padStart(2, "0");
    return `<section class="page practice-page">${header("口语训练", "Speaking Part 1–3 可选择、计时、暂停与语音记录")}
      <div class="section-selector speaking-selector">${Object.values(speakingParts).map((item, index) => `<button class="${speakingPart === String(index + 1) ? "active" : ""}" data-speaking-part="${index + 1}"><strong>Part ${index + 1}</strong><span>${item.title}</span></button>`).join("")}</div>
      <div class="practice-layout"><main class="practice-main card"><div class="practice-kicker"><span class="badge green">${part.label}</span><span>${part.guide}</span></div><div class="speaking-question-nav">${part.questions.map((_, index) => `<button class="${speakingQuestionIndex === index ? "active" : ""}" data-speaking-question="${index}">${index + 1}</button>`).join("")}</div><h2>${prompt}</h2>${part.cue ? `<div class="cue-card"><p>You should say:</p><ul>${part.cue.map(item => `<li>${item}</li>`).join("")}</ul></div>` : `<p class="practice-instruction">先直接回答，再给出原因、细节或例子。避免只回答一个句子。</p>`}<div class="prompt-audio-controls"><button class="button" id="playSpeakingPrompt">${icon("volume")}朗读题目</button><button class="button" id="pauseSpeakingPrompt" disabled>${icon("pause")}暂停朗读</button></div><div class="speaking-controls"><div class="speaking-timer" id="speakingTimer">${minutes}:${seconds}</div><button class="button primary" id="startSpeakingTimer">${icon("play")}开始 / 继续</button><button class="button" id="pauseSpeakingTimer" disabled>${icon("pause")}暂停计时</button><button class="button" id="resetSpeakingTimer">${icon("refresh")}重置</button></div><label class="response-label">回答记录<textarea id="speakingTranscript" placeholder="先记关键词；开始回答后可使用语音转文字记录内容。"></textarea></label><button class="button" id="recordSpeaking">${icon("mic")}语音转文字</button></main><aside class="practice-aside"><section class="card tip-card"><h3>${part.label} 回答方法</h3><p>${part.guide}</p><ol><li><b>Point</b> — 直接给出观点</li><li><b>Reason</b> — 解释原因</li><li><b>Example</b> — 补具体细节</li><li><b>Point</b> — 回扣问题</li></ol></section><section class="card tip-card"><h3>7 分表达提醒</h3><p>流畅和连贯优先于难词堆砌。每次录音后只改一个最明显的问题，再重新回答。</p></section></aside></div></section>`;
  }

  function renderWriting() {
    const prompts = {
      task1: { label: "Academic Task 1", title: "The chart below shows the percentage of households with internet access in three countries from 2000 to 2020.", target: 150, tip: "先写总体趋势，再分组比较关键数据；不要逐年罗列。" },
      task2: { label: "Task 2", title: "Some people think technology makes life more complex, while others believe it makes life easier. Discuss both views and give your own opinion.", target: 250, tip: "讨论双方观点后必须明确给出自己的立场，并用具体例子支撑。" }
    };
    const task = prompts[writingTask];
    const draft = data.writingDrafts?.[writingTask] || "";
    const count = draft.trim() ? draft.trim().split(/\s+/).length : 0;
    return `<section class="page practice-page">
      ${header("写作训练", "IELTS Academic Writing · 审题、搭建结构、限时输出")}
      <div class="writing-switch"><button class="${writingTask === "task1" ? "active" : ""}" data-writing-task="task1">Task 1</button><button class="${writingTask === "task2" ? "active" : ""}" data-writing-task="task2">Task 2</button></div>
      <div class="writing-layout"><main class="writing-editor card"><div class="practice-kicker"><span class="badge blue">${task.label}</span><span>建议用时 ${writingTask === "task1" ? 20 : 40} 分钟</span></div><h2>${task.title}</h2><p class="writing-tip">${task.tip}</p><textarea id="writingDraft" placeholder="Write your answer here...">${escapeHtml(draft)}</textarea><footer><span><b id="writingWordCount">${count}</b> / ${task.target} words</span><button class="button primary" id="saveWriting">保存草稿</button></footer></main>
      <aside class="practice-aside"><section class="card tip-card"><h3>提交前检查</h3><label class="check-item"><input type="checkbox"> 我完整回答了题目</label><label class="check-item"><input type="checkbox"> 每段都有清晰中心句</label><label class="check-item"><input type="checkbox"> 观点后有解释或例子</label><label class="check-item"><input type="checkbox"> 检查了主谓一致和时态</label></section><section class="card tip-card"><h3>推荐结构</h3><p>${writingTask === "task1" ? "Introduction → Overview → Detail 1 → Detail 2" : "Introduction → View 1 → View 2 + Opinion → Conclusion"}</p></section></aside></div>
    </section>`;
  }

  function renderAnalytics() {
    const bars = [[5,4],[8,6],[12,10],[0,0],[18,14],[88,76],[72,63]];
    return `<section class="page analytics-page">
      ${header("学习分析", "查看过去 30 天的阅读与词汇增长趋势。")}
      <div class="metric-grid">
        <section class="metric-card card"><span class="metric-icon">${icon("book")}</span><small>本月 +3</small><strong>${data.articles.length}</strong><span>阅读文章</span></section>
        <section class="metric-card card"><span class="metric-icon">${icon("spark")}</span><small>本周 +24</small><strong>${data.reviewed}</strong><span>学习词汇</span></section>
        <section class="metric-card card"><span class="metric-icon">${icon("calendar")}</span><small>保持中</small><strong>${data.streak} 天</strong><span>连续学习</span></section>
        <section class="metric-card card"><span class="metric-icon">${icon("clock")}</span><small>较上周 +12%</small><strong>71 分</strong><span>累计学习时长</span></section>
      </div>
      <div class="analytics-grid">
        <section class="chart-card card"><h2>阅读与词汇增长</h2><p>最近 30 天的学习记录</p><div class="bar-chart">${bars.map((item, index) => `<div class="bar-day"><div class="bar-pair" style="--value:${item[0]};--correct:${item[1] / Math.max(item[0], 1) * 100}"><i></i><i></i></div><span>${["7/3", "7/9", "7/15", "7/21", "7/27", "8/2", "今天"][index]}</span></div>`).join("")}</div><div class="chart-legend"><span><i></i>复习词汇</span><span><i></i>答对词汇</span></div></section>
        <section class="chart-card card"><h2>当前阅读能力</h2><p>基于文章难度与理解表现估算</p><div class="level-ring"><div><strong>B2</strong><span>Upper Intermediate</span></div></div><div class="skill-list"><div class="skill-line"><div><span>词汇覆盖</span><span>78%</span></div><i style="--width:78%"></i></div><div class="skill-line"><div><span>长难句理解</span><span>69%</span></div><i style="--width:69%"></i></div><div class="skill-line"><div><span>阅读速度</span><span>74%</span></div><i style="--width:74%"></i></div></div></section>
        <section class="chart-card card topic-card"><h2>主题涉猎</h2><p>你最近阅读的内容分布</p><div class="topic-bars">${[["科技",92,2],["历史",66,1],["文化",54,1],["体育",48,1]].map(item => `<div class="topic-row"><span>${item[0]}</span><i style="--width:${item[1]}%"></i><strong>${item[2]} 篇</strong></div>`).join("")}</div></section>
      </div>
    </section>`;
  }

  function renderReview() {
    const queue = data.words.slice(0, 10);
    if (reviewIndex >= queue.length) {
      return `<section class="review-page"><div class="review-toolbar"><button class="icon-button" data-route="vocabulary">${icon("x")}</button><div></div><span></span></div><div class="review-stage"><div class="review-complete"><span class="complete-icon">${icon("check")}</span><h2>今天的复习已完成</h2><p>10 个词已经重新排入艾宾浩斯复习计划。</p><button class="button primary" data-route="analytics">查看学习分析</button></div></div></section>`;
    }
    const word = queue[reviewIndex];
    return `<section class="review-page"><div class="review-toolbar"><button class="icon-button" data-route="vocabulary">${icon("x")}</button><div><div class="session-head"><span>${reviewIndex + 1} / ${queue.length}</span><span>英文回想</span></div><div class="session-track"><span style="width:${(reviewIndex + 1) / queue.length * 100}%"></span></div></div><button class="icon-button">${icon("settings")}</button></div>
      <div class="review-stage"><article class="review-card card"><div class="review-card-head"><span class="badge">英文 → 中文</span><span>间隔复习</span></div><div class="flashcard"><p class="counterword">请回想这个表达的中文意思</p><h2>${escapeHtml(word.word)}</h2><div class="pronounce"><span>${escapeHtml(word.phonetic)}</span><button data-speak="${escapeHtml(word.word)}">${icon("volume")}</button></div>${reviewRevealed ? `<p class="meaning">${escapeHtml(word.meaning)}</p>` : ""}</div>${reviewRevealed ? `<p class="rating-prompt">这次回忆有多轻松？</p><div class="rating-grid"><button data-rating="again"><strong>再来</strong><span>10 分钟</span></button><button data-rating="hard"><strong>困难</strong><span>1 天</span></button><button data-rating="good"><strong>记得</strong><span>3 天</span></button><button data-rating="easy"><strong>熟练</strong><span>7 天</span></button></div>` : `<button class="button primary reveal-button" id="revealWord">显示答案</button>`}</article></div>
    </section>`;
  }

  function render() {
    const views = { study: renderStudy, cambridge: renderCambridge, library: renderLibrary, listening: renderListening, intensive: renderIntensiveHub, speaking: renderSpeaking, writing: renderWriting, reader: renderReader, vocabulary: renderVocabulary, analytics: renderAnalytics, review: renderReview };
    $("#app").innerHTML = (views[route] || renderStudy)();
    bindViewInputs();
    if (route === "cambridge" || (route === "intensive" && intensiveSource === "cambridge")) hydrateExamAssets();
  }

  async function hydrateExamAssets() {
    releaseExamUrls();
    const slot = route === "intensive" ? intensiveCambridgeSlot : examSlot();
    const meta = data.examLibrary?.[slot];
    if (!meta) return;
    try {
      const [paper, media] = await Promise.all([getExamAsset(`${slot}:paper`), getExamAsset(`${slot}:media`)]);
      if (route === "cambridge" && slot !== examSlot()) return;
      if (paper && $("#examPaperHost")) {
        const url = URL.createObjectURL(paper); examObjectUrls.push(url);
        const link = document.createElement("a"); link.className = "button"; link.href = url; link.target = "_blank"; link.rel = "noreferrer"; link.innerHTML = `${icon("file")}打开题目 / 答案文件`;
        $("#examPaperHost").replaceChildren(link);
      }
      const mediaHost = route === "intensive" ? $("#intensiveOriginalAudio") : $("#examMediaHost");
      if (media && mediaHost) {
        const url = URL.createObjectURL(media); examObjectUrls.push(url);
        const player = document.createElement(media.type.startsWith("video/") ? "video" : "audio"); player.controls = true; player.preload = "metadata"; player.src = url;
        mediaHost.replaceChildren(player);
      } else if (mediaHost) mediaHost.textContent = "未导入原始音频，可使用浏览器朗读备份。";
    } catch (error) {
      [$("#examPaperHost"), $("#examMediaHost"), $("#intensiveOriginalAudio")].filter(Boolean).forEach(host => { host.textContent = "本机文件读取失败，请重新导入。"; });
    }
  }

  function bindViewInputs() {
    const librarySearch = $("#librarySearch");
    if (librarySearch) librarySearch.addEventListener("input", event => { articleQuery = event.target.value; $("#articleList").innerHTML = articleListMarkup(); });
    const vocabSearch = $("#vocabSearch");
    if (vocabSearch) vocabSearch.addEventListener("input", event => { vocabQuery = event.target.value; $("#wordTableBody").innerHTML = wordTableMarkup(); });
    const writingDraft = $("#writingDraft");
    if (writingDraft) writingDraft.addEventListener("input", event => {
      const count = event.target.value.trim() ? event.target.value.trim().split(/\s+/).length : 0;
      $("#writingWordCount").textContent = count;
      data.writingDrafts ||= {};
      data.writingDrafts[writingTask] = event.target.value;
    });
    const intensiveDraft = $("#intensiveDraft");
    if (intensiveDraft) intensiveDraft.addEventListener("input", event => { intensiveDrafts[intensiveDraftKey()] = event.target.value; });
    const speedSelect = $("#listeningSpeed");
    if (speedSelect) speedSelect.addEventListener("change", event => { listeningSpeed = Number(event.target.value); });
    ["Gist", "Retell"].forEach(kind => {
      const field = $(`#intensive${kind}`);
      if (field) field.addEventListener("input", event => {
        data.intensiveNotes ||= {};
        data.intensiveNotes[intensiveSessionKey()] ||= {};
        data.intensiveNotes[intensiveSessionKey()][kind.toLowerCase()] = event.target.value;
      });
    });
  }

  function addWord(word) {
    if (hasWord(word)) { showToast(`“${word}” 已在词汇库中`); return; }
    const detail = getDetail(word);
    data.words.unshift({ id: `word-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, word: detail.word, phonetic: detail.phonetic, pos: detail.pos, meaning: detail.meaning, exams: detail.exams, reviews: 0, addedAt: Date.now() });
    save();
    showToast(`已将 “${detail.word}” 加入词汇库`);
  }

  function updateManagedControls() {
    ["Listening", "Sentence", "SpeakingPrompt"].forEach(context => {
      const play = $(`#play${context}`), pause = $(`#pause${context}`);
      if (pause) pause.disabled = !(managedSpeech.context === context && managedSpeech.status === "playing");
      if (play) play.innerHTML = `${icon("play")}${managedSpeech.context === context && managedSpeech.status === "paused" ? "继续" : context === "SpeakingPrompt" ? "朗读题目" : "播放 / 继续"}`;
    });
  }

  function playManagedSpeech(text, context, rate = .9, restart = false, lang = "en-GB") {
    if (!("speechSynthesis" in window)) return showToast("当前浏览器不支持发音");
    if (!restart && managedSpeech.context === context && managedSpeech.status === "paused") {
      speechSynthesis.resume();
      managedSpeech.status = "playing";
      updateManagedControls();
      return;
    }
    if (!restart && managedSpeech.context === context && managedSpeech.status === "playing") return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.onend = () => { managedSpeech = { status: "idle", context: null, utterance: null }; updateManagedControls(); };
    utterance.onerror = () => { managedSpeech = { status: "idle", context: null, utterance: null }; updateManagedControls(); };
    managedSpeech = { status: "playing", context, utterance };
    speechSynthesis.speak(utterance);
    updateManagedControls();
  }

  function pauseManagedSpeech(context) {
    if (!("speechSynthesis" in window) || managedSpeech.context !== context || managedSpeech.status !== "playing") return;
    speechSynthesis.pause();
    managedSpeech.status = "paused";
    updateManagedControls();
  }

  function stopManagedSpeech() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    managedSpeech = { status: "idle", context: null, utterance: null };
    updateManagedControls();
  }

  function speak(text) {
    playManagedSpeech(text, "word", .82, true);
  }

  function refreshAiPanel(openOnMobile = false) {
    const panel = $("#aiPanel");
    if (!panel) return;
    panel.outerHTML = aiPanelMarkup(currentArticle());
    if (openOnMobile && window.innerWidth <= 930) $("#aiPanel")?.classList.add("open");
  }

  function handleArticleSelection() {
    if (route !== "reader") return;
    const selection = window.getSelection();
    const text = selection?.toString().replace(/\s+/g, " ").trim();
    if (!selection || !text || text.length > 600) return;
    const range = selection.getRangeAt(0);
    const commonNode = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
    if (!commonNode?.closest?.(".article-body")) return;

    const sentenceElement = commonNode.closest(".interactive-sentence");
    if (sentenceElement) selectedSentence = sentenceElement.textContent.replace(/\s+/g, " ").trim();
    const tokens = text.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g) || [];
    const looksLikeSentence = tokens.length > 4 || /[.!?;:]$/.test(text);
    if (looksLikeSentence) {
      selectedSentence = text;
      aiTab = "sentence";
    } else {
      selectedWord = text.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
      aiTab = "word";
    }
    refreshAiPanel(true);
  }

  document.addEventListener("mouseup", () => setTimeout(handleArticleSelection, 0));

  document.addEventListener("click", event => {
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) { setRoute(routeButton.dataset.route); return; }

    const articleButton = event.target.closest("[data-open-article]");
    if (articleButton) { currentArticleId = articleButton.dataset.openArticle; selectedWord = currentArticleId === "england-rice" ? "enormity" : "Buffalo"; aiTab = "word"; setRoute("reader"); return; }

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) { categoryFilter = filterButton.dataset.filter; render(); return; }

    if (event.target.closest("#openImport")) { $("#importDialog").showModal(); return; }
    if (event.target.closest("#startReview")) { reviewIndex = 0; reviewRevealed = false; setRoute("review"); return; }
    if (event.target.closest("#revealWord")) { reviewRevealed = true; render(); return; }
    const volumeButton = event.target.closest("[data-cambridge-volume]");
    if (volumeButton) { cambridgeVolume = volumeButton.dataset.cambridgeVolume; render(); return; }
    const testButton = event.target.closest("[data-cambridge-test]");
    if (testButton) { cambridgeTest = testButton.dataset.cambridgeTest; render(); return; }
    const skillButton = event.target.closest("[data-cambridge-skill]");
    if (skillButton) { cambridgeSkill = skillButton.dataset.cambridgeSkill; render(); return; }
    const examCell = event.target.closest("[data-exam-cell]");
    if (examCell) { [cambridgeTest, cambridgeSkill] = examCell.dataset.examCell.split("|"); render(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (event.target.closest("#openExamImport")) {
      examImportTarget = examSlot();
      $("#examImportLabel").textContent = `${examLabel(examImportTarget)} · 文件只保存在当前浏览器`;
      $("#examImportForm").reset();
      $("#examTranscript").value = data.examLibrary?.[examImportTarget]?.transcript || "";
      $("#examImportDialog").showModal();
      return;
    }
    if (event.target.closest("#sendExamToIntensive")) { intensiveSource = "cambridge"; intensiveCambridgeSlot = examSlot(); listeningSentenceIndex = 0; intensiveRevealed = false; setRoute("intensive"); return; }
    const intensiveSourceButton = event.target.closest("[data-intensive-source]");
    if (intensiveSourceButton) { stopManagedSpeech(); cleanupPronunciationSession(); intensiveSource = intensiveSourceButton.dataset.intensiveSource; if (intensiveSource === "cambridge" && !intensiveCambridgeSlot) intensiveCambridgeSlot = importedListeningEntries()[0]?.[0] || ""; listeningSentenceIndex = 0; intensiveRevealed = false; render(); return; }
    const importedListeningButton = event.target.closest("[data-intensive-import]");
    if (importedListeningButton) { stopManagedSpeech(); cleanupPronunciationSession(); intensiveCambridgeSlot = importedListeningButton.dataset.intensiveImport; listeningSentenceIndex = 0; intensiveRevealed = false; render(); return; }
    const listeningModeButton = event.target.closest("[data-listening-mode]");
    if (listeningModeButton) { stopManagedSpeech(); listeningMode = listeningModeButton.dataset.listeningMode; intensiveRevealed = false; render(); return; }
    const listeningSectionButton = event.target.closest("[data-listening-section]");
    if (listeningSectionButton) { stopManagedSpeech(); cleanupPronunciationSession(); listeningSection = listeningSectionButton.dataset.listeningSection; listeningMaterialIndex = 0; listeningSentenceIndex = 0; intensiveRevealed = false; render(); return; }
    const listeningMaterialButton = event.target.closest("[data-listening-material]");
    if (listeningMaterialButton) { stopManagedSpeech(); cleanupPronunciationSession(); listeningMaterialIndex = Number(listeningMaterialButton.dataset.listeningMaterial); listeningSentenceIndex = 0; intensiveRevealed = false; render(); return; }
    if (event.target.closest("#playListening")) { const material = activeIntensiveMaterial(); playManagedSpeech(listeningText(material), "Listening", listeningSpeed, false, material.voiceLang); return; }
    if (event.target.closest("#pauseListening")) { pauseManagedSpeech("Listening"); return; }
    if (event.target.closest("#restartListening")) { const material = activeIntensiveMaterial(); playManagedSpeech(listeningText(material), "Listening", listeningSpeed, true, material.voiceLang); return; }
    const currentSegment = () => { const material = activeIntensiveMaterial(); return material.segments[listeningSentenceIndex % material.segments.length][1]; };
    if (event.target.closest("#playSentence")) { const material = activeIntensiveMaterial(); playManagedSpeech(currentSegment(), "Sentence", listeningSpeed, false, material.voiceLang); return; }
    if (event.target.closest("#pauseSentence")) { pauseManagedSpeech("Sentence"); return; }
    if (event.target.closest("#restartSentence")) { const material = activeIntensiveMaterial(); playManagedSpeech(currentSegment(), "Sentence", listeningSpeed, true, material.voiceLang); return; }
    if (event.target.closest("#shadowSentence")) { const material = activeIntensiveMaterial(); playManagedSpeech(currentSegment(), "Sentence", .9, true, material.voiceLang); showToast("跟随音频同步开口，注意重音、弱读和节奏"); return; }
    const sentenceNav = event.target.closest("[data-sentence-nav]");
    if (sentenceNav) {
      cleanupPronunciationSession();
      intensiveDrafts[intensiveDraftKey()] = $("#intensiveDraft")?.value || "";
      const length = activeIntensiveMaterial().segments.length;
      listeningSentenceIndex = sentenceNav.dataset.sentenceNav === "next" ? (listeningSentenceIndex + 1) % length : (listeningSentenceIndex - 1 + length) % length;
      intensiveRevealed = false; stopManagedSpeech(); render(); return;
    }
    if (event.target.closest("#compareDictation")) { intensiveDrafts[intensiveDraftKey()] = $("#intensiveDraft").value; intensiveRevealed = true; render(); return; }
    const errorCause = event.target.closest("[data-error-cause]");
    if (errorCause) { data.intensiveNotes ||= {}; data.intensiveNotes[intensiveSessionKey()] ||= {}; data.intensiveNotes[intensiveSessionKey()].causes = $$('[data-error-cause]:checked').map(input => input.dataset.errorCause); save(); return; }
    if (event.target.closest("#saveIntensiveNote")) { data.intensiveNotes ||= {}; data.intensiveNotes[intensiveSessionKey()] ||= {}; data.intensiveNotes[intensiveSessionKey()].gist = $("#intensiveGist")?.value || ""; data.intensiveNotes[intensiveSessionKey()].retell = $("#intensiveRetell")?.value || ""; save(); showToast("主旨与复述已保存到本机"); return; }
    if (event.target.closest("#addListeningReview")) { const material = activeIntensiveMaterial(); data.intensiveReviews ||= []; const duplicate = data.intensiveReviews.some(item => item.sessionKey === intensiveSessionKey() && item.sentenceIndex === listeningSentenceIndex); if (!duplicate) data.intensiveReviews.push({ id: `listen-review-${Date.now()}`, sessionKey: intensiveSessionKey(), title: material.title, sentenceIndex: listeningSentenceIndex, text: currentSegment(), createdAt: Date.now(), stage: 0, nextAt: Date.now() + DAY, intervals: [1, 3, 7] }); save(); showToast(duplicate ? "这句话已在复习队列中" : "已安排第 1、3、7 天重新盲听"); render(); return; }
    if (event.target.closest("#startPronunciation")) { startPronunciationRecording(); return; }
    if (event.target.closest("#stopPronunciation")) { stopPronunciationRecording(); return; }
    if (event.target.closest("#analyzeSpeechText")) { pronunciationTranscript = $("#speechAttempt")?.value || ""; pronunciationStartedAt = 0; pronunciationConfidence = 0; finishPronunciationAssessment(); return; }
    if (event.target.closest("#toggleTranscript")) { $("#listeningTranscript")?.classList.toggle("hidden"); event.target.closest("#toggleTranscript").textContent = $("#listeningTranscript")?.classList.contains("hidden") ? "提交后查看原文" : "隐藏原文"; return; }
    if (event.target.closest("#checkListening")) {
      const section = currentListening();
      const chosen = section.questions.map((question, index) => question.type === "choice" ? $(`input[name="listen-q${index}"]:checked`)?.value || "" : $(`input[name="listen-q${index}"]`)?.value || "");
      if (chosen.some(answer => !answer.trim())) { showToast(`请先完成 ${section.questions.length} 道题`); return; }
      const results = section.questions.map((question, index) => {
        const accepted = [question.answer, ...(question.alternatives || [])].map(normalizeAnswer);
        return accepted.includes(normalizeAnswer(chosen[index]));
      });
      const score = results.filter(Boolean).length;
      $("#listeningFeedback").innerHTML = `<div class="practice-feedback ${score === section.questions.length ? "success" : ""}"><strong>${score} / ${section.questions.length} 答对</strong><p>${section.questions.map((question, index) => `${index + 1}. ${question.answer}${results[index] ? " ✓" : ""}`).join("；")}</p></div>`;
      return;
    }
    const speakingPartButton = event.target.closest("[data-speaking-part]");
    if (speakingPartButton) { if (speakingTimer) clearInterval(speakingTimer); speakingTimer = null; stopManagedSpeech(); speakingPart = speakingPartButton.dataset.speakingPart; speakingQuestionIndex = 0; speakingSeconds = speakingParts[speakingPart].duration; render(); return; }
    const speakingQuestionButton = event.target.closest("[data-speaking-question]");
    if (speakingQuestionButton) { if (speakingTimer) clearInterval(speakingTimer); speakingTimer = null; stopManagedSpeech(); speakingQuestionIndex = Number(speakingQuestionButton.dataset.speakingQuestion); speakingSeconds = speakingParts[speakingPart].duration; render(); return; }
    if (event.target.closest("#playSpeakingPrompt")) { playManagedSpeech(speakingParts[speakingPart].questions[speakingQuestionIndex], "SpeakingPrompt", .86); return; }
    if (event.target.closest("#pauseSpeakingPrompt")) { pauseManagedSpeech("SpeakingPrompt"); return; }
    if (event.target.closest("#startSpeakingTimer")) {
      if (speakingTimer) return;
      if (speakingSeconds <= 0) speakingSeconds = speakingParts[speakingPart].duration;
      $("#pauseSpeakingTimer").disabled = false;
      speakingTimer = setInterval(() => {
        speakingSeconds -= 1;
        const timer = $("#speakingTimer");
        if (timer) timer.textContent = `${String(Math.floor(speakingSeconds / 60)).padStart(2, "0")}:${String(speakingSeconds % 60).padStart(2, "0")}`;
        if (speakingSeconds <= 0) { clearInterval(speakingTimer); speakingTimer = null; $("#pauseSpeakingTimer")?.setAttribute("disabled", ""); showToast("本题计时结束，请回听并只改一个最明显的问题"); }
      }, 1000);
      return;
    }
    if (event.target.closest("#pauseSpeakingTimer")) { if (speakingTimer) clearInterval(speakingTimer); speakingTimer = null; event.target.closest("#pauseSpeakingTimer").disabled = true; return; }
    if (event.target.closest("#resetSpeakingTimer")) { if (speakingTimer) clearInterval(speakingTimer); speakingTimer = null; speakingSeconds = speakingParts[speakingPart].duration; const timer = $("#speakingTimer"); if (timer) timer.textContent = `${String(Math.floor(speakingSeconds / 60)).padStart(2, "0")}:${String(speakingSeconds % 60).padStart(2, "0")}`; $("#pauseSpeakingTimer").disabled = true; return; }
    if (event.target.closest("#recordSpeaking")) {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) { showToast("当前浏览器不支持语音转文字，可直接在文本框记录"); return; }
      speechRecognition?.stop();
      speechRecognition = new Recognition();
      speechRecognition.lang = "en-GB";
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.onresult = resultEvent => {
        const transcript = Array.from(resultEvent.results).map(result => result[0].transcript).join(" ");
        const field = $("#speakingTranscript");
        if (field) field.value = transcript;
      };
      speechRecognition.onerror = () => showToast("未能使用麦克风，请检查浏览器权限");
      speechRecognition.start();
      showToast("正在记录英文回答，再次进入页面会停止录音");
      return;
    }
    const writingTaskButton = event.target.closest("[data-writing-task]");
    if (writingTaskButton) { data.writingDrafts ||= {}; data.writingDrafts[writingTask] = $("#writingDraft")?.value || data.writingDrafts[writingTask] || ""; writingTask = writingTaskButton.dataset.writingTask; render(); return; }
    if (event.target.closest("#saveWriting")) { data.writingDrafts ||= {}; data.writingDrafts[writingTask] = $("#writingDraft").value; save(); showToast("写作草稿已保存到本机"); return; }

    const rating = event.target.closest("[data-rating]");
    if (rating) { const word = data.words[reviewIndex]; if (word) word.reviews = (word.reviews || 0) + 1; data.reviewed += 1; save(); reviewIndex += 1; reviewRevealed = false; render(); return; }

    const browserSelection = window.getSelection()?.toString().trim();
    if (route === "reader" && browserSelection && event.target.closest(".article-body")) return;

    const wordMark = event.target.closest("[data-word]");
    if (wordMark) { selectedWord = wordMark.dataset.word; aiTab = "word"; $$(".word-mark,.phrase-mark").forEach(item => item.classList.remove("selected")); wordMark.classList.add("selected"); const panel = $("#aiPanel"); if (panel) panel.outerHTML = aiPanelMarkup(currentArticle()); if (window.innerWidth <= 930) $("#aiPanel").classList.add("open"); return; }

    const sentence = event.target.closest("[data-sentence]");
    if (sentence) { selectedSentence = sentence.dataset.sentence; aiTab = "sentence"; $$(".interactive-sentence").forEach(item => item.classList.remove("selected")); sentence.classList.add("selected"); const panel = $("#aiPanel"); if (panel) panel.outerHTML = aiPanelMarkup(currentArticle()); if (window.innerWidth <= 930) $("#aiPanel").classList.add("open"); return; }

    const aiTabButton = event.target.closest("[data-ai-tab]");
    if (aiTabButton) { aiTab = aiTabButton.dataset.aiTab; const panel = $("#aiPanel"); if (panel) panel.outerHTML = aiPanelMarkup(currentArticle()); return; }

    const addWordButton = event.target.closest("[data-add-word]");
    if (addWordButton) { addWord(addWordButton.dataset.addWord); const panel = $("#aiPanel"); if (panel) panel.outerHTML = aiPanelMarkup(currentArticle()); return; }
    const addRelated = event.target.closest("[data-add-related]");
    if (addRelated) { addWord(addRelated.dataset.addRelated); addRelated.innerHTML = icon("check"); return; }
    if (event.target.closest("#addAllRelated")) { const related = selectedWord.toLowerCase() === "buffalo" ? relatedByWord.buffalo : relatedByWord.default; related.forEach(item => { if (!hasWord(item[0])) addWord(item[0]); }); const panel = $("#aiPanel"); if (panel) panel.outerHTML = aiPanelMarkup(currentArticle()); showToast("相关词汇已批量加入词汇库"); return; }

    const speakButton = event.target.closest("[data-speak]");
    if (speakButton) { speak(speakButton.dataset.speak); return; }
    const deleteButton = event.target.closest("[data-delete-word]");
    if (deleteButton) { data.words = data.words.filter(item => item.id !== deleteButton.dataset.deleteWord); save(); render(); showToast("词汇已移除"); return; }

    if (event.target.closest("#toggleAI")) { $("#aiPanel")?.classList.toggle("open"); return; }
    if (event.target.closest("#generateNote")) { aiTab = "summary"; const panel = $("#aiPanel"); if (panel) { panel.outerHTML = aiPanelMarkup(currentArticle()); $("#aiPanel").classList.add("open"); } showToast("精读笔记已生成"); return; }
    if (event.target.closest("#saveNote")) { data.notes[currentArticleId] = $("#articleNote").value; save(); showToast("笔记已保存"); return; }
    if (event.target.closest("#markComplete")) { const article = currentArticle(); article.progress = 100; save(); $("#readPercent").textContent = "100"; showToast("已完成阅读，学习记录已更新"); return; }
    if (event.target.closest("#exportWords")) { exportVocabulary(); return; }
  });

  function exportVocabulary() {
    const rows = [["word", "phonetic", "meaning", "exams"], ...data.words.map(item => [item.word, item.phonetic, item.meaning, item.exams.join("|")])];
    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    link.download = "知阅词汇库.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("词汇表已导出");
  }

  function exportStudyBackup() {
    const backup = { app: "知阅 IELTS", version: 1, exportedAt: new Date().toISOString(), data };
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" }));
    link.download = `知阅学习备份-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("学习备份已导出");
  }

  async function restoreStudyBackup(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const restored = parsed?.data || parsed;
      if (!restored || !Array.isArray(restored.articles) || !Array.isArray(restored.words)) throw new Error("格式不正确");
      if (!window.confirm(`将恢复 ${restored.words.length} 个词和 ${restored.articles.length} 篇文章，并替换平板当前记录。是否继续？`)) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
      showToast("恢复成功，正在重新载入");
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      showToast("无法读取备份，请选择“知阅学习备份”JSON 文件");
    } finally {
      $("#studyBackupFile").value = "";
    }
  }

  async function installApp() {
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) return showToast("知阅已经安装在这台设备上");
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return;
    }
    if (location.protocol === "file:") return showToast("部署到网址后，平板即可安装到主屏幕");
    const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    showToast(isAppleMobile ? "请点 Safari 的分享按钮，再选“添加到主屏幕”" : "请打开浏览器菜单，选择“安装应用”或“添加到主屏幕”");
  }

  $("#mobileMenu").addEventListener("click", () => { $("#sidebar").classList.add("open"); $("#mobileScrim").classList.add("show"); });
  $("#mobileScrim").addEventListener("click", () => { $("#sidebar").classList.remove("open"); $("#mobileScrim").classList.remove("show"); });
  $("#focusToggle").addEventListener("click", () => document.body.classList.add("focus-mode"));
  $("#focusExit").addEventListener("click", () => document.body.classList.remove("focus-mode"));
  $("#installApp").addEventListener("click", installApp);
  $("#deviceTransfer").addEventListener("click", () => $("#transferDialog").showModal());
  $("#exportStudyBackup").addEventListener("click", exportStudyBackup);
  $("#studyBackupFile").addEventListener("change", event => restoreStudyBackup(event.target.files[0]));

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  $$("[data-import-tab]").forEach(button => button.addEventListener("click", () => {
    $$("[data-import-tab]").forEach(item => item.classList.toggle("active", item === button));
    $$("[data-import-panel]").forEach(panel => panel.classList.toggle("active", panel.dataset.importPanel === button.dataset.importTab));
  }));
  $("#articleText").addEventListener("input", event => $("#textCount").textContent = event.target.value.length);
  $("#cancelImport").addEventListener("click", () => $("#importDialog").close());
  $("#cancelExamImport").addEventListener("click", () => $("#examImportDialog").close());
  $("#examImportForm").addEventListener("submit", async event => {
    event.preventDefault();
    const target = examImportTarget || examSlot();
    const paper = $("#examPaperFile").files[0];
    const media = $("#examMediaFile").files[0];
    const transcript = $("#examTranscript").value.trim();
    const previous = data.examLibrary?.[target] || {};
    if (!paper && !media && !transcript && !previous.paperName && !previous.mediaName) return showToast("请至少选择一个文件或粘贴文本");
    try {
      await Promise.all([paper ? putExamAsset(`${target}:paper`, paper) : null, media ? putExamAsset(`${target}:media`, media) : null]);
      data.examLibrary ||= {};
      data.examLibrary[target] = { paperName: paper?.name || previous.paperName || "", mediaName: media?.name || previous.mediaName || "", transcript: transcript || previous.transcript || "", updatedAt: Date.now() };
      save();
      $("#examImportDialog").close();
      showToast(`${examLabel(target)} 已保存到本机`);
      render();
    } catch (error) { showToast("保存失败：文件可能过大或浏览器存储空间不足"); }
  });
  $("#importForm").addEventListener("submit", event => {
    event.preventDefault();
    const activeTab = $("[data-import-tab].active").dataset.importTab;
    const pasted = $("#articleText").value.trim();
    const url = $("#articleUrl").value.trim();
    const file = activeTab === "image" ? $("#imageFile").files[0] : activeTab === "pdf" ? $("#pdfFile").files[0] : null;
    if (activeTab === "text" && pasted.length < 40) return showToast("请粘贴至少 40 个字符的英文内容");
    if (activeTab === "web" && !url) return showToast("请输入文章网址");
    if ((activeTab === "image" || activeTab === "pdf") && !file) return showToast("请先选择文件");
    const titleField = $("#articleTitle").value.trim();
    const source = $("#articleSource").value.trim() || (activeTab === "web" ? new URL(url).hostname.replace("www.", "") : "个人导入");
    const rawTitle = titleField || (pasted ? pasted.split(/[.!?\n]/)[0].slice(0, 82) : file ? file.name.replace(/\.[^.]+$/, "") : "Imported English article");
    const paragraphs = pasted ? pasted.split(/\n{2,}/).map(item => item.trim()).filter(Boolean).map(escapeHtml) : ["This imported article is ready for focused reading. Select any sentence to open the AI analysis panel.", "Important vocabulary will be collected here as you continue reading and reviewing the article."];
    const article = { id: `article-${Date.now()}`, title: rawTitle, deck: "由知阅自动提取并整理的英文内容。", category: "未分类", method: ({ text: "直接粘贴", image: "图片 OCR", pdf: "PDF 文档", web: "网页导入" })[activeTab], source, date: "今天", minutes: Math.max(2, Math.ceil(paragraphs.join(" ").split(/\s+/).length / 180)), progress: 0, body: paragraphs };
    data.articles.unshift(article);
    save();
    currentArticleId = article.id;
    $("#importDialog").close();
    $("#importForm").reset();
    $("#textCount").textContent = "0";
    showToast("文章已导入，AI 标注已完成");
    setRoute("reader");
  });

  window.addEventListener("scroll", () => {
    if (route !== "reader") return;
    const documentEl = $(".article-document");
    const percentEl = $("#readPercent");
    if (!documentEl || !percentEl) return;
    const start = documentEl.offsetTop;
    const height = Math.max(1, documentEl.offsetHeight - window.innerHeight);
    const percent = Math.max(currentArticle().progress || 0, Math.min(100, Math.round((window.scrollY - start + 180) / height * 100)));
    percentEl.textContent = percent;
  }, { passive: true });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }

  render();
})();
