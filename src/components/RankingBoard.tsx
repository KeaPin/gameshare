"use client";

import Image from 'next/image';
import { GameData } from './GameCard';

interface RankingBoardProps {
  title: string;
  subtitle?: string;
  games: GameData[];
  accentClass?: string; // 自定义标题左上角色块
}

export default function RankingBoard({ title, subtitle, games, accentClass }: RankingBoardProps) {
  const topOne = games[0];
  const rest = games.slice(1, 6);

  return (
    <section className="space-y-2 sm:space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
          <span className={`inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded ${accentClass ?? 'bg-blue-300'}`} />
          {title}
        </h3>
        {subtitle && (
          <button className="text-xs text-white/60 hover:text-white">{subtitle} ›</button>
        )}
      </div>

      {/* TOP1 大卡 */}
      {topOne && (
        <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-[16/9] sm:aspect-[16/10] border border-white/10">
          {/* 游戏背景图片 */}
          <Image src={topOne.image} alt={topOne.title} fill className="object-cover" />
          
          {/* 下部分淡灰色遮罩 */}
          <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-14 bg-gray-400" />
          
          {/* 内容区域 - 只在遮罩区域内 */}
          <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-14 flex items-center px-2 sm:px-3">
            {/* 左侧：TOP 1 标识 */}
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-500 flex flex-col items-center justify-center mr-2 sm:mr-3 flex-shrink-0 rounded">
              <div className="text-white text-xs font-black leading-tight">TOP</div>
              <div className="text-white text-sm sm:text-lg font-black leading-none">1</div>
            </div>
            
            {/* 右侧：游戏信息 */}
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm sm:text-base font-bold line-clamp-1 mb-0.5 sm:mb-1">{topOne.title}</div>
              <div className="text-white/90 text-xs line-clamp-1">{topOne.tags.join(' · ')}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2-6 列表项 */}
      <ul className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
        {rest.map((g, index) => (
          <li key={g.id} className="flex items-center gap-2 sm:gap-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 p-1 sm:p-0">
            {/* 左侧游戏图片 - 比例 15/7 */}
            <div className="relative w-20 h-12 sm:w-24 sm:h-14 flex-shrink-0 rounded-md overflow-hidden bg-white/10">
              <Image src={g.image} alt={g.title} fill className="object-cover" />
            </div>
            
            {/* 右侧内容：排行数 + 游戏信息 */}
            <div className="flex-1 min-w-0">
              {/* 第一行：排行数 + 游戏名称 */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-400 rounded text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {index + 2}
                </div>
                <div className="text-white text-xs sm:text-sm font-medium line-clamp-1">{g.title}</div>
              </div>
              
              {/* 第二行：游戏标签 */}
              <div className="text-white/60 text-xs line-clamp-1">
                {g.tags.join(' · ')}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}


