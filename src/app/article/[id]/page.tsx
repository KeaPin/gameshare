"use client";

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { guides } from '@/data/guides';

interface ArticleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const resolvedParams = use(params);
  const articleId = parseInt(resolvedParams.id);
  const article = guides.find(g => g.id === articleId);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!article) {
    notFound();
  }

  // 获取相关文章（相同分类或标签）
  const relatedArticles = guides.filter(g => 
    g.id !== articleId && 
    (g.category === article.category || 
     g.tags?.some(tag => article.tags?.includes(tag)))
  ).slice(0, 6);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // 可以添加提示消息
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-[1208px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
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

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{article.title}</h1>
              <p className="text-gray-400">{article.summary}</p>
            </div>
            {article.category && (
              <div className="flex-shrink-0">
                <span className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-full font-semibold">
                  {article.category}
                </span>
              </div>
            )}
          </div>
          
          {/* 文章元信息 */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
            {article.author && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {article.author.charAt(0)}
                </div>
                <span>{article.author}</span>
              </div>
            )}
            {article.publishDate && (
              <>
                <span>•</span>
                <span>{article.publishDate}</span>
              </>
            )}
            {article.readTime && (
              <>
                <span>•</span>
                <span>{article.readTime}阅读</span>
              </>
            )}
            {article.views && (
              <>
                <span>•</span>
                <span>{article.views.toLocaleString()} 次阅读</span>
              </>
            )}
          </div>

          {/* 文章标签 */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2">
            {/* 文章图片 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl overflow-hidden mb-6">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* 操作按钮 */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      liked 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span className="text-sm">喜欢</span>
                  </button>
                  
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isBookmarked 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span className="text-sm">收藏</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/>
                      <circle cx="6" cy="12" r="3"/>
                      <circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    <span className="text-sm">分享</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 文章内容 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
              <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                <div 
                  className="text-gray-300 leading-relaxed"
                  style={{
                    lineHeight: '1.7',
                  }}
                >
                  {article.content && (
                    <div className="whitespace-pre-line">
                      {article.content.split('\n').map((line, index) => {
                        // 处理标题
                        if (line.startsWith('# ')) {
                          return <h1 key={index} className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0">{line.substring(2)}</h1>;
                        }
                        if (line.startsWith('## ')) {
                          return <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3">{line.substring(3)}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={index} className="text-lg font-bold text-white mt-5 mb-2">{line.substring(4)}</h3>;
                        }
                        // 处理列表
                        if (line.startsWith('- ')) {
                          return <li key={index} className="text-gray-300 mb-1 ml-4 list-disc">{line.substring(2)}</li>;
                        }
                        // 处理段落
                        if (line.trim() === '') {
                          return <br key={index} />;
                        }
                        return <p key={index} className="text-gray-300 mb-4 leading-relaxed">{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 文章结尾互动 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-lg font-bold text-white mb-4">觉得这篇文章怎么样？</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {['很有用', '通俗易懂', '内容详细', '操作性强'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white text-sm rounded-lg transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm">
                如果这篇攻略对你有帮助，别忘了点赞和收藏哦！有任何问题欢迎在评论区留言。
              </p>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-6">
            {/* 作者信息 */}
            {article.author && (
              <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5">
                <h3 className="text-lg font-bold text-white mb-3">关于作者</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{article.author}</div>
                    <div className="text-sm text-gray-400">游戏攻略达人</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  专注游戏攻略创作，为玩家提供最实用的游戏指南。
                </p>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                  关注作者
                </button>
              </div>
            )}

            {/* 相关文章 */}
            {relatedArticles.length > 0 && (
              <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5">
                <h3 className="text-lg font-bold text-white mb-4">相关文章</h3>
                <div className="space-y-3">
                  {relatedArticles.slice(0, 3).map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      href={`/article/${relatedArticle.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedArticle.image}
                            alt={relatedArticle.title}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                            {relatedArticle.title}
                          </h4>
                          <div className="text-xs text-gray-400">
                            {relatedArticle.readTime} • {relatedArticle.views?.toLocaleString()} 阅读
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/articles"
                  className="block w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-300 text-sm transition-colors"
                >
                  查看更多文章
                </Link>
              </div>
            )}

            {/* 热门标签 */}
            <div className="bg-[#1a1a1a] rounded-xl p-4 sm:p-5">
              <h3 className="text-lg font-bold text-white mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(guides.flatMap(guide => guide.tags || []))).slice(0, 8).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs rounded-lg cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
