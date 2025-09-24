import Image from 'next/image';
import Link from 'next/link';
import { Resource } from '@/types/database';

export interface DownloadLink {
  name: string;
  url: string;
  password?: string;
  size?: string;
}

export interface GameData {
  id: number | string;
  title?: string;
  name?: string;
  rating?: number;
  image?: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  description?: string;
  downloadLinks?: DownloadLink[];
}

interface GameCardProps {
  game: GameData | Resource;
  priority?: boolean; // 是否优先加载
  index?: number; // 卡片索引，用于判断是否在首屏
}

export default function GameCard({ game, priority = false, index = 0 }: GameCardProps) {
  // 适配不同的数据格式
  const gameTitle = ('title' in game && game.title) || ('name' in game && game.name) || '未知游戏';
  const gameImage = ('image' in game && game.image) || ('thumbnail' in game && game.thumbnail) || '/default.webp';
  const gameDescription = ('description' in game && game.description) || '暂无介绍';

  // 处理标签数据
  let gameTags: string[] = [];
  if ('tags' in game && game.tags) {
    if (typeof game.tags === 'string') {
      // 如果是字符串，尝试解析为数组
      try {
        gameTags = JSON.parse(game.tags);
      } catch {
        // 如果解析失败，按逗号分割
        gameTags = game.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    } else if (Array.isArray(game.tags)) {
      gameTags = game.tags;
    }
  }

  const hasRating = game.rating;
  const ratingText = game.rating ? game.rating : '暂无评分';

  // 优化图片加载策略
  const isFirstRow = index < 4; // 假设每行4个，首行优先加载
  const shouldPreload = priority || isFirstRow;

  return (
    <Link href={`/game/${game.id}`} className="block">
      <div className="relative group">
        {/* 原始卡片 - 保持原有大小和位置 */}
        <div className="rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-transparent group-hover:border-gray-600">
          <div className="relative aspect-[15/7] overflow-hidden rounded-xl sm:rounded-2xl">
            <Image
              src={gameImage}
              alt={gameTitle}
              fill
              className="object-cover transition-transform duration-300 rounded-xl sm:rounded-2xl"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              priority={shouldPreload}
              loading={shouldPreload ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyb5v3elyNat6zWqSC1+UUCmgDaKGTZJOQRQ=="
            />
          </div>

          <div className="pt-2 sm:pt-3 pb-2 sm:pb-3">
            <div className="flex items-start justify-between gap-1 sm:gap-2">
              <h3 className="font-bold text-white text-[12px] sm:text-[14px] leading-[16px] sm:leading-[18px] line-clamp-1 flex-1 min-w-0">
                {gameTitle}
              </h3>
              <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[12px] font-semibold text-blue-300 flex-shrink-0">
                {hasRating && <span className="text-blue-300">★</span>}
                <span>{ratingText}</span>
              </div>
            </div>
            <div className="mt-0.5 sm:mt-1 text-[9px] sm:text-[11px] text-white/60 leading-[14px] sm:leading-[16px]">
              <span className="line-clamp-1">
                {gameTags.slice(0, 3).join(' · ')}
              </span>
            </div>
          </div>
        </div>

        {/* 悬浮放大卡片 - 只在桌面端悬停时显示 */}
        <div className="hidden sm:block absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform scale-105 z-20 transition-all duration-300">
          <div className="bg-[#131313] rounded-2xl overflow-hidden shadow-2xl border border-gray-600">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={gameImage}
                alt={gameTitle}
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyb5v3elyNat6zWqSC1+UUCmgDaKGTZJOQRQ=="
              />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-blue-300 text-[15px] leading-[20px] line-clamp-1 flex-1 min-w-0">
                  {gameTitle}
                </h3>
                <div className="flex items-center gap-1 text-[13px] font-semibold text-blue-300 flex-shrink-0">
                  {hasRating && <span className="text-blue-300">★</span>}
                  <span>{ratingText}</span>
                </div>
              </div>
              
              {/* 游戏简介 */}
              <div className="mt-2 text-[12px] text-white/80 leading-[16px] line-clamp-2">
                {gameDescription}
              </div>
              
              {/* 圆角标签 */}
              <div className="mt-3 flex flex-wrap gap-1">
                {gameTags.slice(0, 6).map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-[10px] text-blue-300 bg-blue-600/20 rounded-full"
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
