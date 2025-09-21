"use client";

import { useState } from 'react';
import GameCard from '@/components/GameCard';
import { featuredGames, categories } from '@/data/games';

export default function GamesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredGames = featuredGames.filter(game => {
    if (selectedCategory === 'all') return true;
    return game.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
  });

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
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">游戏列表</h1>
          <p className="text-gray-400">发现你喜欢的游戏</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCategory(category.id);
                  }
                }}
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
              <option value="newest">最新</option>
              <option value="rating">评分</option>
              <option value="name">名称</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-gray-400 text-sm">
          共找到 {sortedGames.length} 款游戏
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
            <div className="text-gray-500 text-lg mb-2">没有找到相关游戏</div>
            <div
              onClick={() => setSelectedCategory('all')}
              className="text-blue-500 hover:text-blue-400 active:text-blue-600 cursor-pointer select-none touch-manipulation inline-block transition-colors duration-200"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCategory('all');
                }
              }}
            >
              查看全部游戏
            </div>
          </div>
        )}
      </div>
    </div>
  );
}