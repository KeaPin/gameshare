import SkeletonBase from './SkeletonBase';

export default function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-[1208px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* 面包屑导航骨架 */}
        <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
          <SkeletonBase width="30px" height="16px" />
          <span className="text-gray-600">›</span>
          <SkeletonBase width="60px" height="16px" />
          <span className="text-gray-600">›</span>
          <SkeletonBase width="100px" height="16px" />
        </div>

        {/* 文章头部信息骨架 */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <SkeletonBase width="60%" height="32px" className="sm:h-10 mb-2" />
              <SkeletonBase width="80%" height="20px" />
            </div>
            <SkeletonBase width="80px" height="32px" rounded="full" />
          </div>
          
          {/* 文章元信息骨架 */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <SkeletonBase width="20px" height="20px" rounded="full" />
              <SkeletonBase width="60px" height="16px" />
            </div>
            <SkeletonBase width="80px" height="16px" />
            <SkeletonBase width="60px" height="16px" />
            <SkeletonBase width="100px" height="16px" />
          </div>

          {/* 文章标签骨架 */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBase key={index} width="60px" height="24px" rounded="full" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 主要内容区域骨架 */}
          <div className="lg:col-span-2">
            {/* 文章图片骨架 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl overflow-hidden mb-6">
              <div className="relative aspect-[16/9] overflow-hidden">
                <SkeletonBase height="100%" rounded="none" />
              </div>

              {/* 操作按钮骨架 */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <SkeletonBase width="80px" height="36px" rounded="lg" />
                  <SkeletonBase width="80px" height="36px" rounded="lg" />
                  <SkeletonBase width="80px" height="36px" rounded="lg" />
                </div>
              </div>
            </div>

            {/* 文章内容骨架 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
              <div className="space-y-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <SkeletonBase 
                    key={index} 
                    width={index % 4 === 3 ? '70%' : '100%'} 
                    height="20px" 
                  />
                ))}
              </div>
            </div>

            {/* 文章结尾互动骨架 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <SkeletonBase width="150px" height="24px" className="mb-4" />
              <div className="flex flex-wrap gap-3 mb-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBase key={index} width="80px" height="32px" rounded="lg" />
                ))}
              </div>
              <SkeletonBase width="100%" height="40px" />
            </div>
          </div>

          {/* 右侧边栏骨架 */}
          <div className="space-y-6">
            {/* 作者信息骨架 */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5">
              <SkeletonBase width="80px" height="24px" className="mb-3" />
              <div className="flex items-center gap-3 mb-3">
                <SkeletonBase width="48px" height="48px" rounded="full" />
                <div>
                  <SkeletonBase width="80px" height="20px" className="mb-1" />
                  <SkeletonBase width="100px" height="16px" />
                </div>
              </div>
              <SkeletonBase width="100%" height="40px" className="mb-3" />
              <SkeletonBase width="100%" height="36px" rounded="lg" />
            </div>

            {/* 相关文章骨架 */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5">
              <SkeletonBase width="80px" height="24px" className="mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex gap-3 p-3">
                    <SkeletonBase width="64px" height="64px" rounded="lg" />
                    <div className="flex-1">
                      <SkeletonBase width="100%" height="16px" className="mb-1" />
                      <SkeletonBase width="80%" height="16px" className="mb-1" />
                      <SkeletonBase width="60%" height="12px" />
                    </div>
                  </div>
                ))}
              </div>
              <SkeletonBase width="100px" height="20px" className="mt-4" />
            </div>

            {/* 热门标签骨架 */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5">
              <SkeletonBase width="80px" height="24px" className="mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonBase key={index} width="50px" height="28px" rounded="lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
