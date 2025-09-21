/**
 * 数据库连接测试 API 路由
 * 用于测试数据库连接和基本 CRUD 操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';
import { ResourceModel, ArticleModel, CategoryModel } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection failed' 
        },
        { status: 500 }
      );
    }

    // 测试基本查询操作
    const [categories, resources, articles] = await Promise.all([
      CategoryModel.getTopLevelCategories().catch(() => []),
      ResourceModel.getFeaturedResources(3).catch(() => []),
      ArticleModel.getFeaturedArticles(3).catch(() => [])
    ]);

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connection: 'OK',
        categories: categories.length,
        resources: resources.length,
        articles: articles.length,
        sample_data: {
          categories: categories.slice(0, 2),
          resources: resources.slice(0, 2),
          articles: articles.slice(0, 2)
        }
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database test failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { action?: string };
    const { action } = body;

    switch (action) {
      case 'test_insert':
        // 测试插入操作
        const testCategoryId = await CategoryModel.createCategory({
          type: 'Test',
          name: `测试分类 ${Date.now()}`,
          icon: '/test.svg',
          weight: 0,
          status: 'active'
        });

        return NextResponse.json({
          success: true,
          message: 'Insert test successful',
          data: { categoryId: testCategoryId }
        });

      case 'test_query':
        // 测试查询操作
        const queryResult = await CategoryModel.getCategories('Test');
        
        return NextResponse.json({
          success: true,
          message: 'Query test successful',
          data: { count: queryResult.length, items: queryResult }
        });

      case 'cleanup':
        // 清理测试数据
        const testCategories = await CategoryModel.getCategories('Test');
        
        for (const category of testCategories) {
          await CategoryModel.deleteCategory(category.id);
        }

        return NextResponse.json({
          success: true,
          message: 'Cleanup completed',
          data: { deletedCount: testCategories.length }
        });

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Database operation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database operation failed', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
