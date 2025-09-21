"use client";

import { useState } from 'react';
import Image from 'next/image';
import ArticleCard from '@/components/ArticleCard';

interface ArticleDetailClientProps {
  article: {
    id: number;
    title: string;
    summary: string;
    image: string;
    category: string;
    publishDate: string;
    views: number;
    tags?: string[];
  };
  relatedArticles: {
    id: number;
    title: string;
    image: string;
    category: string;
    tags?: string[];
  }[];
}

export default function ArticleDetailClient({ article, relatedArticles }: ArticleDetailClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      // 回退到复制链接
      navigator.clipboard.writeText(window.location.href);
      // 这里可以添加一个toast提示
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // 这里可以添加实际的收藏逻辑
  };

  const handleLike = () => {
    setLiked(!liked);
    // 这里可以添加实际的点赞逻辑
  };

  return (
    <>
      {/* 文章内容 */}
      <article className="bg-[#1a1a1a] rounded-2xl overflow-hidden mb-6">
        {/* 文章封面图 */}
        <div className="relative aspect-[16/9] bg-gray-800">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* 文章分类标签 */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-blue-600/90 text-white rounded-full text-sm font-medium backdrop-blur-sm">
              {article.category}
            </span>
          </div>
        </div>

        {/* 文章信息 */}
        <div className="p-6">
          {/* 文章标题 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>

          {/* 文章元信息 */}
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                A
              </div>
              <span>作者</span>
            </div>
            <span>•</span>
            <span>{article.publishDate}</span>
            <span>•</span>
            <span>{article.views} 次阅读</span>
            <span>•</span>
            <span>5 分钟阅读</span>
          </div>

          {/* 文章摘要 */}
          <div className="text-gray-300 text-lg leading-relaxed mb-8 p-4 bg-gray-800/30 rounded-lg border-l-4 border-blue-500">
            {article.summary}
          </div>

          {/* 文章正文 */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              <p>
                在这篇详细的攻略中，我们将为您提供完整的游戏指南，帮助您更好地理解游戏机制，掌握关键技巧，并在游戏中取得更好的成绩。
              </p>
              
              <h2 className="text-xl font-bold text-white mt-8 mb-4">游戏基础概念</h2>
              <p>
                首先，让我们了解一些基本概念。这些概念对于理解整个游戏系统至关重要，是您成功的基础。
              </p>
              
              <h3 className="text-lg font-bold text-white mt-6 mb-3">核心机制</h3>
              <p>
                游戏的核心机制包括资源管理、角色发展和策略制定。理解这些机制将帮助您做出更明智的决策。
              </p>
              
              <h2 className="text-xl font-bold text-white mt-8 mb-4">进阶策略</h2>
              <p>
                掌握了基础知识后，我们来探讨一些进阶策略。这些策略可以帮助您在竞争中占据优势。
              </p>
              
              <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 my-6">
                <h4 className="text-amber-300 font-semibold mb-2">💡 专家提示</h4>
                <p className="text-amber-100">
                  记住，最重要的是保持耐心和练习。每个高手都是从新手开始的，关键是不断学习和改进。
                </p>
              </div>

              <h2 className="text-xl font-bold text-white mt-8 mb-4">常见问题解答</h2>
              <p>
                以下是玩家最常遇到的问题和解答：
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Q: 新手应该如何开始？</h4>
                  <p>A: 建议先完成教程任务，熟悉基本操作，然后逐步探索更复杂的功能。</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Q: 如何快速提升等级？</h4>
                  <p>A: 专注于完成日常任务和主线任务，这些通常提供最多的经验值。</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mt-8 mb-4">总结</h2>
              <p>
                通过本攻略，您应该已经掌握了游戏的核心要素和策略。记住，实践是最好的老师，不断游戏和实验将帮助您成为真正的专家。
              </p>
            </div>
          </div>

          {/* 文章标签 */}
          {article.tags && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-white font-semibold mb-3">相关标签</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full text-sm transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* 文章互动区域 */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                liked
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {liked ? '已点赞' : '点赞'}
            </button>
            
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isBookmarked
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {isBookmarked ? '已收藏' : '收藏'}
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            分享
          </button>
        </div>
      </div>

      {/* 相关文章 */}
      {relatedArticles.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">相关文章</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} guide={relatedArticle} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
