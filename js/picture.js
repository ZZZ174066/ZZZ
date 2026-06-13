const PICTURE_NATURES = ['电脑壁纸', '手机壁纸', '头像', '表情包', '立绘', '其他'];

const PICTURES = [
  {
    id: '0001',
    name: '琪亚娜·卡斯兰娜',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/01/18/4976467/0be55baf0769c9d5d76f2af8d45dbf65_1618689575616640027.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0002',
    name: '雷电芽衣',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2026/01/29/4976467/2aab6e5a3fe0d4cef474526e5b16efbd_4391258740181403062.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0003',
    name: '布洛妮娅·扎伊切克',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/11/26/6100274/3f7bc8de691746ef0c26e366244d90a0_7454756053112451951.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0004',
    name: '布朗尼',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/75216984/c84355e3109e194bd7bd26e3e749e9a3_9083605557632269496.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0005',
    name: '无量塔·姬子',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/75216984/cab405f99a17006aaa3fa214b5df0874_5248274888341588743.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0006',
    name: '朔夜观星',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/75216984/11666a7a2bf5e93c9d4ec4c69b4bfed7_4037998077301864177.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0007',
    name: '德莉莎·阿波卡利斯',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/01/16/50494840/5d790d2b955e222f7838db222c98cb30_641897115043684970.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0008',
    name: '识之律者',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/24/50494840/4e0a024a4fd1e1c0d0efbabcc3ec6818_5189216467820956514.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0009',
    name: '符华',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/12/18/4976467/6546d72d2ce42861310e9893187ec763_8039053651114261869.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0010',
    name: '窈窕谍影',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/11/28/4976467/9bf3cf031459734b450f00ad34544ce7_4934339290011930078.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0011',
    name: '失落迷迭',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/76361817/b82c61ca04f66ea2f04def3d19ed3b4c_2024376263070550224.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0012',
    name: '八重樱',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/76361817/be3684ef5b24a45de4ed241fd6fa9749_5931370485606107084.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0013',
    name: '八重霞',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/72350798/08990112516281faaabbfbd8ec9f9a84_2159278838564401953.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0014',
    name: '卡莲·卡斯兰娜',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/76361817/fcb56356661b066cc7b1ab296684a47a_5840937164437105928.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0015',
    name: '莉莉娅·阿琳',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/76361817/0e623c302b014d47cb47ed362d8fa090_8530639749210665292.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0016',
    name: '萝莎莉娅·阿琳',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/77124895/7619b9e88145794292400add916272bf_1117881906323082463.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0017',
    name: '狂热蓝调Δ',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/27/73514954/e77a739ab6f35dce6ec2745b2a0b3413_6779816709942462742.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0018',
    name: '希儿·芙乐艾',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/81417673/6fa512784d0c359609bedeb280237603_5549453963236351035.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0019',
    name: '希儿·芙乐艾',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2026/05/19/4976467/aa653f3f2ce646a27a6a63594078ec2b_1178604407718565360.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0020',
    name: '幽兰黛尔',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/12/03/4976467/ceac4b8c897bc3a8d695eb6e030e6949_5561940668755187712.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0021',
    name: '菲谢尔·冯·露弗施洛斯·那菲多特',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/77124895/9daf05325605cef79f999d5f68f15b4f_8831957001967838419.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0022',
    name: '爱莉希雅',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/09/18/4976467/b968d49ff2b42f59f04205735fc6e645_5227460032732359975.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0023',
    name: '梅比乌斯',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/10/25/50494840/2e8279d01c2a04714253b6910a80303e_1627708995239623713.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0024',
    name: '渡鸦',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/10/25/50494840/da9b13f3c5b94b64dfe7f7d90491eb0b_6672497063707191786.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0025',
    name: '明日香',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/09/24/50494840/818883adafc5aa87bcefcbaee48364c2_2720408605336334206.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0026',
    name: '卡萝尔·佩珀',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/11/02/77124895/09aac182c7c5065ea2146356d0a884ed_513550707817642334.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0027',
    name: '帕朵菲利丝',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/02/25/50494840/5f6b71225c8d06e16e638b0551f069e2_7618386735023564905.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0028',
    name: '伊甸',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/04/01/6100274/6438bad41f607c93a9038a4eae360777_3203861347626462448.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0029',
    name: '阿波尼亚',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/04/18/6100274/53697e83833574d5094c2d202d6444ae_2147518316687614951.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0030',
    name: '格蕾修',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/11/01/50494840/cb83545dd0df2c2b7ff0d6ef9196f85e_762604071459129379.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0031',
    name: '维尔薇',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/06/25/50494840/b7fe93eb4659d3f26325e8773d9ff8da_8165269080772232716.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0032',
    name: '李素裳',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/03/15/4976467/e727fe7513a6f5d3a29b0c1f8795111f_1347222900328884979.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0033',
    name: '爱衣·休伯利安Λ',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/10/21/50494840/a5af1221bc5705b7e4f21c6fa1ba38b0_6694038534289014380.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0034',
    name: '苏莎娜',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2023/02/20/50494840/31918d3e5034074b05f74046a4c6e0ef_3143474124441032998.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0035',
    name: '米斯忒琳',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2023/04/01/50494840/9d9b7f4543bf253f3d3b78568d9e27cb_3154386111833336883.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0036',
    name: '普罗米修斯',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2023/04/01/282941837/0d2d7395b0d8c132f316974e476fceeb_6904550714904886315.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0037',
    name: '时雨绮罗',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/05/15/50494840/3847009ea9f51542e7fd81bdc4fa1e46_4438534966089352275.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0038',
    name: '西琳',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/08/01/50494840/a7ce6dfc9b5f625de75f50ea00a96ebc_4036589708562992055.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0039',
    name: '希娜狄雅',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/01/30/73749426/14d8e9d0013d98979fe238c589271dc2_8909240753721134836.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0040',
    name: '科拉莉·6626·普朗克',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/07/13/4976467/e82cd1b7b42ca265a9f9d394fd5eee4a_3841603596562213253.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0041',
    name: '埃尔德什·赫丽娅',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/05/18/4976467/be81897c68fc6c585ac2820f60400806_5244577982226911128.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0042',
    name: '瑟莉姆·努特里斯科',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/03/18/76321978/8fa6a53197cec7379266f15be43b67f6_2972680046746439564.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0043',
    name: '「灯」',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/04/19/76321978/91fb1663cdd7dcd21ac2b1d548339c01_7967211773031053617.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0044',
    name: '松雀',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/06/07/76321978/600b1d62a6408adff9b811c3bd9d9e33_8975502539823556933.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0045',
    name: '薇塔',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/09/15/4976467/947fa08174913a03b622ceabcc8ba9b8_8096704560296297854.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0046',
    name: '花火',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/10/22/4976467/1c45e2beebbaa1c74426e3cddd15d69b_5991563338126045762.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0047',
    name: '白鹿游云',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2026/03/29/4976467/8c9388d2ec4f038709ad033431f332e7_8867764648835724605.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0048',
    name: '晨雪',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/07/18/9809137/4240bb5eb35a10643e2b3cc624ece55c_8166822329938274156.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0049',
    name: '瑟拉珮姆',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/06/16/75216984/d62068170420f2fa32d3cdf7d41ae6d2_1626725873865138264.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0050',
    name: '寻梦者',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/01/22/73749426/fa5d5550e623457030097902ae9a92c4_7272448367250326176.png',
    natures: ['立绘'],
    tags: ['崩坏三']
  },
  {
    id: '0051',
    name: '可琳·威克斯',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/236ee5308224213251cbed89d7373dce_1457359834919069415.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0052',
    name: '苍角',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/5ff402462421ee3956f8627b3ca074d4_7538265196219713017.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0053',
    name: '妮可·德玛拉',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/97e6b0c20f7fbb51cf4698575a990cbc_3976286956559623091.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0054',
    name: '派派·韦尔',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/76bf3a04b3bea4d06cc083154d64c17a_7128888337781188889.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0055',
    name: '露西亚娜·德·蒙特夫',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/5b57f18fd25d6125c17d9a1db2eafb3b_8579008197735461414.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0056',
    name: '波可娜·费雷尼',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/03/05/15559334/e580002690f8aeb311de4608063235f1_3158522883564202676.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0057',
    name: '格莉丝·霍华德',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/0857aee9fa4d74ee55ff24953ef228d3_8449388676618564769.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0058',
    name: '珂蕾妲·贝洛伯格',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/327186c5a35f01f64c3f987af5c10823_3042825403141923601.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0059',
    name: '亚历山德丽娜·莎芭丝缇安',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/2a2c17a8786be73e40407df8e41b0c8e_8595380272413573060.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0060',
    name: '「11号」',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/96de44ff1486f828a1d1fa477fae614d_666957098767962858.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0061',
    name: '猫宫 又奈',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/3762cc4676b341f6bd53127827645e6e_8663005375158146409.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0062',
    name: '艾莲·乔',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/03ccbe64542570776967153c4ebb08e9_6128696990818407188.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0063',
    name: '朱鸢',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/9945563f20fca22f8397bb21931ec5c4_542475313663532302.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0064',
    name: '青衣',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/08/05/76099754/822d214326e467e99ccf6bccff768de1_8048158907789191989.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0065',
    name: '简·杜',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/09/11/76099754/a8cecba77dcf30aac55911791b97d286_5628704406046486367.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0066',
    name: '凯撒·金',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/09/18/76099754/2997f69317554fefc854909753dcf271_6699774852879942097.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0067',
    name: '柏妮思·怀特',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/10/28/76099754/6d3e78f6bee852ea27b0a14403746548_424601202762741934.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0068',
    name: '月城柳',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/10/29/76099754/51f7da64878494b38ec4147c794e1b2c_2233892488382252178.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0069',
    name: '星见 雅',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/12/08/82500917/f6b4ae8f3e2106e33180e18ed87d4e8d_4325623899800859624.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0070',
    name: '耀嘉音',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/01/16/15559334/42e581cb3828278a6d79867a165df819_6472892422375142685.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0071',
    name: '伊芙琳·舒瓦利耶',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/02/04/15559334/84b1718e8b4c8c85322776c89bac039c_5603416352690327429.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0072',
    name: '零号·安比',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/03/01/82500917/ce785c9b2861fc16c2ab28d912c9067b_5811064203395145699.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0073',
    name: '「扳机」',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/03/20/82500917/304ef76355275fecfcac4fc3f6d264a3_2227158392948245307.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0074',
    name: '薇薇安·班希',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/04/18/15559334/8319b24c3066e8ca1ba042932e25ff14_2284717965088394307.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0075',
    name: '仪玄',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/05/29/15559334/503f72b51a44b54278b85390a2e30fe0_4102207195254984498.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0076',
    name: '橘福福',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/06/20/158441880/674c69b2ec585a1f7f91006a6dbefab3_2060071298931628803.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0077',
    name: '浮波 柚叶',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/07/08/82500917/ca293f1cff2865ce2d6f1a284672b59e_3099819737866401038.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0078',
    name: '爱丽丝·泰姆菲尔德',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/07/29/15559334/b0a35446738314435b77c472410a7ca9_2218141421659685735.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0079',
    name: '「席德」',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/08/28/15559334/93ff6fe18ebd0722d609d0c92e9aee0a_3187062097775551463.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0080',
    name: '卢西娅·艾洛温',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/10/07/82500917/08f5e492feb17f63bdfd22386b94a525_4102768975677636124.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0081',
    name: '伊德海莉·墨菲',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/10/29/233874762/96d962b65e26b404f1e251eec0c23a58_1080297264947616397.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0082',
    name: '琉音',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/11/20/15559334/b55c5f7ec0efa3554382c9d968e02f67_7050571773364969405.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0083',
    name: '照',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/12/26/15559334/6ed2b5a32c28b767eaa2f259d29b6e94_1052621028308778586.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0084',
    name: '叶瞬光',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/12/25/15559334/2651a4310081f02bbc7c3ee8aedb9417_8086292013067850838.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0085',
    name: '千夏',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/02/01/15559334/e2cce1dcb540aeb9304125bf5c3e5512_1863947874220153279.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0086',
    name: '爱芮-形态1',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/02/26/82500917/a0d73f565e97fc6dd092efc9a154d33c_6323227830245911769.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0087',
    name: '南宫羽',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/03/22/76099754/c8344ece999c6d798e6e55b558e110fa_2228858142616648506.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0088',
    name: '希希芙',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/04/10/233874762/73ca00d9d222284c111f822c8cc92a73_2365965413356557275.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0089',
    name: '普罗米娅',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/04/29/82500917/ccf387eebd0159c6990446793c5fa270_7627715357189602192.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0090',
    name: '奥菲丝&「鬼火」',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/09/21/15559334/f80e5cd274d91697668fbb16d2118f2d_1098522281754662874.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0091',
    name: '安比·德玛拉',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/29/76099754/323599789244108f45d720b6d625d483_6311895131978562843.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0092',
    name: '三月七',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/24/281496331/058b1964932ed5a487de911d29a39f04_5562474376695252482.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0093',
    name: '艾丝妲',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/26/281496331/7efb3fde8547b31aa6328e5393538d86_7040454768487056981.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0094',
    name: '黑塔',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/09/18/197948068/413ccdf412656119eb9205c6db098706_3597394422981225745.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0095',
    name: '希露瓦',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/24/281496331/104029380412eb1a8dec009230d35002_8964275330938768757.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0096',
    name: '娜塔莎',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/24/281496331/ef25dcb366bf08ee26b727d9c79a2530_769979529715710133.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0097',
    name: '佩拉',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/21/331632599/10d1b16db650de2624c7772ea8b5ebd4_988417821788515634.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0098',
    name: '虎克',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/04/281496331/75005d84d76b376bf94435a928cf3392_2145790752311769881.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0099',
    name: '玲可',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/09/06/281496331/d87ac9fe7112cd292c2c7711551cce97_2405885679334067056.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0100',
    name: '青雀',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/24/281496331/f1e8314135b8e0563782f875ce4f5e5e_5619748099798921612.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0101',
    name: '停云',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/12/14/281496331/45087c9ad3b060e9d951a90c30fe54d7_82123332789447592.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0102',
    name: '素裳',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/31/281496331/447d528eaec57e707879251986bf80e5_6234735755180812396.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0103',
    name: '驭空',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/27/281496331/712eaa3a0108b9173dc15b9194cc78ac_1169371305822154139.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0104',
    name: '桂乃芬',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/31/281496331/50e49b59d34989db6d572b0061c4578b_6287242180972888800.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0105',
    name: '雪衣',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/09/18/197948068/76babb6c17ef462be4fc4f7a66f9ead3_6773096011780886736.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0106',
    name: '寒鸦',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/27/281496331/e3b9324aa51f9f45488ec684a9b0f2df_343622841149520524.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0107',
    name: '仙舟三月七',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/06/281496331/87757046fcd7644b685c0d51e011f242_2452303955027980096.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0108',
    name: '开拓者·毁灭',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/09/02/159300832/b50a31d20a90817d4b3a6d6203048152_8871755169095395644.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0109',
    name: '开拓者·存护',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/11/30/331632599/a16d50e3d1bec34119947d66f0224ee8_3251547190181945282.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0110',
    name: '开拓者•同谐',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/25/331632599/23e654eb894c97fc63ac50dec1647dd9_4474527079850830942.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0111',
    name: '姬子',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/07/05/197948068/887a32cddacb19f1bb2af4b0764e0769_4461823625198551265.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0112',
    name: '布洛妮娅',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/07/04/197948068/29e12cc395d0d9c4081cada87237b21d_4910797842539917063.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0113',
    name: '克拉拉',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/07/18/331632599/fc98321aa4593969d912a83bcc9c0d58_3746476657306757590.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0114',
    name: '托帕&账账',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/07/18/331632599/352801c0def69beffbb2ee805365e184_4868469725322412835.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0115',
    name: '符玄',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/07/05/197948068/62924fc83e472e9e9b9c1c69c52f335a_8635606035917333368.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0116',
    name: '白露',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/07/19/281496331/543fbe873e6d21cf3d730bc69c5b4226_2572490326282665270.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0117',
    name: '阮•梅',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/25/197948068/a1e3b879dfd5b4a7bbbef9e0f945cd3e_2951482036890553038.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0118',
    name: '翡翠',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/29/197948068/005fcf36b406173392cdbd97fefad223_4869761168218830714.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0119',
    name: '开拓者•记忆',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/26/197948068/5b4568e782785f03c902fc3ccee653b2_5864013736084271254.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0120',
    name: '知更鸟',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/25/197948068/5de480c69cc78d114a7dbde6705e5e98_8454883161627555117.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0121',
    name: '云璃',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/05/16/281496331/ce0a37956d03d7e17ec8eb439a2e5659_6530414364638149713.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0122',
    name: '黄泉',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/03/27/159300832/4e90a7fd1a49f3feee30cac28223a75e_634736699294022677.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0123',
    name: 'Saber',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/04/276833758/26c5acea65c8b5c594ec5556e37881c6_4562746630950494855.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0124',
    name: '镜流',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/25/197948068/3977d62ea4d0fe0255c5150e1033179a_5862782453906698066.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0125',
    name: '卡芙卡',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/26/331632599/65d197d46bb434c561ba157123d8565e_1275620304822777564.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0126',
    name: '银狼',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/28/159300832/2cd7ba29770cd2c5359a7553c8b6a5ed_2208525302407443377.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0127',
    name: '大黑塔',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/21/197948068/86c27c4f19751481686f2d470ab3a805_6705477560224549997.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0128',
    name: '赛飞儿',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/06/01/281496331/aa243fe68df74535edad448ebe95779c_1541411589364668657.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0129',
    name: '昔涟',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/10/24/276833758/7e882466b8296aec6babf9ae587c7db1_2588671916746164363.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0130',
    name: '灵砂',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/27/197948068/51a0aa571edf98617adc29d90ff397c2_8288054523810998474.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0131',
    name: '忘归人',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/12/14/281496331/b51685bd7e0cfe9b96a3d54dadfc33ca_4585517113854158201.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0132',
    name: '阿格莱雅',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/03/11/159300832/d8a7ab6d1dfb573a41335e6eaf8a18f1_6212223373173456731.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0133',
    name: '海瑟音',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/03/276833758/bbbb046351d15361de2c034acae2365e_5408770241774826343.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0134',
    name: '长夜月',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/09/16/159300832/6b457fdb6f1abcef0d54b5c0079a3659_5705777770790640873.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0135',
    name: '黑天鹅',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/29/197948068/3b08e6fb550b9ce40aab2f1abe862420_369522537692998554.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0136',
    name: '花火',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/26/331632599/35febe0dcde248275e78541a22a1d691_3880185522085795821.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0137',
    name: '乱破',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/29/331632599/462a6b32e1de34b64c59c6ff4a44c828_8941481948502544191.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0138',
    name: '刻律德菈',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/08/03/276833758/17870d73a2aaa511ed556ff6b20aaba5_7005454115364746059.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0139',
    name: '火花',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/01/02/276833758/49ad2738c298a2a0b63fce9109d40ae6_9064531483009345818.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0140',
    name: '风堇',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/21/193706962/c71716b044d2acf2e07e792607cc506b_3590066788707249084.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0141',
    name: '开拓者•欢愉',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/04/22/276833758/c6e8c914a02ccaf80af48d4ade531db4_2793374788124216407.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0142',
    name: '希儿',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/07/04/197948068/5060d2a342075d081928230f28d6c68b_9199287545619787290.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0143',
    name: '藿藿',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/04/15/281496331/3d83b8e2005f993e3688809e777a1daa_3078874667295665982.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0144',
    name: '流萤',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/28/159300832/f37341d7ff48ce8cb980a2b446b53dd9_9114734859826249021.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0145',
    name: '遐蝶',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/03/11/331632599/5310ccf5bf3a921f2c6e98634708af26_6843303027698005130.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0146',
    name: '大丽花',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/12/05/276833758/7a03ebd21acec4b34b8addfb0540a10b_8883284878063652008.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0147',
    name: '银狼LV.999',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/04/17/159300832/d6e17a88a4fc4d7fad4640b804f33332_2284950615105105299.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0148',
    name: '飞霄',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/05/27/197948068/1e22e960fd7ee7f5e2d8e583f273ba82_7739650463383911952.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0149',
    name: '缇宝',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2025/03/11/197948068/564aaccf90fc5d0c18a19811b62cb0ef_3930799636646992022.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0150',
    name: '绯英',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/04/29/159300832/2877dd262cfe6bfff51a2eec92d257bb_5335515090825879786.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0151',
    name: '姬子•启行',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/05/20/276833758/278dfbd44011d2b872e8cccee205e65a_284697657432364604.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0152',
    name: '远坂凛',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/05/22/276833758/2c3bb88fbfccc2770359277d64b41d36_6746392531035671526.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0153',
    name: '爻光',
    url: 'https://act-upload.mihoyo.com/sr-wiki/2026/01/02/276833758/4289695278385bf69e230f069c4e0461_5399176605810919556.png?x-oss-process=image%2Fformat%2Cwebp',
    natures: ['立绘'],
    tags: ['崩坏：星穹铁道']
  },
  {
    id: '0154',
    name: '爱芮-形态2',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/02/26/82500917/63bed622699126eee666f1b599125e58_6336973556727794545.png?x-oss-process=image/format,webp',
    natures: ['立绘'],
    tags: ['绝区零']
  },
  {
    id: '0155',
    name: '琪亚娜·卡斯兰娜 空之律者',
    url: 'https://i0.hdslb.com/bfs/article/c39242c2040ab35af83cc2d14ef461db18d1b80d.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0156',
    name: '琪亚娜·卡斯兰娜 夏日泳装',
    url: 'https://gd-hbimg.huaban.com/020d3251b2a8aa14f70dd310e69af265c26a2107343d02-o5P3rZ',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0157',
    name: '琪亚娜·卡斯兰娜，雷电芽衣',
    url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F16abea917bed6d2ba5c45b92ab630c2f12f3acd1.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663220517&t=649e7ff00b3a693c6a6e05b407eb5c50',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0158',
    name: '雷电芽衣',
    url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2-chuzhan.qingwk.com%2Fimages%2Fresource%2F2020%2F04%2F14%2Fh80774528p0.jpg%3FimageView2%2F3%2Fq%2F100%2Finterlace%2F1%2Fw%2F1600%2Fh%2F1600&refer=http%3A%2F%2Fimg2-chuzhan.qingwk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1649851736&t=9114b16d6236632dc98004130ddf214a',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0159',
    name: '布朗尼',
    url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F6c2b3febb0df6952c115e50efa75bd83c504ed73.png&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665982047&t=133d5bdb939f70c574cd63ed708c1ddb',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0160',
    name: '布洛妮娅·扎伊切克 真理之律者',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/12/17/75216984/3040319b61369cd9ea0cca0728a52870_3292282305824140882.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0161',
    name: '布洛妮娅·扎伊切克 生日',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2021/11/10/77124895/6bd26f42fbe8ead877bdcbef002b805a_3357991177533394457.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0162',
    name: '多鸭鸭',
    url: 'https://gd-hbimg.huaban.com/84c55afb22204711d13d2929dfe9bc4892ef3a7c3478d1-hjI6PS',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三','崩坏：星穹铁道']
  },
  {
    id: '0163',
    name: '德丽莎·阿波卡利斯 生日',
    url: 'https://gd-hbimg.huaban.com/89a8effcccafdd5713ceafa53aae3e3febc2586f58ade2-7khpO0',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0164',
    name: '朔夜观星',
    url: 'https://i0.hdslb.com/bfs/archive/7ebe8418da05ff33050906edcc956fa03f806fd5.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0165',
    name: '朔夜观星 兰夜行歌',
    url: 'https://i0.hdslb.com/bfs/archive/0c1103b8d9653ded5c422e5ffeff1418316a9297.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0166',
    name: '德丽莎·阿波卡利斯 天命难逃',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/08/12/75216984/cec5875d5cb87a57eda885247119a98e_1683274862435943674.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0167',
    name: '符华 人为崩落',
    url: 'https://i2.hdslb.com/bfs/archive/160fbfbca72bd880b548b99560ca4ae74fea3697.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0168',
    name: '符华 云墨丹心',
    url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F63f301132fff273184cbdc7fcda7a1fa1d8f57ed.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661273987&t=57125c9bad0442f67c0f4afd36759a92',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0169',
    name: '符华',
    url: 'https://gd-hbimg.huaban.com/b7dc465d7d538073f14216e5eea2003389755ae17b969f-F4AusY',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0170',
    name: '识之律者 泳装',
    url: 'https://gd-hbimg.huaban.com/b7d5f51e8dcee5b7ae3fc386b3c4ad4d8f8fb7048c6d55-YVA43w',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0171',
    name: '李素裳 识之律者',
    url: 'https://pic.rmb.bdstatic.com/bjh/209ccb722ce85e2587b8edc674c9c3839201.jpeg@h_1280',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0172',
    name: '丽塔 窈窕谍影',
    url: 'https://i2.hdslb.com/bfs/archive/93d0f9b3cd36c29b22d8c129d10cc9dccd79ef32.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0173',
    name: '丽塔·洛丝薇瑟 缭乱星棘',
    url: 'https://pic.rmb.bdstatic.com/bjh/c9f48b1297231443463f1e0db3421e53.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0174',
    name: '丽塔·洛丝薇瑟 失落迷迭',
    url: 'https://i0.hdslb.com/bfs/archive/b3f3ee1deb1b823abd136e0b5ce011c36f1bcfc3.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0175',
    name: '雷电芽衣 镇×偃月叩晓',
    url: 'https://upload-bbs.miyoushe.com/upload/2026/02/03/171401465/24c90212aee6789a452e866a2b1fc004_3573466150101162257.webp?x-oss-process=image//resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0176',
    name: '琪亚娜·卡斯兰娜 新春贺图',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/01/26/75216984/e5d80131132973b1448fbac609caded5_9187620786462458702.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0177',
    name: '八重樱 生日贺图',
    url: 'https://upload-bbs.miyoushe.com/upload/2025/12/28/320927337/67c99b24946ec93989cd3b68386431a9_6560492543964694651.jpg?x-oss-process=image//resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0178',
    name: '八重樱 巫女',
    url: 'https://gd-hbimg.huaban.com/bd7fb39cbb234258d5e8179447858328633ebc353bdabe-Zyy7KP',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0179',
    name: '阿琳姐妹 科学怪人&鬼魂玛丽',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/24/50494840/309340fc2bf6a5bd33c218df8a0af791_3234259626592406538.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0180',
    name: '阿琳姐妹 逐梦双星',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/24/50494840/19d786573a3b4b42e228a37700b1b970_3396005431952961860.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0181',
    name: '希儿·芙乐艾 幻海梦蝶',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/24/50494840/a4808d9586a7aa09f53911864ffafe81_323864792583300574.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0182',
    name: '雷电芽衣 夜雨春澜',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/04/13/75216984/cd468f66bb8b0d559428d42334b0d361_1638234829845120376.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0183',
    name: '布洛妮娅·扎伊切克 次生银翼Q版',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/23/77124895/718b1c5b21359a19e20d8ef3c5c863f4_8704587116473719555.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0184',
    name: '布朗尼',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/24/50494840/c4ee42e05335c7b22da441f9b2c6a039_7841648679082509520.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0185',
    name: '丽塔·洛丝薇瑟 黯蔷薇',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/05/25/50494840/f879fc2f5e7d826bf89221cfcac07d67_3097490388034985413.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0186',
    name: '丽塔·洛丝薇瑟 幽兰黛尔',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/23/75216984/36ed3f49793c959c10112d9978390a55_3517455543418202299.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0187',
    name: '月下誓约·予爱以心',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/09/30/75216984/38f7bf650fdc5a831e956141b999b7c0_3875900278476422615.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0188',
    name: '德莉莎·阿波卡利斯 生日贺图',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2023/03/29/75216984/37b956cd70853ad0917b7358e3c41120_8516152658128126525.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0189',
    name: '德莉莎·阿波卡利斯 待春来时',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/28/75216984/45fbf7acdbe46cd3c675c69fbc48c2f6_2843226734594046733.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0190',
    name: '朔夜观星',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/23/75216984/18c57c937df18805dc20b0894bf803e3_6628881501389920137.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0191',
    name: '月下初拥',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/24/50494840/bd339e528134c7ff794433a4e3c3c8de_3553430119473893434.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0192',
    name: '无量塔·姬子 真红骑士·月蚀',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/24/50494840/32cbd522475f43a046f83016a8bdd829_4720175560821322271.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0193',
    name: '符华 生日贺图',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/03/03/75216984/58ac92ba185f93ece8a671a389c2410a_5774936671155407100.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0194',
    name: '符华 生日贺图',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2023/02/10/75216984/84d61b99a2f03fb4d319666ccda6ec10_2315201836956440405.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0195',
    name: '幽兰黛尔 天光驰彻',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/12/14/75216984/8dc2c2a4a8b1d45370d0d1e6cb91bc68_4880260285160895233.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0196',
    name: '幽兰黛尔 生日贺图',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2023/01/01/75216984/87a21afc28f455b4aae83772c469060a_3875778164852731286.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0197',
    name: '幽兰黛尔 尼伯龙根梦歌',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/10/06/75216984/17a275753fa01c1ac8034be8a2ee2486_3433886009370952153.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0198',
    name: '幽兰黛尔 十字星的约定',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/23/77124895/42f6a5e87fcc6d2ba41bcd53b345585f_6551823192692509933.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0199',
    name: '爱莉希雅 嗨♪爱愿妖精♥',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/09/26/50494840/688e538e400f66b0abfdcfaa84061656_2035245401418284595.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0200',
    name: '梅比乌斯 噬界之蛇',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/10/25/75216984/6a579e7e52f819d3a3407e1b2ee61978_1774155618637568012.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0201',
    name: '梅比乌斯 湛碧之女',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/07/23/75216984/114df5dcbce3b822cbfbd80abc2cdf57_2011442560763636610.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0202',
    name: '梅比乌斯 生日贺图',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/04/30/75216984/87710871876b5a8905509585fd924feb_1845627812223980176.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0203',
    name: '渡鸦 生日贺图',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/06/20/75216984/a8b54415a57e38e3dbc8afa47d9d3d74_3118622469246316259.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0204',
    name: '渡鸦 午夜马天尼',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/06/20/50494840/5d6bbcbe8caa9536b23bbd8dd2394163_88213556508918288.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0205',
    name: '卡萝尔·佩珀 生日贺图',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/09/23/75216984/1e9b548eddd007e3a0fb1988360116df_7300319782459651464.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0206',
    name: '卡萝尔·佩珀 咪啾特调',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/11/03/75216984/9bf86897b52737a7ad5d2cd8884d43f0_6172890514653177680.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0207',
    name: '帕朵菲利丝 帕朵的课堂',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/23/73514954/86eee28bb3cbf409c9c049b26087966c_8468249647549872367.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0208',
    name: '帕朵菲利丝 掠集之兽',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/03/23/73514954/10600321ea0499f89855b80e38faf41a_724530368834017905.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0209',
    name: '伊甸 生日贺图',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/10/31/75216984/4211162800b478dbd9c41f027d541b1a_6942480755882196329.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0210',
    name: '阿波尼亚 生日贺图',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/03/03/75216984/8b239535d1447977123faa8d4a331a79_3711724211147380507.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0211',
    name: '维尔薇 生日贺图',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/05/05/75216984/6dbecabda0b06a2bb447c07bf4839229_2722580619919224524.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0212',
    name: '维尔薇 愚戏之匣',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/07/17/75216984/8dea806f1c250a3c346400dacf701d7f_5637880818474598133.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0213',
    name: '格蕾修 夏梦如绘',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/08/25/75216984/b93b14af16daaaff1b3239d9197dc9a1_7575719239517508242.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0214',
    name: '格蕾修 绘星之卷',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/11/11/75216984/eceb97c8b9980f4dc42df1b0be7c671c_7534948743872819823.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0215',
    name: '李素裳 一客逍遥',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2025/03/30/75216984/9c2139c8a978e08a3a9b9d38d57f647f_7190247344984673511.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0216',
    name: '李素裳 生日贺图',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2023/04/03/75216984/be6c1ef347f574762089718d6cbb0331_1730896337375355011.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0217',
    name: '爱衣·休伯利安Λ 时帆旅人',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2022/11/14/75216984/e8b6fd88b31841ffbd27ebe1d44b2646_8664982411572816053.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0218',
    name: '琪亚娜·卡斯兰娜 爱衣·休伯利安Λ 普罗米亚联动',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/08/25/75216984/a869ce353bfb07a901c74c5fecb3dcdf_4927353605725003868.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0219',
    name: '苏莎娜 女武神·热砂',
    url: 'https://uploadstatic.mihoyo.com/bh3-wiki/2023/03/11/75216984/121fabad648d9b5fb57978a4b1a47b03_2969837608346700720.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0220',
    name: '米斯忒琳 普罗米修斯',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/04/23/75216984/8f8a76d7e4f65579c6cc93aac74d5776_1104897402804512492.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0221',
    name: '时雨绮罗 糖露星霜',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/06/02/75216984/2df144a9293df8f8d7c2437f17b7b009_3094283295652968010.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0222',
    name: '希娜狄雅 深空定锚·曙光',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/12/14/50494840/f1e3873823875a61d95c651f7f9069a3_8717990787859018790.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0223',
    name: '西琳 奇迹☆魔法少女',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2023/08/23/75216984/ac6e346e9e60ef4c47798901b0559eeb_5390892898930396024.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0224',
    name: '瑟莉姆 享乐狂宴·邀影',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/04/09/75216984/a540b596720fdee5690500bc33a4368b_2250665392384858577.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0225',
    name: '松雀 瞒天乐游·曙影',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/07/01/75216984/a8211d27926d4387390537805f3c11f8_139652423974257081.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0226',
    name: '松雀 瞒天乐游·曙影',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/07/01/75216984/0184ed0ba276fbc416b1469dfbb3aaba_8407125196275573194.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0227',
    name: '薇塔 孑遗千星',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/09/22/75216984/16de7766a642388d21e4c76cacfde801_5165224128247218265.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0228',
    name: '薇塔 度星之邀',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/09/12/75216984/fa9fc6e9532e4c56c9ad0e5e9548a06a_2258061419554533859.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  {
    id: '0229',
    name: '花火 诡戏千役「友情出演！」',
    url: 'https://act-upload.mihoyo.com/bh3-wiki/2024/11/01/75216984/413d9baf46083ef3ca801456019f7154_3317743326195224317.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏三']
  },
  { 
    id: '0230',
    name: '安比·德玛拉',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1744783082003.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0231',
    name: '安比·德玛拉 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/294465423/af8f2b802a4e7b6b1b9ecb1201f7f11c_6049355643711622422.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0232',
    name: '安比·德玛拉',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1744783065114.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0233',
    name: '苍角',
    url: 'https://gd-hbimg.huaban.com/86ef9c1b3366e8929db52bffb1a6ee75044c8db13c9e55-725b1h',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0234',
    name: '苍角 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/82500917/a10cfa8665c32ecb0d1cba9a1f00f2a7_2788275355775106233.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0235',
    name: '妮可·德玛拉',
    url: 'https://gd-hbimg.huaban.com/595524dcce278f81fb9a950126db54e94fbebc2215d3b7-uwD5oy',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0236',
    name: '妮可·德玛拉',
    url: 'https://gd-hbimg.huaban.com/480f7e822b64d33c7c04e1febd95a0be6ff5204d80cd75-Tit6BF',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0237',
    name: '妮可·德玛拉 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/15559334/215fb5090ba85e039ddd87fac2aae22d_8425932520024716177.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0238',
    name: '派派·韦尔 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/82500917/881dfce1cd686f5f5f3d3c7704efa763_915923293465944749.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0239',
    name: '露西亚娜·德·蒙特夫 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/34600917/8bc8a91d73acc33c2d3d3ec64f85430f_2342069972803550305.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0240',
    name: '波可娜·费雷尼 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/03/12/76099754/9a8bd2bf8bf5d3565e7954fe8807273e_1268317287413353361.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0241',
    name: '格莉丝·霍华德 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/222203892/8af1af9191d1cd30ff43e1e0174963f0_3794055921226975825.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0242',
    name: '珂蕾妲·贝洛伯格 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/222203892/2fbb331d2db73713acaf971bd8b80546_3554107707630856136.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0243',
    name: '亚历山德丽娜·莎芭丝缇安 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/02/141353238/0c2231d5cb3e7ac805aead9164581ae2_5975115841692770163.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0244',
    name: '「11号」',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/15559334/f07183a672beb4bea9b18238da9fef4f_4816231871974757908.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0245',
    name: '可琳·威克斯 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/294465423/fb1b196b18de8e830209a74296abeda9_1714378063647665753.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0246',
    name: '可琳·威克斯',
    url: 'https://gd-hbimg.huaban.com/19ab42cd797ad0a321ef051a348e4fc274d113282aa9b0-zhcCPI',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0247',
    name: '猫宫又奈 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/01/15559334/13a099a6bbe7ded8dbbce4b3c78f8e86_4318385003976319491.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0248',
    name: '艾莲·乔 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/03/4859366/a2b8afcbef8b57736457a633a3444076_4415096551351034473.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0249',
    name: '艾莲·乔',
    url: 'https://gd-hbimg.huaban.com/f4ca609a62a2473e302dd831833b24fd7bedb9e960e36f-Low5WD',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0250',
    name: '维多利亚家政',
    url: 'https://gd-hbimg.huaban.com/ae87f2b1f5f2824070dcc4392b2b46fe72e0d72311bf52-WuFf7A',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0251',
    name: '狡兔屋',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1744782913254.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0252',
    name: '狡兔屋',
    url: 'https://b0.bdstatic.com/ugc/f02T0Fi9IE-W_P0IOt6oswf75eea195f522daac47e668af94079c4.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0253',
    name: '白祇重工',
    url: 'https://img.71acg.net/sykb~bbs/default/20240329/1434102927681',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0254',
    name: '卡吕冬之子',
    url: 'https://i1.hdslb.com/bfs/archive/37a39991c0319d98b014738f63533889d0dbfa5f.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0255',
    name: '朱鸢 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/07/06/15559334/d80b3e28053a2ab49808910373abd2bf_6618978954799731201.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0256',
    name: '青衣 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/08/14/76099754/b97564ca9f720a03826357b782b5a66d_2494225873345280470.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0257',
    name: '刑侦特勤组',
    url: 'https://i1.hdslb.com/bfs/archive/654e3dc4d14df7d6981e1a914945a075f0278633.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0258',
    name: '简·杜 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/09/04/76099754/76ca0fce0dda779a5308c51734208d74_6732653271525274824.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0259',
    name: '凯撒·金 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/09/25/76099754/2ac01c1a75302b2d3183150b02f7d85f_5125940504683650339.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0260',
    name: '柏妮思·怀特 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/10/16/76099754/56071426862b50025a7f44ea23ce23c2_6173449843340604773.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0261',
    name: '月城柳 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2024/11/06/76099754/93171af7d069601a30c8129ebbfaff34_7755247229681328322.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0262',
    name: '对空六课',
    url: 'https://gd-hbimg.huaban.com/f1961af6da294e25b3418d553c892a054fe95c4d105ff4-FfSJdo',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0263',
    name: '月城柳',
    url: 'https://t14.baidu.com/it/u=3489442569,2641646999&fm=225&app=113&f=JPEG?w=3840&h=2160&s=92B43088864142EC523A67CA0300709E',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0264',
    name: '星见雅 影画',
    url: 'https://gd-hbimg.huaban.com/12b53145a99684adc3800b3a9d08e3ead2e2ee2a9d8576-PbRy8m',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0265',
    name: '耀嘉音 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/01/23/76099754/7cb647c6825fd1993655b1e761512ddc_9076315672894002177.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0266',
    name: '天琴座',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1744987982540.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0267',
    name: '伊芙琳·舒瓦利耶 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/02/12/76099754/c1d0c580daab58904f4a001e748bef5f_7545051182027015528.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0268',
    name: '零号·安比 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/03/12/76099754/a40bd3e7cc879eb969e8b01b590d3f2c_6850515742842836522.jpg?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0269',
    name: '「扳机」 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/04/02/76099754/cdcf8e92f26cf2f3e2f65a5767d8b535_8135397900960636679.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0270',
    name: '奥波勒斯小队',
    url: 'https://i1.hdslb.com/bfs/archive/9e4c80716ea07da46857d00da9c4bb5696c1b00c.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0271',
    name: '薇薇安·班希 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/04/23/76099754/44a0b002562b649bb686f35542bf33b0_100700600916513283.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0272',
    name: '仪玄 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/06/06/141353238/1749e54da2ecf9c909577b9ab3ed479d_717285368809051707.jpg?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0273',
    name: '仪玄',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1748955763093.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0274',
    name: '橘福福 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/06/25/233874762/0da9ab63efb890db13255e6635bd3cab_7349922063823232687.jpg?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0275',
    name: '橘福福',
    url: 'https://i0.hdslb.com/bfs/archive/9bc635263228b7554ed0267c7a75b3c4d7d43351.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0276',
    name: '云岿山',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1751274578928.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0277',
    name: '浮波柚叶 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/07/16/233874762/b2dc3752be513d4bbf2fc7e8814684b4_8434331713908070060.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0278',
    name: '浮波柚叶 爱丽丝·泰姆菲尔德',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1755697421638.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0279',
    name: '浮波柚叶 爱丽丝·泰姆菲尔德',
    url: 'https://gd-hbimg.huaban.com/f1577de23c1a20f8e7b2551e81473a7a0a47782c326ed0-19D3fO',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0280',
    name: '浮波柚叶 爱丽丝·泰姆菲尔德',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1755697433888.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0281',
    name: '怪啖屋',
    url: 'https://img2.huashi6.com/images/resource/thumbnail/2025/12/17/151459_69988548325.jpg?imageMogr2/quality/100/interlace/1/thumbnail/2000x%3E|watermark/2/text/6Kem56uZQOWFlOeOluS6jOS4gw/gravity/South/fill/I2ZmZmZmZg/fontsize/400/font/5b6u6L2v6ZuF6buR/dy/20',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0282',
    name: '「席德」 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/09/04/141353238/a91d1c8cc145c7da490fbdb4d41fb33d_8930642118752991202.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0283',
    name: '「席德」',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1757679222645.jpeg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0284',
    name: '卢西娅·艾洛温',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/10/15/76099754/eab509938dce31ee959078a856b3be57_2530606985717724390.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0285',
    name: '伊德海莉·墨菲',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/11/05/439466880/67f4287efb1e6bc76546072bc873e115_8517810047356138344.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0286',
    name: '琉音 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/11/26/76099754/813dec45c7967ef2c3524fc9843259e1_1194975861895640443.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0287',
    name: '坎卜斯黑枝',
    url: 'https://i1.hdslb.com/bfs/archive/60b3e5172ece9538f1525f1fca382498547a9ab6.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0288',
    name: '琉音',
    url: 'https://assets-hs-cdn.soutushenqi.com/ai_images/279da5bc-56dd-4986-95b5-f2059cd0fabe.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0289',
    name: '照 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/12/30/76099754/ab4c755b9275b4cf27a2878544a6f752_1972604269313426166.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0290',
    name: '叶瞬光 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/12/30/76099754/a914afa2048a485b8f070935aed65935_641180353289948044.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0291',
    name: '叶瞬光',
    url: 'https://i2.hdslb.com/bfs/archive/98accdb5e1ee7b475dc359dbc462f1225b8a4f46.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0292',
    name: '千夏 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/02/06/76099754/13666dd20b2da8f2721bef43c6fd2e2b_8488383116535685613.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0293',
    name: '妄想天使',
    url: 'https://i0.hdslb.com/bfs/archive/ef88aadeab61b501a5569cde9bdc150a5c58b52d.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0294',
    name: '妄想天使',
    url: 'https://i2.hdslb.com/bfs/archive/8c1d4a13237a0b1e1da8af156e68e2511cfb366b.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0295',
    name: '爱芮',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/03/04/15559334/cf4879bfe26a706cb1d1b4d0d42e91d5_2912038973003802971.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0296',
    name: '妄想天使',
    url: 'https://i1.hdslb.com/bfs/archive/f2f729fc092846c3b0f9a05c85aabe58638c0cbe.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0297',
    name: '南宫羽',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/03/24/76099754/3c295970f08564f14cc47f2a526f4c77_7082097647693198176.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0298',
    name: '妄想天使',
    url: 'https://i2.hdslb.com/bfs/archive/ccf63bd7cdf815aff2b61e7095ad23046a80313a.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0299',
    name: '希希芙 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/04/15/76099754/ac2b92f6d5b936c06d56aff5f3bfdb9d_2922335594929204113.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0300',
    name: '普罗米娅 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2026/05/06/322740211/d56804e4e435acb81bfb89da8c639d1d_2540812567820924423.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0301',
    name: '奥菲丝&「鬼火」 影画',
    url: 'https://act-upload.mihoyo.com/nap-obc-indep/2025/09/24/76099754/fd9886fc08cb2c1c49df38ff540e9740_8456236238066491113.png?x-oss-process=image/format,webp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0302',
    name: '奥菲丝&「鬼火」',
    url: 'https://i0.hdslb.com/bfs/archive/8def7be3b8a8d95b59eaac810340a1ae3b83d418.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','绝区零']
  },
  { 
    id: '0303',
    name: '三月七',
    url: 'https://gd-hbimg.huaban.com/dd41018a2bb0f88c03644bfc17ee214f3f42736ad323e9-2aTHQL',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0304',
    name: '三月七',
    url: 'https://c-ssl.duitang.com/uploads/blog/202408/05/EWSM54x3fVMVzdj.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0305',
    name: '列车组',
    url: 'https://gd-hbimg.huaban.com/3f97dfd22e9916347edd45b73d4433f321d7daea10a0de-4DTiAX',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0306',
    name: '列车组',
    url: 'https://gd-hbimg.huaban.com/392677a720f1658de3bdbf0f63ad97bd004c40b11252bb-hIROmk',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0307',
    name: '艾丝妲',
    url: 'https://c-ssl.duitang.com/uploads/blog/202309/14/YxSX3BAYUqyx1y7.jpeg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0308',
    name: '黑塔',
    url: 'https://gd-hbimg.huaban.com/a3f334b0197c70536e2ad35247305d7a380e8d624bff10-CKVczt',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0309',
    name: '大黑塔',
    url: 'https://c-ssl.duitang.com/uploads/blog/202503/08/n6SXgVaoF9oQzV5.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0310',
    name: '黑塔',
    url: 'https://c-ssl.duitang.com/uploads/blog/202305/04/20230504191806_d3821.jpeg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0311',
    name: '希露瓦',
    url: 'https://img-baofun.zhhainiao.com/pcwallpaper_ugc_mobile/static/53fedff123887fc8a197dfa1a2a3c151.jpg?x-oss-process=image%2fresize%2cm_lfit%2cw_3840%2ch_2160',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0312',
    name: '佩拉',
    url: 'https://gd-hbimg.huaban.com/b3611ec9c4482f3e309f5c688318cf71a236a8ba308633-IKc50R',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0313',
    name: '佩拉',
    url: 'https://gd-hbimg.huaban.com/bd0b525765fe495b9365ccc4b927b0a8df063c042be2dc-KS76ms',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0314',
    name: '青雀',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1754933349826.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0315',
    name: '停云',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1735208067428.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0316',
    name: '托帕',
    url: 'https://gd-hbimg.huaban.com/cf93cd1d8dd8196311f3b0270ad71e3748a71f64fe1cb-78P7Pg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0317',
    name: '流萤&知更鸟',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1741483506682.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0318',
    name: '知更鸟',
    url: 'https://i0.hdslb.com/bfs/article/d5aeae3990e9a37c5ef677815fda1e68286431045.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0319',
    name: '知更鸟',
    url: 'https://image-assets.soutushenqi.com/moment/1731034570118.jpeg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0320',
    name: '云璃',
    url: 'https://gd-hbimg.huaban.com/f0149eddcdbf6b24f4626817875d90463e9f6111a7a92d-QmTy8f',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0321',
    name: '黄泉',
    url: 'https://i1.hdslb.com/bfs/archive/57b77ba476167cd655555be5bd34d692377fb916.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0322',
    name: '黄泉',
    url: 'https://gd-hbimg.huaban.com/845e8703935cd75dde3e855f9367dc02b2adc0d3c4b7fc-QzHXqY',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0323',
    name: '银狼',
    url: 'https://i1.hdslb.com/bfs/archive/deddf3adad2b57cee6e6a9db5ddbb189559eb759.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0324',
    name: '赛飞儿',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1755339224422.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0325',
    name: '昔涟',
    url: 'https://gd-hbimg.huabanimg.com/a900e252c0264e8c2bc16b1f90aff6e3231525b8a378bd-iWT8Hp',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0326',
    name: '昔涟',
    url: 'https://gd-hbimg.huaban.com/87c6f52e440e8f198197431692429968c41c8069bbdfae-KYZBek',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0327',
    name: '长夜月',
    url: 'https://gd-hbimg.huaban.com/6be01678868ea348c6565815b09833b8c42468c67662ba-woCs1U',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0328',
    name: '花火',
    url: 'https://gd-hbimg.huaban.com/cbdd07e453519408aa0f0d0382ecca630ed8101d595edb-qzqVzI',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0329',
    name: '长夜月',
    url: 'https://assets-hs-cdn.soutushenqi.com/ai_images/d85997cb-cc13-4bec-9cb9-3ed6bd1de059.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0330',
    name: '流萤&遐蝶',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1748677436724.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0331',
    name: '遐蝶',
    url: 'https://image-assets.soutushenqi.com/UserUploadWallpaper_upload/1737391090173.png',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0332',
    name: '飞霄',
    url: 'https://gd-hbimg.huaban.com/bdbd6f5f331ddd0af2b999a4da35c481012a567f64d102-DnUi8i',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0333',
    name: '爻光',
    url: 'https://i1.hdslb.com/bfs/archive/78e8a097a2158c3efb26fa6010f5aabd5544364d.jpg',
    natures: ['电脑壁纸'],
    tags: ['人物','游戏','崩坏：星穹铁道']
  },
  { 
    id: '0334',
    name: '波奇酱',
    url: 'https://video-assets.soutushenqi.com/live_wp/83c6ec0a.mp4',
    natures: ['电脑壁纸'],
    tags: ['人物','动漫','动态']
  },
  { 
    id: '0335',
    name: '星见雅',
    url: 'https://video-assets.soutushenqi.com/live_wp/a20a6041.mp4',
    natures: ['电脑壁纸'],
    tags: ['游戏','人物','绝区零','动态']
  },
  { 
    id: '0336',
    name: '罗小黑',
    url: 'https://video-assets.soutushenqi.com/live_wp/9ff62e3b.mp4',
    natures: ['电脑壁纸'],
    tags: ['动漫', '动态']
  },
  { 
    id: '0337',
    name: '绘梨衣',
    url: 'https://video-assets.soutushenqi.com/live_wp/4c93f9a7.mp4',
    natures: ['电脑壁纸'],
    tags: ['动态', '动漫', '人物']
  },
  { 
    id: '0338',
    name: '芙莉莲',
    url: 'https://video-assets.soutushenqi.com/live_wp/c0aa5cbe.mp4',
    natures: ['电脑壁纸'],
    tags: ['动态', '动漫', '人物']
  },
  { 
    id: '0339',
    name: '米塔',
    url: 'https://video-assets.soutushenqi.com/live_wp/2362d93a.mp4',
    natures: ['电脑壁纸'],
    tags: ['动态', '游戏', '人物']
  }
];

const PICTURE_TAG_NONE = '暂无';
const PICTURE_BATCH_SIZE = 30;
const PICTURE_THUMB_WIDTH = 400;

const pictureFilterState = {
  nature: PICTURE_NATURES[0],
  tag: PICTURE_TAG_NONE
};

const pictureScrollState = {
  pictures: [],
  renderedCount: 0,
  loading: false
};

let pictureScrollObserver = null;

function isPictureVideo(picture) {
  return /\.mp4(\?|$)/i.test(String(picture && picture.url));
}

function applyOssThumbProcess(url, width) {
  const process = 'image/format,webp/resize,w_' + width + '/quality,q_80';
  const qIndex = url.indexOf('?');
  if (qIndex === -1) return url + '?x-oss-process=' + process;
  const path = url.slice(0, qIndex);
  const query = url.slice(qIndex + 1);
  if (/x-oss-process=/i.test(query)) {
    return path + '?' + query.replace(/x-oss-process=[^&]*/i, 'x-oss-process=' + process);
  }
  return url + '&x-oss-process=' + process;
}

function getPictureThumbUrl(url) {
  const raw = String(url || '').trim();
  if (!raw || /\.mp4(\?|$)/i.test(raw)) return raw;

  if (/\.(mihoyo|miyoushe)\.com/i.test(raw)) {
    return applyOssThumbProcess(raw, PICTURE_THUMB_WIDTH);
  }

  if (/hdslb\.com\/bfs\//i.test(raw)) {
    const base = raw.split('@')[0];
    return base + '@' + PICTURE_THUMB_WIDTH + 'w.webp';
  }

  if (/img-baofun\.zhhainiao\.com/i.test(raw) && /x-oss-process/i.test(raw)) {
    return raw.replace(/w_\d+/i, 'w_' + PICTURE_THUMB_WIDTH);
  }

  if (/huashi6\.com/i.test(raw) && /thumbnail/i.test(raw)) {
    return raw;
  }

  return raw;
}

function getPictureNatures(picture) {
  if (!picture || !Array.isArray(picture.natures)) return [];
  return picture.natures.map((item) => String(item).trim()).filter(Boolean);
}

function getPictureTags(picture) {
  if (!picture || !Array.isArray(picture.tags)) return [];
  return picture.tags.map((item) => String(item).trim()).filter(Boolean);
}

function getPictureName(picture) {
  const name = picture && picture.name;
  if (!name || String(name).trim() === '' || name === '暂无') return '暂无';
  return String(name).trim();
}

function comparePictureLabel(a, b) {
  return String(a).localeCompare(String(b), 'zh-CN');
}

function getPicturesByNature(nature) {
  return PICTURES.filter((picture) => getPictureNatures(picture).includes(nature));
}

function getValidPictures(list) {
  return list.filter((picture) => String(picture.url || '').trim());
}

function countPicturesByNature(nature) {
  return getValidPictures(getPicturesByNature(nature)).length;
}

function countPicturesByTag(nature, tag) {
  const pool = getValidPictures(getPicturesByNature(nature));
  if (tag === PICTURE_TAG_NONE) return pool.length;
  return pool.filter((picture) => getPictureTags(picture).includes(tag)).length;
}

function getSecondaryTagsForNature(nature) {
  return getSortedSecondaryTags(getValidPictures(getPicturesByNature(nature)));
}

function getDefaultTagForNature(nature) {
  const tags = getSecondaryTagsForNature(nature);
  return tags.length ? tags[0] : PICTURE_TAG_NONE;
}

function normalizePictureTag(nature, tag) {
  const tags = getSecondaryTagsForNature(nature);
  if (!tags.length) return PICTURE_TAG_NONE;
  if (tag === PICTURE_TAG_NONE || !tags.includes(tag)) return tags[0];
  return tag;
}

function getTagCounts(pictures) {
  const counts = new Map();
  pictures.forEach((picture) => {
    getPictureTags(picture).forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    });
  });
  return counts;
}

function getSortedSecondaryTags(pictures) {
  const counts = getTagCounts(pictures);
  return [...counts.keys()].sort((a, b) => {
    const countDiff = (counts.get(b) || 0) - (counts.get(a) || 0);
    if (countDiff !== 0) return countDiff;
    return comparePictureLabel(a, b);
  });
}

function getSortedPictures(list) {
  return [...list].sort((a, b) => AppCommon.compareByName(getPictureName(a), getPictureName(b)));
}

function getFilteredPictures() {
  const pool = getValidPictures(getPicturesByNature(pictureFilterState.nature));
  const filtered = pictureFilterState.tag === PICTURE_TAG_NONE
    ? pool
    : pool.filter((picture) => getPictureTags(picture).includes(pictureFilterState.tag));
  return getSortedPictures(filtered);
}

function createPictureFilterButton(label, count, isActive, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'picture-filter-btn ui-interactive' + (isActive ? ' is-active' : '');
  button.textContent = label + ' (' + count + ')';
  button.addEventListener('click', onClick);
  return button;
}

function renderPicturePrimaryFilters(container) {
  container.innerHTML = '';
  PICTURE_NATURES.forEach((nature) => {
    container.appendChild(createPictureFilterButton(
      nature,
      countPicturesByNature(nature),
      pictureFilterState.nature === nature,
      () => {
        if (pictureFilterState.nature === nature) return;
        pictureFilterState.nature = nature;
        pictureFilterState.tag = getDefaultTagForNature(nature);
        refreshPictureModule();
      }
    ));
  });
}

function renderPictureSecondaryFilters(container) {
  container.hidden = false;
  container.innerHTML = '';

  const tags = getSecondaryTagsForNature(pictureFilterState.nature);
  pictureFilterState.tag = normalizePictureTag(pictureFilterState.nature, pictureFilterState.tag);
  const options = tags.length ? tags : [PICTURE_TAG_NONE];

  options.forEach((tag) => {
    container.appendChild(createPictureFilterButton(
      tag,
      countPicturesByTag(pictureFilterState.nature, tag),
      pictureFilterState.tag === tag,
      () => {
        if (pictureFilterState.tag === tag) return;
        pictureFilterState.tag = tag;
        renderPictureSecondaryFilters(container);
        refreshPictureGrid();
      }
    ));
  });
}

function openPicturePreview(picture) {
  AppCommon.openMediaPreview(picture.url, isPictureVideo(picture));
}

function createPictureItem(picture) {
  const item = document.createElement('article');
  item.className = 'picture-item';
  const pictureName = getPictureName(picture);

  const frame = document.createElement('button');
  frame.type = 'button';
  frame.className = 'picture-item-frame ui-interactive';
  frame.setAttribute('aria-label', '查看图片：' + pictureName);

  if (isPictureVideo(picture)) {
    const badge = document.createElement('span');
    badge.className = 'picture-item-video-badge';
    badge.textContent = '▶';
    badge.setAttribute('aria-hidden', 'true');
    frame.appendChild(badge);
  } else {
    const img = document.createElement('img');
    img.className = 'picture-item-media';
    img.src = getPictureThumbUrl(picture.url);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    frame.appendChild(img);
  }

  frame.addEventListener('click', () => openPicturePreview(picture));

  const nameEl = document.createElement('p');
  nameEl.className = 'picture-item-name';
  nameEl.textContent = pictureName;
  nameEl.title = pictureName;

  item.appendChild(frame);
  item.appendChild(nameEl);
  return item;
}

function getPictureColumnCount(container) {
  const value = getComputedStyle(container).getPropertyValue('--picture-cols').trim();
  const count = parseInt(value, 10);
  return Number.isFinite(count) && count > 0 ? count : 5;
}

function appendItemsToMasonry(container, newItems) {
  const columns = [...container.querySelectorAll('.picture-grid-column')];
  if (!columns.length) return;
  const colCount = columns.length;
  const startIndex = container._masonryItems.length - newItems.length;
  newItems.forEach((item, i) => {
    bindPictureMasonryMedia(item, container);
    const target = pickMasonryColumn(columns, startIndex + i, colCount, false);
    columns[target].appendChild(item);
  });
}

function positionPictureSentinel(container) {
  if (!container._pictureSentinel) return;
  container.appendChild(container._pictureSentinel);
  if (pictureScrollObserver) pictureScrollObserver.observe(container._pictureSentinel);
}

function appendMorePictureBatch(container) {
  const pictures = pictureScrollState.pictures;
  if (pictureScrollState.loading || pictureScrollState.renderedCount >= pictures.length) return;

  pictureScrollState.loading = true;
  const start = pictureScrollState.renderedCount;
  const end = Math.min(start + PICTURE_BATCH_SIZE, pictures.length);
  const batch = pictures.slice(start, end);
  const newItems = batch.map((picture) => createPictureItem(picture));

  if (!container._masonryItems.length) {
    container._masonryItems = newItems;
    newItems.forEach((item) => bindPictureMasonryMedia(item, container));
    layoutPictureMasonry(container, newItems, true);
  } else {
    container._masonryItems.push(...newItems);
    appendItemsToMasonry(container, newItems);
  }

  pictureScrollState.renderedCount = end;
  pictureScrollState.loading = false;
  positionPictureSentinel(container);
  queuePictureMasonryRelayout(container);
}

function bindPictureInfiniteScroll(container) {
  if (container.dataset.infiniteScrollBound) return;
  container.dataset.infiniteScrollBound = 'true';
  container._pictureUserScrolled = false;

  const sentinel = document.createElement('div');
  sentinel.className = 'picture-load-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  container._pictureSentinel = sentinel;

  function maybeLoadMore() {
    if (!container._pictureUserScrolled) return;
    appendMorePictureBatch(container);
  }

  container.addEventListener('scroll', () => {
    container._pictureUserScrolled = true;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 240) {
      maybeLoadMore();
    }
  }, { passive: true });

  if (typeof IntersectionObserver !== 'undefined') {
    pictureScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) maybeLoadMore();
      });
    }, { root: container, rootMargin: '240px' });
  }
}

function resetPictureScrollObserver() {
  if (pictureScrollObserver) {
    pictureScrollObserver.disconnect();
    pictureScrollObserver = null;
  }
}

function pickMasonryColumn(columns, index, colCount, balanced) {
  if (balanced) return index % colCount;
  const maxHeight = Math.max(...columns.map((col) => col.offsetHeight));
  if (maxHeight <= 0) return index % colCount;
  let target = 0;
  for (let i = 1; i < columns.length; i++) {
    if (columns[i].offsetHeight < columns[target].offsetHeight) target = i;
  }
  return target;
}

function layoutPictureMasonry(container, items, balanced) {
  const colCount = getPictureColumnCount(container);
  container.innerHTML = '';

  const columns = Array.from({ length: colCount }, () => {
    const col = document.createElement('div');
    col.className = 'picture-grid-column';
    container.appendChild(col);
    return col;
  });

  items.forEach((item, index) => {
    columns[pickMasonryColumn(columns, index, colCount, balanced)].appendChild(item);
  });
  positionPictureSentinel(container);
}

let pictureMasonryFrame = null;
function schedulePictureMasonry(container, balanced) {
  if (!container || !container._masonryItems || !container._masonryItems.length) return;
  if (pictureMasonryFrame) cancelAnimationFrame(pictureMasonryFrame);
  pictureMasonryFrame = requestAnimationFrame(() => {
    pictureMasonryFrame = requestAnimationFrame(() => {
      pictureMasonryFrame = null;
      if (!container._masonryItems || !container._masonryItems.length) return;
      layoutPictureMasonry(container, container._masonryItems, !!balanced);
    });
  });
}

function queuePictureMasonryRelayout(container) {
  if (!container) return;
  if (container._masonryRelayoutQueued) return;
  container._masonryRelayoutQueued = true;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container._masonryRelayoutQueued = false;
      schedulePictureMasonry(container, false);
    });
  });
}

function bindPictureMasonryMedia(item, container) {
  const media = item.querySelector('.picture-item-media');
  if (!media) return;
  const relayout = () => queuePictureMasonryRelayout(container);
  if (media.tagName === 'IMG') {
    if (media.complete) relayout();
    else media.addEventListener('load', relayout, { once: true });
    media.addEventListener('error', relayout, { once: true });
  } else {
    media.addEventListener('loadeddata', relayout, { once: true });
    media.addEventListener('loadedmetadata', relayout, { once: true });
    media.addEventListener('error', relayout, { once: true });
  }
}

function renderPictureGrid(container) {
  const pictures = getFilteredPictures();
  resetPictureScrollObserver();
  container.innerHTML = '';
  container._masonryItems = [];
  container._pictureSentinel = null;
  container._pictureUserScrolled = false;
  pictureScrollState.pictures = pictures;
  pictureScrollState.renderedCount = 0;
  pictureScrollState.loading = false;

  if (!pictures.length) {
    container.innerHTML = '<p class="picture-empty">暂无图片</p>';
    return;
  }

  bindPictureInfiniteScroll(container);
  appendMorePictureBatch(container);
}

function refreshPictureGrid() {
  const gridEl = document.getElementById('picture-grid');
  if (gridEl) renderPictureGrid(gridEl);
}

function refreshPictureModule() {
  const primaryEl = document.getElementById('picture-filter-primary');
  const secondaryEl = document.getElementById('picture-filter-secondary');
  const gridEl = document.getElementById('picture-grid');
  if (primaryEl) renderPicturePrimaryFilters(primaryEl);
  if (secondaryEl) renderPictureSecondaryFilters(secondaryEl);
  if (gridEl) renderPictureGrid(gridEl);
}

function initPictureMasonryObservers(gridEl) {
  if (!gridEl || gridEl.dataset.masonryObserversBound) return;
  gridEl.dataset.masonryObserversBound = 'true';

  const relayout = () => queuePictureMasonryRelayout(gridEl);
  window.addEventListener('resize', relayout);

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(relayout).observe(gridEl);
  }

  document.querySelectorAll('.nav-btn[data-section="images"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      requestAnimationFrame(() => queuePictureMasonryRelayout(gridEl));
    });
  });
}

function initPictureModule() {
  const gridEl = document.getElementById('picture-grid');
  initPictureMasonryObservers(gridEl);

  pictureFilterState.nature = PICTURE_NATURES[0];
  pictureFilterState.tag = getDefaultTagForNature(pictureFilterState.nature);
  refreshPictureModule();
}

AppCommon.registerLazySection('images', initPictureModule);
