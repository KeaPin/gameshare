/**
 * 文章数据模型
 * 处理文章相关的数据库操作
 */

import { RowDataPacket } from 'mysql2/promise';
import { query, execute } from '../database';
import { Article, ArticleDetail, QueryParams, PaginatedResult, Category } from '../../types/database';
import { generateId } from '../utils/id-generator';

/**
 * 文章模型类
 */
export class ArticleModel {
  /**
   * 获取文章列表
   * @param params 查询参数
   * @returns 分页文章数据
   */
  static async getArticles(params: QueryParams = {}): Promise<PaginatedResult<Article>> {
    const {
      page = 1,
      limit = 12,
      category_id,
      status = 'active',
      search,
      sort = 'created_time',
      order = 'desc'
    } = params;

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE a.status = ?';
    let queryParams: any[] = [status];

    // 添加分类筛选
    if (category_id) {
      whereClause += ' AND ac.category_id = ?';
      queryParams.push(category_id);
    }

    // 添加搜索条件
    if (search) {
      whereClause += ' AND (a.title LIKE ? OR a.summary LIKE ? OR a.content LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // 构建查询语句
    const baseQuery = category_id
      ? `FROM article a 
         INNER JOIN article_category ac ON a.id = ac.article_id 
         ${whereClause}`
      : `FROM article a ${whereClause}`;

    // 获取总数
    const countSql = `SELECT COUNT(DISTINCT a.id) as total ${baseQuery}`;
    const countResult = await query<RowDataPacket[]>(countSql, queryParams);
    const total = countResult[0].total;

    // 获取数据
    const dataSql = `
      SELECT DISTINCT a.* 
      ${baseQuery}
      ORDER BY a.${sort} ${order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;
    queryParams.push(limit, offset);
    
    const articles = await query<(Article & RowDataPacket)[]>(dataSql, queryParams);

    return {
      data: articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * 根据ID获取文章详情
   * @param id 文章ID
   * @returns 文章详情
   */
  static async getArticleById(id: string): Promise<ArticleDetail | null> {
    // 获取基础文章信息
    const articleSql = 'SELECT * FROM article WHERE id = ? AND status = ?';
    const articleResult = await query<(Article & RowDataPacket)[]>(articleSql, [id, 'active']);

    if (articleResult.length === 0) {
      return null;
    }

    const article = articleResult[0];

    // 获取分类信息
    const categorySql = `
      SELECT c.* 
      FROM category c
      INNER JOIN article_category ac ON c.id = ac.category_id
      WHERE ac.article_id = ? AND c.status = ?
    `;
    const categories = await query<(Category & RowDataPacket)[]>(categorySql, [id, 'active']);

    // 解析标签
    let tags_parsed: string[] = [];
    if (article.tags) {
      try {
        tags_parsed = JSON.parse(article.tags);
      } catch (e) {
        tags_parsed = article.tags.split(',').map(tag => tag.trim());
      }
    }

    return {
      ...article,
      categories,
      tags_parsed
    };
  }

  /**
   * 获取精选文章
   * @param limit 限制数量
   * @returns 精选文章列表
   */
  static async getFeaturedArticles(limit: number = 6): Promise<Article[]> {
    const sql = `
      SELECT * FROM article 
      WHERE status = 'active' AND is_featured = 1
      ORDER BY created_time DESC
      LIMIT ?
    `;
    return await query<(Article & RowDataPacket)[]>(sql, [limit]);
  }

  /**
   * 获取置顶文章
   * @param limit 限制数量
   * @returns 置顶文章列表
   */
  static async getTopArticles(limit: number = 3): Promise<Article[]> {
    const sql = `
      SELECT * FROM article 
      WHERE status = 'active' AND is_top = 1
      ORDER BY created_time DESC
      LIMIT ?
    `;
    return await query<(Article & RowDataPacket)[]>(sql, [limit]);
  }

  /**
   * 获取热门文章（按浏览量排序）
   * @param limit 限制数量
   * @returns 热门文章列表
   */
  static async getPopularArticles(limit: number = 6): Promise<Article[]> {
    const sql = `
      SELECT * FROM article 
      WHERE status = 'active'
      ORDER BY view_count DESC, like_count DESC
      LIMIT ?
    `;
    return await query<(Article & RowDataPacket)[]>(sql, [limit]);
  }

  /**
   * 增加文章浏览次数
   * @param id 文章ID
   */
  static async incrementViewCount(id: string): Promise<void> {
    const sql = 'UPDATE article SET view_count = view_count + 1 WHERE id = ?';
    await execute(sql, [id]);
  }

  /**
   * 搜索文章
   * @param keyword 搜索关键词
   * @param params 其他查询参数
   * @returns 搜索结果
   */
  static async searchArticles(keyword: string, params: QueryParams = {}): Promise<PaginatedResult<Article>> {
    return this.getArticles({
      ...params,
      search: keyword
    });
  }

  /**
   * 创建文章
   * @param articleData 文章数据
   * @returns 文章ID
   */
  static async createArticle(articleData: Partial<Article>): Promise<string> {
    const id = generateId();
    const sql = `
      INSERT INTO article (
        id, title, summary, content, thumbnail, tags,
        is_featured, is_top, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await execute(sql, [
      id,
      articleData.title,
      articleData.summary || null,
      articleData.content,
      articleData.thumbnail || null,
      articleData.tags || null,
      articleData.is_featured || false,
      articleData.is_top || false,
      articleData.status || 'active'
    ]);

    return id;
  }
}
