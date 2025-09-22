import Link from 'next/link';
import GameCard from '@/components/GameCard';
import { Metadata } from 'next';
import { CategoryModel } from '@/lib/models/CategoryModel';
import { ResourceModel } from '@/lib/models/ResourceModel';
import { Resource, Category } from '@/types/database';

// 该页面依赖数据库实时数据，强制动态渲染，避免构建期静态预渲染超时
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '游戏分类 - 精品游戏合集',
  description: '浏览各个平台的精品游戏，包括安卓游戏、PC游戏、怀旧游戏、Swift游戏和游戏模拟器。',
  keywords: '游戏分类,安卓游戏,PC游戏,游戏模拟器,游戏下载',
};

// 分类键值映射到数据库alias字段（父级分类）  
const categoryAliasMapping: Record<string, string> = {
  'android': 'android',
  'pc': 'pc',  
  'retro': 'retro',
  'switch': 'switch',
  'simulator': 'simulator'
};

// 分类显示名称
const categoryNames: Record<string, string> = {
  'android': '安卓游戏',
  'pc': 'PC游戏', 
  'retro': '怀旧游戏',
  'switch': 'Swift游戏',
  'simulator': '游戏模拟器'
};

export default async function GamesPage() {
  // 从数据库获取分类信息和资源数据（全部并行）
  const [categories, featuredResources, hotResources] = await Promise.all([
    CategoryModel.getTopLevelCategories(),
    ResourceModel.getFeaturedResources(8),
    ResourceModel.getHotResources(8)
  ]);

  // 预构建：alias -> 父分类
  const parentByAlias: Record<string, Category | undefined> = Object.fromEntries(
    Object.entries(categoryAliasMapping).map(([key, alias]) => [key, categories.find(c => c.level === 0 && c.alias === alias)])
  );

  // 并行获取所有父分类的子分类
  const subCategoriesEntries = await Promise.all(
    Object.entries(parentByAlias).map(async ([key, parent]) => {
      if (!parent) return [key, [] as Category[]] as const;
      const subs = await CategoryModel.getSubCategories(parent.id);
      return [key, subs] as const;
    })
  );
  const subCategoriesByKey = Object.fromEntries(subCategoriesEntries as Array<[string, Category[]]>);

  // 为每个大类计算用于查询的分类ID集合（若无子类则使用父类ID）
  const categoryIdsByKey: Record<string, string[]> = Object.fromEntries(
    Object.keys(categoryAliasMapping).map(key => {
      const parent = parentByAlias[key];
      const subs = subCategoriesByKey[key] ?? [];
      if (!parent) return [key, []];
      return [key, subs.length > 0 ? subs.map(s => s.id) : [parent.id]];
    })
  );

  // 并行按多个分类ID聚合查询总数（一次查询解决一个大类，避免 N+1）
  const countsEntries = await Promise.all(
    Object.entries(categoryIdsByKey).map(async ([key, ids]) => {
      if (ids.length === 0) return [key, 0] as const;
      const result = await ResourceModel.getResourcesByCategoryIds(ids, { limit: 1 });
      return [key, result.total] as const;
    })
  );
  const categoryResourceCounts: Record<string, number> = Object.fromEntries(countsEntries);

  // 获取分类下的标签，用于显示
  const getCategoryTags = (dbAlias: string): string[] => {
    const category = categories.find(cat => cat.level === 0 && cat.alias === dbAlias);
    if (category?.description) {
      // 如果数据库中有描述，可以从描述中解析标签
      // 这里使用简单的逗号分割，实际项目中可能需要更复杂的逻辑
      return category.description.split(',').slice(0, 4);
    }
    // 回退到默认标签
    const defaultTags: Record<string, string[]> = {
      'android': ['模拟', '角色扮演', '冒险', '休闲'],
      'pc': ['策略', 'RTS', 'RPG', '开放世界'],
      'retro': ['经典', '像素', '回合制', '战棋'],
      'switch': ['多人联机', '合作', '竞技'],
      'simulator': ['模拟', '模拟经营', '养成', '放置']
    };
    return defaultTags[dbAlias] || [];
  };

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            首页
          </Link>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">游戏分类</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">游戏分类</h1>
          <p className="text-gray-400">选择你喜欢的游戏平台和类型</p>
        </div>

        {/* 主要游戏分类 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(categoryNames).map(([key, name]) => {
            const dbAlias = categoryAliasMapping[key];
            const tags = getCategoryTags(dbAlias);
            const gameCount = categoryResourceCounts[key] || 0;
            
            return (
              <Link
                key={key}
                href={`/games/${key}`}
                className="group bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#222] transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors">
                      {name}
                    </h3>
                    <p className="text-gray-400 text-sm">{gameCount} 款游戏</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-800/50 text-gray-400 text-xs rounded-full">
                      +{tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="text-blue-600 text-sm group-hover:text-blue-300 transition-colors">
                  浏览 {name} →
                </div>
              </Link>
            );
          })}
        </div>

        {/* 热门游戏预览 */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">热门游戏</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {(hotResources.length > 0 ? hotResources : featuredResources).slice(0, 8).map((resource, idx) => (
              <div 
                key={resource.id} 
                className="fade-in" 
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <GameCard game={resource} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/games/android"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            查看所有游戏
          </Link>
        </div>
      </div>
    </div>
  );
}