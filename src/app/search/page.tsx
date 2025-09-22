import { Suspense } from 'react';
import SearchClient from '@/components/SearchClient';
import { featuredGames, rankingHotDownloads, rankingTopRated, rankingBetaHot } from '@/data/games';
import { GameData } from '@/components/GameCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '搜索游戏 - 找到你想要的游戏',
  description: '搜索和发现各种类型的游戏，包括安卓游戏、PC游戏、怀旧游戏等。',
  keywords: '游戏搜索,找游戏,游戏发现,游戏下载',
};

export default function SearchPage() {
  // 合并所有游戏数据
  const allGames: GameData[] = [
    ...featuredGames,
    ...rankingHotDownloads,
    ...rankingTopRated,
    ...rankingBetaHot
  ];

  // 去重（基于ID）
  const uniqueGames = allGames.filter((game, index, array) => 
    array.findIndex(g => g.id === game.id) === index
  );

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        <Suspense fallback={<div className="text-gray-400">加载中...</div>}>
          <SearchClient uniqueGames={uniqueGames} />
        </Suspense>
      </div>
    </div>
  );
}
