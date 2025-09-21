"use client";

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import GameCard from '@/components/GameCard';
import { featuredGames, categories } from '@/data/games';

interface GamesCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// 定义分类映射关系
const categoryMapping: Record<string, string[]> = {
  'android': ['模拟', '角色扮演', '冒险', '休闲', '射击'],
  'pc': ['策略', 'RTS', 'RPG', '开放世界', 'FPS'],
  'retro': ['经典', '像素', '回合制', '战棋'],
  'switch': ['多人联机', '合作', '竞技'],
  'simulator': ['模拟', '模拟经营', '养成', '放置']
};

// 分类显示名称
const categoryNames: Record<string, string> = {
  'android': '安卓游戏',
  'pc': 'PC游戏',
  'retro': '怀旧游戏',
  'switch': 'Swift游戏',
  'simulator': '游戏模拟器'
};

export default function GamesCategoryPage({ params }: GamesCategoryPageProps) {
  const resolvedParams = use(params);
  const category = resolvedParams.category;
  const [sortBy, setSortBy] = useState('newest');

  // 检查分类是否有效
  if (!categoryMapping[category]) {
    notFound();
  }

  const categoryTags = categoryMapping[category];
  const categoryName = categoryNames[category];

  // 根据分类过滤游戏
  const filteredGames = featuredGames.filter(game => {
    return game.tags.some(tag => 
      categoryTags.some(catTag => 
        tag.toLowerCase().includes(catTag.toLowerCase()) ||
        catTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  });

  // 排序游戏
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
          <a href="/" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            首页
          </a>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">{categoryName}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{categoryName}</h1>
          <p className="text-gray-400">发现 {categoryName.replace('游戏', '')} 平台的精品游戏</p>
        </div>

        {/* 筛选和排序 */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryNames).map(([key, name]) => (
              <a
                key={key}
                href={`/games/${key}`}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none touch-manipulation ${
                  category === key
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600 active:scale-95'
                }`}
              >
                {name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="newest">最新</option>
              <option value="rating">评分</option>
              <option value="name">名称</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-gray-400 text-sm">
          共找到 {sortedGames.length} 款 {categoryName}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {sortedGames.map((game, idx) => (
            <div 
              key={game.id} 
              className="fade-in" 
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>

        {sortedGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">暂无 {categoryName}</div>
            <div className="text-gray-400 text-sm mb-4">
              该分类下的游戏正在收录中，敬请期待...
            </div>
            <a
              href="/games/android"
              className="text-blue-500 hover:text-blue-600 active:text-blue-600 cursor-pointer select-none touch-manipulation inline-block transition-colors duration-200"
            >
              查看安卓游戏
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
