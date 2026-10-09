(function () {
  "use strict";
  const categories = [
    ["time", "日期、时间与单位"], ["housing", "住宿与家居"],
    ["travel", "旅行与交通"], ["money", "费用与金融"],
    ["study", "学校与课程"], ["work", "求职与工作"],
    ["health", "健康与饮食"], ["leisure", "运动与活动"],
    ["arts", "艺术与公共设施"], ["nature", "环境、地理与能源"],
    ["animals", "动植物与农业"], ["materials", "材料与物品"],
    ["research", "研究与学术"], ["technology", "科技与通讯"],
    ["forms", "形容词与词形"], ["personal", "个人考点积累"]
  ];
  // These are selections, regrouped with original Chinese glosses, not frequency counts.
  const sources = [
    { id: "fiona", name: "IELTS with Fiona · 剑桥填空答案整理", type: "teacher", url: "https://members.ieltsetc.com/wp-content/uploads/2022/07/Listen-GF-Spllng-Ptns.pdf", note: "教师整理的剑桥练习册填空词；此处择取部分词项，不复刻原表。", entries: [
      ["logic","逻辑","research"], ["confusion","困惑；混淆","research"], ["meditation","冥想","health"],
      ["anxiety","焦虑","health"], ["vocabulary","词汇","study"], ["podcast","播客","technology"],
      ["smartphones","智能手机（复数）","technology"], ["bilingual","双语的","forms"], ["grammar","语法","study"],
      ["identity","身份；特征","research"], ["fluent","流利的","forms"], ["feathers","羽毛（复数）","animals"],
      ["diameter","直径","research"], ["tube","管子；伦敦地铁","materials"], ["steam","蒸汽","materials"],
      ["cloudy","多云的","forms"], ["litter","乱扔的垃圾","nature"], ["beginners","初学者（复数）","leisure"],
      ["spoons","勺子（复数）","materials"], ["collecting","收集（-ing 形式）","leisure"], ["records","记录；唱片（复数）","materials"],
      ["quiz","小测验；知识问答","study"], ["electrician","电工","work"], ["dust","灰尘","housing"],
      ["practical","实用的；实践的","forms"], ["publication","出版物；出版","research"], ["choices","选择（复数）","research"],
      ["capitalism","资本主义","research"], ["depression","抑郁；萧条","health"], ["creativity","创造力","research"],
      ["therapy","治疗；疗法","health"], ["balance","平衡；余额","health"], ["brain","大脑","health"],
      ["motivation","动机；积极性","study"], ["isolation","隔离；孤立","health"], ["calories","卡路里（复数）","health"],
      ["obesity","肥胖","health"], ["habit","习惯","health"], ["decade","十年","time"],
      ["equipment","设备（不可数）","materials"], ["bone","骨；骨头","health"], ["rough","粗糙的","forms"],
      ["sheep","绵羊（单复数同形）","animals"], ["spice","香料","health"], ["colony","群体；殖民地","animals"],
      ["fat","脂肪；肥胖的","health"], ["movement","运动；移动","research"], ["smell","气味；嗅觉","health"],
      ["rats","老鼠（复数）","animals"], ["frame","框架；画框","materials"], ["background","背景","research"],
      ["focus","焦点；重点","study"], ["snack","零食；小吃","health"], ["medication","药物；药物治疗","health"],
      ["monument","纪念碑；历史建筑","arts"], ["shelter","庇护所；遮蔽物","nature"], ["preservation","保存；保护","nature"],
      ["bees","蜜蜂（复数）","animals"], ["perfume","香水","materials"], ["salt","盐","health"],
      ["lighting","照明","housing"], ["communication","交流；通讯","technology"], ["feedback","反馈（不可数）","study"],
      ["tidy","整洁的","forms"], ["graphic","图形的；图表","research"], ["assumption","假设","research"],
      ["journalist","记者","work"], ["gates","门；闸门（复数）","nature"], ["fuel","燃料","nature"],
      ["survival","生存","nature"], ["festivals","节日；活动节（复数）","leisure"], ["sky","天空","nature"],
      ["instruments","仪器；乐器（复数）","arts"], ["violin","小提琴","arts"], ["complex","复杂的；建筑群","forms"],
      ["clarinet","单簧管","arts"], ["diversity","多样性","nature"], ["physics","物理学","study"],
      ["marble","大理石","materials"], ["knee","膝盖","health"], ["shoulder","肩膀","health"],
      ["roses","玫瑰（复数）","animals"], ["cabins","小木屋；客舱（复数）","housing"], ["crow","乌鸦","animals"],
      ["cliffs","悬崖（复数）","nature"], ["attention","注意力","study"], ["frequency","频率","research"],
      ["tongue","舌头","health"], ["snakes","蛇（复数）","animals"], ["protection","保护","nature"],
      ["injuries","伤；损伤（复数）","health"], ["destruction","毁坏","nature"], ["taxation","征税；税制","money"],
      ["concrete","混凝土","materials"], ["rubber","橡胶","materials"], ["mud","泥；泥浆","materials"],
      ["leather","皮革","materials"], ["poverty","贫困","research"], ["comfortable","舒适的","forms"],
      ["curtain","窗帘","housing"], ["damage","损坏；损害","research"], ["marriage","婚姻","research"],
      ["behaviour","行为（英式拼写）","research"], ["oxygen","氧气","nature"], ["variety","种类；多样化","research"],
      ["safety","安全","research"], ["mammals","哺乳动物（复数）","animals"], ["frogs","青蛙（复数）","animals"],
      ["predators","捕食者（复数）","animals"], ["creatures","生物（复数）","animals"], ["permanent","永久的","forms"],
      ["food","食物（通常不可数）","health"], ["oil","油；石油","materials"], ["water","水","materials"],
      ["sugar","糖","health"], ["stone","石头；石材","materials"], ["paper","纸（材料义不可数）","materials"],
      ["transport","交通；运输","travel"], ["floor","地板；楼层","housing"], ["windows","窗户（复数）","housing"],
      ["fridge","冰箱","housing"], ["shirts","衬衫（复数）","materials"], ["tickets","票（复数）","travel"],
      ["family","家庭","research"], ["week","星期；周","time"], ["training","培训；训练","work"],
      ["review","复习；评论","study"], ["payment","支付；付款","money"], ["rain","雨","nature"],
      ["art","艺术","arts"], ["weather","天气","nature"], ["language","语言","study"]
    ] },
    { id: "yourielts", name: "Your IELTS · Common Answers", type: "teacher", url: "https://yourielts.net/prepare-for-ielts/ielts-listening/ielts-listening-words", note: "公开常见答案词整理；只收清晰词项，排除了网页中粘连的词组。", entries: [
      ["shoes","鞋（复数）","materials"], ["clay","黏土","materials"], ["oven","烤箱","housing"],
      ["helicopter","直升机","travel"], ["towel","毛巾","materials"], ["support","支持","research"],
      ["advice","建议（不可数）","research"], ["flowers","花（复数）","animals"], ["concert hall","音乐厅","arts"],
      ["spider","蜘蛛","animals"], ["electricity","电力","nature"], ["decoration","装饰","housing"],
      ["skin","皮肤","health"], ["supermarket","超市","arts"], ["hospital","医院","health"],
      ["hunting","狩猎","animals"], ["insects","昆虫（复数）","animals"], ["agriculture","农业","animals"],
      ["disease","疾病","health"], ["garage","车库","housing"], ["machinery","机器设备（总称，不可数）","technology"],
      ["desert","沙漠","nature"], ["corn","玉米","health"], ["rocks","岩石（复数）","materials"],
      ["database","数据库","technology"], ["legal advice","法律建议","research"], ["studio","工作室；单间公寓","housing"],
      ["footprint","足迹；足印","research"], ["lungs","肺（复数）","health"], ["soil","土壤","materials"],
      ["wood","木材","materials"], ["glasses","眼镜；玻璃杯（复数）","materials"], ["guidelines","指导原则（复数）","research"],
      ["acid","酸","materials"], ["temple","寺庙","arts"], ["ferry services","渡轮服务（复数）","travel"],
      ["insurance","保险","money"], ["discussions","讨论（复数）","study"], ["bookshop","书店","arts"],
      ["woodland","林地","nature"], ["comparison","比较","research"], ["microscope","显微镜","technology"],
      ["software","软件（不可数）","technology"], ["butterflies","蝴蝶（复数）","animals"], ["pottery","陶器；制陶","arts"],
      ["women","女性（复数）","forms"], ["texture","质地；纹理","materials"], ["corridors","走廊（复数）","housing"],
      ["screens","屏幕（复数）","technology"], ["glass","玻璃","materials"], ["homework","家庭作业（不可数）","study"],
      ["silver","银；银色","materials"], ["police","警察（集合名词）","work"], ["photocopy","复印件；复印","study"],
      ["patience","耐心","forms"], ["apron","围裙","materials"], ["primary school","小学","study"],
      ["shipping","运输；航运","travel"], ["calendar","日历","time"], ["eclipse","日食；月食","nature"],
      ["ceremony","仪式","leisure"], ["competition","比赛；竞争","leisure"], ["headlines","新闻标题（复数）","technology"],
      ["microwave","微波炉","housing"], ["reception","接待处；接待","housing"], ["purpose","目的","research"],
      ["whales","鲸（复数）","animals"], ["petrol","汽油","travel"], ["heater","加热器；暖气设备","housing"],
      ["reduction","减少；降价","money"], ["facilities","设施（复数）","arts"], ["mirror","镜子","housing"],
      ["ladder","梯子","materials"], ["bucket","桶","materials"], ["laundry","洗衣；待洗衣物","housing"],
      ["city council","市政委员会","arts"], ["field","田地；领域","nature"], ["airport","机场","travel"],
      ["chart","图表","research"], ["double bedroom","双人卧室","housing"], ["balcony","阳台","housing"],
      ["rainfall","降雨量","nature"], ["nutrition","营养","health"], ["coconut","椰子","health"],
      ["fertilizer","肥料","animals"], ["ropes","绳子（复数）","materials"], ["hot buffet","热食自助餐","health"],
      ["paper napkins","餐巾纸（复数）","materials"], ["carbon dioxide","二氧化碳","nature"], ["digestion","消化","health"],
      ["nets","网（复数）","materials"], ["efficiency","效率","research"], ["evaporation","蒸发","nature"],
      ["nest","鸟巢；窝","animals"], ["hurricane","飓风","nature"], ["layout","布局","research"],
      ["carpet","地毯","housing"], ["powder","粉末","materials"], ["cotton","棉；棉花","materials"],
      ["accommodation","住宿（通常不可数）","housing"], ["certificate","证书","study"], ["guest","客人","housing"],
      ["client","客户","work"], ["location","位置","travel"], ["fishing","钓鱼；捕鱼","leisure"],
      ["resources","资源（复数）","nature"], ["climate","气候","nature"], ["technology","技术","technology"],
      ["tools","工具（复数）","materials"], ["poster","海报","arts"], ["storage space","储存空间","housing"],
      ["station","车站","travel"], ["hotel","酒店","housing"], ["kitchen","厨房","housing"],
      ["garden","花园","housing"], ["museum","博物馆","arts"], ["laboratory","实验室","study"],
      ["business management","企业管理","study"], ["bank statements","银行对账单（复数）","money"],
      ["income","收入","money"], ["benefits","福利；好处（复数）","work"], ["application","申请；应用程序","work"],
      ["attitudes","态度（复数）","research"], ["climbing","攀爬；攀岩","leisure"], ["swimming","游泳","leisure"],
      ["cheap","便宜的","forms"], ["high temperature","高温","nature"], ["office","办公室","work"],
      ["river","河流","nature"], ["desk","书桌；办公桌","materials"], ["post office","邮局","arts"],
      ["roof","屋顶","housing"], ["prison","监狱","arts"], ["mathematics","数学","study"],
      ["newspapers","报纸（复数）","technology"], ["accident","事故","health"], ["light","光；轻的","nature"],
      ["engineer","工程师","work"], ["magazine","杂志","arts"], ["photographs","照片（复数）","arts"],
      ["biscuits","饼干（复数）","health"], ["campus","校园","study"], ["traffic","交通；车流","travel"],
      ["cycling","骑自行车","leisure"], ["fresh food","新鲜食物","health"], ["restaurant","餐馆","arts"],
      ["sea view","海景","housing"], ["bathroom","浴室","housing"], ["birds","鸟（复数）","animals"],
      ["lunch","午饭","health"], ["clothes","衣服（复数）","materials"], ["meal","一顿饭","health"]
    ] },
    { id: "usingenglish", name: "UsingEnglish · Part 1 答案听写", type: "teacher", url: "https://www.usingenglish.com/files/pdf/ielts-listening-part-one-list-dictation.pdf", note: "教师按答案类型组织的听写练习；此处改按场景分类。", entries: [
      ["avenue","大街；林荫道","travel"], ["lane","小巷；车道","travel"], ["street","街道","travel"],
      ["road","道路","travel"], ["enquiries","询问；咨询（复数，英式）","technology"], ["envelopes","信封（复数）","materials"],
      ["receipts","收据（复数）","money"], ["invoices","发票（复数）","money"], ["newsletters","通讯；简报（复数）","technology"],
      ["cheque","支票（英式）","money"], ["bargain","便宜货；划算的交易","money"], ["refund","退款","money"],
      ["wages","工资（常用复数）","work"], ["mushrooms","蘑菇（复数）","health"], ["cooker","炉灶","housing"],
      ["plates","盘子（复数）","materials"], ["dining room","餐厅；饭厅","housing"], ["salad","沙拉","health"],
      ["day off","休息日","time"], ["weekend","周末","time"], ["vacation","假期","leisure"],
      ["nursing","护理","health"], ["heart","心脏","health"], ["disabled","有残疾的","forms"],
      ["appointment","预约；约定","health"], ["dentist","牙医","work"], ["fence","围栏","housing"],
      ["terrace","露台；连排房屋","housing"], ["host family","寄宿家庭","housing"], ["student halls","学生宿舍（复数）","housing"],
      ["self-catering","自炊的","housing"], ["youth hostel","青年旅舍","housing"], ["desk lamp","台灯","materials"],
      ["rooftop","屋顶","housing"], ["rental","租赁；出租的","housing"], ["mortgage","抵押贷款","money"],
      ["spare room","空余房间","housing"], ["lecturer","讲师","work"], ["nurse","护士","work"],
      ["director","主管；导演","work"], ["actor","演员","work"], ["hairdresser","理发师","work"],
      ["receptionist","接待员","work"], ["librarian","图书管理员","work"], ["shop assistant","店员","work"],
      ["placement","安置；实习安排","study"], ["statement","声明；账单","research"], ["refreshment","茶点；饮料","health"],
      ["document","文件","materials"], ["sunglasses","太阳镜（复数）","materials"], ["jeans","牛仔裤（复数）","materials"],
      ["trousers","裤子（英式，复数）","materials"], ["teeth","牙齿（复数）","health"], ["teenagers","青少年（复数）","research"],
      ["relative","亲属；相对的","research"], ["teamwork","团队合作","work"], ["misunderstanding","误解","research"],
      ["enthusiastic","热情的","forms"], ["qualified","合格的；有资格的","forms"], ["intermediate","中级的","study"],
      ["common room","公共休息室","study"], ["economics","经济学","study"], ["media centre","媒体中心","study"],
      ["negotiable","可协商的","forms"], ["central","中心的","forms"], ["reasonable","合理的","forms"],
      ["automatic","自动的","forms"], ["effective","有效的","forms"], ["direct","直接的","forms"],
      ["noon","中午","time"], ["messages","消息（复数）","technology"], ["replies","回复（复数）","technology"],
      ["lecture","讲座；授课","study"], ["college","学院","study"], ["secondary","中等的；中学的","study"],
      ["prices","价格（复数）","money"], ["discount","折扣","money"], ["cash","现金","money"],
      ["stamps","邮票（复数）","materials"], ["letters","信；字母（复数）","technology"], ["diary","日记；日程本","materials"],
      ["bottle","瓶子","materials"], ["assistant","助理","work"], ["hall","大厅","housing"],
      ["pool","游泳池","leisure"], ["dinner","晚餐","health"], ["home phone","家用电话","technology"]
    ] },
    { id: "year2023", name: "IELTS Writing · 2023 Part 1 民间整理", type: "teacher", url: "https://ieltswriting.org/answer-keys-in-2023-ielts-listening-part-1/", note: "作者称据部分考试整理；未验证完整试卷与统计样本，不作为预测。", entries: [
      ["accounts","账户；账目（复数）","money"], ["adults","成年人（复数）","research"], ["agency","代理机构","work"],
      ["anniversary","周年纪念日","time"], ["bakery","面包店","arts"], ["biography","传记","arts"],
      ["birdwatching","观鸟","leisure"], ["booking","预订","travel"], ["boots","靴子（复数）","materials"],
      ["brushes","刷子（复数）","materials"], ["caravan","旅行拖车","travel"], ["cartoon","动画片；漫画","arts"],
      ["cleaning","清洁（-ing 形式）","housing"], ["coats","外套（复数）","materials"], ["comedy","喜剧","arts"],
      ["concentration","专注；集中","study"], ["cookery","烹饪","health"], ["donation","捐赠","money"],
      ["drama","戏剧","arts"], ["eggs","鸡蛋（复数）","health"], ["error","错误","research"],
      ["fiction","小说；虚构作品","arts"], ["films","电影（复数）","arts"], ["garbage","垃圾","nature"],
      ["guide","导游；指南","travel"], ["hat","帽子","materials"], ["horses","马（复数）","animals"],
      ["ice pack","冰袋","health"], ["leaflet","传单；小册子","arts"], ["leak","泄漏；漏水","housing"],
      ["locker","储物柜","materials"], ["massage","按摩","health"], ["medal","奖牌","leisure"],
      ["menu","菜单","health"], ["noise","噪声","nature"], ["noisy","吵闹的","forms"],
      ["nursery","托儿所；苗圃","arts"], ["nuts","坚果（复数）","health"], ["organic","有机的","forms"],
      ["postage","邮费","money"], ["race","竞赛；种族","leisure"], ["reliable","可靠的","forms"],
      ["rows","排；行（复数）","research"], ["sailing","帆船运动；航行","leisure"], ["sandwiches","三明治（复数）","health"],
      ["seafood","海鲜","health"], ["security","安全；安保","housing"], ["singing","唱歌","arts"],
      ["snowboarding","单板滑雪","leisure"], ["soup","汤","health"], ["steps","台阶；步骤（复数）","travel"],
      ["stories","故事（复数）","arts"], ["uniform","制服","materials"], ["villages","村庄（复数）","nature"],
      ["waterfall","瀑布","nature"], ["wedding","婚礼","leisure"], ["workshops","研讨会；车间（复数）","study"],
      ["yoga","瑜伽","leisure"], ["vision","视力；愿景","research"], ["wet","湿的","forms"],
      ["bus","公共汽车","travel"], ["child","孩子（单数）","research"], ["apartment","公寓","housing"],
      ["cinema","电影院","arts"], ["experience","经验；经历","work"], ["flat","公寓；平坦的","housing"],
      ["French","法语；法国的","study"], ["fruit","水果","health"], ["gift","礼物","materials"],
      ["gym","健身房","leisure"], ["house","房子","housing"], ["money","钱（不可数）","money"],
      ["morning","早晨","time"], ["night","夜晚","time"], ["north","北；北方","travel"],
      ["south","南；南方","travel"], ["west","西；西方","travel"], ["tour","游览；旅行","travel"],
      ["tutor","导师；辅导教师","work"], ["theatre","剧院；戏剧（英式）","arts"]
    ] },
    { id: "idp", name: "IDP IELTS · 官方听力场景词建议", type: "topic", url: "https://ielts.idp.com/prepare/article-common-vocabulary-ielts-listening", note: "官方备考建议中的场景词；不是官方答案词统计表。", entries: [
      ["Monday","星期一","time"], ["Tuesday","星期二","time"], ["Wednesday","星期三","time"],
      ["Thursday","星期四","time"], ["Friday","星期五","time"], ["Saturday","星期六","time"], ["Sunday","星期日","time"],
      ["January","一月","time"], ["February","二月","time"], ["March","三月","time"], ["April","四月","time"],
      ["May","五月","time"], ["June","六月","time"], ["July","七月","time"], ["August","八月","time"],
      ["September","九月","time"], ["October","十月","time"], ["November","十一月","time"], ["December","十二月","time"],
      ["winter","冬季","time"], ["spring","春季","time"], ["autumn","秋季","time"], ["summer","夏季","time"],
      ["circle","圆；圆形","research"], ["square","正方形；广场","research"], ["rectangle","长方形","research"],
      ["triangle","三角形","research"], ["cylinder","圆柱体","research"], ["oval","椭圆形的；椭圆形","research"],
      ["tractor","拖拉机","travel"], ["tram","有轨电车","travel"], ["subway","地铁（美式）；地下通道","travel"],
      ["pedestrian","行人","travel"], ["passenger","乘客","travel"], ["commuter","通勤者","travel"],
      ["necessary","必要的","forms"], ["convenient","方便的","forms"], ["temporary","临时的","forms"],
      ["courtyard","庭院","housing"], ["running track","跑道","leisure"], ["tennis court","网球场","leisure"],
      ["vegetarian","素食者；素食的","health"], ["vegan","严格素食者；纯素的","health"], ["protein","蛋白质","health"],
      ["carbohydrates","碳水化合物（复数）","health"], ["vaccination","接种疫苗","health"], ["virus","病毒","health"],
      ["primates","灵长类动物（复数）","animals"], ["prey","猎物（通常不可数）","animals"], ["endangered","濒危的","animals"],
      ["species","物种（单复数同形）","animals"], ["pond","池塘","nature"], ["stream","小溪","nature"],
      ["earthquake","地震","nature"], ["tornado","龙卷风","nature"], ["blizzard","暴风雪","nature"],
      ["drought","干旱","nature"], ["flood","洪水","nature"], ["deforestation","森林砍伐","nature"],
      ["desertification","荒漠化","nature"], ["nuclear","核能的；原子核的","nature"], ["coal","煤","nature"],
      ["natural gas","天然气","nature"], ["solar power","太阳能","nature"], ["wind turbine","风力涡轮机","nature"],
      ["renewable","可再生的","nature"], ["guarantee","保证","research"], ["satellite","卫星","technology"],
      ["licence","许可证（英式名词）","travel"], ["millennium","千年","time"], ["opportunity","机会","research"],
      ["government","政府","research"], ["society","社会","research"], ["occupation","职业","work"],
      ["red","红色","forms"], ["orange","橙色；橙子","forms"], ["yellow","黄色","forms"],
      ["green","绿色","forms"], ["blue","蓝色","forms"], ["purple","紫色","forms"],
      ["white","白色","forms"], ["black","黑色","forms"], ["brown","棕色","forms"],
      ["bicycle","自行车","travel"], ["car","汽车","travel"], ["truck","卡车","travel"], ["airplane","飞机（美式）","travel"]
    ] },
    { id: "testpro", name: "IELTS Test Pro · 场景补充", type: "topic", url: "https://ielts-testpro.com/blog/ielts-listening-vocabulary-for-high-scores/", note: "按听力场景补充的词汇；不据此声称曾作为某道真题的答案。", entries: [
      ["credit card","信用卡","money"], ["loan","贷款","money"], ["tuition fees","学费（复数）","money"],
      ["withdrawal","取款；退出","money"], ["penalty","罚款；处罚","money"], ["interest rate","利率","money"],
      ["investment","投资","money"], ["currency","货币","money"], ["exchange rate","汇率","money"],
      ["expenditure","支出","money"], ["coursework","课程作业（不可数）","study"], ["professor","教授","work"],
      ["semester","学期","study"], ["textbook","教科书","study"], ["bibliography","参考书目","study"],
      ["plagiarism","剽窃；抄袭","study"], ["journal","期刊","study"], ["deadline","截止日期","study"],
      ["thesis","学位论文","study"], ["extension","延期；扩展","study"], ["graduation","毕业","study"],
      ["questionnaire","问卷","research"], ["brand","品牌","work"], ["campaign","宣传活动","work"],
      ["profit margin","利润率","money"], ["workforce","劳动力；全体员工","work"], ["allergy","过敏","health"],
      ["prevention","预防","health"], ["mental health","心理健康","health"], ["contamination","污染；污染物混入","nature"],
      ["greenhouse effect","温室效应","nature"], ["emissions","排放（复数）","nature"], ["amphibians","两栖动物（复数）","animals"],
      ["seed","种子","animals"], ["trunk","树干；象鼻","animals"], ["root","根","animals"],
      ["crop","庄稼；作物","animals"], ["harvest","收获；收割","animals"], ["pesticide","农药","animals"],
      ["dormitory","宿舍","housing"], ["shopping centre","购物中心","arts"], ["intersection","交叉路口","travel"],
      ["candidate","候选人；应聘者","work"], ["qualification","资格；学历","study"], ["resignation","辞职","work"],
      ["sightseeing","观光","travel"], ["souvenir","纪念品","travel"], ["hostel","旅舍","housing"],
      ["suite","套房","housing"], ["boarding pass","登机牌","travel"], ["cancellation","取消","travel"],
      ["ferry","渡轮","travel"], ["coach","长途汽车；教练","travel"], ["minibus","小型公共汽车","travel"],
      ["timetable","时刻表；课程表","travel"], ["humid","潮湿的","forms"], ["breeze","微风","nature"],
      ["forecast","预报","nature"], ["moisture","水分；湿气","nature"], ["overcast","阴天的","forms"],
      ["visibility","能见度","nature"], ["specimen","样本；标本","research"], ["simulation","模拟","research"],
      ["prerequisite","先决条件；预修课程","study"], ["orientation","迎新介绍；方向","study"], ["auditorium","礼堂；观众席","study"],
      ["placement test","分级测试","study"], ["lease","租约；租赁","housing"], ["plumbing","管道系统","housing"],
      ["ventilation","通风","housing"], ["air conditioning","空调","housing"], ["furnished","配有家具的","housing"],
      ["renovation","翻新；整修","housing"], ["inspection","检查","housing"], ["utility bills","水电等公用事业账单（复数）","money"]
    ] },
    { id: "mocklab", name: "IELTS Mock Lab · 听力主题词", type: "topic", url: "https://ieltsmocklab.com/ielts-insights/258-high-frequency-words-commonly-heard-in-ielts-listening", note: "公开主题词表择取；含与答案词相关的学术和日常场景词。", entries: [
      ["seminar","研讨课","study"], ["tutorial","辅导课","study"], ["assignment","作业；任务","study"],
      ["scholarship","奖学金","study"], ["curriculum","课程体系","study"], ["diploma","文凭","study"],
      ["undergraduate","本科生","study"], ["postgraduate","研究生","study"], ["internship","实习","work"],
      ["assessment","评估；考核","study"], ["faculty","院系；全体教师","study"], ["attendance","出勤；出席","study"],
      ["transcript","成绩单；文字记录","study"], ["landlord","房东","housing"], ["tenant","租户","housing"],
      ["basement","地下室","housing"], ["cottage","小屋；乡间住宅","housing"], ["vacancy","空房；职位空缺","housing"],
      ["suburb","郊区","housing"], ["journey","旅程","travel"], ["destination","目的地","travel"],
      ["itinerary","行程","travel"], ["passport","护照","travel"], ["luggage","行李（不可数）","travel"],
      ["departure","出发；离站","travel"], ["arrival","抵达","travel"], ["platform","站台；平台","travel"],
      ["terminal","航站楼；终点站；终端","travel"], ["vehicle","车辆","travel"], ["motorway","高速公路","travel"],
      ["shuttle","往返接驳车","travel"], ["fare","车票或船票价格","travel"], ["reservation","预订","travel"],
      ["clinic","诊所","health"], ["surgery","手术；诊所","health"], ["prescription","处方","health"],
      ["pharmacy","药房","health"], ["symptom","症状","health"], ["diagnosis","诊断","health"],
      ["recovery","恢复","health"], ["consultation","咨询；会诊","health"], ["emergency","紧急情况","health"],
      ["conservation","保护；保育","nature"], ["recycling","回收利用","nature"], ["habitat","栖息地","animals"],
      ["ecosystem","生态系统","nature"], ["sustainable","可持续的","nature"], ["biodiversity","生物多样性","nature"],
      ["salary","薪水","work"], ["colleague","同事","work"], ["employer","雇主","work"],
      ["employee","雇员","work"], ["recruitment","招聘","work"], ["accountant","会计师","work"],
      ["password","密码","technology"], ["network","网络","technology"], ["wireless","无线的","technology"],
      ["boundary","边界","nature"], ["altitude","海拔；高度","nature"], ["hemisphere","半球","nature"],
      ["hypothesis","假设","research"], ["measurement","测量；测量值","research"], ["statistics","统计学；统计数据","research"],
      ["analysis","分析","research"], ["sample","样本","research"], ["experiment","实验","research"],
      ["fortnight","两周","time"], ["duration","持续时间","time"], ["century","世纪","time"],
      ["kilometre","千米（英式）","time"], ["centimetre","厘米（英式）","time"], ["kilogram","千克","time"],
      ["litre","升（英式）","time"], ["percentage","百分比","time"], ["maximum","最大值；最大的","research"],
      ["minimum","最小值；最小的","research"], ["research","研究","research"], ["tuition","学费；教学","money"],
      ["rent","租金；租用","housing"], ["interview","面试；访谈","work"], ["conference","会议","study"],
      ["contract","合同","work"], ["budget","预算","money"], ["marketing","市场营销","work"],
      ["computer","计算机","technology"], ["website","网站","technology"], ["keyboard","键盘","technology"],
      ["signal","信号","technology"], ["download","下载","technology"], ["internet","互联网","technology"],
      ["population","人口","research"], ["coastline","海岸线","nature"], ["distance","距离","travel"],
      ["annual","每年的","time"], ["monthly","每月的","time"], ["average","平均值；平均的","research"]
    ] },
    { id: "kapi", name: "Kapi 雅思 · 答案词专题", type: "teacher", url: "https://www.kapipala.com/articles/listening-answer-words/polysemous-and-academic-vocabulary.html", note: "民间答案词专题；未采用文中缺少完整样本说明的词频数字。", entries: [
      ["interest","兴趣；利息","money"], ["credit","信用；学分","money"], ["capital","首都；资本","money"],
      ["deposit","押金；存款","money"], ["bill","账单；法案","money"], ["profit","利润；益处","money"],
      ["train","火车；培训","travel"], ["parking","停车；停车位","travel"], ["bridge","桥；纽带","travel"],
      ["harbour","港口（英式）；心怀","travel"], ["port","港口；端口","travel"], ["culture","文化；培养物","research"],
      ["environment","环境","nature"], ["pollution","污染","nature"], ["classification","分类","research"],
      ["combination","组合；结合","research"], ["description","描述","research"], ["distortion","扭曲；失真","research"],
      ["innovation","创新","technology"], ["observation","观察","research"], ["presentation","展示；报告","study"],
      ["reproduction","繁殖；复制","animals"], ["achievement","成就；成绩","study"], ["responsibility","责任","work"],
      ["identification","识别；身份证明","research"], ["entertainment","娱乐","arts"], ["construction","建造；建筑工程","research"],
      ["conversation","谈话","technology"], ["recognition","识别；认可","research"], ["prediction","预测","research"]
    ] },
    { id: "xdf", name: "新东方 · 剑桥10 T1 P1 逐题解析", type: "teacher", url: "https://ielts.xdf.cn/201609/10550477.html", note: "只收文章明确指出的单词答案；数字、姓氏未混入单词表。", entries: [
      ["newspaper","报纸","technology"], ["tent","帐篷","housing"], ["castle","城堡","arts"],
      ["beaches","海滩（复数）","nature"], ["flight","航班；飞行","travel"]
    ] },
    { id: "official", name: "IELTS.org · 官方样题答案页", type: "official", url: "https://cdn.ielts.org/Sample-tests/ielts-listening-sample-tasks-2023.pdf", note: "仅据样题答案页摘选词项（第7、13、17、33页）；不是官方高频词表。", entries: [
      ["books","书（复数）","materials"], ["toys","玩具（复数）","materials"],
      ["language","语言","study"], ["customs","风俗（此处是复数）","research"],
      ["music","音乐","arts"], ["local history","当地历史","arts"],
      ["library","图书馆","study"], ["town hall","市政厅","arts"],
      ["motivation","学习动机；积极性","study"], ["time management","时间管理","study"],
      ["modules","课程模块（复数）","study"], ["summer school","暑期学校","study"],
      ["classical music","古典音乐","arts"], ["bookshop","书店","arts"],
      ["planned","计划了（过去式或过去分词）","forms"], ["city council","市政委员会","arts"]
    ] }
  ];
  const variants = {
    behaviour: ["behavior"], jewellery: ["jewelry"], enquiries: ["inquiries"], cheque: ["check"],
    colour: ["color"], centre: ["center"], harbour: ["harbor"], licence: ["license"],
    kilometre: ["kilometer"], centimetre: ["centimeter"], litre: ["liter"],
    fertilizer: ["fertiliser"], "media centre": ["media center"], "shopping centre": ["shopping center"],
    "time management": ["time-management"], theatre: ["theater"], airplane: ["aeroplane"]
  };
  const hints = {
    accommodation: "双 c、双 m：ac-com-mo-da-tion。通常为不可数名词。",
    Wednesday: "拼写保留 d；发音中的弱读不能直接当作字母拼写。",
    February: "不要漏掉第一个 r。", autumn: "末尾有不发音的 n。",
    questionnaire: "双 n，结尾 -naire。", receipt: "p 不发音。", receipts: "p 不发音；此卡保留复数 s。",
    maintenance: "maintain → maintenance，不能写 maintainance。",
    predictable: "pre-dict-able，不要漏掉 t。", deliveries: "delivery → deliveries，不能写 deliverys。",
    butterflies: "butterfly → butterflies，保留复数结尾。", injuries: "injury → injuries，保留复数结尾。",
    personality: "结尾 -ality；注意与 personal 区分。", environment: "拼写有 n：en-viron-ment。",
    separate: "中间是 a：sep-a-rate。", necessary: "一个 c，双 s。", colleague: "双 l，结尾 -eague。",
    millennium: "双 l、双 n。", government: "保留 n：govern-ment。", business: "busi-ness；弱读元音不要漏写。",
    "time management": "词卡接受 time management / time-management；实题按题目字数要求填写。",
    equipment: "不可数；不能把 equipments 当作本词的复数。", furniture: "不可数；不用 furnitures。",
    luggage: "不可数；通常说 pieces of luggage。", advice: "不可数；与 advise（动词）区分。",
    glass: "此卡练习材料“玻璃”；glasses 是眼镜或玻璃杯，不能在本卡替换。",
    glasses: "保留 -es；与材料 glass 区分。", sheep: "单复数同形；实题数量由上下文判断。",
    species: "单复数同形；不要删除结尾 s。", customs: "本卡为“风俗”；custom 可表示一种习俗，词形不能随意互换。",
    gates: "本卡练习复数 gates，不能漏掉 s；gate 已在个人笔记中另收。",
    licence: "英式名词 licence / 美式 license；英式动词拼作 license。",
    bookshop: "官方样题也列出 bookstore；它是另一个单词，本卡听写仍要求写出听到的 bookshop。"
  };
  const normalize = s => s.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
  const words = new Map();
  function add(word, meaning, category, sourceId, extra = {}) {
    const key = normalize(word);
    let entry = words.get(key);
    if (!entry) {
      entry = { id: `listening-answer-${key.replace(/[^a-z0-9]+/g,"-")}`, word, meaning, skill: "listening",
        source: "listening-answers", answerCategories: [], answerSources: [], answers: variants[word] || variants[key] || [],
        answerNotes: [], trainingMode: "audio", reviews: 0 };
      words.set(key, entry);
    }
    if (!entry.answerCategories.includes(category)) entry.answerCategories.push(category);
    if (!entry.answerSources.includes(sourceId)) entry.answerSources.push(sourceId);
    if (hints[word] || hints[key]) entry.spellingHint = hints[word] || hints[key];
    Object.assign(entry, extra);
    return entry;
  }
  for (const source of sources) for (const [word, meaning, category] of source.entries) add(word, meaning, category, source.id);
  const personalCategories = { general: "materials", jobs: "work", conflict: "work", agriculture: "animals", employment: "work", industry: "technology", energy: "nature", health: "health", weather: "nature", hotel: "housing" };
  for (const note of (window.LISTENING_NOTES?.words || [])) {
    const entry = add(note.word, note.meaning, personalCategories[note.noteGroups?.[0]] || "personal", "personal", {
      meaning: note.meaning, noteGroups: note.noteGroups, personalTopic: note.topic, personalAnswerWord: true, spellingPriority: !!note.spellingPriority
    });
    entry.answers = [...new Set([...entry.answers, ...(note.answers || [])])];
    if (note.example) entry.answerNotes.push(note.example);
  }
  sources.push({ id: "personal", name: "我的听力考点笔记 · 10月8日", type: "personal", url: "", note: "按你提供的听力笔记收录；题号尚未核实的条目保留原有说明。" });
  const sourceById = Object.fromEntries(sources.map(s => [s.id, s]));
  for (const entry of words.values()) {
    entry.answerKinds = [...new Set(entry.answerSources.map(id => sourceById[id].type))];
    entry.answerCore = entry.answerKinds.some(type => type !== "topic");
    entry.answerSpellingPriority = !!entry.spellingHint || /（复数）|（不可数）|单复数同形/.test(entry.meaning) || /[\s-]/.test(entry.word) || entry.word.length >= 9;
    entry.answerTopic = entry.answerCategories.map(id => categories.find(c => c[0] === id)[1]).join(" / ");
    entry.example = [entry.spellingHint, ...entry.answerNotes].filter(Boolean).join("\n");
  }
  window.LISTENING_ANSWER_BANK = {
    updated: "2026-10-09", categories: categories.map(([id,title]) => ({ id, title })),
    sources: sources.map(({ entries, ...source }) => source), words: [...words.values()]
  };
})();
