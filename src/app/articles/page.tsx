import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { Metadata } from 'next';
import { getCachedFeaturedArticles } from '@/lib/utils/cache';

export const metadata: Metadata = {
  title: '游戏攻略 - 最全游戏指南',
  description: '最新最全的游戏攻略文章，涵盖策略攻略、剧情攻略、养成攻略等各种类型，助你轻松通关。',
  keywords: '游戏攻略,策略攻略,剧情攻略,游戏指南,通关攻略',
};

export const revalidate = 1800; // 缓存30分钟

interface ArticlesPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

// 文章分类配置
const categories = [
  { id: 'all', name: '全部' },
  { id: '游戏攻略', name: '游戏攻略' },
  { id: '策略攻略', name: '策略攻略' },
  { id: '剧情攻略', name: '剧情攻略' },
  { id: '养成攻略', name: '养成攻略' },
  { id: '竞技攻略', name: '竞技攻略' },
  { id: '解谜攻略', name: '解谜攻略' },
  { id: '生存攻略', name: '生存攻略' }
];

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams.category || 'all';
  const sortBy = resolvedSearchParams.sort || 'newest';
  const currentPage = parseInt(resolvedSearchParams.page || '1');

  // 从数据库获取文章（使用缓存）
  const articles = await getCachedFeaturedArticles(50); // 获取足够多的文章供筛选

  // 服务端过滤
  const filteredArticles = articles.filter(article => {
    if (selectedCategory === 'all') return true;
    // 这里假设文章有 category 字段，实际需要根据数据库结构调整
    return article.tags?.includes(selectedCategory);
  });

  // 服务端排序
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return (b.view_count || 0) - (a.view_count || 0);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'newest':
      default:
        return new Date(b.created_time || '').getTime() - new Date(a.created_time || '').getTime();
    }
  });

  // 服务端分页
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = sortedArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

        {/* 筛选和排序 */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/articles?category=${category.id}&sort=${sortBy}&page=1`}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">排序:</span>
            <div className="flex gap-2">
              {[
                { value: 'newest', label: '最新发布' },
                { value: 'views', label: '阅读量' },
                { value: 'title', label: '标题' }
              ].map((option) => (
                <Link
                  key={option.value}
                  href={`/articles?category=${selectedCategory}&sort=${option.value}&page=1`}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    sortBy === option.value
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-gray-800 text-white border-gray-700 hover:border-blue-500'
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4 text-gray-400 text-sm">
          共找到 {sortedArticles.length} 篇文章，当前第 {currentPage} 页
        </div>

        {/* 文章列表 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 mb-8">
          {paginatedArticles.map((article, idx) => (
            <div
              key={article.id}
              className="fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <ArticleCard guide={{
                id: Number(article.id),
                title: article.title,
                summary: article.summary || '暂无摘要',
                image: article.thumbnail || '/default.webp',
                category: selectedCategory !== 'all' ? selectedCategory : '游戏攻略',
                publishDate: new Date(article.created_time).toLocaleDateString('zh-CN'),
                views: article.view_count || 0,
                author: '游戏攻略组'
              }} />
            </div>
          ))}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {/* 上一页 */}
            {currentPage > 1 && (
              <Link
                href={`/articles?category=${selectedCategory}&sort=${sortBy}&page=${currentPage - 1}`}
                className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                上一页
              </Link>
            )}

            {/* 页码 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
              return (
                <Link
                  key={pageNum}
                  href={`/articles?category=${selectedCategory}&sort=${sortBy}&page=${pageNum}`}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {/* 下一页 */}
            {currentPage < totalPages && (
              <Link
                href={`/articles?category=${selectedCategory}&sort=${sortBy}&page=${currentPage + 1}`}
                className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                下一页
              </Link>
            )}
          </div>
        )}

        {/* 无结果提示 */}
        {sortedArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">该分类下暂无文章</div>
            <div className="text-gray-400 text-sm mb-4">
              更多精彩内容正在准备中，敬请期待...
            </div>
            <Link
              href="/articles?category=all"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              查看全部文章
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}