/**
 * 资源数据模型
 * 处理资源相关的数据库操作
 */

import { query, execute } from '../database';
import { Resource, ResourceDetail, ResourceLink, QueryParams, PaginatedResult, Category } from '../../types/database';
import { generateId } from '../utils/id-generator';

/**
 * 资源模型类
 */
export class ResourceModel {
  /**
   * 获取资源列表
   * @param params 查询参数
   * @returns 分页资源数据
   */
  static async getResources(params: QueryParams = {}): Promise<PaginatedResult<Resource>> {
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
    let whereClause = 'WHERE r.status = ?';
    let queryParams: any[] = [status];

    // 添加分类筛选
    if (category_id) {
      whereClause += ' AND rc.category_id = ?';
      queryParams.push(category_id);
    }

    // 添加搜索条件
    if (search) {
      whereClause += ' AND (r.name LIKE ? OR r.description LIKE ? OR r.tags LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // 构建查询语句
    const baseQuery = category_id
      ? `FROM resource r 
         INNER JOIN resource_category rc ON r.id = rc.resource_id 
         ${whereClause}`
      : `FROM resource r ${whereClause}`;

    // 获取总数
    const countSql = `SELECT COUNT(DISTINCT r.id) as total ${baseQuery}`;
    const countResult = await query<any[]>(countSql, queryParams);
    const total = countResult[0].total;

    // 获取数据
    const dataSql = `
      SELECT DISTINCT r.* 
      ${baseQuery}
      ORDER BY r.${sort} ${order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;
    queryParams.push(limit, offset);
    
    const resources = await query<(Resource & any)[]>(dataSql, queryParams);

    return {
      data: resources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * 根据ID获取资源详情
   * @param id 资源ID
   * @returns 资源详情
   */
  static async getResourceById(id: string): Promise<ResourceDetail | null> {
    // 获取基础资源信息
    const resourceSql = 'SELECT * FROM resource WHERE id = ? AND status = ?';
    const resourceResult = await query<(Resource & any)[]>(resourceSql, [id, 'active']);

    if (resourceResult.length === 0) {
      return null;
    }

    const resource = resourceResult[0];

    // 获取分类信息
    const categorySql = `
      SELECT c.* 
      FROM category c
      INNER JOIN resource_category rc ON c.id = rc.category_id
      WHERE rc.resource_id = ? AND c.status = ?
    `;
    const categories = await query<(Category & any)[]>(categorySql, [id, 'active']);

    // 获取下载链接
    const linkSql = 'SELECT * FROM resource_link WHERE resource_id = ? AND status = ? ORDER BY weight DESC';
    const downloadLinks = await query<(ResourceLink & any)[]>(linkSql, [id, 'active']);

    // 解析图片画廊
    let galleries_parsed: string[] = [];
    if (resource.galleries) {
      try {
        galleries_parsed = JSON.parse(resource.galleries);
      } catch (e) {
        galleries_parsed = [];
      }
    }

    return {
      ...resource,
      categories,
      downloadLinks,
      galleries_parsed
    };
  }

  /**
   * 获取热门资源
   * @param limit 限制数量
   * @returns 热门资源列表
   */
  static async getHotResources(limit: number = 6): Promise<Resource[]> {
    const sql = `
      SELECT * FROM resource 
      WHERE status = 'active' AND (is_hot::text IN ('1','t','true'))
      ORDER BY weight DESC, download_count DESC, view_count DESC
      LIMIT ?
    `;
    return await query<(Resource & any)[]>(sql, [limit]);
  }

  /**
   * 获取精选资源
   * @param limit 限制数量
   * @returns 精选资源列表
   */
  static async getFeaturedResources(limit: number = 8): Promise<Resource[]> {
    const sql = `
      SELECT * FROM resource 
      WHERE status = 'active' AND (is_featured::text IN ('1','t','true'))
      ORDER BY weight DESC, created_time DESC
      LIMIT ?
    `;
    return await query<(Resource & any)[]>(sql, [limit]);
  }

  /**
   * 获取最新资源
   * @param limit 限制数量
   * @returns 最新资源列表
   */
  static async getNewResources(limit: number = 6): Promise<Resource[]> {
    const sql = `
      SELECT * FROM resource 
      WHERE status = 'active' AND (is_new::text IN ('1','t','true'))
      ORDER BY created_time DESC
      LIMIT ?
    `;
    return await query<(Resource & any)[]>(sql, [limit]);
  }

  /**
   * 按分类ID集合随机获取资源
   * @param categoryIds 分类ID数组
   * @param limit 返回数量
   */
  static async getRandomResourcesByCategoryIds(categoryIds: string[], limit: number = 8): Promise<Resource[]> {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return [];
    }

    const placeholders = categoryIds.map(() => '?').join(',');
    const sql = `
      SELECT r.*
      FROM resource r
      WHERE r.status = 'active'
        AND r.id IN (
          SELECT DISTINCT rc.resource_id
          FROM resource_category rc
          WHERE rc.category_id IN (${placeholders})
        )
      ORDER BY RANDOM()
      LIMIT ?
    `;

    return await query<(Resource & any)[]>(sql, [...categoryIds, limit]);
  }

  /**
   * 按顶级分类别名随机获取资源（自动聚合其子分类）
   * @param alias 顶级分类的 alias（如 android、pc）
   * @param limit 返回数量
   */
  static async getRandomResourcesByCategoryAlias(alias: string, limit: number = 8): Promise<Resource[]> {
    // 查找顶级分类
    const parentRows = await query<(any & { id: string })[]>(
      `SELECT id FROM category WHERE level = 0 AND alias = ? AND status = ? LIMIT 1`,
      [alias, 'active']
    );

    if (parentRows.length === 0) {
      return [];
    }

    const parentId = parentRows[0].id;

    // 查找其子分类
    const childRows = await query<(any & { id: string })[]>(
      `SELECT id FROM category WHERE parent_id = ? AND status = ?`,
      [parentId, 'active']
    );

    const categoryIds = childRows.length > 0 ? childRows.map(r => r.id) : [parentId];
    return await this.getRandomResourcesByCategoryIds(categoryIds, limit);
  }

  /**
   * 按顶级分类别名获取资源（按权重排序）
   * @param alias 顶级分类的 alias（如 android、pc）
   * @param limit 返回数量
   */
  static async getResourcesByCategoryAliasOrderedByWeight(alias: string, limit: number = 8): Promise<Resource[]> {
    // 查找顶级分类
    const parentRows = await query<(any & { id: string })[]>(
      `SELECT id FROM category WHERE level = 0 AND alias = ? AND status = ? LIMIT 1`,
      [alias, 'active']
    );

    if (parentRows.length === 0) {
      return [];
    }

    const parentId = parentRows[0].id;

    // 查找其子分类
    const childRows = await query<(any & { id: string })[]>(
      `SELECT id FROM category WHERE parent_id = ? AND status = ?`,
      [parentId, 'active']
    );

    const categoryIds = childRows.length > 0 ? childRows.map(r => r.id) : [parentId];

    const placeholders = categoryIds.map(() => '?').join(',');
    const sql = `
      SELECT r.*
      FROM resource r
      WHERE r.status = 'active'
        AND r.id IN (
          SELECT DISTINCT rc.resource_id
          FROM resource_category rc
          WHERE rc.category_id IN (${placeholders})
        )
      ORDER BY r.weight DESC, r.created_time DESC
      LIMIT ?
    `;

    return await query<(Resource & any)[]>(sql, [...categoryIds, limit]);
  }

  /**
   * 获取高评分资源
   * @param limit 限制数量
   * @returns 高评分资源列表
   */
  static async getTopRatedResources(limit: number = 6): Promise<Resource[]> {
    const sql = `
      SELECT * FROM resource 
      WHERE status = 'active' AND rating IS NOT NULL
      ORDER BY rating DESC, view_count DESC
      LIMIT ?
    `;
    return await query<(Resource & any)[]>(sql, [limit]);
  }

  /**
   * 按多个分类ID一次性查询资源并分页（避免对每个子分类分别查询造成的性能问题）
   * @param categoryIds 分类ID数组
   * @param params 查询与分页参数
   */
  static async getResourcesByCategoryIds(
    categoryIds: string[],
    params: QueryParams = {}
  ): Promise<PaginatedResult<Resource>> {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return {
        data: [],
        total: 0,
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        totalPages: 0
      };
    }

    const {
      page = 1,
      limit = 12,
      status = 'active',
      sort = 'download_count',
      order = 'desc'
    } = params;

    const offset = (page - 1) * limit;

    // 统计总数（去重资源ID）
    const placeholders = categoryIds.map(() => '?').join(',');
    const countSql = `
      SELECT COUNT(DISTINCT r.id) AS total
      FROM resource r
      INNER JOIN resource_category rc ON rc.resource_id = r.id
      WHERE r.status = ? AND rc.category_id IN (${placeholders})
    `;
    const countRows = await query<any[]>(countSql, [status, ...categoryIds]);
    const total = countRows[0]?.total ?? 0;

    // 查询数据：先取到去重后的资源ID，再回表拿完整字段，保证排序与分页正确且避免 DISTINCT 全行的性能开销
    const idSql = `
      SELECT DISTINCT r.id
      FROM resource r
      INNER JOIN resource_category rc ON rc.resource_id = r.id
      WHERE r.status = ? AND rc.category_id IN (${placeholders})
      ORDER BY r.${sort} ${order.toUpperCase()}
      LIMIT ? OFFSET ?
    `;
    const idRows = await query<(any & { id: string })[]>(idSql, [status, ...categoryIds, limit, offset]);
    const ids = idRows.map(r => r.id);

    if (ids.length === 0) {
      return {
        data: [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }

    const dataPlaceholders = ids.map(() => '?').join(',');
    const dataSql = `
      SELECT r.*
      FROM resource r
      WHERE r.id IN (${dataPlaceholders})
      ORDER BY r.${sort} ${order.toUpperCase()}
    `;
    const resources = await query<(Resource & any)[]>(dataSql, ids);

    return {
      data: resources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * 增加资源浏览次数
   * @param id 资源ID
   */
  static async incrementViewCount(id: string): Promise<void> {
    const sql = 'UPDATE resource SET view_count = view_count + 1 WHERE id = ?';
    await execute(sql, [id]);
  }

  /**
   * 增加资源下载次数
   * @param id 资源ID
   */
  static async incrementDownloadCount(id: string): Promise<void> {
    const sql = 'UPDATE resource SET download_count = download_count + 1 WHERE id = ?';
    await execute(sql, [id]);
  }

  /**
   * 批量获取多个分类ID的资源统计数量
   * @param categoryIds 分类ID数组
   * @returns 每个分类ID对应的资源数量
   */
  static async getBatchResourceCountsByCategoryIds(categoryIds: string[]): Promise<Record<string, number>> {
    if (categoryIds.length === 0) return {};

    const placeholders = categoryIds.map(() => '?').join(',');
    const sql = `
      SELECT rc.category_id, COUNT(DISTINCT r.id) as total
      FROM resource r
      INNER JOIN resource_category rc ON rc.resource_id = r.id
      WHERE r.status = ? AND rc.category_id IN (${placeholders})
      GROUP BY rc.category_id
    `;

    const result = await query<(any & { category_id: string; total: number })[]>(
      sql,
      ['active', ...categoryIds]
    );

    return Object.fromEntries(result.map(row => [row.category_id, row.total]));
  }

  /**
   * 搜索资源
   * @param keyword 搜索关键词
   * @param params 其他查询参数
   * @returns 搜索结果
   */
  static async searchResources(keyword: string, params: QueryParams = {}): Promise<PaginatedResult<Resource>> {
    return this.getResources({
      ...params,
      search: keyword
    });
  }

  /**
   * 创建资源
   * @param resourceData 资源数据
   * @returns 资源ID
   */
  static async createResource(resourceData: Partial<Resource>): Promise<string> {
    const id = generateId();
    const sql = `
      INSERT INTO resource (
        id, name, alias, description, rating, thumbnail, galleries,
        tags, developer, publisher, platforms, version, size, language,
        detail, release_date, official_link, is_featured, is_hot, is_new,
        weight, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await execute(sql, [
      id,
      resourceData.name,
      resourceData.alias || null,
      resourceData.description || null,
      resourceData.rating || 10,
      resourceData.thumbnail || null,
      resourceData.galleries || null,
      resourceData.tags || null,
      resourceData.developer || null,
      resourceData.publisher || null,
      resourceData.platforms || null,
      resourceData.version || null,
      resourceData.size || null,
      resourceData.language || null,
      resourceData.detail || null,
      resourceData.release_date || null,
      resourceData.official_link || null,
      resourceData.is_featured || false,
      resourceData.is_hot || false,
      resourceData.is_new || false,
      resourceData.weight || 0,
      resourceData.status || 'active'
    ]);

    return id;
  }
}
