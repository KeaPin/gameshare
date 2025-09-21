import SkeletonBase from './SkeletonBase';
import GameCardSkeleton from './GameCardSkeleton';

export default function GamesPageSkeleton() {
  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 面包屑导航骨架 */}
        <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
          <SkeletonBase width="30px" height="16px" />
          <span className="text-gray-600">›</span>
          <SkeletonBase width="60px" height="16px" />
        </div>

        {/* 页面标题骨架 */}
        <div className="mb-6">
          <SkeletonBase width="120px" height="32px" className="sm:h-10 mb-2" />
          <SkeletonBase width="200px" height="20px" />
        </div>

        {/* 主要游戏分类骨架 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <SkeletonBase width="48px" height="48px" rounded="xl" />
                <div>
                  <SkeletonBase width="80px" height="20px" className="mb-1" />
                  <SkeletonBase width="60px" height="16px" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from({ length: 4 }).map((_, tagIndex) => (
                  <SkeletonBase key={tagIndex} width="50px" height="24px" rounded="full" />
                ))}
              </div>
              
              <SkeletonBase width="100px" height="16px" />
            </div>
          ))}
        </div>

        {/* 热门游戏预览骨架 */}
        <div className="mb-6">
          <SkeletonBase width="80px" height="24px" className="sm:h-8 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* 查看所有游戏按钮骨架 */}
        <div className="text-center">
          <SkeletonBase width="120px" height="44px" rounded="lg" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
