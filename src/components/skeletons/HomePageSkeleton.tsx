import SkeletonBase from './SkeletonBase';
import GameCardSkeleton from './GameCardSkeleton';

export default function HomePageSkeleton() {
  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* Hero 区域骨架 */}
        <div className="relative rounded-xl sm:rounded-2xl bg-gray-800 animate-pulse overflow-hidden mb-4 sm:mb-6">
          <div className="relative aspect-[5/2]">
            <div className="absolute inset-0 z-10 p-3 sm:p-4 md:p-6 grid grid-cols-12 gap-3 sm:gap-4 items-stretch">
              <div className="col-span-12 xl:col-span-9 flex flex-col justify-between">
                <div>
                  <SkeletonBase width="120px" height="24px" rounded="full" />
                </div>
                <div>
                  <SkeletonBase width="300px" height="32px" className="sm:h-10 md:h-12" />
                </div>
              </div>
              <div className="col-span-12 xl:col-span-3 mt-4 xl:mt-0">
                <div className="rounded-lg sm:rounded-xl bg-black/10 p-3 sm:p-4">
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonBase key={i} height="60px" rounded="lg" />
                    ))}
                  </div>
                  <div className="mt-2 sm:mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <SkeletonBase width="100px" height="20px" />
                      <SkeletonBase width="40px" height="20px" />
                    </div>
                    <SkeletonBase width="120px" height="16px" />
                    <SkeletonBase width="100%" height="60px" className="mt-2" />
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i}>
                          <SkeletonBase width="100%" height="12px" />
                          <SkeletonBase width="60%" height="16px" className="mt-1" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <SkeletonBase width="100%" height="32px" rounded="full" />
                      <SkeletonBase width="36px" height="32px" rounded="lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 游戏分组骨架 */}
        {Array.from({ length: 6 }).map((_, groupIndex) => (
          <div key={groupIndex} className="mt-4 sm:mt-6">
            {/* 分组标题骨架 */}
            <div className="mb-2 sm:mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SkeletonBase width="24px" height="24px" />
                <SkeletonBase width="80px" height="24px" />
              </div>
              <SkeletonBase width="60px" height="20px" />
            </div>
            
            {/* 游戏卡片网格骨架 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, cardIndex) => (
                <GameCardSkeleton key={cardIndex} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
