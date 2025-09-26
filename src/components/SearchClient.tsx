"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GameCard from '@/components/GameCard';
import type { Resource } from '@/types/database';
import EmptyState from '@/components/EmptyState';

interface SearchClientProps {
  results: Resource[];
  initialQuery: string;
  total: number;
  page?: number;
  totalPages?: number;
  limit?: number;
}

export default function SearchClient({ results, initialQuery, total }: SearchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery || '');

  // 从URL参数获取搜索关键词，保持与地址栏同步
  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = query.trim();
    if (next) {
      router.push(`/search?q=${encodeURIComponent(next)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <>
      {/* 搜索标题和搜索框 */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">搜索游戏</h1>
        
        {/* 搜索框 - 居中显示，样式与Header保持一致 */}
        <form onSubmit={handleSearchSubmit} className="mb-4 flex justify-center">
          <div className="relative w-160 min-w-0 max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索游戏..."
              className="w-full h-8 sm:h-10 rounded-3xl bg-white/10 text-white placeholder-white/50 pl-8 pr-14 sm:pl-12 sm:pr-20 outline-none focus:ring-2 focus:ring-blue-600/50 text-sm sm:text-base border-0"
            />
            <div className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 text-white/40">
              <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 20l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <button
              type="submit"
              className="custom-size absolute right-0.5 sm:right-1.5 top-1/2 -translate-y-1/2 px-2 sm:px-4 h-6 sm:h-8 rounded-3xl bg-blue-600 text-black text-xs sm:text-sm font-medium hover:bg-blue-300 transition-colors flex-shrink-0"
            >
              搜索
            </button>
          </div>
        </form>

        {/* 搜索结果提示 */}
        {query && (
          <p className="text-gray-400 text-sm">
            搜索 &ldquo;<span className="text-white font-medium">{query}</span>&rdquo; 的结果
          </p>
        )}
      </div>

      {/* 结果统计 */}
      <div className="mb-4 text-gray-400 text-sm">
        {query ? `找到 ${total} 款相关游戏` : `共有 ${total} 款游戏`}
      </div>

      {/* 游戏结果列表 */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {results.map((game, idx) => (
            <div 
              key={game.id} 
              className="fade-in" 
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search"
          title={query ? '没有找到相关游戏' : '暂无游戏'}
          description={
            query
              ? '试试简化关键词、换一种说法，或浏览热门分类。'
              : '当前没有可展示的游戏资源。你可以浏览热门分类或返回首页。'
          }
          suggestions={query ? [
            '检查关键词是否有拼写错误',
            '尝试使用更通用的词语（例如：动作、赛车）',
            '前往游戏分类页进行筛选'
          ] : []}
          primaryAction={{
            label: query ? '清除搜索条件' : '浏览游戏',
            onClick: () => {
              setQuery('');
              router.push(query ? '/search' : '/games');
            }
          }}
          secondaryAction={{
            label: '返回首页',
            href: '/'
          }}
        />
      )}
    </>
  );
}
