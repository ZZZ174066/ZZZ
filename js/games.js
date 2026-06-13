const GAMES = [
  {
    id: '0001',
    name: '100%鲜橙汁',
    cover: 'files/game/100%鲜橙汁.jpg',
    originalPrice: 29,
    buyPrice: 2.9,
    playTime: '0h',
    tags: ['动漫', '棋牌', '策略', '卡牌', '多人', '回合制'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0002',
    name: 'DJMAX RESPECT V',
    cover: 'files/game/DJMAX RESPECT V.jpg',
    originalPrice: 138,
    buyPrice: 25.74,
    playTime: '0h',
    tags: ['音乐', '节奏', '单人', '休闲', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0003',
    name: 'INSIDE',
    cover: 'files/game/INSIDE.jpg',
    originalPrice: 90,
    buyPrice: 9,
    playTime: '0h',
    tags: ['解密', '剧情', '恐怖', '单人'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0004',
    name: '三角洲行动',
    cover: 'files/game/三角洲行动.jpg',
    originalPrice: 0,
    buyPrice: 0,
    playTime: '1.5h',
    tags: ['多人', '射击', '搜打撤', '竞技'],
    rating: 3,
    review: '个人不喜欢搜打撤一类的游戏，仅游玩几场，全面战场玩的比较多，但是一直打枪感觉也有点无聊。'
  },
  {
    id: '0005',
    name: '不存在的你和我',
    cover: 'files/game/不存在的你和我.jpg',
    originalPrice: 12,
    buyPrice: 3,
    playTime: '0h',
    tags: ['视觉小说', '恐怖', '单人', '剧情', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0006',
    name: '东方冰之勇者记',
    cover: 'files/game/东方冰之勇者记.jpg',
    originalPrice: 38,
    buyPrice: 3.8,
    playTime: '36.1h',
    tags: ['动作', '弹幕射击', '单人', '动漫'],
    rating: 4,
    review: '经典的弹幕躲避和设计游戏，操作手感可以，难度对于新手来说有点高，游戏剧情很有梗。'
  },
  {
    id: '0007',
    name: '东方夜雀食堂',
    cover: 'files/game/东方夜雀食堂.jpg',
    originalPrice: 38,
    buyPrice: 26.5,
    playTime: '246.3h',
    tags: ['休闲', '模拟经营', '角色扮演', '像素', '动漫', '单人'],
    rating: 4,
    review: '东方的模拟经营休闲游戏，主要是每天采集材料，晚上开店做饭，记住不同客人的口味偏好。'
  },
  {
    id: '0008',
    name: '冰汽时代',
    cover: 'files/game/冰汽时代.jpg',
    originalPrice: 108,
    buyPrice: 10.8,
    playTime: '1.0h',
    tags: ['生存', '模拟经营', '策略', '建造', '单人', '末日'],
    rating: 3,
    review: '经常出现在广告上的游戏，实际游玩之后感觉很一般，传统的经营建造，但是视角不舒服，前期发育速度很慢。'
  },
  {
    id: '0009',
    name: '地铁：离乡',
    cover: 'files/game/地铁：离乡.jpg',
    originalPrice: 148,
    buyPrice: 11.1,
    playTime: '0h',
    tags: ['末日', '射击', '开放世界', '剧情', '单人'],
    rating: 4,
    review: '很不错的末日生存游戏，画面和音乐都很棒，玩法也很丰富，但是难度较高，需要一定的操作技巧。'
  },
  {
    id: '0010',
    name: '动物迷城',
    cover: 'files/game/动物迷城.jpg',
    originalPrice: 98,
    buyPrice: 0,
    playTime: '0h',
    tags: ['剧情', '像素', '单人', '角色扮演', '多结局'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0011',
    name: '底特律：化身为人',
    cover: 'files/game/底特律：化身为人.jpg',
    originalPrice: 136,
    buyPrice: 13.88,
    playTime: '0h',
    tags: ['剧情', '电影式', '单人', '多结局', '角色扮演'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0012',
    name: '恶魔轮盘',
    cover: 'files/game/恶魔轮盘.jpg',
    originalPrice: 12,
    buyPrice: 3,
    playTime: '0h',
    tags: ['多人', '恐怖', '策略'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0013',
    name: '方舟：生存飞升',
    cover: 'files/game/方舟：生存飞升.jpg',
    originalPrice: 248,
    buyPrice: 248,
    playTime: '1h',
    tags: ['开放世界', '生存', '建造', '多人'],
    rating: 4,
    review: '非常优秀的生存游戏，在进化的基础上大幅提升了画质，但是游戏内容并没有太多变化，且优化做的非常差，一般的电脑完全带不动，官方也长期不当人。'
  },
  {
    id: '0014',
    name: '房产达人',
    cover: 'files/game/房产达人.jpg',
    originalPrice: 92,
    buyPrice: 8.07,
    playTime: '97.1h',
    tags: ['休闲', '单人', '模拟', '建造', '模拟经营'],
    rating: 4,
    review: '很好的一款建造打扫模拟器，十分解压，可以体验到装修的乐趣。'
  },
  {
    id: '0015',
    name: '鼓手余命十日谭',
    cover: 'files/game/鼓手余命十日谭.jpg',
    originalPrice: 0,
    buyPrice: 0,
    playTime: '0h',
    tags: ['剧情', '视觉小说', '单人', '多结局', '角色扮演', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0016',
    name: '黑森町绮谭',
    cover: 'files/game/黑森町绮谭.jpg',
    originalPrice: 18,
    buyPrice: 3,
    playTime: '0h',
    tags: ['剧情', '像素', '单人', '恐怖', '角色扮演', '动漫', '冒险'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0017',
    name: '霍格沃茨之遗',
    cover: 'files/game/霍格沃茨之遗.jpg',
    originalPrice: 384,
    buyPrice: 43.98,
    playTime: '0h',
    tags: ['剧情', '开放世界', '单人', '冒险', '角色扮演'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0018',
    name: '饥荒',
    cover: 'files/game/饥荒.jpg',
    originalPrice: 18,
    buyPrice: 6,
    playTime: '0h',
    tags: ['生存', '开放世界', '冒险', '多人', '建造'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0019',
    name: '极限国度',
    cover: 'files/game/极限国度.jpg',
    originalPrice: 168,
    buyPrice: 16.8,
    playTime: '0h',
    tags: ['开放世界', '多人', '竞技'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0020',
    name: '猎人：荒野的召唤',
    cover: 'files/game/猎人：荒野的召唤.jpg',
    originalPrice: 70,
    buyPrice: 14,
    playTime: '0h',
    tags: ['开放世界', '多人', '射击', '休闲'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0021',
    name: '绿色地狱',
    cover: 'files/game/绿色地狱.jpg',
    originalPrice: 80,
    buyPrice: 8,
    playTime: '0h',
    tags: ['开放世界', '多人', '生存', '建造', '恐怖'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0022',
    name: '妹相随～黑白世界的缤纷冒险～',
    cover: 'files/game/妹相随～黑白世界的缤纷冒险～.jpg',
    originalPrice: 39,
    buyPrice: 3.9,
    playTime: '8.4h',
    tags: ['动漫', '单人', '回合制', '模拟经营', '养成'],
    rating: 4,
    review: '游戏本身玩法简单，妹妹很可爱。'
  },
  {
    id: '0023',
    name: '米塔',
    cover: 'files/game/米塔.jpg',
    originalPrice: 52,
    buyPrice: 52,
    playTime: '185.5h',
    tags: ['恐怖', '单人', '剧情', '动漫'],
    rating: 5,
    review: '很好玩的剧情向恐怖游戏，虽然难度不高，但是氛围感拉满，恐怖元素丰富，剧情也很有意思，内部还有很多小游戏可以玩。'
  },
  {
    id: '0024',
    name: '女神异闻录5皇家版',
    cover: 'files/game/女神异闻录5皇家版.jpg',
    originalPrice: 268,
    buyPrice: 86.88,
    playTime: '0h',
    tags: ['角色扮演', '单人', '回合制', '剧情', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0025',
    name: '人类一败涂地',
    cover: 'files/game/人类一败涂地.jpg',
    originalPrice: 58,
    buyPrice: 9.85,
    playTime: '0h',
    tags: ['解密', '多人', '冒险'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0026',
    name: '嗜血印',
    cover: 'files/game/嗜血印.jpg',
    originalPrice: 79,
    buyPrice: 9.48,
    playTime: '0h',
    tags: ['角色扮演', '单人', '动作', '砍杀'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0027',
    name: '双人成行',
    cover: 'files/game/双人成行.jpg',
    originalPrice: 198,
    buyPrice: 19.8,
    playTime: '0h',
    tags: ['多人', '冒险', '解密'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0028',
    name: '同步音律喵赛克',
    cover: 'files/game/同步音律喵赛克.jpg',
    originalPrice: 12,
    buyPrice: 5.8,
    playTime: '0h',
    tags: ['音乐', '动漫', '单人', '节奏', '休闲'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0029',
    name: '巫师3：狂猎',
    cover: 'files/game/巫师3：狂猎.jpg',
    originalPrice: 149,
    buyPrice: 14.9,
    playTime: '0h',
    tags: ['单人', '剧情', '角色扮演', '开放世界', '冒险'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0030',
    name: '小小梦魇2',
    cover: 'files/game/小小梦魇2.jpg',
    originalPrice: 118,
    buyPrice: 11.8,
    playTime: '0h',
    tags: ['恐怖', '单人', '冒险', '解谜'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0031',
    name: '烟火',
    cover: 'files/game/烟火.jpg',
    originalPrice: 39,
    buyPrice: 3.9,
    playTime: '0h',
    tags: ['恐怖', '单人', '解密'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0032',
    name: '永恒轮回',
    cover: 'files/game/永恒轮回.jpg',
    originalPrice: 0,
    buyPrice: 0,
    playTime: '0h',
    tags: ['动漫', '多人', '竞技', '大逃杀'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0033',
    name: '幽灵行者2',
    cover: 'files/game/幽灵行者2.jpg',
    originalPrice: 168,
    buyPrice: 15.79,
    playTime: '0h',
    tags: ['动作', '砍杀', '单人'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0034',
    name: '终极钓鱼模拟器',
    cover: 'files/game/终极钓鱼模拟器.jpg',
    originalPrice: 76,
    buyPrice: 3.8,
    playTime: '0h',
    tags: ['单人', '模拟'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0035',
    name: '重力回路',
    cover: 'files/game/重力回路.jpg',
    originalPrice: 74.8,
    buyPrice: 0,
    playTime: '0h',
    tags: ['单人', '动作', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0036',
    name: '侏罗纪世界：进化2',
    cover: 'files/game/侏罗纪世界：进化2.jpg',
    originalPrice: 163,
    buyPrice: 8.15,
    playTime: '0h',
    tags: ['单人', '模拟经营', '策略', '建造'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0037',
    name: '主播女孩重度依赖',
    cover: 'files/game/主播女孩重度依赖.jpg',
    originalPrice: 54,
    buyPrice: 0,
    playTime: '0h',
    tags: ['单人', '恐怖', '动漫', '视觉小说', '像素'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0038',
    name: '我们之中',
    cover: 'files/game/我们之中.jpg',
    originalPrice: 25,
    buyPrice: 13.5,
    playTime: '0h',
    tags: ['多人', '策略'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0039',
    name: '方舟：生存进化',
    cover: 'files/game/方舟：生存进化.jpg',
    originalPrice: 58,
    buyPrice: 5.8,
    playTime: '1171.8h',
    tags: ['多人', '生存', '建造', '开放世界'],
    rating: 5,
    review: '经典好玩的生存游戏，难度较高，但官方经常抽风，建议多备份存档，目前官方服务器已经关闭。'
  },
  {
    id: '0040',
    name: '蔚蓝',
    cover: 'files/game/蔚蓝.jpg',
    originalPrice: 68,
    buyPrice: 7.6,
    playTime: '0h',
    tags: ['单人', '像素', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0041',
    name: '噬血代码',
    cover: 'files/game/噬血代码.jpg',
    originalPrice: 268,
    buyPrice: 17.38,
    playTime: '0h',
    tags: ['单人', '动作', '动漫', '角色扮演'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0042',
    name: '反恐精英2',
    cover: 'files/game/反恐精英2.jpg',
    originalPrice: 0,
    buyPrice: 0,
    playTime: '673.3h',
    tags: ['多人', '射击', '竞技'],
    rating: 4,
    review: '经典射击游戏，需要一定的操作技巧，购买通行证后每周还能赚点钱。'
  },
  {
    id: '0043',
    name: '节奏地牢',
    cover: 'files/game/节奏地牢.jpg',
    originalPrice: 48,
    buyPrice: 4.8,
    playTime: '0h',
    tags: ['单人', '节奏', '音乐', '像素', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0044',
    name: '约会大作战：凛绪轮回',
    cover: 'files/game/约会大作战：凛绪轮回.jpg',
    originalPrice: 136,
    buyPrice: 23.2,
    playTime: '0h',
    tags: ['单人', '视觉小说', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0045',
    name: '鬼泣5',
    cover: 'files/game/鬼泣5.jpg',
    originalPrice: 148,
    buyPrice: 16.69,
    playTime: '0h',
    tags: ['单人', '动作', '砍杀', '角色扮演'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0046',
    name: '心跳文学部',
    cover: 'files/game/心跳文学部.jpg',
    originalPrice: 0,
    buyPrice: 0,
    playTime: '0h',
    tags: ['单人', '恐怖', '视觉小说', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0047',
    name: '你画我猜',
    cover: 'files/game/你画我猜.jpg',
    originalPrice: 25,
    buyPrice: 5,
    playTime: '0h',
    tags: ['多人', '休闲'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0048',
    name: '辐射4',
    cover: 'files/game/辐射4.jpg',
    originalPrice: 83,
    buyPrice: 18.69,
    playTime: '0h',
    tags: ['单人', '末日', '角色扮演', '开放世界', '冒险'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0049',
    name: '茸茸便利店',
    cover: 'files/game/茸茸便利店.jpg',
    originalPrice: 11,
    buyPrice: 3,
    playTime: '0h',
    tags: ['单人', '动漫', '视觉小说'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0050',
    name: '狐姬',
    cover: 'files/game/狐姬.jpg',
    originalPrice: 11,
    buyPrice: 3,
    playTime: '0h',
    tags: ['单人', '动漫', '视觉小说'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0051',
    name: '狐姬零',
    cover: 'files/game/狐姬零.jpg',
    originalPrice: 11,
    buyPrice: 3,
    playTime: '0h',
    tags: ['单人', '动漫', '视觉小说'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0052',
    name: '几何冲刺',
    cover: 'files/game/几何冲刺.jpg',
    originalPrice: 22,
    buyPrice: 4,
    playTime: '0h',
    tags: ['单人', '音乐', '节奏', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0053',
    name: '幽灵行者',
    cover: 'files/game/幽灵行者.jpg',
    originalPrice: 148,
    buyPrice: 25.88,
    playTime: '0h',
    tags: ['动作', '砍杀', '单人'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0054',
    name: '山羊模拟器',
    cover: 'files/game/山羊模拟器.jpg',
    originalPrice: 42,
    buyPrice: 5.4,
    playTime: '0h',
    tags: ['单人', '模拟', '休闲'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0055',
    name: '鹅鸭杀',
    cover: 'files/game/鹅鸭杀.jpg',
    originalPrice: 0,
    buyPrice: 0,
    playTime: '0h',
    tags: ['多人', '策略'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0056',
    name: '灰色',
    cover: 'files/game/灰色.jpg',
    originalPrice: 128,
    buyPrice: 12.8,
    playTime: '0h',
    tags: ['单人', '冒险', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0057',
    name: '半衰期2',
    cover: 'files/game/半衰期2.jpg',
    originalPrice: 42,
    buyPrice: 0,
    playTime: '0h',
    tags: ['单人', '射击', '动作', '剧情'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0058',
    name: '地狱把妹王',
    cover: 'files/game/地狱把妹王.jpg',
    originalPrice: 0,
    buyPrice: 0,
    playTime: '0h',
    tags: ['单人', '解密', '动漫', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0059',
    name: '艾希',
    cover: 'files/game/艾希.jpg',
    originalPrice: 38,
    buyPrice: 3.8,
    playTime: '0h',
    tags: ['单人', '动作', '砍杀', '动漫','弹幕射击'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0061',
    name: '天国：拯救',
    cover: 'files/game/天国：拯救.jpg',
    originalPrice: 111,
    buyPrice: 11.1,
    playTime: '0h',
    tags: ['单人', '开放世界', '剧情', '角色扮演'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0062',
    name: '求生之路',
    cover: 'files/game/求生之路.jpg',
    originalPrice: 42,
    buyPrice: 4.2,
    playTime: '0h',
    tags: ['多人', '射击', '末日','恐怖'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0063',
    name: '求生之路2',
    cover: 'files/game/求生之路2.jpg',
    originalPrice: 42,
    buyPrice: 4.2,
    playTime: '0h',
    tags: ['多人', '射击', '末日','恐怖'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0064',
    name: '地狱边境',
    cover: 'files/game/地狱边境.jpg',
    originalPrice: 45,
    buyPrice: 4.5,
    playTime: '0h',
    tags: ['单人', '解密', '剧情', '恐怖'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0065',
    name: '拣爱',
    cover: 'files/game/拣爱.jpg',
    originalPrice: 10,
    buyPrice: 3,
    playTime: '0h',
    tags: ['单人', '剧情', '视觉小说', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0066',
    name: '怪物猎人：崛起',
    cover: 'files/game/怪物猎人：崛起.jpg',
    originalPrice: 198,
    buyPrice: 39,
    playTime: '0h',
    tags: ['多人', '动作', '冒险', '砍杀'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0067',
    name: '怪物猎人：世界',
    cover: 'files/game/怪物猎人：世界.jpg',
    originalPrice: 148,
    buyPrice: 38.48,
    playTime: '0h',
    tags: ['多人', '动作', '冒险', '砍杀'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0068',
    name: '喵斯快跑',
    cover: 'files/game/喵斯快跑.jpg',
    originalPrice: 18,
    buyPrice: 3,
    playTime: '491.1h',
    tags: ['单人', '音乐', '节奏', '动漫','休闲'],
    rating: 4,
    review: '2D平面音游，收录了很多歌曲，难度也比较适中，适合休闲娱乐游玩。'
  },
  {
    id: '0069',
    name: '奥日：黑暗森林',
    cover: 'files/game/奥日：黑暗森林.jpg',
    originalPrice: 32,
    buyPrice: 21.24,
    playTime: '0h',
    tags: ['单人', '冒险', '闯关', '动作'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0070',
    name: '奥日：精灵与萤火意志',
    cover: 'files/game/奥日：精灵与萤火意志.jpg',
    originalPrice: 90,
    buyPrice: 18,
    playTime: '0h',
    tags: ['单人', '冒险', '闯关', '动作'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0071',
    name: '逃生2',
    cover: 'files/game/逃生2.jpg',
    originalPrice: 76,
    buyPrice: 7.6,
    playTime: '0h',
    tags: ['单人', '生存', '恐怖'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0072',
    name: '幻兽帕鲁',
    cover: 'files/game/幻兽帕鲁.jpg',
    originalPrice: 108,
    buyPrice: 81,
    playTime: '438.4h',
    tags: ['多人', '生存', '养成','建造','开放世界'],
    rating: 5,
    review: '类方舟的生存捉宠游戏，可以建造基地，养宠物，打怪，非常自由，官方很活跃很听劝。'
  },
  {
    id: '0073',
    name: '收获日2',
    cover: 'files/game/收获日2.jpg',
    originalPrice: 35,
    buyPrice: 3.5,
    playTime: '0h',
    tags: ['多人', '射击', '动作'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0074',
    name: '传送门',
    cover: 'files/game/传送门.jpg',
    originalPrice: 42,
    buyPrice: 4.2,
    playTime: '0h',
    tags: ['多人', '解密', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0075',
    name: '传送门2',
    cover: 'files/game/传送门2.jpg',
    originalPrice: 42,
    buyPrice: 4.2,
    playTime: '0h',
    tags: ['多人', '解密', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0076',
    name: '绝地求生',
    cover: 'files/game/绝地求生.jpg',
    originalPrice: 0,
    buyPrice: 0,
    playTime: '0h',
    tags: ['多人', '竞技', '射击', '大逃杀'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0077',
    name: '影子战术：将军之刃',
    cover: 'files/game/影子战术：将军之刃.jpg',
    originalPrice: 160,
    buyPrice: 16,
    playTime: '0h',
    tags: ['单人', '策略', '解密'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0078',
    name: '文明6',
    cover: 'files/game/文明6.jpg',
    originalPrice: 220,
    buyPrice: 11,
    playTime: '0h',
    tags: ['单人', '策略', '回合制'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0079',
    name: '史莱姆牧场',
    cover: 'files/game/史莱姆牧场.jpg',
    originalPrice: 70,
    buyPrice: 17.5,
    playTime: '0h',
    tags: ['单人', '冒险', '开放世界'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0080',
    name: '森林',
    cover: 'files/game/森林.jpg',
    originalPrice: 70,
    buyPrice: 14,
    playTime: '0h',
    tags: ['多人', '生存', '开放世界', '恐怖', '建造'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0081',
    name: '森林之子',
    cover: 'files/game/森林之子.jpg',
    originalPrice: 108,
    buyPrice: 32.4,
    playTime: '0h',
    tags: ['多人', '生存', '开放世界', '恐怖', '建造'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0082',
    name: '灵魂摆渡人',
    cover: 'files/game/灵魂摆渡人.jpg',
    originalPrice: 108,
    buyPrice: 12,
    playTime: '0h',
    tags: ['单人', '休闲', '模拟经营', '剧情', '建造'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0083',
    name: '星露谷物语',
    cover: 'files/game/星露谷物语.jpg',
    originalPrice: 48,
    buyPrice: 24,
    playTime: '0h',
    tags: ['多人', '休闲', '模拟经营', '模拟', '建造', '像素'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0084',
    name: '泰拉瑞亚',
    cover: 'files/game/泰拉瑞亚.jpg',
    originalPrice: 48,
    buyPrice: 24,
    playTime: '0h',
    tags: ['多人', '休闲', '模拟经营', '模拟', '建造', '像素'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0085',
    name: '最后的篝火',
    cover: 'files/game/最后的篝火.jpg',
    originalPrice: 58,
    buyPrice: 5.8,
    playTime: '0h',
    tags: ['单人', '冒险', '解密', '闯关', '休闲'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0086',
    name: '漫漫长夜',
    cover: 'files/game/漫漫长夜.jpg',
    originalPrice: 70,
    buyPrice: 7,
    playTime: '0h',
    tags: ['单人', '生存', '开放世界'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0087',
    name: '未上锁的房间1-4',
    cover: 'files/game/未上锁的房间1-4.jpg',
    originalPrice: 105,
    buyPrice: 42,
    playTime: '0h',
    tags: ['单人', '解密', '闯关'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0088',
    name: '小偷模拟器',
    cover: 'files/game/小偷模拟器.jpg',
    originalPrice: 76,
    buyPrice: 7.6,
    playTime: '0h',
    tags: ['单人', '模拟', '开放世界'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0089',
    name: '古墓丽影',
    cover: 'files/game/古墓丽影.jpg',
    originalPrice: 98,
    buyPrice: 2,
    playTime: '0h',
    tags: ['单人', '冒险', '动作', '剧情', '解密'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0090',
    name: '全面战争模拟器',
    cover: 'files/game/全面战争模拟器.jpg',
    originalPrice: 70,
    buyPrice: 0,
    playTime: '0h',
    tags: ['单人', '策略', '模拟'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0091',
    name: '传说之下',
    cover: 'files/game/传说之下.jpg',
    originalPrice: 36,
    buyPrice: 3.6,
    playTime: '0h',
    tags: ['单人', '剧情', '像素', '多结局'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0092',
    name: '吸血鬼的旋律',
    cover: 'files/game/吸血鬼的旋律.jpg',
    originalPrice: 18,
    buyPrice: 3,
    playTime: '0h',
    tags: ['单人', '剧情', '视觉小说', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0093',
    name: '吸血鬼的旋律2',
    cover: 'files/game/吸血鬼的旋律2.jpg',
    originalPrice: 18,
    buyPrice: 3,
    playTime: '0h',
    tags: ['单人', '剧情', '视觉小说', '动漫'],
    rating: 0,
    review: '暂无'
  },
  {
    id: '0094',
    name: '幽浮2',
    cover: 'files/game/幽浮2.jpg',
    originalPrice: 99,
    buyPrice: 1,
    playTime: '0h',
    tags: ['单人', '策略', '回合制', '角色扮演'],
    rating: 0,
    review: '暂无'
  }
]
const GAME_RATING_MAX = 5;
const PRICE_FILTERS = [
  { value: 'free', label: '免费', match: (price) => price === 0 },
  { value: '0-10', label: '0-10￥', match: (price) => price > 0 && price <= 10 },
  { value: '10-20', label: '10-20￥', match: (price) => price > 10 && price <= 20 },
  { value: '20-50', label: '20-50￥', match: (price) => price > 20 && price <= 50 },
  { value: '50-100', label: '50-100￥', match: (price) => price > 50 && price <= 100 },
  { value: '100-200', label: '100-200￥', match: (price) => price > 100 && price <= 200 },
  { value: '200+', label: '大于200￥', match: (price) => price > 200 }
];

const gameFilterSelection = { tag: new Set(), price: new Set(), rating: new Set() };
const gameFilterUi = { openKind: null };
const GAME_FILTER_PANELS = [
  { kind: 'tag', btnId: 'gameFilterTagBtn', panelId: 'gameFilterTagPanel', defaultLabel: '筛选标签' },
  { kind: 'price', btnId: 'gameFilterPriceBtn', panelId: 'gameFilterPricePanel', defaultLabel: '筛选价格' },
  { kind: 'rating', btnId: 'gameFilterRatingBtn', panelId: 'gameFilterRatingPanel', defaultLabel: '推荐指数' }
];

function getSortedGames(list) {
  return [...list].sort((a, b) => {
    const ratingDiff = normalizeGameRating(b) - normalizeGameRating(a);
    if (ratingDiff !== 0) return ratingDiff;
    return AppCommon.compareByName(a.name, b.name);
  });
}

function getGameTags(game) {
  return Array.isArray(game.tags) ? game.tags.map((tag) => String(tag).trim()).filter(Boolean) : [];
}

function normalizeGameRating(game) {
  const rating = Number(game && game.rating);
  if (!Number.isFinite(rating)) return 1;
  return Math.max(1, Math.min(GAME_RATING_MAX, Math.floor(rating)));
}

function getGameOriginalPrice(game) {
  const price = Number(game && game.originalPrice);
  return Number.isFinite(price) ? price : 0;
}

function gameMatchesTagFilter(game) {
  return AppCommon.matchesFilterSet(gameFilterSelection.tag, getGameTags(game));
}

function gameMatchesPriceFilter(game) {
  const set = gameFilterSelection.price;
  if (!set.size) return true;
  const price = getGameOriginalPrice(game);
  return [...set].some((key) => {
    const option = PRICE_FILTERS.find((item) => item.value === key);
    return option && option.match(price);
  });
}

function gameMatchesRatingFilter(game) {
  const set = gameFilterSelection.rating;
  if (!set.size) return true;
  return set.has(String(normalizeGameRating(game)));
}

function gamePassesFilters(game) {
  return gameMatchesTagFilter(game) && gameMatchesPriceFilter(game) && gameMatchesRatingFilter(game);
}

function getFilteredGames() {
  return getSortedGames(GAMES.filter(gamePassesFilters));
}

function getGamesForFilterPool(excludeKind) {
  return GAMES.filter((game) => {
    if (excludeKind !== 'tag' && !gameMatchesTagFilter(game)) return false;
    if (excludeKind !== 'price' && !gameMatchesPriceFilter(game)) return false;
    if (excludeKind !== 'rating' && !gameMatchesRatingFilter(game)) return false;
    return true;
  });
}

function noneLabel(value) {
  return value === AppCommon.FILTER_NONE ? '暂无' : value;
}

function compareFilterOptionsByCount(a, b) {
  if (b.count !== a.count) return b.count - a.count;
  return AppCommon.compareByName(a.label, b.label);
}

function sortGameFilterOptions(items, kind) {
  return items.filter((item) => item.count > 0).sort((a, b) => {
    if (kind === 'rating') return Number(a.value) - Number(b.value);
    if (kind === 'price') {
      const order = PRICE_FILTERS.map((item) => item.value);
      return order.indexOf(a.value) - order.indexOf(b.value);
    }
    return compareFilterOptionsByCount(a, b);
  });
}

function collectGameFilterOptions(kind) {
  const pool = getGamesForFilterPool(kind);
  const selected = gameFilterSelection[kind];
  let options = [];

  if (kind === 'tag') {
    const values = new Set();
    pool.forEach((game) => getGameTags(game).forEach((tag) => values.add(tag)));
    if (pool.some((game) => getGameTags(game).length === 0)) values.add(AppCommon.FILTER_NONE);
    values.forEach((value) => {
      const count = value === AppCommon.FILTER_NONE
        ? pool.filter((game) => getGameTags(game).length === 0).length
        : pool.filter((game) => getGameTags(game).includes(value)).length;
      options.push({ value, label: noneLabel(value), count });
    });
  } else if (kind === 'price') {
    PRICE_FILTERS.forEach((item) => {
      options.push({
        value: item.value,
        label: item.label,
        count: pool.filter((game) => item.match(getGameOriginalPrice(game))).length
      });
    });
  } else {
    for (let rating = 1; rating <= GAME_RATING_MAX; rating++) {
      options.push({
        value: String(rating),
        label: String(rating),
        count: pool.filter((game) => String(normalizeGameRating(game)) === String(rating)).length
      });
    }
  }

  const sorted = sortGameFilterOptions(options, kind);
  if (!selected.size) return sorted;

  selected.forEach((value) => {
    if (sorted.some((item) => item.value === value)) return;
    if (kind === 'rating') {
      sorted.push({ value, label: value, count: 0 });
    } else if (kind === 'price') {
      const label = (PRICE_FILTERS.find((item) => item.value === value) || {}).label || value;
      sorted.push({ value, label, count: 0 });
    } else {
      sorted.push({ value, label: noneLabel(value), count: 0 });
    }
  });

  return sortGameFilterOptions(sorted, kind);
}

function updateGameFilterButtonLabel(kind, labelEl, set, defaultLabel) {
  labelEl.classList.remove('game-rating-filter-label');
  if (!set.size) {
    labelEl.textContent = defaultLabel;
    return;
  }
  if (set.size === 1) {
    const only = [...set][0];
    if (kind === 'rating') AppCommon.setHeartsLabel(labelEl, only, GAME_RATING_MAX, 'game-rating-filter');
    else if (kind === 'price') labelEl.textContent = (PRICE_FILTERS.find((item) => item.value === only) || {}).label || only;
    else labelEl.textContent = noneLabel(only);
    return;
  }
  labelEl.textContent = defaultLabel + ' (' + set.size + ')';
}

function renderGameFilterOption(btn, kind, item) {
  if (kind === 'rating') AppCommon.setHeartsLabel(btn, item.value, GAME_RATING_MAX, 'game-rating-filter', ' (' + item.count + ')');
  else btn.textContent = item.label + ' (' + item.count + ')';
}

function initGameFilters(onApply) {
  const controller = AppCommon.createMultiSelectFilter({
    layerId: 'filter-layer',
    noneKey: AppCommon.FILTER_NONE,
    panels: GAME_FILTER_PANELS,
    selection: gameFilterSelection,
    ui: gameFilterUi,
    optionClass: 'game-filter-option',
    labelSelector: '.game-filter-label',
    collectOptions: collectGameFilterOptions,
    updateButtonLabel: updateGameFilterButtonLabel,
    renderOptionContent: renderGameFilterOption,
    onApply
  });
  controller.bindEvents();
  controller.buildAllPanels();
}

function formatGamePrice(price) {
  const value = Number(price);
  if (!Number.isFinite(value)) return '0￥';
  if (value === 0) return '0￥';
  return Number.isInteger(value) ? value + '￥' : value.toFixed(1).replace(/\.0$/, '') + '￥';
}

function renderGameList(container, games, activeId, onSelect) {
  container.innerHTML = '';
  games.forEach((game) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'game-item ui-interactive' + (game.id === activeId ? ' active' : '');
    item.dataset.id = game.id;
    item.innerHTML =
      '<div class="game-item-cover"><img src="' + game.cover + '" alt="' + game.name + '">' +
      '<span class="game-item-current">当前</span></div>' +
      '<span class="game-item-name">' + game.name + '</span>';
    item.addEventListener('click', () => onSelect(game.id));
    container.appendChild(item);
  });
}

function renderGameDetail(container, game) {
  if (!game) {
    container.innerHTML = '<p class="game-empty">暂无游戏</p>';
    return;
  }

  const tagsText = getGameTags(game).join('，') || '暂无';
  const review = game.review && game.review !== '无' ? game.review : '暂无';

  container.innerHTML =
    '<div class="game-detail-title">游戏详情</div>' +
    '<div class="game-detail-body">' +
      '<div class="game-detail-header">' +
        '<div class="game-detail-cover ui-interactive" role="button" tabindex="0" aria-label="查看封面大图">' +
          '<img src="' + game.cover + '" alt="' + game.name + '">' +
        '</div>' +
        '<p class="game-detail-name">' + game.name + '</p>' +
      '</div>' +
      '<div class="game-detail-prices">' +
        '<p class="game-meta-box" title="原价：' + formatGamePrice(game.originalPrice) + '">原价：' + formatGamePrice(game.originalPrice) + '</p>' +
        '<p class="game-meta-box" title="购入：' + formatGamePrice(game.buyPrice) + '">购入：' + formatGamePrice(game.buyPrice) + '</p>' +
      '</div>' +
      '<p class="game-meta-box game-meta-full" title="游戏时长：' + game.playTime + '">游戏时长：' + game.playTime + '</p>' +
      '<p class="game-meta-box game-meta-full" title="游戏标签：' + tagsText + '">游戏标签：' + tagsText + '</p>' +
      '<div class="game-meta-box game-meta-full game-detail-rating">' +
        '<span class="game-detail-rating-label">推荐指数：</span>' +
        '<span class="game-detail-rating-hearts"></span>' +
      '</div>' +
      '<p class="game-meta-box game-meta-full game-detail-review" title="个人评价：' + review + '">个人评价：' + review + '</p>' +
    '</div>';

  const heartsEl = container.querySelector('.game-detail-rating-hearts');
  if (heartsEl) heartsEl.appendChild(AppCommon.createHeartsEl(game.rating, GAME_RATING_MAX, 'game-detail-rating'));
  AppCommon.bindCoverPreview(container, '.game-detail-cover', game.cover);
}

function initGames() {
  const listEl = document.getElementById('game-list');
  const detailEl = document.getElementById('game-detail');
  if (!listEl || !detailEl || !GAMES.length) return;

  let viewingId = getSortedGames(GAMES)[0].id;

  function refreshGameList() {
    renderGameList(listEl, getFilteredGames(), viewingId, selectGame);
  }

  function selectGame(id) {
    viewingId = id;
    refreshGameList();
    renderGameDetail(detailEl, GAMES.find((item) => item.id === id));
  }

  initGameFilters(refreshGameList);
  refreshGameList();
  renderGameDetail(detailEl, GAMES.find((item) => item.id === viewingId));
}

AppCommon.registerLazySection('games', initGames);

