import Image from 'next/image';
import Link from 'next/link';

export interface DownloadLink {
  name: string;
  url: string;
  password?: string;
  size?: string;
}

export interface GameData {
  id: number;
  title: string;
  rating?: number | null;
  image: string;
  images?: string[]; // 轮播图片数组
  tags: string[];
  description: string;
  downloadLinks?: DownloadLink[]; // 网盘下载链接
}

interface GameCardProps {
  game: GameData;
}

export default function GameCard({ game }: GameCardProps) {
  const hasRating = typeof game.rating === 'number' && !Number.isNaN(game.rating);
  const ratingText = hasRating ? (game.rating as number).toFixed(1) : '暂无评分';

  return (
    <Link href={`/game/${game.id}`} className="block">
      <div className="relative group">
        {/* 原始卡片 - 保持原有大小和位置 */}
        <div className="rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-transparent group-hover:border-gray-600">
          <div className="relative aspect-[15/7] overflow-hidden rounded-xl sm:rounded-2xl">
            <Image
              src={game.image}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-300 rounded-xl sm:rounded-2xl"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
            />
          </div>

          <div className="pt-2 sm:pt-3 pb-2 sm:pb-3">
            <div className="flex items-start justify-between gap-1 sm:gap-2">
              <h3 className="font-bold text-white text-[12px] sm:text-[14px] leading-[16px] sm:leading-[18px] line-clamp-1 flex-1 min-w-0">
                {game.title}
              </h3>
              <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[12px] font-semibold text-blue-300 flex-shrink-0">
                {hasRating && <span className="text-blue-300">★</span>}
                <span>{ratingText}</span>
              </div>
            </div>
            <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-[11px] text-white/60 leading-[14px] sm:leading-[16px]">
              <span className="line-clamp-1">
                {game.tags.filter(Boolean).join(' · ')}
              </span>
            </div>
          </div>
        </div>

        {/* 悬浮放大卡片 - 只在桌面端悬停时显示 */}
        <div className="hidden sm:block absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform scale-105 z-20 transition-all duration-300">
          <div className="bg-[#131313] rounded-2xl overflow-hidden shadow-2xl border border-gray-600">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-blue-300 text-[15px] leading-[20px] line-clamp-1 flex-1 min-w-0">
                  {game.title}
                </h3>
                <div className="flex items-center gap-1 text-[13px] font-semibold text-blue-300 flex-shrink-0">
                  {hasRating && <span className="text-blue-300">★</span>}
                  <span>{ratingText}</span>
                </div>
              </div>
              
              {/* 游戏简介 */}
              <div className="mt-2 text-[12px] text-white/80 leading-[16px] line-clamp-2">
                {game.description}
              </div>
              
              {/* 圆角标签 */}
              <div className="mt-3 flex flex-wrap gap-1">
                {game.tags.filter(Boolean).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-[10px] text-blue-300 bg-blue-400/20 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
