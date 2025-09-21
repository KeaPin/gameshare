import SkeletonBase from './SkeletonBase';

export default function GameDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* 面包屑导航骨架 */}
      <div className="max-w-[1208px] mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center gap-2">
          <SkeletonBase width="30px" height="16px" />
          <span className="text-gray-600">›</span>
          <SkeletonBase width="40px" height="16px" />
          <span className="text-gray-600">›</span>
          <SkeletonBase width="80px" height="16px" />
        </div>
      </div>
      
      <div className="max-w-[1208px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 游戏基本信息骨架 */}
            <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* 游戏轮播图骨架 */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <SkeletonBase height="100%" rounded="none" />
              </div>

              {/* 游戏信息骨架 */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <SkeletonBase width="64px" height="64px" rounded="xl" />
                    <div>
                      <SkeletonBase width="200px" height="32px" className="mb-1" />
                      <SkeletonBase width="120px" height="16px" />
                    </div>
                  </div>
                  <div>
                    <SkeletonBase width="60px" height="32px" className="mb-1" />
                    <SkeletonBase width="50px" height="16px" />
                  </div>
                </div>

                {/* 统计数据骨架 */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center">
                      <SkeletonBase width="60px" height="24px" className="mb-1 mx-auto" />
                      <SkeletonBase width="40px" height="16px" className="mx-auto" />
                    </div>
                  ))}
                </div>

                {/* 标签骨架 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonBase key={i} width="60px" height="28px" rounded="full" />
                  ))}
                </div>

                {/* 操作按钮骨架 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <SkeletonBase width="120px" height="48px" rounded="xl" />
                  <SkeletonBase width="120px" height="48px" rounded="xl" />
                  <SkeletonBase width="48px" height="48px" rounded="xl" />
                  <SkeletonBase width="48px" height="48px" rounded="xl" />
                </div>
              </div>
            </div>

            {/* 游戏规格信息骨架 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <SkeletonBase width="80px" height="24px" className="mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <SkeletonBase width="16px" height="16px" />
                      <SkeletonBase width="60px" height="16px" />
                    </div>
                    <SkeletonBase width="80px" height="20px" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* 游戏描述骨架 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <SkeletonBase width="80px" height="24px" className="mb-4" />
              <div className="space-y-3">
                <SkeletonBase width="100%" height="20px" />
                <SkeletonBase width="95%" height="20px" />
                <SkeletonBase width="90%" height="20px" />
                <SkeletonBase width="85%" height="20px" />
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-500 mt-4">
                <SkeletonBase width="80px" height="20px" className="mb-2" />
                <div className="space-y-2">
                  <SkeletonBase width="100%" height="16px" />
                  <SkeletonBase width="90%" height="16px" />
                </div>
              </div>
            </div>

            {/* 评价区域骨架 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <SkeletonBase width="80px" height="24px" />
                  <SkeletonBase width="60px" height="24px" rounded="full" />
                </div>
                <SkeletonBase width="80px" height="36px" rounded="lg" />
              </div>
              
              {/* 评分统计骨架 */}
              <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <SkeletonBase width="60px" height="36px" className="mb-1 mx-auto" />
                    <SkeletonBase width="80px" height="20px" className="mb-1 mx-auto" />
                    <SkeletonBase width="60px" height="16px" className="mx-auto" />
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <SkeletonBase width="12px" height="16px" />
                        <SkeletonBase width="100%" height="8px" rounded="full" />
                        <SkeletonBase width="24px" height="16px" />
                      </div>
                    ))}
                  </div>
                  <div className="text-center space-y-2">
                    <SkeletonBase width="80px" height="16px" className="mx-auto" />
                    <SkeletonBase width="100px" height="16px" className="mx-auto" />
                  </div>
                </div>
              </div>

              {/* 评价列表骨架 */}
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <SkeletonBase width="40px" height="40px" rounded="full" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <SkeletonBase width="60px" height="20px" />
                          <SkeletonBase width="80px" height="16px" />
                          <SkeletonBase width="60px" height="16px" />
                          <SkeletonBase width="80px" height="20px" rounded="full" />
                        </div>
                        <div className="space-y-2 mb-3">
                          <SkeletonBase width="100%" height="16px" />
                          <SkeletonBase width="90%" height="16px" />
                          <SkeletonBase width="70%" height="16px" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <SkeletonBase width="80px" height="16px" />
                            <SkeletonBase width="40px" height="16px" />
                          </div>
                          <SkeletonBase width="40px" height="16px" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 加载更多按钮骨架 */}
              <div className="text-center mt-6">
                <SkeletonBase width="120px" height="36px" rounded="lg" className="mx-auto" />
              </div>
            </div>
          </div>

          {/* 右侧边栏骨架 */}
          <div className="space-y-6">
            {/* 相关游戏骨架 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-5">
              <SkeletonBase width="80px" height="24px" className="mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <SkeletonBase width="128px" height="64px" rounded="lg" />
                    <div className="flex-1">
                      <SkeletonBase width="100px" height="16px" className="mb-1" />
                      <SkeletonBase width="60px" height="14px" className="mb-1" />
                      <SkeletonBase width="80px" height="12px" />
                    </div>
                  </div>
                ))}
              </div>
              <SkeletonBase width="60px" height="20px" className="mt-4" />
            </div>

            {/* 游戏标签骨架 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-5">
              <SkeletonBase width="80px" height="24px" className="mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonBase key={i} width="60px" height="32px" rounded="lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
