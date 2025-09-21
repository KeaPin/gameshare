import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { featuredGames } from '@/data/games';
import GameDetailClient from '@/components/GameDetailClient';
import { Metadata } from 'next';

interface GameDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const gameId = parseInt(resolvedParams.id);
  const game = featuredGames.find(g => g.id === gameId);
  
  if (!game) {
    return {
      title: '游戏未找到 - 游戏分享',
      description: '您查找的游戏不存在或已被移除。',
    };
  }
  
  return {
    title: `${game.title} - 游戏详情`,
    description: game.description || `下载和了解更多关于${game.title}的信息，包括游戏截图、评价和系统要求。`,
    keywords: `${game.title},游戏下载,${game.tags.join(',')},游戏评价`,
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
    const resolvedParams = await params;
    const gameId = parseInt(resolvedParams.id);
    const game = featuredGames.find(g => g.id === gameId);

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
                    game={game}
                    gameDetail={gameDetail}
                    reviews={reviews}
                    relatedGames={relatedGames}
                />
            </div>
        </div>
    );
}
