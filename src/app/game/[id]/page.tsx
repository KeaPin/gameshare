"use client";

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { featuredGames } from '@/data/games';
import GameCard from '@/components/GameCard';
import GameImageCarousel from '@/components/GameImageCarousel';
import DownloadDialog from '@/components/DownloadDialog';

interface GameDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const resolvedParams = use(params);
  const gameId = parseInt(resolvedParams.id);
  const game = featuredGames.find(g => g.id === gameId);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();

  if (!game) {
    notFound();
  }

  // 获取相关游戏推荐（随机选择不同的游戏）
  const relatedGames = featuredGames.filter(g => g.id !== gameId).slice(0, 8);

  // 模拟游戏详细数据
  const gameDetail = {
    ...game,
    downloadCount: "12.4万",
    reviewCount: "2.2万", 
    followCount: "3.6万",
    releaseDate: "2024-01-15",
    developer: "官方公社",
    publisher: "半糖工作室",
    platforms: ["PC", "移动端"],
    version: "1.0.0",
    size: "2.1GB",
    language: "中文",
    ageRating: "12+",
    updateDate: "2024-12-20",
    announcement: "《大侠立志传外传》测试版正式公测，众位大侠快来体验吧！经过两年精心制作，不负大家的期待。现已开放全新剧情线和角色养成系统..."
  };

  // 模拟用户评价数据
  const reviews = [
    {
      id: 1,
      username: "游戏达人小李",
      rating: 5,
      date: "3天前",
      content: "这款游戏真的超出了我的期待！画面精美，剧情丰富，角色设计很有特色。特别是战斗系统，非常流畅，技能搭配也很有策略性。已经玩了50多个小时，还想继续探索更多内容。强烈推荐给喜欢RPG的玩家！",
      helpful: 23,
      device: "iPhone 15 Pro"
    },
    {
      id: 2,
      username: "休闲玩家",
      rating: 4,
      date: "1周前", 
      content: "整体体验不错，游戏优化得很好，在我的老手机上也能流畅运行。新手引导做得很贴心，上手很容易。就是有些任务比较重复，希望后续更新能增加更多玩法。不过瑕不掩瑜，是一款值得推荐的好游戏。",
      helpful: 12,
      device: "小米12"
    },
    {
      id: 3,
      username: "硬核玩家2024",
      rating: 4,
      date: "2周前",
      content: "游戏深度很不错，装备系统和技能树设计得很用心。PVP模式也很有趣，平衡性做得还可以。唯一的问题是服务器偶尔会卡顿，希望官方能优化一下网络连接。总的来说是一款高质量的作品。",
      helpful: 8,
      device: "iPad Pro"
    }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: game.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // 这里可以添加一个提示消息
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
          <Link href="/games" className="hover:text-white transition-colors whitespace-nowrap touch-manipulation min-h-[32px] flex items-center">
            游戏分类
          </Link>
          <span className="flex-shrink-0">›</span>
          <span className="text-white truncate">{game.title}</span>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{game.title}</h1>
              <p className="text-gray-400">{game.description}</p>
            </div>
            <div className="flex-shrink-0 text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold text-blue-300 mb-1">
                {game.rating?.toFixed(1) || "暂无"}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">评分品质</div>
            </div>
          </div>
          
          {/* 游戏标签 */}
          <div className="flex flex-wrap gap-2">
            {game.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* 游戏轮播图和操作区 */}
            <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* 游戏轮播图 */}
              <GameImageCarousel 
                images={game.images || [game.image]} 
                alt={game.title}
              />

              <div className="p-4 lg:p-6">
                {/* 统计数据 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 lg:mb-6">
                  <div className="text-center bg-gray-800/30 rounded-lg p-3">
                    <div className="text-sm sm:text-base lg:text-lg font-bold text-white">{gameDetail.downloadCount}</div>
                    <div className="text-xs sm:text-sm text-gray-400">下载量</div>
                  </div>
                  <div className="text-center bg-gray-800/30 rounded-lg p-3">
                    <div className="text-sm sm:text-base lg:text-lg font-bold text-white">{gameDetail.reviewCount}</div>
                    <div className="text-xs sm:text-sm text-gray-400">评价</div>
                  </div>
                  <div className="text-center bg-gray-800/30 rounded-lg p-3">
                    <div className="text-sm sm:text-base lg:text-lg font-bold text-white">{gameDetail.followCount}</div>
                    <div className="text-xs sm:text-sm text-gray-400">关注</div>
                  </div>
                  <div className="text-center bg-gray-800/30 rounded-lg p-3">
                    <div className="text-sm sm:text-base lg:text-lg font-bold text-white">{gameDetail.ageRating}</div>
                    <div className="text-xs sm:text-sm text-gray-400">年龄评级</div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setIsDownloadDialogOpen(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl py-3 sm:py-3 px-4 sm:px-6 font-semibold transition-colors flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7,10 12,15 17,10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span className="text-sm sm:text-base">网盘下载</span>
                  </button>
                  <button className="px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl transition-colors min-h-[48px] touch-manipulation">
                    <span className="text-sm sm:text-base">官方正版</span>
                  </button>
                  <div className="flex gap-3 sm:flex-shrink-0">
                    <button 
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={`px-3 sm:px-4 py-3 rounded-xl transition-colors flex items-center justify-center min-h-[48px] min-w-[48px] touch-manipulation ${
                        isFavorited 
                          ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white' 
                          : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white'
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    <button 
                      onClick={handleShare}
                      className="px-3 sm:px-4 py-3 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center min-h-[48px] min-w-[48px] touch-manipulation"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/>
                        <circle cx="6" cy="12" r="3"/>
                        <circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 游戏描述 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">游戏介绍</h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
                {game.description}
              </p>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {gameDetail.announcement}
              </p>
            </div>

            {/* 游戏详细信息 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">游戏信息</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">开发商</div>
                  <div className="text-sm sm:text-base text-white truncate">{gameDetail.developer}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">发行商</div>
                  <div className="text-sm sm:text-base text-white truncate">{gameDetail.publisher}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">发布日期</div>
                  <div className="text-sm sm:text-base text-white">{gameDetail.releaseDate}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">版本</div>
                  <div className="text-sm sm:text-base text-white">{gameDetail.version}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">大小</div>
                  <div className="text-sm sm:text-base text-white">{gameDetail.size}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">语言</div>
                  <div className="text-sm sm:text-base text-white">{gameDetail.language}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">支持平台</div>
                  <div className="text-sm sm:text-base text-white">{gameDetail.platforms.join(', ')}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">最后更新</div>
                  <div className="text-sm sm:text-base text-white">{gameDetail.updateDate}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-400 mb-1">年龄评级</div>
                  <div className="text-sm sm:text-base text-white">{gameDetail.ageRating}</div>
                </div>
              </div>
            </div>

            {/* 评价区域 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-white">用户评价 ({reviews.length} 条)</h2>
                <button className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors px-2 sm:px-3 py-1 bg-blue-400/10 rounded-lg touch-manipulation min-h-[32px]">
                  写评价
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-800 pb-4 sm:pb-6 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                        {review.username.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="text-sm sm:text-base text-white font-semibold truncate">{review.username}</span>
                          <div className="flex text-yellow-400 text-sm">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={i < review.rating ? "★" : "☆"}>★</span>
                            ))}
                          </div>
                          <span className="text-xs sm:text-sm text-gray-400">{review.date}</span>
                        </div>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed mb-3">
                          {review.content}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400">
                            <span className="truncate">来自 {review.device}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                            <button className="hover:text-white transition-colors flex items-center gap-1 touch-manipulation min-h-[32px] px-2 py-1 rounded">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                              </svg>
                              有帮助 ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧边栏 */}
          <div className="space-y-4 lg:space-y-6">
            {/* 相关游戏 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">相关游戏</h3>
              <div className="space-y-3 sm:space-y-4">
                {relatedGames.map((relatedGame) => (
                  <Link 
                    key={relatedGame.id} 
                    href={`/game/${relatedGame.id}`}
                    className="flex items-center gap-2 sm:gap-3 p-2 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer group touch-manipulation"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={relatedGame.image}
                        alt={relatedGame.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-xs sm:text-sm mb-1 line-clamp-1 group-hover:text-blue-300 transition-colors">
                        {relatedGame.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-blue-300 mb-1">
                        <span>★</span>
                        <span>{relatedGame.rating?.toFixed(1) || "暂无"}</span>
                      </div>
                      <div className="text-xs text-gray-400 line-clamp-1">
                        {relatedGame.tags.slice(0, 2).join(' · ')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link 
                href="/games/android"
                className="block w-full mt-3 sm:mt-4 py-2 text-center text-blue-400 hover:text-blue-300 text-xs sm:text-sm transition-colors touch-manipulation min-h-[32px] flex items-center justify-center"
              >
                查看全部
              </Link>
            </div>

            {/* 游戏标签 */}
            <div className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">游戏标签</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-xs sm:text-sm transition-colors cursor-pointer touch-manipulation"
                  >
                    {tag}
                  </span>
                ))}
                {/* 相关标签 */}
                {['开放世界', '多人在线', '竞技', '休闲', '策略', '动作'].map((tag, index) => (
                  <span 
                    key={`related-${index}`}
                    className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-800/50 hover:bg-gray-700 active:bg-gray-600 text-gray-400 hover:text-white rounded-lg text-xs sm:text-sm transition-colors cursor-pointer touch-manipulation"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下载对话框 */}
      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        onClose={() => setIsDownloadDialogOpen(false)}
        gameTitle={game.title}
        downloadLinks={game.downloadLinks || []}
      />
    </div>
  );
}
