import SkeletonBase from './SkeletonBase';
import GameCardSkeleton from './GameCardSkeleton';

export default function SearchPageSkeleton() {
  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 搜索标题和搜索框骨架 */}
        <div className="mb-8 text-center">
          <SkeletonBase width="120px" height="32px" className="sm:h-10 mb-6 mx-auto" />
          
          {/* 搜索框骨架 */}
          <div className="mb-4 flex justify-center">
            <SkeletonBase width="400px" height="40px" className="sm:h-10" rounded="full" />
          </div>

          {/* 搜索结果提示骨架 */}
          <SkeletonBase width="150px" height="16px" className="mx-auto" />
        </div>

        {/* 结果统计骨架 */}
        <div className="mb-4">
          <SkeletonBase width="120px" height="16px" />
        </div>

        {/* 游戏结果列表骨架 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <GameCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
