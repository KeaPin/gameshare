/**
 * 分类数据模型
 * 处理分类相关的数据库操作
 */

import { RowDataPacket } from 'mysql2/promise';
import { query, execute } from '../database';
import { Category } from '../../types/database';
import { generateId } from '../utils/id-generator';

/**
 * 分类模型类
 */
export class CategoryModel {
  /**
   * 获取所有分类
   * @param type 分类类型筛选（可选）
   * @returns 分类列表
   */
  static async getCategories(type?: string): Promise<Category[]> {
    let sql = 'SELECT * FROM category WHERE status = ?';
    const params: any[] = ['active'];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY level ASC, weight DESC, name ASC';
    
    return await query<(Category & RowDataPacket)[]>(sql, params);
  }

  /**
   * 根据ID获取分类
   * @param id 分类ID
   * @returns 分类信息
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    const sql = 'SELECT * FROM category WHERE id = ? AND status = ?';
    const result = await query<(Category & RowDataPacket)[]>(sql, [id, 'active']);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * 获取顶级分类
   * @param type 分类类型筛选（可选）
   * @returns 顶级分类列表
   */
  static async getTopLevelCategories(type?: string): Promise<Category[]> {
    let sql = 'SELECT * FROM category WHERE level = 0 AND status = ?';
    const params: any[] = ['active'];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY weight DESC, name ASC';
    
    return await query<(Category & RowDataPacket)[]>(sql, params);
  }

  /**
   * 获取子分类
   * @param parentId 父分类ID
   * @returns 子分类列表
   */
  static async getSubCategories(parentId: string): Promise<Category[]> {
    const sql = `
      SELECT * FROM category 
      WHERE parent_id = ? AND status = ?
      ORDER BY weight DESC, name ASC
    `;
    
    return await query<(Category & RowDataPacket)[]>(sql, [parentId, 'active']);
  }

  /**
   * 批量获取多个父分类的子分类
   * @param parentIds 父分类ID数组
   * @returns 子分类列表
   */
  static async getBatchSubCategories(parentIds: string[]): Promise<Category[]> {
    if (parentIds.length === 0) return [];

    const placeholders = parentIds.map(() => '?').join(',');
    const sql = `
      SELECT * FROM category
      WHERE parent_id IN (${placeholders}) AND status = ?
      ORDER BY parent_id, weight DESC, name ASC
    `;

    return await query<(Category & RowDataPacket)[]>(sql, [...parentIds, 'active']);
  }

  /**
   * 获取分类树结构
   * @param type 分类类型筛选（可选）
   * @returns 分类树
   */
  static async getCategoryTree(type?: string): Promise<CategoryTree[]> {
    // 获取所有分类
    const categories = await this.getCategories(type);
    
    // 构建树结构
    const categoryMap = new Map<string, CategoryTree>();
    const rootCategories: CategoryTree[] = [];

    // 初始化所有分类节点
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        children: []
      });
    });

    // 构建父子关系
    categories.forEach(category => {
      const node = categoryMap.get(category.id)!;
      
      if (category.level === 0 || !category.parent_id) {
        rootCategories.push(node);
      } else {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return rootCategories;
  }

  /**
   * 根据类型获取分类
   * @param type 分类类型
   * @returns 该类型的分类列表
   */
  static async getCategoriesByType(type: string): Promise<Category[]> {
    const sql = `
      SELECT * FROM category 
      WHERE type = ? AND status = ?
      ORDER BY level ASC, weight DESC, name ASC
    `;
    
    return await query<(Category & RowDataPacket)[]>(sql, [type, 'active']);
  }

  /**
   * 获取游戏平台分类
   * @returns 游戏平台分类列表
   */
  static async getGamePlatformCategories(): Promise<Category[]> {
    const sql = `
      SELECT * FROM category 
      WHERE type IN ('Android', 'iOS', 'Windows', 'Mac', 'Linux') AND status = ?
      ORDER BY weight DESC, name ASC
    `;
    
    return await query<(Category & RowDataPacket)[]>(sql, ['active']);
  }

  /**
   * 获取游戏类型分类
   * @returns 游戏类型分类列表
   */
  static async getGameGenreCategories(): Promise<Category[]> {
    const sql = `
      SELECT * FROM category 
      WHERE type = 'Genre' AND status = ?
      ORDER BY weight DESC, name ASC
    `;
    
    return await query<(Category & RowDataPacket)[]>(sql, ['active']);
  }

  /**
   * 创建分类
   * @param categoryData 分类数据
   * @returns 分类ID
   */
  static async createCategory(categoryData: Partial<Category>): Promise<string> {
    const id = generateId();
    const sql = `
      INSERT INTO category (
        id, level, parent_id, type, name, alias, description, 
        icon, weight, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await execute(sql, [
      id,
      categoryData.level || 0,
      categoryData.parent_id || null,
      categoryData.type,
      categoryData.name,
      categoryData.alias || null,
      categoryData.description || null,
      categoryData.icon,
      categoryData.weight || 0,
      categoryData.status || 'active'
    ]);

    return id;
  }

  /**
   * 更新分类
   * @param id 分类ID
   * @param categoryData 更新的分类数据
   */
  static async updateCategory(id: string, categoryData: Partial<Category>): Promise<void> {
    const sql = `
      UPDATE category SET 
        name = ?, alias = ?, description = ?, icon = ?, 
        weight = ?, status = ?
      WHERE id = ?
    `;

    await execute(sql, [
      categoryData.name,
      categoryData.alias || null,
      categoryData.description || null,
      categoryData.icon,
      categoryData.weight || 0,
      categoryData.status || 'active',
      id
    ]);
  }

  /**
   * 删除分类（软删除）
   * @param id 分类ID
   */
  static async deleteCategory(id: string): Promise<void> {
    const sql = 'UPDATE category SET status = ? WHERE id = ?';
    await execute(sql, ['deleted', id]);
  }
}

/**
 * 分类树节点接口
 */
interface CategoryTree extends Category {
  children: CategoryTree[];
}