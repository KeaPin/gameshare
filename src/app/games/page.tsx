"use client";

import { useState } from 'react';
import Link from 'next/link';
import GameCard from '@/components/GameCard';
import { featuredGames, categories } from '@/data/games';

// 定义分类映射关系，与 /games/[category] 保持一致
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

export default function GamesPage() {
  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            首页
          </Link>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">游戏分类</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">游戏分类</h1>
          <p className="text-gray-400">选择你喜欢的游戏平台和类型</p>
        </div>

        {/* 主要游戏分类 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(categoryNames).map(([key, name]) => {
            const tags = categoryMapping[key];
            const categoryGames = featuredGames.filter(game =>
              game.tags.some(tag => 
                tags.some(catTag => 
                  tag.toLowerCase().includes(catTag.toLowerCase()) ||
                  catTag.toLowerCase().includes(tag.toLowerCase())
                )
              )
            );
            
            return (
              <Link
                key={key}
                href={`/games/${key}`}
                className="group bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#222] transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors">
                      {name}
                    </h3>
                    <p className="text-gray-400 text-sm">{categoryGames.length} 款游戏</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-full">
                      +{tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="text-blue-400 text-sm group-hover:text-blue-300 transition-colors">
                  浏览 {name} →
                </div>
              </Link>
            );
          })}
        </div>

        {/* 热门游戏预览 */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">热门游戏</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredGames.slice(0, 8).map((game, idx) => (
              <div 
                key={game.id} 
                className="fade-in" 
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/games/android"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            查看所有游戏
          </Link>
        </div>
      </div>
    </div>
  );
}