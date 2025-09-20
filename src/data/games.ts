import { GameData } from '@/components/GameCard';

export const featuredGames: GameData[] = [
  {
    id: 1,
    title: '大侠立志传外传',
    rating: 9.4,
    image: '/default.webp',
    tags: ['模拟', '角色扮演', '冒险'],
    description: '正式上线，TapTap专属折扣开启中！国产原始题材生存沙盒游戏，从零开始壮大氏族'
  },
  {
    id: 2,
    title: '灵魂面甲',
    rating: 7.8,
    image: '/default.webp',
    tags: ['模拟', '大型多人在线', '冒险'],
    description: '广州灵犀互动娱乐有限公司出品，原始题材生存沙盒游戏'
  },
  {
    id: 3,
    title: '崩坏：因缘精灵',
    rating: 8.4,
    image: '/default.webp',
    tags: ['冒险', '宠物', '自走棋'],
    description: '全新宠物养成系统，体验自走棋的乐趣与策略'
  },
  {
    id: 4,
    title: '洛克王国：世界',
    rating: 7.5,
    image: '/default.webp',
    tags: ['抓宠', '回合制', '养成'],
    description: '经典宠物抓捕与回合制战斗，体验精彩的养成乐趣'
  },
  {
    id: 5,
    title: '超自然行动组',
    rating: 7.0,
    image: '/default.webp',
    tags: ['合作', '密室', '盗墓'],
    description: '团队合作解谜，探索神秘密室与古代遗迹'
  },
  {
    id: 6,
    title: '终极角逐',
    rating: null,
    image: '/default.webp',
    tags: ['高画质', '竞技', '多人联机'],
    description: '高画质竞技对抗，支持多人在线实时对战'
  },
  {
    id: 7,
    title: '星际争霸重制版',
    rating: 9.1,
    image: '/default.webp',
    tags: ['策略', 'RTS', '经典'],
    description: '经典RTS游戏重制，全新画面呈现经典策略对战'
  },
  {
    id: 8,
    title: '赛博朋克2088',
    rating: 8.7,
    image: '/default.webp',
    tags: ['RPG', '开放世界', '冒险'],
    description: '未来科技与人性的碰撞，探索开放世界的赛博朋克之旅'
  }
];

export const categories = [
  { name: '全部', id: 'all' },
  { name: 'RPG', id: 'rpg' },
  { name: '策略', id: 'strategy' },
  { name: '射击', id: 'fps' },
  { name: '冒险', id: 'adventure' },
  { name: '模拟', id: 'simulation' },
  { name: '竞技', id: 'competitive' },
  { name: '休闲', id: 'casual' }
];

// 首页排行榜示例数据（各取 6 条）
export const rankingHotDownloads: GameData[] = [
  {
    id: 101,
    title: '超自然行动组',
    rating: 7.0,
    image: '/default.webp',
    tags: ['合作', '密室', '盗墓'],
    description: '团队合作解谜，探索神秘密室与古代遗迹'
  },
  {
    id: 102,
    title: '心动小镇',
    rating: 8.0,
    image: '/default.webp',
    tags: ['模拟经营', '多人联机', '治愈'],
    description: '温馨小镇经营与多人生涯体验'
  },
  {
    id: 103,
    title: '火炬之光：无限',
    rating: 7.6,
    image: '/default.webp',
    tags: ['暗黑', 'ARPG', '刷宝'],
    description: '爽快刷宝与职业流派的搭配乐趣'
  },
  {
    id: 104,
    title: '无限暖暖',
    rating: 8.2,
    image: '/default.webp',
    tags: ['开放世界', '换装', '多人联机'],
    description: '开放大世界与极致服装收集体验'
  },
  {
    id: 105,
    title: '不朽密言',
    rating: 7.9,
    image: '/default.webp',
    tags: ['策略', '养成', '放置'],
    description: '策略放置与养成玩法的融合'
  },
  {
    id: 106,
    title: '三角洲行动',
    rating: 7.3,
    image: '/default.webp',
    tags: ['射击', '战争', '任务'],
    description: '小队协作战术射击体验'
  }
];

export const rankingTopRated: GameData[] = [
  {
    id: 201,
    title: '纸房子',
    rating: 9.6,
    image: '/default.webp',
    tags: ['模拟', '角色扮演', '休闲'],
    description: '风格独特的叙事体验'
  },
  {
    id: 202,
    title: '传说之下',
    rating: 9.5,
    image: '/default.webp',
    tags: ['角色扮演'],
    description: '选择与结局紧密关联的名作'
  },
  {
    id: 203,
    title: '星露谷物语',
    rating: 9.3,
    image: '/default.webp',
    tags: ['模拟', '角色扮演'],
    description: '经典像素风农场生活'
  },
  {
    id: 204,
    title: '恶魔守护者',
    rating: 9.0,
    image: '/default.webp',
    tags: ['像素', '战棋', '回合制'],
    description: '策略与像素风格的结合'
  },
  {
    id: 205,
    title: '不存在的你，和我',
    rating: 8.9,
    image: '/default.webp',
    tags: ['角色扮演', '冒险'],
    description: '别具一格的剧情冒险'
  },
  {
    id: 206,
    title: '苏丹的游戏',
    rating: 8.8,
    image: '/default.webp',
    tags: ['模拟', '角色扮演', '策略'],
    description: '中世纪权术与经营'
  }
];

export const rankingBetaHot: GameData[] = [
  {
    id: 301,
    title: '洛克王国：世界',
    rating: 7.5,
    image: '/default.webp',
    tags: ['抓宠', '回合制', '养成'],
    description: '经典宠物抓捕与回合制战斗'
  },
  {
    id: 302,
    title: '五星好市民',
    rating: 7.8,
    image: '/default.webp',
    tags: ['多人联机', '开放世界', '角色扮演'],
    description: '都市开放世界多人互动'
  },
  {
    id: 303,
    title: '鸽亿分钟',
    rating: 8.0,
    image: '/default.webp',
    tags: ['模拟', '休闲'],
    description: '轻松治愈的放置玩法'
  },
  {
    id: 304,
    title: '疾风燃烬',
    rating: 7.4,
    image: '/default.webp',
    tags: ['MMORPG', '多人联机', '冒险'],
    description: '快节奏动作冒险'
  },
  {
    id: 305,
    title: '霓虹人生',
    rating: 7.2,
    image: '/default.webp',
    tags: ['策略', '高自由度', '3D'],
    description: '赛博都市的人生模拟'
  },
  {
    id: 306,
    title: '虫虫生态箱（测试版）',
    rating: 7.0,
    image: '/default.webp',
    tags: ['养成', '放置', '休闲'],
    description: '小小昆虫的生态观察'
  }
];
