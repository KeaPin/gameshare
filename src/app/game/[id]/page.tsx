import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GameDetailClient from '@/components/GameDetailClient';
import { Metadata } from 'next';
import { getGameDetail } from '@/lib/services/gameService';
import { ResourceModel } from '@/lib/models/ResourceModel';

interface GameDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const gameId = resolvedParams.id;
  
  // 从数据库获取游戏信息用于生成元数据
  const gameDetailData = await getGameDetail(gameId);
  
  if (!gameDetailData) {
    return {
      title: '游戏未找到 - 游戏分享',
      description: '您查找的游戏不存在或已被移除。',
    };
  }
  
  const { game } = gameDetailData;
  
  return {
    title: `${game.title} - 游戏详情`,
    description: game.description || `下载和了解更多关于${game.title}的信息，包括游戏截图、评价和系统要求。`,
    keywords: [
      game.title,
      '游戏下载',
      ...game.tags,
      '游戏评价'
    ],
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
    const resolvedParams = await params;
    const gameId = resolvedParams.id;
    
    // 从数据库获取游戏详情数据
    const gameDetailData = await getGameDetail(gameId);

    if (!gameDetailData) {
        notFound();
    }

    const { game, detailedData, reviews, relatedGames } = gameDetailData;

    // 获取完整的资源字段（包含 Resource 的所有字段）
    const resourceDetail = await ResourceModel.getResourceById(gameId);
    if (!resourceDetail) {
        notFound();
    }

    // 合并生成前端所需的 game 对象：包含 Resource 全字段 + 兼容的前端字段
    const gameForClient = {
        ...resourceDetail,
        title: game.title,
        image: game.image,
        rating: game.rating,
        // Resource.tags 为字符串，这里保留，同时提供解析后的数组以供前端直接使用
        tags_array: game.tags,
        description: game.description,
        detail: game.detail,
        downloadLinks: game.downloadLinks?.map(link => ({
            name: link.platform,
            url: link.url,
            password: link.password
        })),
        images: game.images
    };

    // 构建游戏详细信息
    const gameDetail = {
        preorderCount: "2.4万",
        reviewCount: "2.2万",
        followCount: "26年02",
        releaseDate: game.releaseDate || "未知",
        developer: game.developer || "未知开发商",
        publisher: game.publisher || "未知发行商",
        platforms: game.platforms ? game.platforms.split(',') : ["PC"],
        version: game.version || "1.0.0",
        size: game.size || "未知",
        language: game.language || "中文",
        announcement: "游戏详情页面，欢迎体验！"
    };

    // 转换相关游戏数据
    const relatedGamesForClient = relatedGames.map(relatedGame => ({
        id: String(relatedGame.id),
        title: relatedGame.title,
        image: relatedGame.image,
        rating: relatedGame.rating,
        tags: relatedGame.tags
    }));

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* 面包屑导航 */}
            <div className="max-w-[1208px] mx-auto px-3 sm:px-4 py-3">
                <nav className="flex items-center gap-2 text-sm text-gray-400">
                    <Link href="/" className="hover:text-white transition-colors">
                        首页
                    </Link>
                    <span>›</span>
                    <Link href="/games" className="hover:text-white transition-colors">
                        游戏
                    </Link>
                    <span>›</span>
                    <span className="text-white">{game.title}</span>
                </nav>
            </div>
            
            <div className="max-w-[1208px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <GameDetailClient 
                    game={gameForClient}
                    gameDetail={gameDetail}
                    reviews={reviews}
                    relatedGames={relatedGamesForClient}
                />
            </div>
        </div>
    );
}
