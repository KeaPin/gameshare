"use client";

import { useState } from 'react';
import GameCard from '@/components/GameCard';
import Link from 'next/link';
import { Resource, Category } from '@/types/database';
import { useRouter } from 'next/navigation';

interface GamesCategoryClientProps {
  category: string;
  categoryNames: Record<string, string>;
  subCategories: Category[];  // 新增子分类数据
  selectedSubcategory?: string; // 当前选中的子分类
  filteredGames: Resource[];
  totalCount?: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export default function GamesCategoryClient({
  category,
  categoryNames,
  subCategories,
  selectedSubcategory,
  filteredGames,
  totalCount,
  currentPage,
  totalPages,
  pageSize
}: GamesCategoryClientProps) {
  const [sortBy, setSortBy] = useState('newest');
  const router = useRouter();

  // 处理子分类选择变化
  const handleSubcategoryChange = (selectedValue: string) => {
    if (selectedValue === 'all') {
      router.push(`/games/${category}`);
    } else {
      router.push(`/games/${category}?subcategory=${selectedValue}`);
    }
  };

  // 处理主分类选择变化
  const handleCategoryChange = (selectedValue: string) => {
    router.push(`/games/${selectedValue}`);
  };

  // 排序游戏
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'download':
        return b.download_count - a.download_count;
      case 'view':
        return b.view_count - a.view_count;
      case 'newest':
      default:
        return new Date(b.created_time).getTime() - new Date(a.created_time).getTime();
    }
  });

  return (
    <div>
      {/* 筛选和排序 */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          {/* 如果有子分类，显示子分类下拉选择；否则显示父分类下拉选择 */}
          {subCategories.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">子分类:</span>
              <select
                value={selectedSubcategory || 'all'}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-blue-500 focus:outline-none min-w-[120px]"
              >
                <option value="all">全部</option>
                {subCategories.map((subcategory) => (
                  <option
                    key={subcategory.id}
                    value={subcategory.alias || subcategory.id}
                  >
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">分类:</span>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-blue-500 focus:outline-none min-w-[120px]"
              >
                {Object.entries(categoryNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">排序:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="newest">最新</option>
            <option value="download">下载量</option>
            <option value="view">浏览量</option>
            <option value="rating">评分</option>
            <option value="name">名称</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-gray-400 text-sm">
        共找到 {totalCount || sortedGames.length} 款 {categoryNames[category]}
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
          <div className="text-gray-500 text-lg mb-2">暂无 {categoryNames[category]}</div>
          <div className="text-gray-400 text-sm mb-4">
            该分类下的游戏正在收录中，敬请期待...
          </div>
          <Link
            href="/games/android"
            className="text-blue-500 hover:text-blue-600 active:text-blue-600 cursor-pointer select-none touch-manipulation inline-block transition-colors duration-200"
          >
            查看安卓游戏
          </Link>
        </div>
      )}

      {/* 分页导航 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {/* 上一页 */}
          {currentPage > 1 ? (
            <Link
              href={`/games/${category}?page=${currentPage - 1}${selectedSubcategory ? `&subcategory=${selectedSubcategory}` : ''}`}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              上一页
            </Link>
          ) : (
            <span className="px-3 py-2 bg-gray-900 text-gray-500 rounded-lg cursor-not-allowed">
              上一页
            </span>
          )}

          {/* 页码 */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else {
                if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
              }

              return (
                <Link
                  key={pageNum}
                  href={`/games/${category}?page=${pageNum}${selectedSubcategory ? `&subcategory=${selectedSubcategory}` : ''}`}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          {/* 下一页 */}
          {currentPage < totalPages ? (
            <Link
              href={`/games/${category}?page=${currentPage + 1}${selectedSubcategory ? `&subcategory=${selectedSubcategory}` : ''}`}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              下一页
            </Link>
          ) : (
            <span className="px-3 py-2 bg-gray-900 text-gray-500 rounded-lg cursor-not-allowed">
              下一页
            </span>
          )}
        </div>
      )}
    </div>
  );
}