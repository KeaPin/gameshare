import SkeletonBase from './SkeletonBase';
import GameCardSkeleton from './GameCardSkeleton';

export default function GamesCategoryPageSkeleton() {
  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 面包屑导航骨架 */}
        <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
          <SkeletonBase width="30px" height="16px" />
          <span className="text-gray-600">›</span>
          <SkeletonBase width="80px" height="16px" />
        </div>

        {/* 页面标题骨架 */}
        <div className="mb-6">
          <SkeletonBase width="100px" height="32px" className="sm:h-10 mb-2" />
          <SkeletonBase width="180px" height="20px" />
        </div>

        {/* 筛选和排序骨架 */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBase key={index} width="80px" height="36px" rounded="full" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBase width="40px" height="16px" />
            <SkeletonBase width="80px" height="32px" rounded="lg" />
          </div>
        </div>

        {/* 结果统计骨架 */}
        <div className="mb-4">
          <SkeletonBase width="120px" height="16px" />
        </div>

        {/* 游戏网格骨架 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
