/**
 * 数据库种子数据填充 API
 * 用于填充测试数据到数据库
 */

import { NextRequest, NextResponse } from 'next/server';
import { ResourceModel, ArticleModel, CategoryModel } from '@/lib/models';
import { generateId } from '@/lib/utils/id-generator';

// 基础分类数据
const seedCategories = [
  // 平台分类
  { type: 'Platform', name: 'Android', icon: '/android.svg', level: 0 },
  { type: 'Platform', name: 'iOS', icon: '/ios.svg', level: 0 },
  { type: 'Platform', name: 'Windows', icon: '/windows.svg', level: 0 },
  { type: 'Platform', name: 'Mac', icon: '/mac.svg', level: 0 },
  { type: 'Platform', name: 'Linux', icon: '/linux.svg', level: 0 },
  
  // 游戏类型分类
  { type: 'Genre', name: 'RPG', icon: '/rpg.svg', level: 0 },
  { type: 'Genre', name: '策略', icon: '/strategy.svg', level: 0 },
  { type: 'Genre', name: '射击', icon: '/fps.svg', level: 0 },
  { type: 'Genre', name: '冒险', icon: '/adventure.svg', level: 0 },
  { type: 'Genre', name: '模拟', icon: '/simulation.svg', level: 0 },
  { type: 'Genre', name: '竞技', icon: '/competitive.svg', level: 0 },
  { type: 'Genre', name: '休闲', icon: '/casual.svg', level: 0 },
  
  // 文章分类
  { type: 'Article', name: '游戏攻略', icon: '/guide.svg', level: 0 },
  { type: 'Article', name: '新闻资讯', icon: '/news.svg', level: 0 },
  { type: 'Article', name: '评测', icon: '/review.svg', level: 0 },
];

// 示例资源数据
const seedResources = [
  {
    name: '大侠立志传外传',
    description: '正式上线，TapTap专属折扣开启中！国产原始题材生存沙盒游戏，从零开始壮大氏族',
    rating: 9.4,
    thumbnail: '/default.webp',
    galleries: JSON.stringify(['/default.webp', '/file.svg', '/globe.svg']),
    tags: '模拟,角色扮演,冒险',
    platforms: 'Windows,Android',
    size: '2.1GB',
    language: '简体中文',
    is_featured: true,
    is_hot: true,
    weight: 100
  },
  {
    name: '星际争霸重制版',
    description: '经典RTS游戏重制，全新画面呈现经典策略对战',
    rating: 9.1,
    thumbnail: '/default.webp',
    galleries: JSON.stringify(['/default.webp', '/file.svg', '/globe.svg']),
    tags: '策略,RTS,经典',
    platforms: 'Windows,Mac',
    size: '3.5GB',
    language: '简体中文,English',
    is_featured: true,
    weight: 90
  }
];

// 示例文章数据
const seedArticles = [
  {
    title: '《大侠立志传外传》完全通关攻略',
    summary: '从新手入门到高手进阶，详细解析游戏各个系统和通关技巧，让你快速成为武林高手。',
    content: `# 《大侠立志传外传》完全通关攻略

## 角色创建与初始选择

在开始游戏时，角色的初始属性和技能选择非常重要。建议新手玩家选择...

## 武功秘籍获取指南

游戏中共有108种武功秘籍，获取方式各不相同...`,
    thumbnail: '/default.webp',
    tags: JSON.stringify(['RPG', '通关攻略', '新手指南']),
    is_featured: true,
    is_top: false
  },
  {
    title: '星际争霸重制版：虫族完全进阶指南',
    summary: '从基础操作到高阶战术，全面解析虫族的各种战术体系和应对策略。',
    content: `# 星际争霸重制版：虫族完全进阶指南

## 基础建造顺序

虫族的开局建造顺序直接影响后期发展...`,
    thumbnail: '/default.webp',
    tags: JSON.stringify(['RTS', '虫族', '竞技']),
    is_featured: true,
    is_top: true
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { action?: string };
    const { action = 'seed_all' } = body;

    const results = {
      categories: 0,
      resources: 0,
      articles: 0
    };

    if (action === 'seed_all' || action === 'seed_categories') {
      // 填充分类数据
      for (const category of seedCategories) {
        try {
          await CategoryModel.createCategory({
            ...category,
            description: `${category.name}分类`,
            weight: 50,
            status: 'active'
          });
          results.categories++;
        } catch (error) {
          console.error(`Failed to create category ${category.name}:`, error);
        }
      }
    }

    if (action === 'seed_all' || action === 'seed_resources') {
      // 填充资源数据
      for (const resource of seedResources) {
        try {
          const resourceId = await ResourceModel.createResource({
            ...resource,
            status: 'active'
          });
          
          // 为资源添加分类关系（这里需要实现关系表的操作）
          console.log(`Created resource: ${resourceId}`);
          results.resources++;
        } catch (error) {
          console.error(`Failed to create resource ${resource.name}:`, error);
        }
      }
    }

    if (action === 'seed_all' || action === 'seed_articles') {
      // 填充文章数据
      for (const article of seedArticles) {
        try {
          const articleId = await ArticleModel.createArticle({
            ...article,
            status: 'active'
          });
          
          console.log(`Created article: ${articleId}`);
          results.articles++;
        } catch (error) {
          console.error(`Failed to create article ${article.title}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeding completed',
      data: results
    });

  } catch (error) {
    console.error('Database seeding error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database seeding failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
