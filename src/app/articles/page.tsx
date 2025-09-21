import Link from 'next/link';
import ArticlesClientPage from '@/components/ArticlesClientPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '游戏攻略 - 最全游戏指南',
  description: '最新最全的游戏攻略文章，涵盖策略攻略、剧情攻略、养成攻略等各种类型，助你轻松通关。',
  keywords: '游戏攻略,策略攻略,剧情攻略,游戏指南,通关攻略',
};

export default function ArticlesPage() {
  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1400px] mx-auto">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            首页
          </Link>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">游戏攻略</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">游戏攻略</h1>
          <p className="text-gray-400">最新最全的游戏攻略文章，助你轻松通关</p>
        </div>

        {/* 客户端交互组件 */}
        <ArticlesClientPage />
      </div>
    </div>
  );
}
