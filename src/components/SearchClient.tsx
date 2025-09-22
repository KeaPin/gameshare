"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GameCard from '@/components/GameCard';
import { GameData } from '@/components/GameCard';

interface SearchClientProps {
  uniqueGames: GameData[];
}

export default function SearchClient({ uniqueGames }: SearchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameData[]>([]);

  // 从URL参数获取搜索关键词
  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
  }, [searchParams]);

  // 搜索逻辑
  useEffect(() => {
    let filteredGames = uniqueGames;

    const normalizeTags = (tags: string[] | string | null | undefined): string[] => {
      if (Array.isArray(tags)) return tags;
      if (typeof tags === 'string') {
        try {
          const parsed = JSON.parse(tags);
          if (Array.isArray(parsed)) return parsed as string[];
        } catch {}
        return String(tags).split(',').map(t => t.trim()).filter(Boolean);
      }
      return [];
    };

    // 如果有搜索关键词，进行搜索过滤
    if (query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filteredGames = uniqueGames.filter(game => {
        const titleText = (game.title ?? '').toLowerCase();
        const titleMatch = titleText.includes(searchTerm);
        const tagsArr = normalizeTags(game.tags);
        const tagsMatch = tagsArr.some(tag => tag.toLowerCase().includes(searchTerm));
        const descriptionText = (game.description ?? '').toLowerCase();
        const descriptionMatch = descriptionText.includes(searchTerm);
        
        return titleMatch || tagsMatch || descriptionMatch;
      });

      // 相关性排序：标题匹配 > 标签匹配 > 描述匹配
      filteredGames.sort((a, b) => {
        const getRelevanceScore = (game: GameData) => {
          let score = 0;
          const titleText = (game.title ?? '').toLowerCase();
          if (titleText.includes(searchTerm)) score += 100;
          normalizeTags(game.tags).forEach(tag => {
            if (tag.toLowerCase().includes(searchTerm)) score += 50;
          });
          const descText = (game.description ?? '').toLowerCase();
          if (descText.includes(searchTerm)) score += 10;
          return score;
        };
        return getRelevanceScore(b) - getRelevanceScore(a);
      });
    } else {
      // 如果没有搜索关键词，按ID倒序显示所有游戏
      filteredGames = [...uniqueGames].sort((a, b) => {
        const aId = Number(a.id);
        const bId = Number(b.id);
        return (isNaN(bId) ? 0 : bId) - (isNaN(aId) ? 0 : aId);
      });
    }

    setResults(filteredGames);
  }, [query, uniqueGames]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
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
        {query ? `找到 ${results.length} 款相关游戏` : `共有 ${results.length} 款游戏`}
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
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {query ? '没有找到相关游戏' : '暂无游戏'}
          </div>
          {query && (
            <div className="text-gray-400 text-sm mb-4">
              尝试使用其他关键词
            </div>
          )}
          <div
            onClick={() => {
              setQuery('');
              router.push('/search');
            }}
            className="text-blue-500 hover:text-blue-600 active:text-blue-600 cursor-pointer select-none touch-manipulation inline-block transition-colors duration-200"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setQuery('');
                router.push('/search');
              }
            }}
          >
            清除搜索条件
          </div>
        </div>
      )}
    </>
  );
}
