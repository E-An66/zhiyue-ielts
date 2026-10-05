(function () {
  "use strict";
  const rows = [
    ["diet", "thylacine", "exclusively / carnivorous", "an entirely carnivorous diet", "只以肉为食", "语境改述", "PDF 左侧是两个单词，不是完整原句；右侧是名词短语。不能把 exclusively 与整个短语逐词互换。", "feed exclusively on meat", "have an entirely carnivorous diet"],
    ["pursuit", "thylacine", "pursuit", "chase", "追赶、追逐", "近义表达", "pursuit 是名词；chase 可作名词或动词，使用时核对词性。"],
    ["ecology", "pests", "ecological disorder", "ecological imbalance", "生态紊乱、生态失衡", "语境改述", "依据笔记保留；缺少完整原句，不能据此认定在所有语境下等价。"],
    ["widespread", "pests", "widespread", "around the world", "分布广泛", "语境对应", "widespread 不一定指全球；around the world 范围更具体，需要原句支持。"],
    ["contribute", "pests", "contribute to", "help cause", "促成、导致", "短语改写", "contribute to 后接名词或动名词，help cause 后接结果；不能忽略结构变化。"],
    ["resistance", "pests", "develop resistance to", "no longer respond to", "产生抗性，不再对某种处理起反应", "语境对应", "后者也可能有其他原因；只有当前抗性语境中才可对应。"],
    ["chemicals", "pests", "potent chemicals", "pesticides", "本篇涉及的强效化学药剂与农药", "语境对应", "chemicals 范围比 pesticides 广；pesticides 本身不表示强效。这是语境指代，不是通用同义词。"],
    ["take-to", "pests", "take to", "begin to use", "开始采用", "语境对应", "take to 还有喜欢、养成习惯等意思，此处只记录笔记中的用法。"],
    ["boost", "pests", "boost", "increase", "提高、增加", "近义表达", "核对后接对象；boost 常有促进、推动的意味。"],
    ["yield", "pests", "crop yield", "amount harvested", "农作物产量、收获量", "短语改写", "在同一作物与统计口径下对应；yield 也可能表示单位面积产量。"],
    ["harvest", "pests", "harvest", "obtain crop", "收获作物", "解释性改述", "右侧保留 PDF 原笔记；用于完整句子时需要核对冠词、单复数及自然搭配。"],
    ["outlay", "pests", "financial outlay", "amount spent / expenditure", "经济支出、财政支出", "近义表达", "斜线分隔两种参考表达；放回句子时注意名词结构。"],
    ["account", "pests", "account for", "make up / constitute", "占某个整体的一部分", "近义表达", "只对应占比含义；account for 表示解释原因时不能这样替换。"],
    ["outbreak", "pests", "outbreak", "sudden appearance", "突然出现、爆发", "解释性改述", "outbreak 常用于疾病、冲突或害虫等，不是所有突然出现都叫 outbreak。"],
    ["necessitate", "pests", "necessitate", "make necessary", "使某事成为必要", "句式变化", "常用结构为 necessitate something 或 make something necessary。"],
    ["lethal", "pests", "lethal", "deadly", "致命的", "近义表达", "此处对应能导致死亡的含义；deadly 的其他用法需另看语境。"],
    ["resistant", "pests", "resistant", "immune", "具有抵抗能力", "语境对应", "resistant 不一定表示完全不受影响，immune 通常更强；程度差别不能忽略。"]
  ];
  window.EXPRESSION_SEEDS = rows.map(([id, articleId, left, right, meaning, relation, note, practiceLeft, practiceRight]) => ({
    id: `pdf-202610-${id}`, left, right, meaning, relation, note,
    source: window.READING_NOTES.articles.find(a => a.id === articleId).title,
    provenance: "阅读刷题词汇积累 · PDF 笔记（未附完整原句）",
    practiceLeft: practiceLeft || "", practiceRight: practiceRight || "",
    practiceLabel: practiceLeft ? "教学补写示例，非考试原句" : "",
    defaultSkills: ["reading"]
  }));
})();
