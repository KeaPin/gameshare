/**
 * 游戏服务
 * 提供游戏相关的业务逻辑和数据处理
 */

import { getCachedResourceById } from '../utils/cache';
import { ResourceModel } from '../models/ResourceModel';
import { ResourceDetail, Resource } from '../../types/database';

/**
 * 游戏数据转换接口
 * 将数据库的Resource类型转换为前端使用的GameData类型
 */
export interface GameData {
  id: string | number;
  title: string;
  name?: string;
  rating?: number;
  image: string;
  thumbnail?: string;
  images?: string[];
  tags: string[];
  description?: string;
  detail?: string;
  downloadLinks?: DownloadLink[];
  developer?: string;
  publisher?: string;
  platforms?: string;
  version?: string;
  size?: string;
  language?: string;
  releaseDate?: string;
  officialLink?: string;
}

export interface DownloadLink {
  platform: string;
  url: string;
  password?: string;
}

export interface GameDetailData {
  game: GameData;
  detailedData: {
    systemRequirements: {
      minimum: Record<string, string>;
      recommended: Record<string, string>;
    };
    installationGuide: string[];
  };
  reviews: ReviewData[];
  relatedGames: GameData[];
  resourceDetail?: any; // 完整的资源数据
}

export interface ReviewData {
  id: string;
  username: string;
  rating: number;
  date: string;
  device: string;
  content: string;
  helpful: number;
}

/**
 * 将数据库Resource转换为前端GameData
 */
function convertResourceToGameData(resource: Resource | ResourceDetail): GameData {
  // 解析标签
  let tags: string[] = [];
  if (resource.tags) {
    try {
      tags = resource.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } catch (e) {
      tags = [];
    }
  }

  // 解析图片
  let images: string[] = [];
  if ('galleries_parsed' in resource && resource.galleries_parsed) {
    images = resource.galleries_parsed;
  } else if (resource.galleries) {
    try {
      images = JSON.parse(resource.galleries);
    } catch (e) {
      images = [];
    }
  }

  // 转换下载链接
  let downloadLinks: DownloadLink[] = [];
  if ('downloadLinks' in resource && resource.downloadLinks) {
    downloadLinks = resource.downloadLinks.map(link => ({
      platform: link.platform,
      url: link.url,
      password: link.password
    }));
  }

  return {
    id: resource.id,
    title: resource.name,
    name: resource.name,
    rating: resource.rating || 0,
    image: resource.thumbnail || '/default.webp',
    thumbnail: resource.thumbnail,
    images: images.length > 0 ? images : [resource.thumbnail || '/default.webp'],
    tags,
    description: resource.description,
    detail: resource.detail,
    downloadLinks,
    developer: resource.developer,
    publisher: resource.publisher,
    platforms: resource.platforms,
    version: resource.version,
    size: resource.size,
    language: resource.language,
    releaseDate: resource.release_date,
    officialLink: resource.official_link
  };
}

/**
 * 生成模拟的系统要求数据
 */
function generateSystemRequirements(game: GameData) {
  return {
    minimum: {
      '操作系统': 'Windows 10 64位',
      '处理器': 'Intel Core i5-4430 / AMD FX-6300',
      '内存': '8 GB RAM',
      '显卡': 'NVIDIA GeForce GTX 960 / AMD Radeon R9 280',
      'DirectX': '版本 11',
      '存储空间': game.size || '50 GB 可用空间',
      '声卡': '兼容 DirectX 的声卡'
    },
    recommended: {
      '操作系统': 'Windows 11 64位',
      '处理器': 'Intel Core i7-8700K / AMD Ryzen 5 3600',
      '内存': '16 GB RAM',
      '显卡': 'NVIDIA GeForce RTX 3070 / AMD Radeon RX 6700 XT',
      'DirectX': '版本 12',
      '存储空间': game.size || '50 GB 可用空间 (SSD推荐)',
      '声卡': '兼容 DirectX 的声卡'
    }
  };
}

/**
 * 生成模拟的安装指南
 */
function generateInstallationGuide(): string[] {
  return [
    '1. 下载游戏安装包到本地',
    '2. 解压缩下载的文件到指定目录',
    '3. 运行 setup.exe 开始安装',
    '4. 按照安装向导完成游戏安装',
    '5. 安装完成后，运行游戏启动器',
    '6. 首次运行可能需要下载额外的游戏资源',
    '7. 享受游戏！'
  ];
}

/**
 * 生成模拟的评价数据
 */
function generateMockReviews(gameId: string): ReviewData[] {
  const mockReviews: ReviewData[] = [
    {
      id: `${gameId}_review_1`,
      username: '游戏达人小王',
      rating: 5,
      date: '2024-01-15',
      device: 'PC',
      content: '这款游戏真的太棒了！画面精美，玩法丰富，强烈推荐给所有玩家。剧情引人入胜，角色设计也很有特色。',
      helpful: 23
    },
    {
      id: `${gameId}_review_2`,
      username: 'RPG爱好者',
      rating: 4,
      date: '2024-01-10',
      device: 'Steam Deck',
      content: '整体体验不错，但是有些地方还需要优化。希望开发商能够继续更新改进。',
      helpful: 15
    },
    {
      id: `${gameId}_review_3`,
      username: '休闲玩家',
      rating: 5,
      date: '2024-01-08',
      device: 'PC',
      content: '非常适合休闲时间游玩，操作简单易上手，画面也很不错。值得购买！',
      helpful: 8
    }
  ];

  return mockReviews;
}

/**
 * 根据游戏ID获取游戏详情（优化版本，避免重复查询）
 */
export async function getGameDetail(gameId: string): Promise<GameDetailData | null> {
  try {
    // 使用缓存版本一次性从数据库获取完整的游戏详情数据
    const resourceDetail = await getCachedResourceById(gameId);

    if (!resourceDetail) {
      return null;
    }

    // 转换为前端数据格式
    const game = convertResourceToGameData(resourceDetail);

    // 并行获取相关数据和增加浏览次数
    const [relatedResourcesResult] = await Promise.all([
      ResourceModel.getResources({
        limit: 6,
        sort: 'rating',
        order: 'desc'
      }),
      // 异步增加浏览次数，不阻塞响应
      ResourceModel.incrementViewCount(gameId).catch(err => console.warn('Failed to increment view count:', err))
    ]);

    // 生成详细数据
    const detailedData = {
      systemRequirements: generateSystemRequirements(game),
      installationGuide: generateInstallationGuide()
    };

    // 生成模拟评价数据
    const reviews = generateMockReviews(gameId);

    // 过滤相关游戏（排除当前游戏）
    const relatedGames = relatedResourcesResult.data
      .filter(resource => resource.id !== gameId)
      .slice(0, 4)
      .map(convertResourceToGameData);

    return {
      game,
      detailedData,
      reviews,
      relatedGames,
      // 返回完整的资源数据供游戏详情页使用
      resourceDetail
    };
  } catch (error) {
    console.error('获取游戏详情失败:', error);
    return null;
  }
}

/**
 * 获取热门游戏列表
 */
export async function getHotGames(limit: number = 6): Promise<GameData[]> {
  try {
    const hotResources = await ResourceModel.getHotResources(limit);
    return hotResources.map(convertResourceToGameData);
  } catch (error) {
    console.error('获取热门游戏失败:', error);
    return [];
  }
}

/**
 * 获取精选游戏列表
 */
export async function getFeaturedGames(limit: number = 8): Promise<GameData[]> {
  try {
    const featuredResources = await ResourceModel.getFeaturedResources(limit);
    return featuredResources.map(convertResourceToGameData);
  } catch (error) {
    console.error('获取精选游戏失败:', error);
    return [];
  }
}

/**
 * 获取最新游戏列表
 */
export async function getNewGames(limit: number = 6): Promise<GameData[]> {
  try {
    const newResources = await ResourceModel.getNewResources(limit);
    return newResources.map(convertResourceToGameData);
  } catch (error) {
    console.error('获取最新游戏失败:', error);
    return [];
  }
}

/**
 * 搜索游戏
 */
export async function searchGames(keyword: string, page: number = 1, limit: number = 12): Promise<{
  games: GameData[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const result = await ResourceModel.searchResources(keyword, { page, limit });
    return {
      games: result.data.map(convertResourceToGameData),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  } catch (error) {
    console.error('搜索游戏失败:', error);
    return {
      games: [],
      total: 0,
      page: 1,
      totalPages: 0
    };
  }
}