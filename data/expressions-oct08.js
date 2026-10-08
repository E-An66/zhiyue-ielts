(function () {
  "use strict";
  const additions = [
  [
    "diminish",
    "reading",
    "gifted children and learning",
    "diminish",
    "decrease / reduce",
    "减少、减弱",
    "decrease 可不及物；reduce 通常需要宾语。diminish importance 不宜照搬所有数量搭配。",
    "https://dictionary.cambridge.org/dictionary/english/diminish"
  ],
  [
    "vast",
    "reading",
    "the white horse of Uffington",
    "vast",
    "enormous / huge",
    "巨大的、广阔的",
    "核对所修饰对象；vast experience 等搭配不能随意换成所有近义词。",
    "https://dictionary.cambridge.org/dictionary/english/vast"
  ],
  [
    "depict",
    "reading",
    "Moore's career as an artist",
    "depict",
    "portray",
    "描绘、刻画",
    "本篇涉及描绘人物或场景；词卡中的 depicting 是 depict 的 -ing 形式。",
    "https://www.oxfordlearnersdictionaries.com/definition/english/depict"
  ],
  [
    "substitute",
    "reading",
    "related word to language",
    "a substitute",
    "a replacement",
    "替代品、替代者",
    "这里仅配对名词义；动词 substitute 的介词和方向另看原句。",
    "https://www.oxfordlearnersdictionaries.com/definition/english/substitute_1"
  ],
  [
    "emblem",
    "reading",
    "the white horse of Uffington",
    "an emblem",
    "a symbol",
    "象征、标志",
    "emblem 常指具有代表意义的可见标志；symbol 范围更广。",
    "https://www.oxfordlearnersdictionaries.com/definition/english/emblem"
  ],
  [
    "enigmatic",
    "reading",
    "the white horse of Uffington",
    "enigmatic",
    "mysterious",
    "神秘难解的",
    "都可形容难以理解的人、表情或事物，但不保证所有搭配可互换。",
    "https://www.oxfordlearnersdictionaries.com/definition/english/enigmatic"
  ],
  [
    "customer",
    "listening",
    "Employment Agency: Possible jobs",
    "customer",
    "client",
    "顾客、客户",
    "服务或业务关系中常可对应；client 常指接受专业服务的客户，普通购物语境不必替换。",
    "https://www.oxfordlearnersdictionaries.com/definition/english/client"
  ],
  [
    "constant",
    "listening",
    "marine renewable energy",
    "constant",
    "unchanging",
    "不变的",
    "仅对应数值、速度等保持不变的义项；constant noise 可指持续噪声，不是 unchanging 的通用替换。",
    "https://dictionary.cambridge.org/dictionary/english/constant"
  ],
  [
    "maintenance",
    "listening",
    "marine renewable energy",
    "maintenance",
    "upkeep",
    "维护、保养",
    "用于建筑、设备等的保养；不等于需求，也不只是损坏后的修理。",
    "https://dictionary.cambridge.org/dictionary/english/maintenance"
  ],
  [
    "persuasive",
    "listening",
    "Industrial revolution in Britain",
    "persuasive",
    "convincing",
    "有说服力的",
    "用于论证、解释等时意思接近；具体搭配与强调点仍看原句。",
    "https://dictionary.cambridge.org/us/dictionary/english/persuasive"
  ],
  [
    "out-of-bounds",
    "listening",
    "零散积累与物品",
    "out of bounds",
    "not allowed to enter",
    "禁止进入",
    "一个是形容词短语，一个是解释；放回完整句子时调整主语和结构。不是 stop 的同义词。",
    "https://dictionary.cambridge.org/dictionary/english/out-of-bounds"
  ],
  [
    "exhibition",
    "listening",
    "hotel",
    "an exhibition",
    "a public display",
    "展览、公开展示",
    "指展示活动，不是 exhibition hall（展厅）。听力填空仍写实际听到且符合题干的词。",
    "https://www.oxfordlearnersdictionaries.com/definition/english/exhibition"
  ]
];
  const oldHarvest=window.EXPRESSION_SEEDS.find(e=>e.id==="pdf-202610-harvest");
  oldHarvest.right="collect crops";
  oldHarvest.note="原笔记 obtain crop 是速记表达，现整理为收获作物 collect crops；不要与得到任何物品混用。";
  for(const [id,skill,source,left,right,meaning,note,reference] of additions) {
    if(window.EXPRESSION_SEEDS.some(e=>e.left.toLowerCase()===left.toLowerCase()&&e.right.toLowerCase()===right.toLowerCase()))continue;
    window.EXPRESSION_SEEDS.push({
      id:`notes-20261008-${id}`,source,left,right,meaning,note,
      relation:"近义表达",provenance:"2026-10-08 精选基础改述 · 词义已核对，非真题原句或出现频率统计",
      reference,defaultSkills:[skill],practiceLeft:"",practiceRight:"",practiceLabel:""
    });
  }
})();
