import { notFound } from 'next/navigation';
import Link from 'next/link';
import GamesCategoryClient from '@/components/GamesCategoryClient';
import { Metadata } from 'next';
import { CategoryModel } from '@/lib/models/CategoryModel';
import { ResourceModel } from '@/lib/models/ResourceModel';
import { Resource, Category } from '@/types/database';

interface GamesCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
    subcategory?: string; // 新增子分类参数
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

export default async function GamesCategoryPage({ params, searchParams }: GamesCategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const category = resolvedParams.category;
  const selectedSubcategory = resolvedSearchParams.subcategory;

  // 分页参数
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const pageSize = 16;

  // 检查分类是否有效
  if (!categoryAliasMapping[category]) {
    notFound();
  }

  const dbAlias = categoryAliasMapping[category];
  const categoryName = categoryNames[category];

  // 1. 查询父级分类 (level=0 且 alias=android) — 线下容错
  let allCategories: Category[] = [];
  try {
    allCategories = await CategoryModel.getCategories();
  } catch (error) {
    console.error('Failed to load categories for /games/[category]:', error);
  }
  const parentCategory = allCategories.find(cat => 
    cat.level === 0 && cat.alias === dbAlias
  );

  // 2. 查询该父分类下的所有子分类
  let childCategories: Category[] = [];
  if (parentCategory) {
    try {
      childCategories = await CategoryModel.getSubCategories(parentCategory.id);
    } catch (error) {
      console.error('Failed to load subcategories for /games/[category]:', error);
    }
  }

  // 3. 根据是否有选中的子分类来查询游戏
  let filteredGames: Resource[];
  let totalCount: number;
  let totalPages: number;

  if (selectedSubcategory && childCategories.length > 0) {
    // 如果选中了子分类，只查询该子分类的游戏
    const selectedChild = childCategories.find(cat =>
      cat.alias === selectedSubcategory || cat.id === selectedSubcategory
    );

    if (selectedChild) {
      let resourcesResult;
      try {
        resourcesResult = await ResourceModel.getResources({
          category_id: selectedChild.id,
          page: currentPage,
          limit: pageSize,
          sort: 'download_count',
          order: 'desc'
        });
      } catch (error) {
        console.error('Failed to load resources for selected subcategory:', error);
      }
      resourcesResult = resourcesResult || { data: [], total: 0, page: currentPage, limit: pageSize, totalPages: 0 };
      filteredGames = resourcesResult.data;
      totalCount = resourcesResult.total;
      totalPages = resourcesResult.totalPages;
    } else {
      // 如果找不到子分类，显示所有子分类的游戏
      const childCategoryIds = childCategories.map(c => c.id);
      let result;
      try {
        result = await ResourceModel.getResourcesByCategoryIds(childCategoryIds, {
          page: currentPage,
          limit: pageSize,
          sort: 'download_count',
          order: 'desc'
        });
      } catch (error) {
        console.error('Failed to load resources by category ids:', error);
      }
      result = result || { data: [], total: 0, page: currentPage, limit: pageSize, totalPages: 0 };
      filteredGames = result.data;
      totalCount = result.total;
      totalPages = result.totalPages;
    }
  } else if (childCategories.length === 0 && parentCategory) {
    // 如果没有子分类，直接查询父分类的资源（分页）
    let resourcesResult;
    try {
      resourcesResult = await ResourceModel.getResources({
        category_id: parentCategory.id,
        page: currentPage,
        limit: pageSize,
        sort: 'download_count',
        order: 'desc'
      });
    } catch (error) {
      console.error('Failed to load resources for parent category:', error);
    }
    resourcesResult = resourcesResult || { data: [], total: 0, page: currentPage, limit: pageSize, totalPages: 0 };
    filteredGames = resourcesResult.data;
    totalCount = resourcesResult.total;
    totalPages = resourcesResult.totalPages;
  } else {
    // 没有选中子分类，显示所有子分类的游戏
    const childCategoryIds = childCategories.map(c => c.id);
    let result;
    try {
      result = await ResourceModel.getResourcesByCategoryIds(childCategoryIds, {
        page: currentPage,
        limit: pageSize,
        sort: 'download_count',
        order: 'desc'
      });
    } catch (error) {
      console.error('Failed to load resources for all subcategories:', error);
    }
    result = result || { data: [], total: 0, page: currentPage, limit: pageSize, totalPages: 0 };
    filteredGames = result.data;
    totalCount = result.total;
    totalPages = result.totalPages;
  }

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            首页
          </Link>
          <span className="flex-shrink-0">›</span>
          <Link href="/games" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            游戏分类
          </Link>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">{categoryName}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{categoryName}</h1>
          <p className="text-gray-400">发现 {categoryName.replace('游戏', '')} 平台的精品游戏 ({totalCount} 款游戏)</p>
        </div>

        {/* 客户端交互组件 */}
        <GamesCategoryClient
          category={category}
          categoryNames={categoryNames}
          subCategories={childCategories}
          selectedSubcategory={selectedSubcategory}
          filteredGames={filteredGames}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
