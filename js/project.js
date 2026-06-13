const PROJECTS = [
  {
    id: '0001',
    shortName: '3D绘图系统',
    icon: 'files/project/3D绘图系统/3D绘图系统.jpg',
    fullName: '基于OpenGL开发的3D绘图系统及机器人模型展示',
    intro: '使用C++开发，OpenGL作为框架制作的3D绘图系统，支持在场景中搭建基础模型，提供了一个机器人模型以及几个动作展示',
    link: 'files/project/3D绘图系统/3D绘图系统/CG2022.exe',
    techStack: [
      { icon: 'files/project/3D绘图系统/VS 2022.png', name: 'VS 2022' },
      { icon: 'files/project/3D绘图系统/OpenGL.png', name: 'OpenGL' },
      { icon: 'files/project/3D绘图系统/C++.png', name: 'C++' },
      { icon: 'files/project/3D绘图系统/MFC.jpg', name: 'MFC' }
    ],
    details: '    最初是计算机图形学的课程设计，使用Visual Studio 2022作为开发工具，C++作为基础语言进行开发的一个MFC应用程序，使用了OpenGL的相关库，程序允许用户通过代码生成一些基本的3D模型节点如方块、柱体和球体等并设置它们的坐标，通过场景树管理这些节点之间的继承关系，通过这些模型之间的位置和继承关系等最终构建出一个简易的机器人模型，并通过绑定移动、旋转等事件为机器人添加了一些简单的动作，让机器人的每一个关节都可以设置单独旋转演示。\n    程序允许用户设置模型材质，并内置了塑料材质（反光少，颜色暗）和金属材质（反光多，颜色亮）的两种材质，并且设置有各种光照效果的切换，允许用户设置光照类型（点光源，聚光灯，平行光，视点头灯等），并且可以设置它们的各种参数，更加便于观察。\n    在学习了软件设计模式课程之后，对该程序进行了优化和改进。使用了多种设计模式对代码进行优化，如工厂模式、单例模式、观察者模式等，是程序代码更加易读和易维护；允许用户直接在程序界面上添加各种节点并设置它们的各种属性和绑定关系，允许用户直接对场景树进行编辑，并且可以直接对3D场景中的节点进行选中、移动、旋转和删除等操作，更加方便快捷，利好非专业用户；在场景中添加了一些搭建好的场景物品，如花瓶、底座、桌子等，让场景不单调，更加美观；为机器人添加了一些简单的动作模组，如打招呼（把手举起然后循环左右挥动）、走路（全身协调摆动）、跑步（比走路幅度更大，频率更高）、跳舞（复杂动作，包含了多个多动作逻辑）。',
    images: [
      'files/project/3D绘图系统/1.jpg',
      'files/project/3D绘图系统/2.jpg',
      'files/project/3D绘图系统/3.gif',
      'files/project/3D绘图系统/4.gif'
    ]
  },
  {
    id: '0002',
    shortName: '记事本',
    icon: 'files/project/ZZZ的记事本/ZZZ的记事本.png',
    fullName: '基于HTML5+开发的移动端黑白风格记事本应用',
    intro: '使用HBuilderX开发并打包部署到手机上的个人记事本APP，集成日程、账本、收藏与便签四大模块，采用黑白视觉风格',
    link: 'files/project/ZZZ的记事本/ZZZ的记事本/ZZZ的记事本1.2.2.apk',
    techStack: [
      { icon: 'files/project/ZZZ的记事本/HBuilderX.png', name: 'HBuilderX' },
      { icon: 'files/project/ZZZ的记事本/CSS.png', name: 'CSS' },
      { icon: 'files/project/ZZZ的记事本/HTML5.png', name: 'HTML5+' },
      { icon: 'files/project/ZZZ的记事本/JavaScript.png', name: 'JavaScript' }
    ],
    details: '    一款使用HBuilderX开发、通过HTML5+ Runtime打包部署到Android与iOS手机上的移动端记事本应用。项目采用HTML、CSS与原生JavaScript构建多页面结构，整体界面为黑白高对比风格，并带有统一的卡片阴影、点击反色与墨水溅射动效，兼顾移动端触控操作习惯。\n    应用底部导航划分为日程、账本、收藏、便签四个模块。日程模块支持按年、月、日层级分组展示，也可切换为列表模式；每条日程可设置日期、标题、概览与详细内容，支持置顶、标记完成、搜索筛选、批量选择与删除，编辑时还可插入多张图片并预览、保存到相册。账本模块用于记录日常收支，支持选择收入或支出类型，填写金额、对象、原因与日期，并可附加图片凭证，列表按时间与置顶状态展示。收藏模块以收藏夹形式组织内容，每个收藏夹可设置封面、名称与描述，并在其下管理多个收藏条目；支持对收藏夹或条目进行隐藏，隐藏内容需通过隐私密码验证后查看。便签模块用于快速记录标题与正文，支持置顶、按名称/创建时间/修改时间排序，以及搜索、批量删除与简约模式切换。\n    各模块均提供搜索与删除模式、长按进入批量操作、自定义确认弹窗与Toast提示等通用交互。设置页支持对日程、账本、收藏、便签数据进行分别或全部导入、导出与清空，导出与清空操作需输入隐私密码；同时可修改隐私密码，用于保护隐藏收藏与敏感数据操作。',
    images: [
      'files/project/ZZZ的记事本/1.jpg',
      'files/project/ZZZ的记事本/2.jpg'
    ]
  },
  {
    id: '0003',
    shortName: '智汇出行系统',
    icon: 'files/project/智汇出行系统/智汇出行系统.jpg',
    fullName: '基于Axure开发的手机出行购票APP原型',
    intro: '使用Axure RP制作的手机APP高保真原型，模拟完整购票软件体验，覆盖登录注册、选站购票、订单管理与个人中心，并扩展景点推荐、酒店预订等出行服务',
    link: 'files/project/智汇出行系统/智汇出行/login.html',
    techStack: [
      { icon: 'files/project/智汇出行系统/Axure.png', name: 'Axure RP' }
    ],
    details: '    这是一款使用Axure RP设计并导出的移动端出行购票APP原型，界面按350×700手机尺寸布局，包含状态栏、底部导航与多页面跳转逻辑，用于模拟真实购票类应用的操作流程与视觉呈现。原型通过Axure导出的HTML页面发布，内置jQuery与Axure交互脚本，支持点击跳转、面板切换、中继器与全局变量联动等交互效果，便于在浏览器中直接演示。\n    账号模块提供登录、注册、找回密码与用户协议页面，构成应用入口。主界面采用“购票、订单、个人”三栏底部导航：购票页包含广告位、站点搜索与快捷功能入口；用户可选择出发地与目的地，查询车次并进入预订、结果确认等流程，完成从选站到下单的原型演示。快捷功能中集成了车次查询、车站大屏、景点推荐与全部功能入口。\n    “全部功能”进一步扩展了出行场景，除基础购票外，还包含景点推荐、餐饮特产、酒店预订（含选酒店与预约时间）、旅游门票及我的门票等页面，体现从购票出行到目的地消费的服务链路。订单模块区分待支付、待出行、已完成与其他订单等状态，展示不同阶段的票面信息与站点数据。\n    个人中心涵盖账户信息、设置、通知、字体、关于，以及更多服务：常用乘客、消息、身份核验、客服、退票、保险、敬老版、临时身份证、人脸/指纹验证、失物招领、建议反馈等；FAQ中还补充了票种说明、使用指南、身份核验规则、保险条款与常见问题等说明页。整体原型侧重界面结构与交互流程展示，不涉及真实后端与支付逻辑，适合用于产品方案演示与用户体验验证。',
    images: [
      'files/project/智汇出行系统/1.jpg',
      'files/project/智汇出行系统/2.jpg',
      'files/project/智汇出行系统/3.jpg',
      'files/project/智汇出行系统/4.jpg'
    ]
  },
  {
    id: '0004',
    shortName: '考试管理',
    icon: 'files/project/考试计划管理/考试计划管理.jpg',
    fullName: '基于Spring Boot + Vue开发的考试计划管理系统',
    intro: '前后端分离的全栈Web应用，覆盖管理员、教师与学生三类角色，实现课程管理、考试计划制订与发布、成绩录入与申诉、通知答疑及系统维护等完整业务流程',
    link: '暂无',
    techStack: [
      { icon: 'files/project/考试计划管理/CSS.png', name: 'CSS' },
      { icon: 'files/project/考试计划管理/Element plus.png', name: 'Element Plus' },
      { icon: 'files/project/考试计划管理/IDEA.jpg', name: 'IDEA' },
      { icon: 'files/project/考试计划管理/JAVA.png', name: 'Java' },
      { icon: 'files/project/考试计划管理/Spring Boot.png', name: 'Spring Boot' },
      { icon: 'files/project/考试计划管理/VS Code.png', name: 'VS Code' },
      { icon: 'files/project/考试计划管理/Vue.png', name: 'Vue' },
      { icon: 'files/project/考试计划管理/MySQL.png', name: 'MySQL' }
    ],
    details: '    一款前后端分离的考试计划管理系统。后端使用IntelliJ IDEA开发，基于Spring Boot与Java 17构建REST API，通过MyBatis访问MySQL数据库；前端使用VS Code开发，采用Vue3、Vite、Vue Router、Pinia与Element Plus搭建单页应用，Axios负责与后端通信。系统按用户类型划分管理员、教师、学生三种角色，登录后进入各自控制台，路由守卫会校验身份权限，并在维护模式下强制非管理员用户退出。\n    管理员控制台包含系统用户、课程信息、考试管理与系统设置四个模块。系统用户模块用于维护账号信息；课程信息模块支持课程的增删改查与代码校验；考试管理模块汇总各科目考试状态，可按未安排、已安排、已考试筛选查看；系统设置模块展示系统名称与版本，支持开启维护模式、查看与清除系统日志。\n    教师端提供制订考试计划、上传成绩、发布通知、在线答疑与个人信息五个功能。制订考试计划时可设置考试时间、地点与状态流转；上传成绩支持批量导入；发布通知面向学生推送考试与教学信息；在线答疑模块可查看并回复学生咨询；个人信息页用于维护基本资料。\n    学生端涵盖课程报名、考试计划、考试成绩、服务中心与个人信息。课程报名模块按未报名、已报名、已通过等状态筛选并提交报名申请；考试计划页展示各科目安排进度；考试成绩页支持按状态筛选，并可对成绩发起申诉或修改申诉理由；服务中心集成学习资料、信息通知、在线答疑等功能，便于学生获取学习支持与教务信息。',
    images: [
      'files/project/考试计划管理/1.jpg',
      'files/project/考试计划管理/2.jpg',
      'files/project/考试计划管理/3.jpg',
      'files/project/考试计划管理/4.jpg',
      'files/project/考试计划管理/5.jpg',
      'files/project/考试计划管理/6.jpg'
    ]
  },
  {
    id: '0005',
    shortName: '装箱系统',
    icon: 'files/project/装箱系统/装箱系统.png',
    fullName: '基于大语言模型的板状物品分层装箱优化算法研究',
    intro: '毕业设计项目，前后端分离的板状物品三维分层装箱系统，集成多种启发式优化算法与DeepSeek大语言模型，支持订单智能解析、约束分析与Three.js三维可视化回放',
    link: '暂无',
    techStack: [
      { icon: 'files/project/装箱系统/CSS.png', name: 'CSS' },
      { icon: 'files/project/装箱系统/DeepSeek.png', name: 'DeepSeek' },
      { icon: 'files/project/装箱系统/Element plus.png', name: 'Element Plus' },
      { icon: 'files/project/装箱系统/IDEA.jpg', name: 'IDEA' },
      { icon: 'files/project/装箱系统/JAVA.png', name: 'Java' },
      { icon: 'files/project/装箱系统/MySQL.png', name: 'MySQL' },
      { icon: 'files/project/装箱系统/Spring Boot.png', name: 'Spring Boot' },
      { icon: 'files/project/装箱系统/Three.js.jpg', name: 'Three.js' },
      { icon: 'files/project/装箱系统/VS Code.png', name: 'VS Code' },
      { icon: 'files/project/装箱系统/Vue.png', name: 'Vue' }
    ],
    details: '    一款面向板状物品的三维分层装箱优化系统。后端使用IntelliJ IDEA开发，基于Spring Boot与Java 17提供REST API，MyBatis持久化MySQL中的物品、容器、方案及装箱明细数据；前端使用VS Code开发，采用Vue 3、Vite、Pinia、Element Plus与Axios构建单页应用。主界面左侧管理物品列表、容器列表与方案列表，选中方案后在右侧工作区展开详情，形成「数据管理+方案求解+三维展示」的一体化工作流。\n    系统支持维护物品与容器模板（名称、长宽高、库存数量），并可创建装箱方案：手动勾选参与装箱的物品与容器及各自用量，或通过DeepSeek大语言模型解析订单文本或上传文件，自动抽取板件与容器尺寸、数量及特殊需求并生成方案。方案列表展示装载率、平均填充率、平均支撑率与状态（未开始/容器不足/物品不足），便于对比不同求解结果。\n    装箱求解提供三种算法：常规算法（分层放置、填充率择优）、填充率优先算法（多容器顺序搜索与装配回放）以及序贯锚位紧凑退火算法（含模拟退火与序贯编码）。生成过程通过SSE流式推送阶段日志与温度等中间状态；前端基于Three.js渲染容器与板件三维场景，支持过程回放、正交/透视观察、辅助观察、按层切换、选中物品坐标与支撑率展示，以及全屏模式。\n    大语言模型还用于特殊需求分析与方案优化：用户可为方案添加自然语言约束，LLM结合当前装箱明细JSON评估是否违规，并输出约束说明、推荐算法及是否需重新生成；解析结果可转化为算法可消费的底层禁忌等约束。方案支持导出压缩包，可选方案六视图、方案信息表、装箱明细，便于存档与线下复核。',
    images: [
      'files/project/装箱系统/1.jpg',
      'files/project/装箱系统/2.jpg',
      'files/project/装箱系统/3.jpg',
      'files/project/装箱系统/4.jpg'
    ]
  },
  {
    id: '0006',
    shortName: '音乐播放器',
    icon: 'files/project/视频播放器/视频播放器.png',
    fullName: '基于HTML5和Canvas开发的本地视频分类播放器',
    intro: '本地媒体播放器，通过文件夹导入管理视频库，支持分类检索、频谱可视化，并为部分曲目配置专属面板特效与进度条样式',
    link: 'files/project/视频播放器/视频播放器/index.html',
    techStack: [
      { icon: 'files/project/视频播放器/CSS.png', name: 'CSS' },
      { icon: 'files/project/视频播放器/HTML5.png', name: 'HTML5' },
      { icon: 'files/project/视频播放器/VS Code.png', name: 'VS Code' }, 
      { icon: 'files/project/视频播放器/JavaScript.png', name: 'JavaScript' }
    ],
    details: '    纯网页本地视频分类播放器，使用HTML、CSS与原生JavaScript构建，选择本地文件夹并扫描其中的视频、封面与歌词文件。程序会读取目录内或子目录中的video.json元数据，自动关联同名封面与歌词，将媒体条目整理为可检索、可筛选的视频库；元数据变更可导出为video.json 以便下次导入时保留分类、作者、歌手、喜爱等级与主题色等设置。\n    界面分为视频信息、播放区与视频列表三栏。顶部工具栏提供搜索，以及按分类、作者、歌手、喜爱等级四类筛选；信息面板展示封面、名称与标签，支持编辑模式修改元数据。\n    播放区基于HTML5 Video实现，提供基本控制控件。音频流接入Web Audio API，在Canvas上绘制频谱。项目内置曲目特效注册表，按歌名关键词匹配30余首曲目的专属效果：面板层Canvas/DOM动画、自定义进度条滑块贴图、左右分屏主题，以及封面折角星标提示等。',
    images: [
      'files/project/视频播放器/1.jpg',
      'files/project/视频播放器/2.jpg',
      'files/project/视频播放器/3.jpg'
    ]
  },
  {
    id: '0007',
    shortName: '车牌识别系统',
    icon: 'files/project/车牌识别/车牌识别.png',
    fullName: '基于YOLOv5的中国车牌识别系统',
    intro: '使用Python与PyTorch开发的中国车牌检测与识别程序，含Tkinter图形界面，支持单层/双层车牌识别、多候选识别与图像增强，可处理模糊、遮挡、光照不足等极端场景',
    link: '暂无',
    techStack: [
      { icon: 'files/project/车牌识别/Python.png', name: 'Python' },
      { icon: 'files/project/车牌识别/VS Code.png', name: 'VS Code' },
      { icon: 'files/project/车牌识别/PyTorch.png', name: 'PyTorch' }
    ],
    details: '    人工智能课程设计，一款面向中国各类车牌的检测与识别系统，基于Python与PyTorch 实现。检测阶段采用改进的YOLOv5模型，在车牌框基础上回归四个角点关键点，经透视变换裁剪出校正后的车牌小图，并区分单层与双层车牌；双层车牌通过上下分割拼接后再送入识别网络。识别阶段使用CRNN结构的myNet_ocr模型，字符集覆盖各省简称、字母数字及学警港澳挂使领民航等特殊字符，可选输出车牌颜色（黑/蓝/绿/白/黄）。训练数据来自CCPD、CRPD及自采样本，图形界面由Tkinter构建，三栏布局包含控制面板、图像预览与设置/结果区。支持选择单张图片、文件夹批量识别或视频逐帧处理；启动时自动加载检测与识别权重，识别结果在图像上绘制框与文字，并写入右侧日志。批量模式可浏览每张结果，并提供总览缩略图视图；识别结果可保存。',
    images: [
      'files/project/车牌识别/1.jpg',
      'files/project/车牌识别/2.jpg',
      'files/project/车牌识别/3.jpg'
    ]
  }
];

function getSortedProjects() {
  return [...PROJECTS].sort((a, b) => AppCommon.compareByName(a.shortName, b.shortName, 'zh-CN'));
}

function getSortedTechStack(techStack) {
  return [...techStack].sort((a, b) => {
    const nameA = typeof a === 'string' ? a : a.name;
    const nameB = typeof b === 'string' ? b : b.name;
    return AppCommon.compareByName(nameA, nameB, 'zh-CN');
  });
}

function bindGalleryPreview(container) {
  container.querySelectorAll('.gallery-img').forEach((img) => {
    img.addEventListener('click', () => AppCommon.openImagePreview(img.src));
  });
}

function renderProjectList(container, projects, activeId, onSelect) {
  container.innerHTML = '';

  projects.forEach(project => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'project-item ui-interactive' + (project.id === activeId ? ' active' : '');
    item.dataset.id = project.id;

    item.innerHTML =
      '<div class="project-item-icon">' +
        '<img src="' + project.icon + '" alt="' + project.shortName + '">' +
        '<span class="project-item-current">当前</span>' +
      '</div>' +
      '<span class="project-item-name">' + project.shortName + '</span>';

    item.addEventListener('click', () => onSelect(project.id));
    container.appendChild(item);
  });
}

function renderProjectDetail(container, project) {
  if (!project) {
    container.innerHTML = '<p class="project-empty">暂无项目</p>';
    return;
  }

  const linkHtml = project.link === '暂无' || !project.link
    ? '暂无'
    : '<a class="project-link-url" href="' + project.link + '" target="_blank" rel="noopener">' + project.link + '</a>';

  const techHtml = getSortedTechStack(project.techStack).map(item => {
    const src = typeof item === 'string' ? item : item.icon;
    const name = typeof item === 'string' ? '' : item.name;
    return (
      '<div class="tech-item">' +
        '<div class="tech-item-icon">' +
          '<img src="' + src + '" alt="' + name + '">' +
        '</div>' +
        (name ? '<span class="tech-item-name">' + name + '</span>' : '') +
      '</div>'
    );
  }).join('');

  const imagesHtml = project.images.map(src =>
    '<img class="gallery-img ui-interactive" src="' + src + '" alt="" role="button" tabindex="0">'
  ).join('');

  container.innerHTML =
    '<div class="project-header">' +
      '<div class="project-detail-icon">' +
        '<img src="' + project.icon + '" alt="' + project.shortName + '">' +
      '</div>' +
      '<div class="project-header-info">' +
        '<h3 class="project-full-name">' + project.fullName + '</h3>' +
        '<p class="project-intro">简介：' + project.intro + '</p>' +
        '<p class="project-link">链接：' + linkHtml + '</p>' +
      '</div>' +
    '</div>' +
    '<div class="project-boxes">' +
      '<div class="project-box project-box-tech">' +
        '<p class="project-box-label">技术栈：</p>' +
        '<div class="project-box-content project-box-scroll-y">' +
          '<div class="tech-stack-list">' + techHtml + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="project-box project-box-details">' +
        '<p class="project-box-label">详细信息：</p>' +
        '<div class="project-box-content project-box-scroll-y">' +
          '<p class="project-details-text">' + project.details + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="project-box project-box-gallery">' +
        '<p class="project-box-label">图片展示：</p>' +
        '<div class="project-box-content project-box-scroll-y">' +
          '<div class="gallery-list">' + imagesHtml + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  bindGalleryPreview(container);
}

function initProjects() {
  const listEl = document.getElementById('project-list');
  const detailEl = document.getElementById('project-detail');
  if (!listEl || !detailEl || !PROJECTS.length) return;

  AppCommon.initImagePreview();
  const sortedProjects = getSortedProjects();
  let activeId = sortedProjects[0].id;

  function selectProject(id) {
    activeId = id;
    const project = sortedProjects.find(p => p.id === id);
    renderProjectList(listEl, sortedProjects, activeId, selectProject);
    renderProjectDetail(detailEl, project);
  }

  selectProject(activeId);
}

AppCommon.onDomReady(initProjects);
