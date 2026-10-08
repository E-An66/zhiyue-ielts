(function () {
  "use strict";
  const reading = [
  [
    "athlete",
    "words related to athlete",
    [
      [
        "endurance",
        "n. 耐力"
      ],
      [
        "claim",
        "n. 主张、断言；v. 声称"
      ],
      [
        "even if",
        "即使（引出假设条件）",
        "不等同于 even though：后者通常引出已知事实。"
      ],
      [
        "even though",
        "尽管、虽然（引出事实让步）",
        "由原笔记的辨析补充，不能与 even if 无条件互换。"
      ]
    ]
  ],
  [
    "gifted",
    "gifted children and learning",
    [
      [
        "strategies",
        "n. 策略、战略（strategy 的复数）"
      ],
      [
        "diminish",
        "v. 减少、减弱、削弱"
      ],
      [
        "autonomy",
        "n. 自主权、自治权"
      ]
    ]
  ],
  [
    "nutmeg",
    "The nutmeg tree and fruit",
    [
      [
        "encase",
        "v. 包住、把……封装在……内",
        "不限于放进盒子；encase in 强调包覆，surround 强调围绕。"
      ],
      [
        "fleshy",
        "adj. 肉质的、多肉的"
      ],
      [
        "husk",
        "n. 果实或种子的外壳、外皮"
      ],
      [
        "break open",
        "破开、裂开",
        "不一定恰好裂成两半；split into two halves 比它更具体。"
      ],
      [
        "ripe",
        "adj. 成熟的"
      ],
      [
        "oval",
        "adj. 椭圆形的；n. 椭圆形",
        "shape 是上位概念，不是 oval 的同义词。"
      ],
      [
        "aril",
        "n. 假种皮（包在种子外的结构）"
      ],
      [
        "mace",
        "n. 肉豆蔻衣（由干燥的假种皮制成的香料）",
        "区别 nutmeg：作为香料的 nutmeg 来自种子，mace 来自假种皮。"
      ],
      [
        "spice",
        "n. 香料"
      ],
      [
        "covering",
        "n. 覆盖物；v-ing. 覆盖",
        "若原句中指包裹种子的那一层结构，covering 是名词，不是动词。"
      ],
      [
        "the former",
        "前者"
      ],
      [
        "the latter",
        "后者"
      ],
      [
        "ridge",
        "n. 隆起的条纹、脊、山脊",
        "原记“网状的”不准确；ridged 是有脊纹的，net-like 才是网状的。"
      ],
      [
        "crimson",
        "adj./n. 深红色（的）"
      ],
      [
        "foliage",
        "n. 叶子、叶丛（集合名词）"
      ],
      [
        "dense",
        "adj. 浓密的、密集的"
      ]
    ]
  ],
  [
    "moore",
    "Moore's career as an artist",
    [
      [
        "resignation",
        "n. 辞职；听天由命、顺从",
        "艺术文本中的具体义项须回看原句，不能只凭词表确定。"
      ],
      [
        "hometown",
        "n. 家乡",
        "原笔记 returned to Castle-ford → his hometown 是地点指代，不是同义词；地名通常拼作 Castleford。"
      ],
      [
        "sketches",
        "n. 素描、速写、草图（复数）"
      ],
      [
        "depicting",
        "v-ing. 描绘、描写（原形 depict）"
      ],
      [
        "miner",
        "n. 矿工"
      ],
      [
        "commission",
        "n. 委员会、佣金、委托创作；v. 委托",
        "艺术语境还可能指委托创作或订件。"
      ]
    ]
  ],
  [
    "language",
    "related word to language",
    [
      [
        "substitute",
        "n. 替代品、替代者；v. 替代"
      ],
      [
        "individual",
        "n. 个人；adj. 单独的、个别的"
      ],
      [
        "recoded",
        "v. 重新编码（recode 的过去式/过去分词）",
        "这个拼写本身成立，不擅自改成 recorded（记录）；具体用词需原句确认。"
      ],
      [
        "award",
        "n. 奖、奖项；v. 授予"
      ]
    ]
  ],
  [
    "white-horse",
    "the white horse of Uffington",
    [
      [
        "vast",
        "adj. 巨大的、广阔的"
      ],
      [
        "figures",
        "n. 数字、人物、图形/形象；体形",
        "本篇白马图案语境更可能指图形或形象；词义仍以原句为准。"
      ],
      [
        "controversial",
        "adj. 有争议的"
      ],
      [
        "enigmatic",
        "adj. 神秘难解的"
      ],
      [
        "fade",
        "v. 褪色、逐渐消退、减弱",
        "fade 本身不是形容词；faded 才可表示褪色的。"
      ],
      [
        "cemetery",
        "n. 墓地"
      ],
      [
        "layer",
        "n. 层、层次"
      ],
      [
        "fertility",
        "n. 生育能力；（土地的）肥沃"
      ],
      [
        "ritual",
        "n. 仪式、例行惯例"
      ],
      [
        "emblem",
        "n. 象征、徽章、标志"
      ],
      [
        "construction",
        "n. 建造、修建；结构",
        "本篇可指建造白马图案这一行为。"
      ],
      [
        "assign",
        "v. 分派、布置；赋予、确定",
        "assign a date/value/function：确定年代/赋予数值或功能。"
      ]
    ]
  ]
];
  const listening = [
  [
    "general",
    "零散积累与物品",
    [
      [
        "youth",
        "n. 青春、青年时期；年轻人",
        "不是形容词“年轻的”（young）。"
      ],
      [
        "fountain",
        "n. 喷泉",
        "来源按笔记保留：C12T8P4 噪音话题（未核实题号）。"
      ],
      [
        "jewellery",
        "n. 珠宝、首饰（不可数）",
        "英式 jewellery；美式 jewelry。ring、bracelet 是首饰的种类，不是同义词。",
        [
          "jewelry"
        ]
      ],
      [
        "ring",
        "n. 戒指；环"
      ],
      [
        "bracelet",
        "n. 手镯、手链"
      ],
      [
        "stop",
        "v. 停止、阻止；n. 停靠站",
        "不能单独等同 out of bounds。"
      ],
      [
        "out of bounds",
        "禁止进入的",
        "不是“停止”；常用于场所准入限制。"
      ],
      [
        "smash",
        "v. 打碎、砸碎",
        "smash 是动作，breakages 是破损/破损物，不能直接替换词性。"
      ],
      [
        "breakages",
        "n. 破损物；损坏（复数形式）"
      ]
    ]
  ],
  [
    "jobs",
    "职业",
    [
      [
        "waiter",
        "n. 男服务员"
      ],
      [
        "waitress",
        "n. 女服务员"
      ],
      [
        "manager",
        "n. 经理、管理者"
      ]
    ]
  ],
  [
    "conflict",
    "conflict at work",
    [
      [
        "bully",
        "v. 霸凌、欺凌；n. 恃强凌弱者"
      ],
      [
        "superiority",
        "n. 优越、优势",
        "原笔记：want to prove their superiority ↔ feel the need to show their superiority。只保留本篇语境对应；want 与 feel the need 的侧重点不同。"
      ],
      [
        "personality",
        "n. 个性、人格"
      ],
      [
        "structural",
        "adj. 结构的"
      ],
      [
        "absence",
        "n. 缺席；缺乏"
      ],
      [
        "confidence",
        "n. 信心、信任"
      ],
      [
        "visions",
        "n. 愿景、设想（复数）"
      ],
      [
        "democratic",
        "adj. 民主的"
      ],
      [
        "mediator",
        "n. 调解员"
      ],
      [
        "term",
        "n. 术语、用语；期限、学期",
        "by the term 不是“被称作”；What do you mean by the term ...? = 你所说的……是什么意思？"
      ],
      [
        "hierarchy",
        "n. 等级制度、层级"
      ],
      [
        "human resources",
        "人力资源、人事部门"
      ]
    ]
  ],
  [
    "agriculture",
    "related words to agriculture",
    [
      [
        "irrigation",
        "n. 灌溉"
      ],
      [
        "wire",
        "n. 金属丝、电线"
      ],
      [
        "post",
        "n. 柱、桩；岗位；邮件",
        "农业/围栏语境可能指柱或桩，需原句确认。"
      ],
      [
        "design",
        "n. 设计；v. 设计",
        "笔记只有英文，补充基本义。"
      ],
      [
        "notable",
        "adj. 值得注意的、显著的",
        "“值得注意的是”通常需 it is notable that 等完整结构。"
      ],
      [
        "spoil",
        "v. 宠坏、搞糟、变质"
      ]
    ]
  ],
  [
    "employment",
    "Employment Agency: Possible jobs",
    [
      [
        "furniture",
        "n. 家具（不可数）",
        "不用 furnitures。"
      ],
      [
        "deliveries",
        "n. 送货、交付的货物（复数）",
        "易错：delivery → deliveries，不是 deliverys。",
        [],
        true
      ],
      [
        "heavy",
        "adj. 重的",
        "易错拼写：h-e-a-v-y。",
        [],
        true
      ],
      [
        "customer",
        "n. 顾客、客户",
        "易错拼写：c-u-s-t-o-m-e-r。",
        [],
        true
      ]
    ]
  ],
  [
    "industry",
    "Industrial revolution in Britain",
    [
      [
        "power",
        "n. 动力、电力；力量、权力",
        "“权力”不同于 rights（权利）；工业语境注意动力义。"
      ],
      [
        "textiles",
        "n. 纺织品"
      ],
      [
        "machine",
        "n. 机器",
        "machinery 才常表示机械设备总称。"
      ],
      [
        "advertising",
        "n. 广告活动、广告业"
      ],
      [
        "possession",
        "n. 拥有、占有；所有物",
        "财物常用复数 possessions；wealth 是财富，不能与 possession 的所有义项互换。"
      ],
      [
        "persuasive",
        "adj. 有说服力的"
      ],
      [
        "wealth",
        "n. 财富、财产",
        "来源为 possession 后的笔记；财富不等同于 possession 的拥有、占有等所有义项。"
      ]
    ]
  ],
  [
    "energy",
    "marine renewable energy",
    [
      [
        "constant",
        "adj. 持续的；不变的"
      ],
      [
        "direction",
        "n. 方向、指导",
        "易错拼写：d-i-r-e-c-t-i-o-n。",
        [],
        true
      ],
      [
        "predictable",
        "adj. 可预测的",
        "原笔记 predicable 少了 t；正确为 pre-dict-able。",
        [],
        true
      ],
      [
        "bay",
        "n. 海湾"
      ],
      [
        "gate",
        "n. 门、大门"
      ],
      [
        "migration",
        "n. 迁徙、迁移"
      ],
      [
        "maintenance",
        "n. 维护、保养；维持",
        "不是“需求”；拼写 main-ten-ance，区别 maintain。",
        [],
        true
      ],
      [
        "tidal",
        "adj. 潮汐的、受潮水影响的"
      ],
      [
        "sand",
        "n. 沙、沙子"
      ],
      [
        "disturbing",
        "adj. 令人不安的"
      ]
    ]
  ],
  [
    "health",
    "health",
    [
      [
        "vitamin",
        "n. 维生素",
        "英美发音可能不同，拼写相同。"
      ]
    ]
  ],
  [
    "weather",
    "weather forecast",
    [
      [
        "clouds",
        "n. 云（复数）",
        "注意结尾 /dz/，不要漏写 s。",
        [],
        true
      ],
      [
        "comets",
        "n. 彗星（复数）"
      ],
      [
        "thermometer",
        "n. 温度计"
      ],
      [
        "storms",
        "n. 风暴（复数）"
      ],
      [
        "telegraph",
        "n. 电报系统、通信方式"
      ],
      [
        "proverbs",
        "n. 谚语（复数）"
      ],
      [
        "collated",
        "v. 整理、汇集并核对（collate 的过去式/过去分词）"
      ]
    ]
  ],
  [
    "hotel",
    "hotel",
    [
      [
        "microphone",
        "n. 麦克风、话筒"
      ],
      [
        "exhibition",
        "n. 展览、展览会",
        "不是“展厅”；展厅为 exhibition hall。注意 -bition 的发音。",
        [],
        true
      ]
    ]
  ]
];
  const normalize = s => s.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
  for (const [id,title,entries] of reading) {
    const ids = new Set();
    for (const [word,meaning,note] of entries) {
      let entry = window.READING_NOTES.words.find(w => normalize(w.word) === normalize(word));
      if (!entry) {
        entry = {id:`reading-notes-20261008-${word.replace(/ /g,"-")}`,word,meaning,skill:"reading",source:"reading-notes-20261008",articleIds:[],articleTitles:[],notes:[],reviews:0};
        window.READING_NOTES.words.push(entry);
      }
      if (!entry.articleIds.includes(id)) {entry.articleIds.push(id);entry.articleTitles.push(title);}
      if (note && !entry.notes.includes(note)) entry.notes.push(note);
      entry.topic=entry.articleTitles.join(" / ");entry.example=entry.notes.join("\n");
      ids.add(entry.id);
    }
    if(!window.READING_NOTES.articles.some(a=>a.id===id))window.READING_NOTES.articles.push({id,title,count:ids.size});
  }
  const exclusively=window.READING_NOTES.words.find(w=>w.word==="exclusively");
  exclusively.meaning="adv. 仅仅、专门地、排他地";
  const harvest=window.READING_NOTES.words.find(w=>w.word==="harvest");
  harvest.example="收获作物：collect crops。原笔记 obtain crop 是解释性速记，不宜机械套用。";
  window.LISTENING_NOTES = {
    groups:listening.map(([id,title,entries])=>({id,title,count:entries.length})),
    words:listening.flatMap(([group,title,entries])=>entries.map(([word,meaning,note,answers,spellingPriority])=>({
      id:`listening-notes-20261008-${word.replace(/ /g,"-")}`,word,meaning,skill:"listening",source:"listening-notes-20261008",
      topic:title,noteGroups:[group],example:note||"",answers:answers||[],spellingPriority:!!spellingPriority,trainingMode:"audio",reviews:0
    })))
  };
  window.OCT08_AUDIT = {
  "reading": [
    [
      "even if / even though",
      "已作辨析",
      "前者常引出假设，后者常引出事实。没有作为可机械互换的表达组。",
      "https://dictionary.cambridge.org/grammar/british-grammar/comparatives-and-"
    ],
    [
      "ridge / mace / covering",
      "已校正",
      "ridge 指脊、隆起条纹，不是网状的；mace 是肉豆蔻衣香料；covering 可作名词“覆盖物”。",
      "https://dictionary.cambridge.org/dictionary/english/ridge"
    ],
    [
      "fade / figures / fertility",
      "已校正",
      "fade 是动词；白马语境的 figures 注意图形/形象义；fertility 指生育能力或肥沃程度。",
      ""
    ],
    [
      "encase / break open / oval",
      "保留语境限制",
      "encase 不限于装盒；break open 不一定裂成两半；oval 是一种 shape，属于上下位关系，不是同义词。",
      ""
    ],
    [
      "Castle-ford / his hometown",
      "保留指代笔记",
      "整理为 hometown 词卡。地名通常拼作 Castleford；这是地点指代，不是通用同义词。",
      ""
    ],
    [
      "recoded / resignation / commission",
      "需原句确认义项",
      "recoded（重新编码）本身成立，不擅改 recorded；resignation 可指辞职或顺从；commission 在艺术中也可指委托创作。",
      ""
    ],
    [
      "原有旧词",
      "去重并保留进度",
      "前六篇与已录入内容重复，不再新建卡片；补充释义与限制不重置学习记录。",
      ""
    ],
    [
      "原有替换中的范围问题",
      "加注，不当作通用等号",
      "widespread 不必然是全球；potent chemicals 不等同所有 pesticides；resistant 程度不必然达到 immune；harvest 的释义改为 collect crops。",
      ""
    ]
  ],
  "listening": [
    [
      "predicable / deliveries",
      "已校正",
      "可预测的拼作 predictable；delivery 的复数是 deliveries，保留易错拼写训练。",
      "https://dictionary.cambridge.org/us/dictionary/english/predictable"
    ],
    [
      "maintenance / exhibition",
      "已校正",
      "maintenance 是维护、保养，不是需求；exhibition 是展览，不是展厅。",
      "https://dictionary.cambridge.org/dictionary/english/maintenance"
    ],
    [
      "stop / out of bounds",
      "不作同义词",
      "stop 表示停止或阻止；out of bounds 表示禁止进入。后者另配准入限制的解释。",
      "https://dictionary.cambridge.org/dictionary/english/out-of-bounds"
    ],
    [
      "smash / breakages",
      "保留词性区别",
      "smash 是打碎的动作；breakages 是损坏或破损物。无完整原句，不作可直接互换的一组。",
      ""
    ],
    [
      "jewellery / jewelry / ring / bracelet",
      "拼写变体与上下位关系",
      "前两者是英美拼写变体，听写都接受；后两者是首饰的具体种类，不是同义词。",
      ""
    ],
    [
      "by the term / notable / structural",
      "已校正",
      "by the term 不能单独译为被称作；改收 term 并附句式。notable 为值得注意的；structural 为结构的。",
      ""
    ],
    [
      "power / machine / possession / youth / post",
      "补充义项",
      "power 的权力不是权利；machine 是机器；财物常用 possessions；youth 可指青年时期/年轻人；农业中的 post 可能是柱、桩。",
      ""
    ],
    [
      "酒店价格两句",
      "不能凭位置判答案",
      "$25 more 表示另加 25 美元；$135 是所报房价。答案必须匹配题干、房型、计价单位和最终选择，不能仅凭“后面没改”判断。未将金额当单词加入。",
      ""
    ],
    [
      "prove / show their superiority",
      "仅保留笔记语境",
      "原笔记的 want to prove 与 feel the need to show 含义接近但不完全相同；不将 want 等同 need，也不标成通用高频替换。",
      ""
    ]
  ]
};
})();
