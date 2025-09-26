/**
 * React Cache 缓存工具
 * 使用 React 18+ 的 cache 功能来避免重复请求
 */

import { cache } from 'react';
import { ResourceModel } from '../models/ResourceModel';
import { CategoryModel } from '../models/CategoryModel';
import { ArticleModel } from '../models/ArticleModel';

// 缓存热门游戏
export const getCachedHotGames = cache(async (limit: number = 6) => {
  return ResourceModel.getHotResources(limit);
});

// 缓存精选游戏
export const getCachedFeaturedGames = cache(async (limit: number = 8) => {
  return ResourceModel.getFeaturedResources(limit);
});

// 缓存最新游戏
export const getCachedNewGames = cache(async (limit: number = 6) => {
  return ResourceModel.getNewResources(limit);
});

// 缓存顶级分类
export const getCachedTopLevelCategories = cache(async (type?: string) => {
  return CategoryModel.getTopLevelCategories(type);
});

// 缓存分类树
export const getCachedCategoryTree = cache(async (type?: string) => {
  return CategoryModel.getCategoryTree(type);
});

// 缓存按分类别名获取资源
export const getCachedResourcesByCategoryAlias = cache(async (alias: string, limit: number = 8) => {
  return ResourceModel.getResourcesByCategoryAliasOrderedByWeight(alias, limit);
});

// 缓存按分类ID获取资源
export const getCachedResourcesByCategoryIds = cache(async (categoryIds: string[], params: any = {}) => {
  return ResourceModel.getResourcesByCategoryIds(categoryIds, params);
});

// 缓存精选文章
export const getCachedFeaturedArticles = cache(async (limit: number = 6) => {
  return ArticleModel.getFeaturedArticles(limit);
});

// 缓存热门文章
export const getCachedPopularArticles = cache(async (limit: number = 6) => {
  return ArticleModel.getPopularArticles(limit);
});

/**
 * 内存缓存类
 * 用于短期缓存频繁访问的数据
 */
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // 默认5分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // 清理过期缓存
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// 定期清理过期缓存
if (typeof window === 'undefined') { // 只在服务端运行
  setInterval(() => {
    memoryCache.cleanup();
  }, 10 * 60 * 1000); // 每10分钟清理一次
}

/**
 * 带缓存的获取资源详情
 */
export const getCachedResourceById = cache(async (id: string) => {
  return ResourceModel.getResourceById(id);
});

/**
 * 带缓存的获取文章详情
 */
export const getCachedArticleById = cache(async (id: string) => {
  return ArticleModel.getArticleById(id);
});

/**
 * 创建缓存包装函数
 */
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttl: number = 5 * 60 * 1000
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args);

    // 先从内存缓存获取
    const cached = memoryCache.get(key);
    if (cached !== null) {
      return cached;
    }

    // 执行原函数
    const result = await fn(...args);

    // 存入缓存
    memoryCache.set(key, result, ttl);

    return result;
  };
}