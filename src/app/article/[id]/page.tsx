import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArticleDetailClient from '@/components/ArticleDetailClient';
import { guides } from '@/data/guides';
import { Metadata } from 'next';

interface ArticleDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const articleId = parseInt(params.id);
  const article = guides.find(g => g.id === articleId);
  
  if (!article) {
    return {
      title: '文章未找到 - 游戏攻略',
      description: '您查找的文章不存在或已被移除。',
    };
  }
  
  return {
    title: `${article.title} - 游戏攻略`,
    description: article.summary || `阅读这篇关于${article.title}的详细攻略，获取游戏技巧和策略指导。`,
    keywords: `${article.title},${article.category},游戏攻略,游戏指南,${article.tags?.join(',') || ''}`,
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const articleId = parseInt(params.id);
  const article = guides.find(g => g.id === articleId);

  if (!article) {
    notFound();
  }

  // 获取相关文章（相同分类或标签）
  const relatedArticles = guides.filter(g => 
    g.id !== articleId && 
    (g.category === article.category || 
     g.tags?.some(tag => article.tags?.includes(tag)))
  ).slice(0, 6);

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-[1208px] mx-auto">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            首页
          </Link>
          <span className="flex-shrink-0">›</span>
          <Link href="/articles" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            游戏攻略
          </Link>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">{article.title}</span>
        </div>

        <ArticleDetailClient 
          article={article}
          relatedArticles={relatedArticles}
        />
      </div>
    </div>
  );
}
