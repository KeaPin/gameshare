/**
 * 数据库表结构类型定义
 * 基于 database_schema.sql 中的表结构
 */

/**
 * 基础时间戳字段接口
 */
export interface BaseEntity {
  created_time: Date;
  updated_time: Date;
}

/**
 * 基础状态字段接口
 */
export interface BaseStatus {
  status: 'active' | 'inactive' | 'deleted';
  weight: number;
}

/**
 * 分类表 (category)
 */
export interface Category extends BaseEntity, BaseStatus {
  id: string;
  level: number;
  parent_id?: string;
  type: string; // Android、iOS、Windows、Mac、Linux 等
  name: string;
  alias?: string;
  description?: string;
  icon: string;
}

/**
 * 资源信息表 (resource)
 */
export interface Resource extends BaseEntity, BaseStatus {
  id: string;
  name: string;
  alias?: string;
  description?: string;
  rating?: number; // 0.0-10.0
  thumbnail?: string;
  galleries?: string; // JSON 格式的图片数组
  tags?: string;
  developer?: string;
  publisher?: string;
  platforms?: string;
  version?: string;
  size?: string;
  language?: string;
  detail?: string;
  release_date?: string;
  official_link?: string;
  comment_count: number;
  view_count: number;
  like_count: number;
  download_count: number;
  is_featured: boolean;
  is_hot: boolean;
  is_new: boolean;
}

/**
 * 资源链接表 (resource_link)
 */
export interface ResourceLink extends BaseEntity, BaseStatus {
  id: string;
  resource_id: string;
  platform: string; // 网盘平台名称
  url: string;
  password?: string;
}

/**
 * 文章信息表 (article)
 */
export interface Article extends BaseEntity {
  id: string;
  title: string;
  summary?: string;
  content: string;
  thumbnail?: string;
  tags?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  is_top: boolean;
  status: 'active' | 'inactive' | 'deleted';
}

/**
 * 资源分类关系表 (resource_category)
 */
export interface ResourceCategory {
  id: string;
  resource_id: string;
  category_id: string;
  created_time: Date;
}

/**
 * 文章分类关系表 (article_category)
 */
export interface ArticleCategory {
  id: string;
  article_id: string;
  category_id: string;
  created_time: Date;
}

/**
 * 查询参数接口
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  category_id?: string;
  status?: string;
  search?: string;
  sort?: 'created_time' | 'updated_time' | 'view_count' | 'download_count' | 'rating';
  order?: 'asc' | 'desc';
}

/**
 * 分页结果接口
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 资源详情接口（包含关联数据）
 */
export interface ResourceDetail extends Resource {
  categories: Category[];
  downloadLinks: ResourceLink[];
  galleries_parsed?: string[]; // 解析后的图片数组
}

/**
 * 文章详情接口（包含关联数据）
 */
export interface ArticleDetail extends Article {
  categories: Category[];
  tags_parsed?: string[]; // 解析后的标签数组
}

/**
 * 统计数据接口
 */
export interface Statistics {
  total_resources: number;
  total_articles: number;
  total_categories: number;
  total_downloads: number;
  popular_categories: Array<{
    category: Category;
    count: number;
  }>;
  recent_resources: Resource[];
  hot_resources: Resource[];
}
