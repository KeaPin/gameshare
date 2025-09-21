import { notFound } from 'next/navigation';
import Link from 'next/link';
import GamesCategoryClient from '@/components/GamesCategoryClient';
import { featuredGames } from '@/data/games';
import { Metadata } from 'next';

interface GamesCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: GamesCategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  
  const categoryNames: Record<string, string> = {
    'android': '安卓游戏',
    'pc': 'PC游戏',
    'retro': '怀旧游戏',
    'switch': 'Swift游戏',
    'simulator': '游戏模拟器'
  };
  
  const categoryName = categoryNames[category] || '游戏分类';
  
  return {
    title: `${categoryName} - 精品游戏合集`,
    description: `发现 ${categoryName} 平台的精品游戏，包含各种类型的优质游戏资源。`,
    keywords: `${categoryName},游戏下载,游戏分类,${category}游戏`,
  };
}

// 定义分类映射关系
const categoryMapping: Record<string, string[]> = {
  'android': ['模拟', '角色扮演', '冒险', '休闲', '射击'],
  'pc': ['策略', 'RTS', 'RPG', '开放世界', 'FPS'],
  'retro': ['经典', '像素', '回合制', '战棋'],
  'switch': ['多人联机', '合作', '竞技'],
  'simulator': ['模拟', '模拟经营', '养成', '放置']
};

// 分类显示名称
const categoryNames: Record<string, string> = {
  'android': '安卓游戏',
  'pc': 'PC游戏',
  'retro': '怀旧游戏',
  'switch': 'Swift游戏',
  'simulator': '游戏模拟器'
};

export default async function GamesCategoryPage({ params }: GamesCategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  // 检查分类是否有效
  if (!categoryMapping[category]) {
    notFound();
  }

  const categoryTags = categoryMapping[category];
  const categoryName = categoryNames[category];

  // 根据分类过滤游戏
  const filteredGames = featuredGames.filter(game => {
    return game.tags.some(tag => 
      categoryTags.some(catTag => 
        tag.toLowerCase().includes(catTag.toLowerCase()) ||
        catTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  });

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            首页
          </Link>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">{categoryName}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{categoryName}</h1>
          <p className="text-gray-400">发现 {categoryName.replace('游戏', '')} 平台的精品游戏</p>
        </div>

        {/* 客户端交互组件 */}
        <GamesCategoryClient 
          category={category}
          categoryNames={categoryNames}
          filteredGames={filteredGames}
        />
      </div>
    </div>
  );
}
