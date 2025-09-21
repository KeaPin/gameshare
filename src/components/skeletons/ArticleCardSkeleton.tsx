import SkeletonBase from './SkeletonBase';

export default function ArticleCardSkeleton() {
  return (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white/5">
      {/* 文章图片骨架 */}
      <div className="relative aspect-[15/7] overflow-hidden">
        <SkeletonBase height="100%" rounded="none" />
      </div>
      
      {/* 文章信息骨架 */}
      <div className="p-3 sm:p-4">
        {/* 文章标题骨架 */}
        <SkeletonBase width="85%" height="16px" className="sm:h-[18px]" />
        
        {/* 文章摘要骨架 */}
        <div className="mt-1">
          <SkeletonBase width="90%" height="14px" className="sm:h-[16px]" />
        </div>
        
        {/* 元信息骨架 */}
        <div className="mt-2 flex items-center justify-between">
          <SkeletonBase width="60px" height="10px" />
          <SkeletonBase width="50px" height="10px" />
        </div>
      </div>
    </div>
  );
}
