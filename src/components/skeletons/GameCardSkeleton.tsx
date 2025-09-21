import SkeletonBase from './SkeletonBase';

export default function GameCardSkeleton() {
  return (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden">
      {/* 游戏图片骨架 */}
      <div className="relative aspect-[15/7] overflow-hidden">
        <SkeletonBase height="100%" rounded="xl" />
      </div>
      
      {/* 游戏信息骨架 */}
      <div className="pt-2 sm:pt-3 pb-2 sm:pb-3">
        <div className="flex items-start justify-between gap-1 sm:gap-2">
          {/* 游戏标题骨架 */}
          <SkeletonBase width="60%" height="16px" className="sm:h-[18px]" />
          {/* 评分骨架 */}
          <SkeletonBase width="40px" height="16px" className="sm:h-[18px]" />
        </div>
        {/* 标签骨架 */}
        <div className="mt-0.5 sm:mt-1">
          <SkeletonBase width="80%" height="14px" className="sm:h-[16px]" />
        </div>
      </div>
    </div>
  );
}
