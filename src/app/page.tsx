import Image from 'next/image';
import Link from 'next/link';
import GameCard from '@/components/GameCard';
import { getNavIcon } from '@/data/navigation';
import { Metadata } from 'next';
import { getCachedResourcesByCategoryAlias, getCachedHotGames } from '@/lib/utils/cache';

export const metadata: Metadata = {
  title: '探玩游戏 - 发现精品游戏',
  description: '探索最新最热门的游戏，包括安卓游戏、PC游戏、怀旧游戏等，还有详细的游戏攻略指南。',
  keywords: '游戏下载,游戏攻略,安卓游戏,PC游戏,游戏分享',
};

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 缓存1小时

export default async function Home() {
  // 并行获取所有数据以提升性能（使用缓存版本）
  const [androidGames, pcGames, retroGames, switchGames, simulatorGames, hotGames] = await Promise.all([
    getCachedResourcesByCategoryAlias('android', 8),
    getCachedResourcesByCategoryAlias('pc', 8),
    getCachedResourcesByCategoryAlias('retro', 8),
    getCachedResourcesByCategoryAlias('switch', 8),
    getCachedResourcesByCategoryAlias('simulator', 8),
    getCachedHotGames(8)
  ]);
  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* Hero：固定宽高比例 */}
        <div className="relative rounded-xl sm:rounded-2xl bg-[#6b6f3a] overflow-hidden">
          <div className="relative aspect-[5/2]">
            <Image src="/default.webp" alt="banner" fill className="object-cover opacity-20" />
            <div className="absolute inset-0 z-10 p-3 sm:p-4 md:p-6 grid grid-cols-12 gap-3 sm:gap-4 items-stretch">
              <div className="col-span-12 xl:col-span-9 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" /> 今日焦点
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold drop-shadow">探玩游戏 专属折扣中！</h2>
                </div>
              </div>
              <div className="col-span-12 xl:col-span-3 mt-4 xl:mt-0">
                <div className="rounded-lg sm:rounded-xl bg-black/10 p-3 sm:p-4">
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <div className="relative aspect-[4/3] rounded-md sm:rounded-lg overflow-hidden bg-white/20">
                      <Image src="/default.webp" alt="thumb" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[4/3] rounded-md sm:rounded-lg overflow-hidden bg-white/20">
                      <Image src="/default.webp" alt="thumb" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[4/3] rounded-md sm:rounded-lg overflow-hidden bg-white/20">
                      <Image src="/default.webp" alt="thumb" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm sm:text-base">无主之地 4</h3>
                      <div className="flex items-center gap-1 text-blue-100">
                        <span className="text-xs sm:text-sm">★</span>
                        <span className="font-semibold text-xs sm:text-sm">8.2</span>
                      </div>
                    </div>
                    <div className="mt-1 sm:mt-2 text-xs text-white/90">
                      角色扮演<span className="px-1">·</span>冒险<span className="px-1">·</span>动作
                    </div>
                    <p className="mt-1 sm:mt-2 text-xs text-white/85 line-clamp-2 sm:line-clamp-3">《无主之地4》中靠激烈的战斗、以夸张的战斗体验，以及数十亿件狂野武器的搭配，全球玩家在一个荒诞最荒诞的宇宙中展开紧张刺激的冒险。</p>
                    <div className="mt-2 sm:mt-3 text-xs text-white/90 grid grid-cols-3 gap-1 sm:gap-2">
                      <div className="space-y-1"><div className="opacity-80">心愿单</div><div className="font-semibold">98</div></div>
                      <div className="space-y-1"><div className="opacity-80">开发商</div><div className="font-semibold text-xs">Gearbox</div></div>
                      <div className="space-y-1"><div className="opacity-80">热度</div><div className="font-semibold">2K</div></div>
                    </div>
                    <div className="mt-3 sm:mt-4 flex items-center gap-2">
                      <div className="flex-1 bg-white text-black rounded-full px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-white/90 active:bg-white/80 cursor-pointer select-none touch-manipulation transition-all duration-200 text-center">领券购买</div>
                      <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-white/20 cursor-pointer select-none touch-manipulation hover:bg-white/30 active:bg-white/10 transition-all duration-200" aria-label="心愿单" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 从上到下：六个分组，每组最多 8 条 */}

        {/* 安卓游戏 */}
        <div className="mt-4 sm:mt-6">
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-white">
                {getNavIcon('smartphone', 20)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">安卓游戏</h2>
            </div>
            <Link 
              href="/games"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              查看更多
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {androidGames.map((game, idx) => (
              <div key={game.id} className="fade-in" style={{ animationDelay: `${idx * 0.06}s` }}>
                <GameCard game={game} priority={idx < 4} index={idx} />
              </div>
            ))}
          </div>
        </div>

        {/* PC 游戏 */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-white">
                {getNavIcon('monitor', 20)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">PC游戏</h2>
            </div>
            <Link 
              href="/games"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              查看更多
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {pcGames.map((game, idx) => (
              <div key={game.id} className="fade-in" style={{ animationDelay: `${idx * 0.06}s` }}>
                <GameCard game={game} index={idx + 8} />
              </div>
            ))}
          </div>
        </div>

        {/* 怀旧游戏 */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-white">
                {getNavIcon('history', 20)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">怀旧游戏</h2>
            </div>
            <Link
              href="/games"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              查看更多
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {retroGames.map((game, idx) => (
              <div key={game.id} className="fade-in" style={{ animationDelay: `${idx * 0.06}s` }}>
                <GameCard game={game} index={idx + 16} />
              </div>
            ))}
          </div>
        </div>

        {/* Switch 游戏 */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-white">
                {getNavIcon('zap', 20)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Switch游戏</h2>
            </div>
            <Link
              href="/games"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              查看更多
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {switchGames.map((game, idx) => (
              <div key={game.id} className="fade-in" style={{ animationDelay: `${idx * 0.06}s` }}>
                <GameCard game={game} index={idx + 24} />
              </div>
            ))}
          </div>
        </div>

        {/* 游戏模拟器 */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-white">
                {getNavIcon('cpu', 20)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">游戏模拟器</h2>
            </div>
            <Link
              href="/games"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              查看更多
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {simulatorGames.map((game, idx) => (
              <div key={game.id} className="fade-in" style={{ animationDelay: `${idx * 0.06}s` }}>
                <GameCard game={game} index={idx + 32} />
              </div>
            ))}
          </div>
        </div>

        {/* 热门游戏攻略 */}
        <div className="mt-6 sm:mt-8">
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-white">
                {getNavIcon('book', 20)}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">热门攻略</h2>
            </div>
            <Link
              href="/articles"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
            >
              查看更多
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {hotGames.slice(0, 8).map((game, idx) => (
              <div key={`hot-${game.id}`} className="fade-in" style={{ animationDelay: `${idx * 0.06}s` }}>
                <GameCard game={game} index={idx + 40} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
