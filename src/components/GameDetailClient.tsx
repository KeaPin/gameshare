"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GameImageCarousel from '@/components/GameImageCarousel';
import DownloadDialog from '@/components/DownloadDialog';
import type { DownloadLink } from '@/components/GameCard';
import type { Resource } from '@/types/database';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import remarkBreaks from 'remark-breaks';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|tel:|\/)/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return null;
}

function renderMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let source = markdown.replace(/\r\n?/g, '\n');

  const codeBlocks: Array<{ placeholder: string; html: string }> = [];
  source = source.replace(/```([a-zA-Z0-9_-]+)?\n([\s\S]*?)\n?```/g, (_m, lang, code, idx) => {
    const placeholder = `@@CODE_BLOCK_${codeBlocks.length}@@`;
    const language = typeof lang === 'string' ? lang.trim() : '';
    const escaped = escapeHtml(code ?? '');
    const classAttr = language ? ` class="language-${escapeHtml(language)}"` : '';
    codeBlocks.push({ placeholder, html: `<pre><code${classAttr}>${escaped}</code></pre>` });
    return placeholder;
  });

  source = escapeHtml(source);

  const lines = source.split('\n');
  const htmlParts: string[] = [];
  let inUl = false;
  let inOl = false;
  let inParagraph = false;

  const closeLists = () => {
    if (inUl) {
      htmlParts.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      htmlParts.push('</ol>');
      inOl = false;
    }
  };

  const closeParagraph = () => {
    if (inParagraph) {
      htmlParts.push('</p>');
      inParagraph = false;
    }
  };

  const renderInline = (text: string): string => {
    let result = text;
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
      const safeUrl = sanitizeUrl(url);
      const safeAlt = escapeHtml(alt || '');
      if (!safeUrl) return safeAlt;
      return `<img src="${safeUrl}" alt="${safeAlt}" loading="lazy" />`;
    });
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, textContent, url) => {
      const safeUrl = sanitizeUrl(url);
      const safeText = escapeHtml(textContent || '');
      if (!safeUrl) return safeText;
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
    });
    result = result.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);
    result = result.replace(/\*\*([^*]+)\*\*/g, (_m, bold) => `<strong>${bold}</strong>`);
    result = result.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, (_m, pre, italic) => `${pre}<em>${italic}</em>`);
    return result;
  };

  for (const rawLine of lines) {
    const line = rawLine;

    if (/^\s*$/.test(line)) {
      closeParagraph();
      closeLists();
      continue;
    }

    const hrMatch = /^-{3,}\s*$/.test(line);
    if (hrMatch) {
      closeParagraph();
      closeLists();
      htmlParts.push('<hr />');
      continue;
    }

    const hMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (hMatch) {
      closeParagraph();
      closeLists();
      const level = Math.min(6, hMatch[1].length);
      const content = renderInline(hMatch[2]);
      htmlParts.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    const quoteMatch = /^>\s?(.*)$/.exec(line);
    if (quoteMatch) {
      closeParagraph();
      closeLists();
      const content = renderInline(quoteMatch[1]);
      htmlParts.push(`<blockquote><p>${content}</p></blockquote>`);
      continue;
    }

    const ulMatch = /^\s*[-*+]\s+(.*)$/.exec(line);
    if (ulMatch) {
      if (!inUl) {
        closeParagraph();
        if (inOl) {
          htmlParts.push('</ol>');
          inOl = false;
        }
        htmlParts.push('<ul>');
        inUl = true;
      }
      htmlParts.push(`<li>${renderInline(ulMatch[1])}</li>`);
      continue;
    }

    const olMatch = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (olMatch) {
      if (!inOl) {
        closeParagraph();
        if (inUl) {
          htmlParts.push('</ul>');
          inUl = false;
        }
        htmlParts.push('<ol>');
        inOl = true;
      }
      htmlParts.push(`<li>${renderInline(olMatch[1])}</li>`);
      continue;
    }

    const content = renderInline(line);
    if (!inParagraph) {
      closeLists();
      htmlParts.push('<p>');
      inParagraph = true;
      htmlParts.push(content);
    } else {
      htmlParts.push(' ' + content);
    }
  }

  closeParagraph();
  closeLists();

  let html = htmlParts.join('\n');
  for (const block of codeBlocks) {
    html = html.split(block.placeholder).join(block.html);
  }
  return html;
}

function normalizeMarkdownInput(md?: string): string {
  if (!md) return '';
  const src = md.replace(/\r\n?/g, '\n');
  const fixed = src
    .split('\n')
    .map((line) =>
      line.replace(/^(\s{0,3})(#{1,6})([^#\s])/u, (_m, pre, hashes, ch) => `${pre}${hashes} ${ch}`)
    )
    .join('\n');
  return fixed;
}

type GameWithResource = Resource & {
  // 兼容现有前端字段（不覆盖 Resource 原字段）
  title?: string; // 对应 Resource.name
  image?: string; // 对应 Resource.thumbnail
  tags_array?: string[]; // 解析后的标签数组
  images?: string[]; // 解析后的图片数组
  downloadLinks?: DownloadLink[]; // 前端下载链接结构
};

interface GameDetailClientProps {
  game: GameWithResource;
  gameDetail: {
    preorderCount: string;
    reviewCount: string;
    followCount: string;
    releaseDate: string;
    developer: string;
    publisher: string;
    platforms: string[];
    version: string;
    size: string;
    language: string;
    announcement: string;
  };
  reviews: {
    id: string;
    username: string;
    rating: number;
    date: string;
    content: string;
    helpful: number;
    device: string;
  }[];
  relatedGames: {
    id: string;
    title: string;
    image: string;
    rating?: number;
    tags: string[];
  }[];
}

export default function GameDetailClient({ game, gameDetail, reviews, relatedGames }: GameDetailClientProps) {
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([]);
  const [ratingCounts, setRatingCounts] = useState<number[]>([]);

  // 解析工具
  const parseStringList = (value?: string): string[] => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
    return value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const gameTitle = game.title || game.name || '未知游戏';
  const gameImage = game.image || game.thumbnail || '/default.webp';
  const tagsArray = Array.isArray(game.tags_array)
    ? game.tags_array
    : parseStringList(game.tags);
  const imagesToShow = parseStringList(game.galleries);
  const normalizedDetail = normalizeMarkdownInput(game.detail || '');

  // 监听滚动事件，显示/隐藏回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize rating data after hydration to avoid mismatch
  useEffect(() => {
    // Generate consistent random values for rating distribution
    const distribution = [5, 4, 3, 2, 1].map(() => Math.random() * 80 + 10);
    const counts = [5, 4, 3, 2, 1].map(() => Math.floor(Math.random() * 50));
    
    setRatingDistribution(distribution);
    setRatingCounts(counts);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要内容区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 游戏基本信息 */}
          <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
            {/* 游戏轮播图 */}
            <GameImageCarousel
              images={imagesToShow}
              alt={gameTitle}
            />

            {/* 游戏信息 */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={gameImage}
                      alt={gameTitle}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">{gameTitle}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{gameDetail.platforms.join(', ')}</span>
                      <span>•</span>
                      <span>{gameDetail.version}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-300 mb-1">
                    {game.rating || "暂无"}
                  </div>
                  <div className="text-sm text-gray-400">评分品质</div>
                </div>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{gameDetail.size}</div>
                  <div className="text-sm text-gray-400">游戏大小</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{gameDetail.language}</div>
                  <div className="text-sm text-gray-400">支持语言</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{gameDetail.version}</div>
                  <div className="text-sm text-gray-400">当前版本</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{gameDetail.releaseDate}</div>
                  <div className="text-sm text-gray-400">上线日期</div>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tagsArray.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsDownloadDialogOpen(true)}
                  className="flex-1 sm:flex-none px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  网盘下载
                </button>
                <button className="flex-1 sm:flex-none px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  官方正版
                </button>
                <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 游戏描述 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">游戏介绍</h2>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed mb-4 text-sm">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm /*, (remarkBreaks as any)*/]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-3 mb-2" {...props} />,
                  }}
                >
                  {normalizedDetail}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* 评价区域 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-white">用户评价</h2>
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                写评价
              </button>
            </div>

            {/* 评分统计 */}
            <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300 mb-1">{game.rating || "暂无"}</div>
                  <div className="flex justify-center text-yellow-400 mb-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < Math.floor(game.rating || 0) ? "★" : "☆"}>★</span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-400">总体评分</div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star, index) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 w-2">{star}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 transition-all duration-300" 
                          style={{ width: `${ratingDistribution[index] || 0}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-xs w-8">{ratingCounts[index] || 0}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center text-center text-sm text-gray-400">
                  <div>推荐度: <span className="text-green-400 font-semibold">85%</span></div>
                </div>
              </div>
            </div>

            {/* 评价列表 */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800/20 rounded-xl p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {review.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">{review.username}</span>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`text-xs ${i < review.rating ? "★" : "☆"}`}>★</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">·</span>
                        <span className="text-sm text-gray-400">{review.date}</span>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{review.device}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-3 text-sm">
                        {review.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-300 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            有帮助 ({review.helpful})
                          </button>
                          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-8m-7.667 5l-3.5-3.5a.75.75 0 011.06-1.061l2.44 2.44L17.5 3.5a.75.75 0 111.061 1.061L11 12.5z" />
                            </svg>
                            举报
                          </button>
                        </div>
                        <button className="text-sm text-gray-400 hover:text-blue-300 transition-colors">
                          回复
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 加载更多 */}
            <div className="text-center mt-6">
              <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
                查看更多评价
              </button>
            </div>
          </div>
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-6">
          {/* 相关游戏 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5">
            <h3 className="text-lg font-bold text-white mb-4">相关游戏</h3>
            <div className="space-y-4">
              {relatedGames.map((relatedGame) => (
                <Link key={relatedGame.id} href={`/game/${relatedGame.id}`} className="block">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group">
                    <div className="w-32 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={relatedGame.image}
                        alt={relatedGame.title}
                        width={128}
                        height={64}
                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1 group-hover:text-blue-300 transition-colors">
                        {relatedGame.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-blue-300 mb-1">
                        <span>★</span>
                        <span>{relatedGame.rating || "暂无"}</span>
                      </div>
                      <div className="text-xs text-gray-400 line-clamp-1">
                        {relatedGame.tags.slice(0, 2).join(' · ')}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-300 text-sm transition-colors">
              查看全部
            </button>
          </div>

          {/* 游戏标签 */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5">
            <h3 className="text-lg font-bold text-white mb-4">游戏标签</h3>
            <div className="flex flex-wrap gap-2">
              {tagsArray.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
              {/* 相关标签 */}
              {['开放世界', '多人在线', '竞技', '休闲', '策略', '动作'].map((tag, index) => (
                <span
                  key={`related-${index}`}
                  className="px-3 py-2 bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-sm transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 回到顶部按钮 */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="回到顶部"
        >
          <svg 
            className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}

      {/* 下载对话框 */}
      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        onClose={() => setIsDownloadDialogOpen(false)}
        gameTitle={gameTitle}
        downloadLinks={game.downloadLinks || []}
      />
    </>
  );
}
