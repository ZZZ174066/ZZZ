const MUSICS = [
  {
    id: '0001',
    name: '急性恋爱中毒',
    alias: '无',
    cover: 'files/music/急性恋爱中毒.jpg',
    bv: 'BV1QCXgBEEid',
    author: 'ぴーなた',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0002',
    name: 'Character T',
    alias: '角色 T',
    cover: 'files/music/Character T.jpg',
    bv: 'BV1nk9fBTEkE',
    author: 'Atena',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0003',
    name: 'Harmony',
    alias: '无',
    cover: 'files/music/Harmony.jpg',
    bv: 'BV1vYfiBkEm3',
    author: '原口沙輔，椎乃味醂',
    singer: '初音ミク',
    level: 5
  },
  {
    id: '0004',
    name: 'Signaling',
    alias: '次元通信',
    cover: 'files/music/Signaling.jpg',
    bv: 'BV1s7rBBSEK1',
    author: 'AnythingBecomeMoe，TEKOKITO',
    singer: '初音ミク，重音テト',
    level: 5
  },
  {
    id: '0005',
    name: 'カンケーガール',
    alias: '关系少女',
    cover: 'files/music/カンケーガール.jpg',
    bv: 'BV1SHEn6WEVd',
    author: 'マサラダ',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0006',
    name: '混沌ブギ',
    alias: '混沌布吉',
    cover: 'files/music/混沌ブギ.jpg',
    bv: 'BV1TP411Y7bt',
    author: 'jon-YAKITORY',
    singer: '初音ミク',
    level: 5
  },
  {
    id: '0007',
    name: 'アダチ・レイ',
    alias: '足立・零',
    cover: 'files/music/アダチ・レイ.jpg',
    bv: 'BV1pSdpBCE29',
    author: '佐藤ちなみに',
    singer: '重音テト，足立レイ',
    level: 5
  },
  {
    id: '0008',
    name: 'いますぐ輪廻',
    alias: '即刻轮回',
    cover: 'files/music/いますぐ輪廻.jpg',
    bv: 'BV1phhHz8EPF',
    author: 'なきそ',
    singer: '初音ミク',
    level: 5
  },
  {
    id: '0009',
    name: 'うるたーる😹🐈😻',
    alias: '乌撒的猫',
    cover: 'files/music/うるたーる😹🐈😻.jpg',
    bv: 'BV1BtfVBmEQi',
    author: '藤原ハガネ',
    singer: '重音テト，雨衣',
    level: 5
  },
  {
    id: '0010',
    name: 'スピカ',
    alias: '室女座',
    cover: 'files/music/スピカ.jpg',
    bv: 'BV1np421R7bc',
    author: 'ナユタン星人',
    singer: 'ロクデナシ',
    level: 4
  },
  {
    id: '0011',
    name: 'スプリットダンス',
    alias: '劈叉舞',
    cover: 'files/music/スプリットダンス.jpg',
    bv: 'BV1mGcjzGEpf',
    author: 'えいぷ',
    singer: '重音テト，初音ミク',
    level: 5
  },
  {
    id: '0012',
    name: 'ダイダイダイダイダイキライ',
    alias: '超级超级超级超级超级讨厌',
    cover: 'files/music/ダイダイダイダイダイキライ.jpg',
    bv: 'BV1vqQUYYEmg',
    author: '雨良 Amala',
    singer: '重音テト，初音ミク',
    level: 5
  },
  {
    id: '0013',
    name: 'タイムイズマイン',
    alias: '时间属于我',
    cover: 'files/music/タイムイズマイン.jpg',
    bv: 'BV1xZqmBzECT',
    author: '真島ゆろ',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0014',
    name: 'INTERNET OVERDOSE',
    alias: '无',
    cover: 'files/music/INTERNET OVERDOSE.jpg',
    bv: 'BV1gU4y187xA',
    author: 'Aiobahn',
    singer: 'KOTOKO',
    level: 4
  },
  {
    id: '0015',
    name: 'ディスコティックナイト',
    alias: '迪斯科之夜',
    cover: 'files/music/ディスコティックナイト.jpg',
    bv: 'BV1U8DMBaEZm',
    author: 'NEKOZUME',
    singer: '重音テト，雨衣',
    level: 5
  },
  {
    id: '0016',
    name: 'テトリス',
    alias: '俄罗斯方块',
    cover: 'files/music/テトリス.jpg',
    bv: 'BV1GADYYmEnd',
    author: '柊マグネタイト',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0017',
    name: 'ブレインロット',
    alias: '脑蚀',
    cover: 'files/music/ブレインロット.jpg',
    bv: 'BV1mNf3BREgj',
    author: '東京真中',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0018',
    name: 'メズマライザー',
    alias: '催眠术',
    cover: 'files/music/メズマライザー.jpg',
    bv: 'BV15J4m1A7qy',
    author: '32ki',
    singer: '重音テト，初音ミク',
    level: 5
  },
  {
    id: '0019',
    name: '気まぐれメルシィ',
    alias: '反复无常Mercy',
    cover: 'files/music/気まぐれメルシィ.jpg',
    bv: 'BV1Zs411i7tR',
    author: '八王子P',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0020',
    name: '人マニア',
    alias: '人狂热症',
    cover: 'files/music/人マニア.jpg',
    bv: 'BV1wbwze5EwH',
    author: '原口沙輔',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0021',
    name: '月が綺麗ねと言われたい！',
    alias: '无',
    cover: 'files/music/月が綺麗ねと言われたい！.jpg',
    bv: 'BV15HFVz1EvM',
    author: '柿崎ユウタ',
    singer: '初音ミク',
    level: 5
  },
  {
    id: '0022',
    name: '酔いどれ知らず',
    alias: '不知醉',
    cover: 'files/music/酔いどれ知らず.jpg',
    bv: 'BV1oZ4y1C7Ta',
    author: 'Kanaria',
    singer: 'GUMI',
    level: 4
  },
  {
    id: '0023',
    name: '처형박수',
    alias: '处刑拍手',
    cover: 'files/music/처형박수.jpg',
    bv: 'BV1dyoDBCEWU',
    author: 'TRAP CHICK',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0024',
    name: 'モニタリング',
    alias: '视奸',
    cover: 'files/music/モニタリング.gif',
    bv: 'BV1qDUPYKEzf',
    author: 'DECO 27',
    singer: '初音ミク',
    level: 5
  },
  {
    id: '0025',
    name: '蝶化',
    alias: '无',
    cover: 'files/music/蝶化.jpg',
    bv: 'BV1pmRvBzEPe',
    author: '绘都盐',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0026',
    name: 'ラグトレイン',
    alias: '延误列车',
    cover: 'files/music/ラグトレイン.jpg',
    bv: 'BV1fK4y1s7Qf',
    author: '稲葉曇',
    singer: '歌愛ユキ',
    level: 4
  },
  {
    id: '0027',
    name: 'ラブパラ',
    alias: '恋爱帕拉舞',
    cover: 'files/music/ラブパラ.jpg',
    bv: 'BV15PoUBNEGt',
    author: 'DECO 27',
    singer: '初音ミク',
    level: 5
  },
  {
    id: '0028',
    name: 'アンタに言ってんの！',
    alias: '说的就是你啊！',
    cover: 'files/music/アンタに言ってんの！.gif',
    bv: 'BV1huAGz1EfC',
    author: 'ぴーなた',
    singer: '重音テト',
    level: 5
  },
  {
    id: '0029',
    name: 'ラヴィット',
    alias: 'Loveit',
    cover: 'files/music/ラヴィット.jpg',
    bv: 'BV1i541157SB',
    author: 'ピノキオピー',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0030',
    name: 'ワールズエンド ダンスホール',
    alias: '世末舞厅',
    cover: 'files/music/ワールズエンド ダンスホール.jpg',
    bv: 'BV14x411c7gs',
    author: 'wowaka',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0031',
    name: 'ダダダダダル',
    alias: '烦烦烦烦烦死了',
    cover: 'files/music/ダダダダダル.jpg',
    bv: 'BV1eTwKzfERR',
    author: '雨良 Amala',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0032',
    name: '春嵐',
    alias: '无',
    cover: 'files/music/春嵐.jpg',
    bv: 'BV1cJ411q7GF',
    author: 'john',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0033',
    name: '愛属性',
    alias: '无',
    cover: 'files/music/愛属性.jpg',
    bv: 'BV1pnHWzkE4j',
    author: 'ピノキオピー',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0034',
    name: '愛言葉IV',
    alias: '无',
    cover: 'files/music/愛言葉IV.jpg',
    bv: 'BV1u54y1f7mY',
    author: 'DECO*27',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0035',
    name: '愛言葉V',
    alias: '无',
    cover: 'files/music/愛言葉V.jpg',
    bv: 'BV1obZjBSEpT',
    author: 'DECO*27',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0036',
    name: '不死身ごっこ',
    alias: '不死身游戏',
    cover: 'files/music/不死身ごっこ.jpg',
    bv: 'BV17NrWBaE87',
    author: 'ピノキオピー',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0037',
    name: '鬼ごっこ',
    alias: '捉迷藏',
    cover: 'files/music/鬼ごっこ.jpg',
    bv: 'BV1ZcKdzDE5Q',
    author: '春野',
    singer: '洛天依',
    level: 4
  },
  {
    id: '0038',
    name: '花弁、それにまつわる音声',
    alias: '花瓣、与之相关的声音',
    cover: 'files/music/花弁、それにまつわる音声.jpg',
    bv: 'BV1oG9zY1EKy',
    author: 'あばらや',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0039',
    name: '劣等哀歌',
    alias: '无',
    cover: 'files/music/劣等哀歌.jpg',
    bv: 'BV1hVDvYUEk9',
    author: 'MIMI',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0040',
    name: '魔法少女とチョコレゐト',
    alias: '魔法少女与巧克力',
    cover: 'files/music/魔法少女とチョコレゐト.jpg',
    bv: 'BV11Z4y1k7wC',
    author: 'ピノキオピー',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0041',
    name: '目撃！テト31世',
    alias: '目击！teto 31世',
    cover: 'files/music/目撃！テト31世.jpg',
    bv: 'BV1tc5S6dEiH',
    author: 'はろける',
    singer: '雨衣，重音テト',
    level: 4
  },
  {
    id: '0042',
    name: '求＆影',
    alias: '无',
    cover: 'files/music/求＆影.jpg',
    bv: 'BV1Kc9HB6EoQ',
    author: 'ぴーなた',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0043',
    name: '聖人君子でありたい',
    alias: '我想成为圣人君子',
    cover: 'files/music/聖人君子でありたい.jpg',
    bv: 'BV1iA5jzxEQL',
    author: 'しゃいと',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0044',
    name: '太陽系デスコ',
    alias: '太阳系Disco',
    cover: 'files/music/太陽系デスコ.jpg',
    bv: 'BV1UfZ2YwEP5',
    author: 'ナユタン星人',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0045',
    name: '我ら!ゴミ分別団',
    alias: '我们就是！垃圾分类队',
    cover: 'files/music/我ら!ゴミ分別団.jpg',
    bv: 'BV1fdduBFEww',
    author: 'かてらざわ',
    singer: '重音テト，ずんだもん',
    level: 4
  },
  {
    id: '0046',
    name: '心層麻酔',
    alias: '无',
    cover: 'files/music/心層麻酔.jpg',
    bv: 'BV1qx411t74h',
    author: 'iKz',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0047',
    name: '臙脂',
    alias: '无',
    cover: 'files/music/臙脂.jpg',
    bv: 'BV1ucGzzuEhw',
    author: '蛋包饭咖喱饭',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0048',
    name: '乙女解剖',
    alias: '无',
    cover: 'files/music/乙女解剖.jpg',
    bv: 'BV1Vt411H7j8',
    author: 'DECO*27',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0049',
    name: '踊っチャイナ',
    alias: '舞动吧中国',
    cover: 'files/music/踊っチャイナ.jpg',
    bv: 'BV1euAPePE1y',
    author: 'Atena',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0050',
    name: '幽霊東京',
    alias: '无',
    cover: 'files/music/幽霊東京.jpg',
    bv: 'BV1ii4y1c7it',
    author: 'Ayase',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0051',
    name: '転生林檎',
    alias: '转生苹果',
    cover: 'files/music/転生林檎.jpg',
    bv: 'BV1EY4y1V71F',
    author: 'ピノキオピー',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0052',
    name: 'Clone Clone',
    alias: '克隆克隆',
    cover: 'files/music/Clone Clone.jpg',
    bv: 'BV1K8KUzUEdX',
    author: 'Atena',
    singer: '鏡音リン，GUMI',
    level: 4
  },
  {
    id: '0053',
    name: 'Confessions of a Rotten Girl',
    alias: '腐女忏悔录',
    cover: 'files/music/Confessions of a Rotten Girl.jpg',
    bv: 'BV1HEcfefEKD',
    author: 'SAWTOWNE',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0054',
    name: 'ガチのマジで詰んだ',
    alias: '真的真的完蛋了',
    cover: 'files/music/ガチのマジで詰んだ.jpg',
    bv: 'BV1VrReBREeD',
    author: 'ぱじゃれっと',
    singer: 'ずんだもん',
    level: 4
  },
  {
    id: '0055',
    name: 'Intergalactic Bound',
    alias: '无',
    cover: 'files/music/Intergalactic Bound.jpg',
    bv: 'BV1EK4y1z7St',
    author: '雄之助',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0056',
    name: 'INTERNET YAMERO',
    alias: '无',
    cover: 'files/music/INTERNET YAMERO.jpg',
    bv: 'BV1QX4y1o7YC',
    author: '主播女孩重度依赖',
    singer: 'KOTOKO',
    level: 4
  },
  {
    id: '0057',
    name: 'KING',
    alias: '无',
    cover: 'files/music/KING.jpg',
    bv: 'BV1Ya4y1E7pk',
    author: 'Kanaria',
    singer: 'GUMI',
    level: 4
  },
  {
    id: '0058',
    name: 'M@GICAL☆CURE! LOVE ♥ SHOT!',
    alias: '治愈☆魔法! LOVE ♥ SHOT!',
    cover: 'files/music/M@GICAL☆CURE! LOVE ♥ SHOT!.jpg',
    bv: 'BV12142197jj',
    author: 'SAWTOWNE',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0059',
    name: 'Miku',
    alias: '无',
    cover: 'files/music/Miku.gif',
    bv: 'BV1b94y1b7r9',
    author: 'Anamanaguchi',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0060',
    name: 'PPPP',
    alias: '无',
    cover: 'files/music/PPPP.jpg',
    bv: 'BV1GBptz6EbJ',
    author: 'TAK',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0061',
    name: 'Sell a Friend',
    alias: '出卖朋友',
    cover: 'files/music/Sell a Friend.jpg',
    bv: 'BV11PcgzWESQ',
    author: 'Azari',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0062',
    name: 'Sweet Devil',
    alias: '甜蜜恶魔',
    cover: 'files/music/Sweet Devil.png',
    bv: 'BV1QJ41137T2',
    author: '八王子P',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0063',
    name: 'T氏の話を信じるな',
    alias: '不要相信T氏的话',
    cover: 'files/music/T氏の話を信じるな.jpg',
    bv: 'BV1SfK9zPEL3',
    author: 'ピノキオピー',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0064',
    name: '멜트 아이스크림',
    alias: '融化的冰淇淋',
    cover: 'files/music/멜트 아이스크림.jpg',
    bv: 'BV1FXofB3EFN',
    author: 'TRAP CHICK',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0065',
    name: 'アシンメトリー',
    alias: '不对称性',
    cover: 'files/music/アシンメトリー.gif',
    bv: 'BV1mgn6z8EsU',
    author: 'asakowa',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0066',
    name: 'アンノウン・マザーグース',
    alias: '不为人知的鹅妈妈童谣',
    cover: 'files/music/アンノウン・マザーグース.jpg',
    bv: 'BV1hx411b7CZ',
    author: 'wowaka',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0067',
    name: 'イガク',
    alias: '医学',
    cover: 'files/music/イガク.gif',
    bv: 'BV1nafnYUEac',
    author: '原口沙輔',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0068',
    name: 'ヴァンパイア',
    alias: '吸血鬼',
    cover: 'files/music/ヴァンパイア.jpg',
    bv: 'BV1by4y187EM',
    author: 'DECO*27',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0069',
    name: 'ウィマーマ・サーガ',
    alias: '羽衣妈妈·物语',
    cover: 'files/music/ウィマーマ・サーガ.jpg',
    bv: 'BV1n8iEBGEYJ',
    author: 'まろん',
    singer: '时雨羽衣',
    level: 4
  },
  {
    id: '0070',
    name: 'オーバーライド',
    alias: '覆写',
    cover: 'files/music/オーバーライド.jpg',
    bv: 'BV1dTEFzpEKd',
    author: '吉田夜世',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0071',
    name: 'お返事まだカナ？おじさん構文！',
    alias: '还不给我回复嘛？大叔式小作文！',
    cover: 'files/music/お返事まだカナ？おじさん構文！.jpg',
    bv: 'BV13e7PztEGd',
    author: '吉本おじさん',
    singer: '雨衣',
    level: 4
  },
  {
    id: '0072',
    name: 'おちゃめ機能',
    alias: '天真烂漫机能',
    cover: 'files/music/おちゃめ機能.jpg',
    bv: 'BV1ZoLdz1Eog',
    author: 'ゴジマジp',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0073',
    name: 'キャンディークッキーチョコレート',
    alias: '糖果饼干巧克力',
    cover: 'files/music/キャンディークッキーチョコレート.jpg',
    bv: 'BV1f3CrYfEVA',
    author: 'はろける',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0074',
    name: 'サイエンス',
    alias: '科学',
    cover: 'files/music/サイエンス.jpg',
    bv: 'BV1rmc6ziEHN',
    author: 'MIMI',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0075',
    name: 'シスターに懺悔を',
    alias: '向修女忏悔吧',
    cover: 'files/music/シスターに懺悔を.jpg',
    bv: 'BV1PSAZeiECV',
    author: '廃原メモリ',
    singer: '重音テト，足立レイ',
    level: 4
  },
  {
    id: '0076',
    name: 'チェリーポップ',
    alias: '樱桃汽水',
    cover: 'files/music/チェリーポップ.jpg',
    bv: 'BV1Jsu3zMEpY',
    author: 'DECO*27',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0077',
    name: 'ちっちゃな私',
    alias: '小小的我',
    cover: 'files/music/ちっちゃな私.jpg',
    bv: 'BV148tzzVEoK',
    author: 'マサラダ',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0078',
    name: 'テレパシ',
    alias: '心灵感应',
    cover: 'files/music/テレパシ.jpg',
    bv: 'BV1cZw9eDERz',
    author: 'DECO*27',
    singer: '初音ミク',
    level: 5
  },
  {
    id: '0079',
    name: 'ドゥーマー',
    alias: '末日论者',
    cover: 'files/music/ドゥーマー.jpg',
    bv: 'BV1DFhmz2Ehn',
    author: '東京真中',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0080',
    name: 'どりーむもーど',
    alias: '梦之模式',
    cover: 'files/music/どりーむもーど.jpg',
    bv: 'BV1B5BFB4E4J',
    author: 'Atena',
    singer: '歌愛ユキ，音街ウナ',
    level: 4
  },
  {
    id: '0081',
    name: 'ホントノ',
    alias: '是真的吗',
    cover: 'files/music/ホントノ.jpg',
    bv: 'BV1jC4y157tN',
    author: '原口沙輔',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0082',
    name: 'にゅー！支配者のキャロル',
    alias: '新生！支配者的颂歌',
    cover: 'files/music/にゅー！支配者のキャロル.jpg',
    bv: 'BV17bmEBAEwe',
    author: '藤原ハガネ',
    singer: '里石ユカ',
    level: 4
  },
  {
    id: '0083',
    name: 'ねぇねぇねぇ。',
    alias: '呐呐呐。',
    cover: 'files/music/ねぇねぇねぇ。.jpg',
    bv: 'BV1aL411n7tQ',
    author: 'ピノキオピー',
    singer: '初音ミク，鏡音リン',
    level: 4
  },
  {
    id: '0084',
    name: 'ハート111',
    alias: 'heart111',
    cover: 'files/music/ハート111.jpg',
    bv: 'BV19i421f7AE',
    author: '原口沙輔',
    singer: 'ゆーり',
    level: 4
  },
  {
    id: '0085',
    name: 'バゥムクゥヘン・エンドロゥル',
    alias: '年轮蛋糕',
    cover: 'files/music/バゥムクゥヘン・エンドロゥル.jpg',
    bv: 'BV1FEBiBhEbY',
    author: '雨良 Amala',
    singer: '初音ミク，亞北ネル，重音テト',
    level: 4
  },
  {
    id: '0086',
    name: 'ハオ',
    alias: '好',
    cover: 'files/music/ハオ.jpg',
    bv: 'BV1Zw4m1e7k1',
    author: 'DECO*27',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0087',
    name: 'バカみたいに',
    alias: '像笨蛋一样',
    cover: 'files/music/バカみたいに.jpg',
    bv: 'BV1z7gPzXEzJ',
    author: '柿崎ユウタ',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0088',
    name: 'ハナタバ',
    alias: '花束',
    cover: 'files/music/ハナタバ.jpg',
    bv: 'BV1VPcrzREby',
    author: 'MIMI',
    singer: '可不',
    level: 4
  },
  {
    id: '0089',
    name: 'ビノミ',
    alias: '美之味',
    cover: 'files/music/ビノミ.jpg',
    bv: 'BV11A4m1P7qa',
    author: 'MARETU',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0090',
    name: 'ヒバナ',
    alias: '火花',
    cover: 'files/music/ヒバナ.jpg',
    bv: 'BV1wx411p73F',
    author: 'DECO*27',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0091',
    name: 'ぴょん',
    alias: '一蹦一跳',
    cover: 'files/music/ぴょん.jpg',
    bv: 'BV1YPo5BKEW7',
    author: 'MIMI',
    singer: '初音ミク，重音テト',
    level: 4
  },
  {
    id: '0092',
    name: 'フィクションブルー',
    alias: '虚幻之蓝',
    cover: 'files/music/フィクションブルー.jpg',
    bv: 'BV1a4411m7YJ',
    author: 'Ayase',
    singer: '初音ミク',
    level: 4
  },
  {
    id: '0093',
    name: 'フェイクダンス',
    alias: '虚假舞蹈',
    cover: 'files/music/フェイクダンス.jpg',
    bv: 'BV1EGEP6xESH',
    author: 'NEKOZUME',
    singer: '雨衣，重音テト',
    level: 4
  },
  {
    id: '0094',
    name: 'ベノム',
    alias: '猛毒',
    cover: 'files/music/ベノム.jpg',
    bv: 'BV17s41137mU',
    author: '怪力熊',
    singer: 'flower',
    level: 4
  },
  {
    id: '0095',
    name: 'ふぁんぶる!',
    alias: '大失败!',
    cover: 'files/music/ふぁんぶる!.jpg',
    bv: 'BV1sM4m1z7SN',
    author: '藤原ハガネ',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0096',
    name: 'マジック・メイド',
    alias: '魔法・女仆',
    cover: 'files/music/マジック・メイド.jpg',
    bv: 'BV1zLVz6kEVK',
    author: 'MIMI',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0097',
    name: 'みむかｩわナイストライ',
    alias: '无',
    cover: 'files/music/みむかｩわナイストライ.jpg',
    bv: 'BV1Y9iZYUE6y',
    author: 'ぬぬぬぬぬぬぬぬぬぬ',
    singer: '初音ミク',
    level: 5
  },
  {
    id: '0098',
    name: '㋰責任集合体',
    alias: '无',
    cover: 'files/music/㋰責任集合体.jpg',
    bv: 'BV1cMeAzLEJb',
    author: 'マサラダ',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0099',
    name: 'ライアーダンサー',
    alias: '谎言舞者',
    cover: 'files/music/ライアーダンサー.jpg',
    bv: 'BV1oAtcz7Eyg',
    author: 'マサラダ',
    singer: '重音テト',
    level: 4
  },
  {
    id: '0100',
    name: 'ループザルーム',
    alias: '循环之室',
    cover: 'files/music/ループザルーム.jpg',
    bv: 'BV1zBq6BuEyH',
    author: 'rusino777',
    singer: '初音ミク',
    level: 4
  }
];

const LEVEL_MAX = 5;
const musicFilterSelection = { author: new Set(), singer: new Set(), level: new Set() };
const musicFilterUi = { openKind: null };
const MUSIC_FILTER_PANELS = [
  { kind: 'author', btnId: 'musicFilterAuthorBtn', panelId: 'musicFilterAuthorPanel', defaultLabel: '筛选作者' },
  { kind: 'singer', btnId: 'musicFilterSingerBtn', panelId: 'musicFilterSingerPanel', defaultLabel: '筛选歌手' },
  { kind: 'level', btnId: 'musicFilterLevelBtn', panelId: 'musicFilterLevelPanel', defaultLabel: '喜爱等级' }
];

function getSortedMusics(list) {
  return [...list].sort((a, b) => {
    const levelDiff = normalizeMusicLevel(b) - normalizeMusicLevel(a);
    if (levelDiff !== 0) return levelDiff;
    return AppCommon.compareByName(a.name, b.name);
  });
}

function normalizeMusicLevel(music) {
  const level = Number(music && music.level);
  if (!Number.isFinite(level)) return 0;
  return Math.max(0, Math.min(LEVEL_MAX, Math.floor(level)));
}

function getMusicAuthors(music) {
  return AppCommon.splitTokens(music.author);
}

function getMusicSingers(music) {
  return AppCommon.splitTokens(music.singer);
}

function musicMatchesAuthorFilter(music) {
  return AppCommon.matchesFilterSet(musicFilterSelection.author, getMusicAuthors(music));
}

function musicMatchesSingerFilter(music) {
  return AppCommon.matchesFilterSet(musicFilterSelection.singer, getMusicSingers(music));
}

function musicMatchesLevelFilter(music) {
  const set = musicFilterSelection.level;
  if (!set.size) return true;
  return set.has(String(normalizeMusicLevel(music)));
}

function musicPassesFilters(music) {
  return musicMatchesAuthorFilter(music) && musicMatchesSingerFilter(music) && musicMatchesLevelFilter(music);
}

function getFilteredMusics() {
  return getSortedMusics(MUSICS.filter(musicPassesFilters));
}

function getMusicsForFilterPool(excludeKind) {
  return MUSICS.filter((music) => {
    if (excludeKind !== 'author' && !musicMatchesAuthorFilter(music)) return false;
    if (excludeKind !== 'singer' && !musicMatchesSingerFilter(music)) return false;
    if (excludeKind !== 'level' && !musicMatchesLevelFilter(music)) return false;
    return true;
  });
}

function noneLabel(value) {
  return value === AppCommon.FILTER_NONE ? '暂无' : value;
}

function countTokenFilter(pool, getValues, value) {
  if (value === AppCommon.FILTER_NONE) return pool.filter((item) => getValues(item).length === 0).length;
  return pool.filter((item) => getValues(item).includes(value)).length;
}

function compareFilterOptionsByCount(a, b) {
  if (b.count !== a.count) return b.count - a.count;
  return AppCommon.compareByName(a.label, b.label);
}

function sortMusicFilterOptions(items) {
  return items.filter((item) => item.count > 0).sort((a, b) => {
    if (a.kind === 'level' || b.kind === 'level') return Number(a.value) - Number(b.value);
    return compareFilterOptionsByCount(a, b);
  });
}

function collectMusicFilterOptions(kind) {
  const pool = getMusicsForFilterPool(kind);
  const selected = musicFilterSelection[kind];
  let options = [];

  if (kind === 'author') {
    const values = new Set();
    pool.forEach((music) => getMusicAuthors(music).forEach((name) => values.add(name)));
    if (pool.some((music) => getMusicAuthors(music).length === 0)) values.add(AppCommon.FILTER_NONE);
    values.forEach((value) => {
      options.push({ value, label: noneLabel(value), count: countTokenFilter(pool, getMusicAuthors, value) });
    });
  } else if (kind === 'singer') {
    const values = new Set();
    pool.forEach((music) => getMusicSingers(music).forEach((name) => values.add(name)));
    if (pool.some((music) => getMusicSingers(music).length === 0)) values.add(AppCommon.FILTER_NONE);
    values.forEach((value) => {
      options.push({ value, label: noneLabel(value), count: countTokenFilter(pool, getMusicSingers, value) });
    });
  } else {
    for (let level = 0; level <= LEVEL_MAX; level++) {
      options.push({
        value: String(level),
        label: String(level),
        count: pool.filter((music) => String(normalizeMusicLevel(music)) === String(level)).length,
        kind: 'level'
      });
    }
  }

  const sorted = sortMusicFilterOptions(options);
  if (!selected.size) return sorted;

  selected.forEach((value) => {
    if (sorted.some((item) => item.value === value)) return;
    sorted.push(
      kind === 'level'
        ? { value, label: value, count: 0, kind: 'level' }
        : { value, label: noneLabel(value), count: 0 }
    );
  });

  return kind === 'level'
    ? sorted.sort((a, b) => Number(a.value) - Number(b.value))
    : [...sorted].sort(compareFilterOptionsByCount);
}

function updateMusicFilterButtonLabel(kind, labelEl, set, defaultLabel) {
  labelEl.classList.remove('music-level-filter-label');
  if (!set.size) {
    labelEl.textContent = defaultLabel;
    return;
  }
  if (set.size === 1) {
    const only = [...set][0];
    if (kind === 'level') AppCommon.setHeartsLabel(labelEl, only, LEVEL_MAX, 'music-level-filter');
    else labelEl.textContent = noneLabel(only);
    return;
  }
  labelEl.textContent = defaultLabel + ' (' + set.size + ')';
}

function renderMusicFilterOption(btn, kind, item) {
  if (kind === 'level') AppCommon.setHeartsLabel(btn, item.value, LEVEL_MAX, 'music-level-filter', ' (' + item.count + ')');
  else btn.textContent = item.label + ' (' + item.count + ')';
}

function initMusicFilters(onApply) {
  const controller = AppCommon.createMultiSelectFilter({
    layerId: 'filter-layer',
    noneKey: AppCommon.FILTER_NONE,
    panels: MUSIC_FILTER_PANELS,
    selection: musicFilterSelection,
    ui: musicFilterUi,
    optionClass: 'music-filter-option',
    labelSelector: '.music-filter-label',
    collectOptions: collectMusicFilterOptions,
    updateButtonLabel: updateMusicFilterButtonLabel,
    renderOptionContent: renderMusicFilterOption,
    onApply
  });
  controller.bindEvents();
  controller.buildAllPanels();
}

const BILIBILI_PLAYER_ORIGIN = 'https://player.bilibili.com';

function getBilibiliPlayerUrl(bv, autoplay) {
  return BILIBILI_PLAYER_ORIGIN + '/player.html?bvid=' + encodeURIComponent(bv) +
    '&high_quality=1&danmaku=0&autoplay=' + (autoplay ? '1' : '0') + '&muted=0';
}

function postToBilibiliPlayer(frame, type) {
  if (!frame || !frame.contentWindow) return;
  try {
    frame.contentWindow.postMessage(JSON.stringify({ type }), BILIBILI_PLAYER_ORIGIN);
  } catch (_) {}
}

function startMusicPlayback(frame) {
  if (!frame) return;
  postToBilibiliPlayer(frame, 'play');
  postToBilibiliPlayer(frame, 'unmute');
}

function bindMusicPlayer(container, autoplay) {
  if (!autoplay) return;
  const frame = container.querySelector('.music-player-frame');
  if (!frame) return;
  function onReady() {
    startMusicPlayback(frame);
    setTimeout(() => startMusicPlayback(frame), 400);
  }
  frame.addEventListener('load', onReady);
}

function renderMusicList(container, musics, playingId, onSelect) {
  container.innerHTML = '';
  musics.forEach((music) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'music-item ui-interactive' + (music.id === playingId ? ' active' : '');
    item.dataset.id = music.id;
    item.innerHTML =
      '<div class="music-item-cover"><img src="' + music.cover + '" alt="' + music.name + '">' +
      '<span class="music-item-current">当前</span></div>' +
      '<span class="music-item-name">' + music.name + '</span>';
    item.addEventListener('click', () => onSelect(music.id));
    container.appendChild(item);
  });
}

function renderMusicDetail(container, music, autoplay) {
  if (!music) {
    container.innerHTML = '<p class="music-empty">暂无歌曲</p>';
    return;
  }

  const alias = music.alias && music.alias !== '无' ? music.alias : '无';
  const allowValue = autoplay ? 'autoplay; fullscreen' : 'fullscreen';

  container.innerHTML =
    '<div class="music-header">' +
      '<div class="music-cover-large ui-interactive" role="button" tabindex="0" aria-label="查看封面大图">' +
        '<img src="' + music.cover + '" alt="' + music.name + '">' +
      '</div>' +
      '<div class="music-header-info">' +
        '<div class="music-meta-grid">' +
          '<p class="music-meta-box" title="名称：' + music.name + '">名称：' + music.name + '</p>' +
          '<p class="music-meta-box" title="别名：' + alias + '">别名：' + alias + '</p>' +
          '<p class="music-meta-box" title="作者：' + music.author + '">作者：' + music.author + '</p>' +
          '<p class="music-meta-box" title="歌手：' + music.singer + '">歌手：' + music.singer + '</p>' +
          '<div class="music-meta-box music-meta-level">' +
            '<span class="music-meta-level-label">喜爱等级：</span>' +
            '<span class="music-meta-level-hearts"></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="music-player">' +
      '<iframe class="music-player-frame" allow="' + allowValue + '" ' +
        'src="' + getBilibiliPlayerUrl(music.bv, autoplay) + '" scrolling="no" frameborder="0"></iframe>' +
    '</div>';

  const levelHeartsEl = container.querySelector('.music-meta-level-hearts');
  if (levelHeartsEl) levelHeartsEl.appendChild(AppCommon.createHeartsEl(music.level, LEVEL_MAX, 'music-detail-level'));
  AppCommon.bindCoverPreview(container, '.music-cover-large', music.cover);
  bindMusicPlayer(container, autoplay);
}

function initMusic() {
  const listEl = document.getElementById('music-list');
  const detailEl = document.getElementById('music-detail');
  if (!listEl || !detailEl || !MUSICS.length) return;

  let playingId = getSortedMusics(MUSICS)[0].id;

  function refreshMusicList() {
    renderMusicList(listEl, getFilteredMusics(), playingId, selectMusic);
  }

  function selectMusic(id) {
    playingId = id;
    refreshMusicList();
    renderMusicDetail(detailEl, MUSICS.find((item) => item.id === id), true);
  }

  initMusicFilters(refreshMusicList);
  refreshMusicList();
  renderMusicDetail(detailEl, MUSICS.find((item) => item.id === playingId), false);
}

AppCommon.registerLazySection('music', initMusic);

