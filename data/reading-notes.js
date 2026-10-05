(function () {
  "use strict";
  const articles = [
    { id: "zoos", title: "words related to zoos", entries: [
      ["collapses", "v. 倒塌、崩溃"], ["undertake", "v. 从事、承担"],
      ["specimen", "n. 标本"], ["captive", "adj. 被监禁的、被俘虏的"],
      ["counterpart", "n. 对应物"], ["predator", "n. 捕食者；掠夺者"],
      ["sophisticated", "adj. 精密复杂的"], ["communication", "n. 交流"],
      ["outreach", "n. 外展服务"], ["boost", "v. 促进、增进、提高"]
    ] },
    { id: "thylacine", title: "The thylacine（袋狼）", entries: [
      ["exclusively", "adv. 专一地、仅仅"],
      ["carnivorous", "adj. 食肉的", "搭配：an entirely carnivorous diet（完全以肉食为主的饮食）"],
      ["scent", "n. 气味"], ["prey", "n. 猎物"], ["pursuit", "n. 追赶、追逐", "同义替换：chase"],
      ["compensate for", "弥补、补偿"], ["scarce", "adj. 稀少的、匮乏的"],
      ["crawl", "v. 爬"], ["belly", "n. 腹部、肚子"], ["pouch", "n. 小袋子；育儿袋"],
      ["fossil", "n. 化石"], ["occurrence", "n. 出现、记录、发生的事情"],
      ["mainland", "n. 大陆"], ["captive", "adj. 被监禁的、被俘虏的"], ["impractical", "adj. 不切实际的"]
    ] },
    { id: "tortoise", title: "tortoise 乌龟", entries: [
      ["pirate", "n. 海盗"], ["exploitation", "n. 开发、剥削"], ["exacerbate", "v. 使恶化、加重"]
    ] },
    { id: "pests", title: "biological pests", entries: [
      ["ecological disorder", "生态紊乱", "同义替换：ecological imbalance"],
      ["widespread", "adj. 广泛的", "原笔记替换：around the world / widespread"],
      ["contribute to", "促成、导致", "同义替换：help cause"],
      ["develop resistance to", "对……产生抗性", "原笔记替换：no longer respond to"],
      ["potent chemicals", "强效化学药剂", "potent：有效的、强效的；原笔记替换：pesticides（农药）"],
      ["take to", "开始采用", "同义替换：begin to use"],
      ["boost", "v. 促进、增进、提高", "同义替换：increase"],
      ["crop yield", "农作物产量", "同义替换：amount harvested；harvested：收割、收获的"],
      ["harvest", "v. 收获", "原笔记替换：obtain crop"],
      ["financial outlay", "经济支出、财政支出", "outlay：支出；同义替换：amount spent / expenditure"],
      ["account for", "占……", "同义替换：make up / constitute"],
      ["outbreak", "n. 爆发", "同义替换：sudden appearance"],
      ["necessitate", "v. 使……成为必要", "同义替换：make necessary"],
      ["lethal", "adj. 致命的", "同义替换：deadly"],
      ["resistant", "adj. 有抗性的", "原笔记替换：immune"]
    ] },
    { id: "innovation", title: "psychology innovation", entries: [
      ["shared objective", "共同目标"], ["pursue", "v. 从事、追求"],
      ["complementary", "adj. 互补的"], ["outperform", "v. （效益上）超过"],
      ["simultaneously", "adv. 同时地"], ["value", "v. 重视"]
    ] },
    { id: "cork", title: "Cork 软木、木塞", entries: [["spoil", "v. 宠坏、变质、搞糟"]] }
  ];
  const words = new Map();
  for (const article of articles) {
    for (const [word, meaning, note] of article.entries) {
      if (!words.has(word)) words.set(word, {
        id: `reading-notes-202610-${word.replace(/ /g, "-")}`,
        word, meaning, skill: "reading", source: "reading-notes-202610",
        articleIds: [], articleTitles: [], notes: [], reviews: 0
      });
      const entry = words.get(word);
      entry.articleIds.push(article.id);
      entry.articleTitles.push(article.title);
      if (note) entry.notes.push(`${article.title}：${note}`);
    }
  }
  window.READING_NOTES = {
    articles: articles.map(({ id, title, entries }) => ({ id, title, count: entries.length })),
    words: [...words.values()].map(w => ({ ...w, topic: w.articleTitles.join(" / "), example: w.notes.join("\n") }))
  };
})();
