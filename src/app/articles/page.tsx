"use client";

import { useState } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { guides } from '@/data/guides';

// 文章分类
const categories = [
  { id: 'all', name: '全部' },
  { id: '游戏攻略', name: '游戏攻略' },
  { id: '策略攻略', name: '策略攻略' },
  { id: '剧情攻略', name: '剧情攻略' },
  { id: '养成攻略', name: '养成攻略' },
  { id: '竞技攻略', name: '竞技攻略' },
  { id: '解谜攻略', name: '解谜攻略' },
  { id: '生存攻略', name: '生存攻略' }
];

export default function ArticlesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // 过滤文章
  const filteredGuides = guides.filter(guide => {
    if (selectedCategory === 'all') return true;
    return guide.category === selectedCategory;
  });

  // 排序文章
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime();
    }
  });

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1400px] mx-auto">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            首页
          </Link>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">游戏攻略</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">游戏攻略</h1>
          <p className="text-gray-400">最新最全的游戏攻略文章，助你轻松通关</p>
        </div>

        {/* 筛选和排序 */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none touch-manipulation ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600 active:scale-95'
                }`}
              >
                {category.name}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="newest">最新发布</option>
              <option value="views">阅读量</option>
              <option value="title">标题</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-gray-400 text-sm">
          共找到 {sortedGuides.length} 篇文章
        </div>

        {/* 文章列表 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
          {sortedGuides.map((guide, idx) => (
            <div 
              key={guide.id} 
              className="fade-in" 
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <ArticleCard guide={guide} />
            </div>
          ))}
        </div>

        {sortedGuides.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">该分类下暂无文章</div>
            <div className="text-gray-400 text-sm mb-4">
              更多精彩内容正在准备中，敬请期待...
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-blue-500 hover:text-blue-600 active:text-blue-600 cursor-pointer select-none touch-manipulation inline-block transition-colors duration-200"
            >
              查看全部文章
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
