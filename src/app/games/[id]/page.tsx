"use client";

import { notFound } from 'next/navigation';
import Image from 'next/image';
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

  if (!game) {
    notFound();
  }

  // 获取相关游戏推荐（随机选择不同的游戏）
  const relatedGames = featuredGames.filter(g => g.id !== gameId).slice(0, 8);

  // 模拟游戏详细数据
  const gameDetail = {
    ...game,
    preorderCount: "2.4万",
    reviewCount: "2.2万",
    followCount: "26年02",
    releaseDate: "8+",
    developer: "官方公社",
    publisher: "半糖工作室",
    platforms: ["PC", "移动端"],
    version: "1.0.0",
    size: "2.1GB",
    language: "中文",
    announcement: "《大侠立志传外传》测试版正式公测，名位大侠好好玩，两年的时光精心制作，不负大家深等待！！，可是就怕大家不满意下单，来总是体验这不错，未来有..."
  };

  // 模拟用户评价数据
  const reviews = [
    {
      id: 1,
      username: "心动",
      rating: 5,
      date: "1打",
      content: "一代大侠现身争夺大侠人的小的，所有的DLC包含天人无大人的，当时真的是有意想不到的微妙角色设计感官界面也比较清爽的来。也承担不出现回血次数保值白白老婆这种状况，也是愿意是一位人的是现真人...",
      helpful: 2,
      device: "Redmi K70 Pro"
    },
    {
      id: 2,
      username: "学不会",
      rating: 5,
      date: "19小时前",
      content: "所有的效果真的棒极好了，更别说下面白应该，一起感应不见这个神感不错也蛮真技术很完善不错，玩起来想干什么出现天神的这。是天气预报：还不中文化妹子 0.5星1分玩这0.5星",
      helpful: 0,
      device: "口袋里"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-[1208px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主要内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 游戏基本信息 */}
            <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* 游戏轮播图 */}
              <GameImageCarousel 
                images={game.images || [game.image]} 
                alt={game.title}
              />

              {/* 游戏信息 */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={game.image}
                        alt={game.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">{game.title}</h1>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{gameDetail.developer}</span>
                        <span>•</span>
                        <span>官方公社</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-300 mb-1">
                      {game.rating?.toFixed(1) || "暂无"}
                    </div>
                    <div className="text-sm text-gray-400">评分品质</div>
                  </div>
                </div>

                {/* 统计数据 */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{gameDetail.preorderCount}</div>
                    <div className="text-sm text-gray-400">预约</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{gameDetail.reviewCount}</div>
                    <div className="text-sm text-gray-400">评分用户</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{gameDetail.followCount}</div>
                    <div className="text-sm text-gray-400">关注</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{gameDetail.releaseDate}</div>
                    <div className="text-sm text-gray-400">上线日期</div>
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {game.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDownloadDialogOpen(true)}
                    className="px-18 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition-colors"
                  >
                    网盘下载
                  </button>
                  <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">
                    官方正版
                  </button>
                </div>
              </div>
            </div>

            {/* 游戏描述 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">游戏介绍</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {game.description}
              </p>
              <p className="text-gray-300 leading-relaxed">
                开发者的话：这款游戏的玩法，而原题材的光芒时期，不是做大家这样不信这个项目拍经验的，
                并没有创意下本，未来有看高预关一下，本版游戏可能作品的简介，所以能的视线一边优化...
              </p>
            </div>

            {/* 评价区域 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">评价 104 条</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">写评价</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-800 pb-6 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.username.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-semibold">{review.username}</span>
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={i < review.rating ? "★" : "☆"}>★</span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">{review.date}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-3">
                          {review.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>得分于 {review.device}</span>
                            <span>口袋里</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <button className="hover:text-white transition-colors">
                              有帮助 {review.helpful}
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
          <div className="space-y-6">
            {/* 相关游戏 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-4">相关游戏</h3>
              <div className="space-y-4">
                {relatedGames.map((relatedGame) => (
                  <div key={relatedGame.id} className="flex items-center gap-3 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <div className="w-32 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={relatedGame.image}
                        alt={relatedGame.title}
                        width={12823
                          
                        }
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
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
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                查看全部
              </button>
            </div>

            {/* 游戏标签 */}
            <div className="bg-[#1a1a1a] rounded-2xl p-5">
              <h3 className="text-lg font-bold text-white mb-4">游戏标签</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag, index) => (
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
