# 游戏分享网站数据库设计

基于当前项目的数据结构分析，设计以下5个核心数据库表：

## 1. 游戏分类表 (game_categories)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，分类ID |
| category_code | VARCHAR | 50 | NOT NULL | - | 分类代码，如'rpg','strategy' |
| category_name | VARCHAR | 100 | NOT NULL | - | 分类名称，如'RPG','策略' |
| description | TEXT | - | NULL | NULL | 分类描述 |
| sort_order | INT | - | NOT NULL | 0 | 排序权重 |
| is_active | TINYINT | 1 | NOT NULL | 1 | 是否启用(0:否,1:是) |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- UNIQUE KEY: `category_code`
- INDEX: `sort_order`, `is_active`

---

## 2. 资源信息表 (resource)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，资源ID |
| name | VARCHAR | 200 | NOT NULL | - | 资源名称 |
| description | TEXT | - | NULL | NULL | 资源描述 |
| rating | DECIMAL | 3,1 | NULL | NULL | 资源评分(0.0-10.0) |
| image | VARCHAR | 500 | NULL | NULL | 主图片URL |
| gallery | JSON | - | NULL | NULL | 图片画廊(JSON数组) |
| tags | VARCHAR | 255 | NULL | NULL | 资源标签 |
| developer | VARCHAR | 200 | NULL | NULL | 开发商 |
| publisher | VARCHAR | 200 | NULL | NULL | 发行商 |
| platforms | JSON | - | NULL | NULL | 支持平台(JSON数组) |
| version | VARCHAR | 50 | NULL | NULL | 游戏版本 |
| size | VARCHAR | 50 | NULL | NULL | 资源大小 |
| language | VARCHAR | 100 | NULL | NULL | 支持语言 |
| release_date | DATE | - | NULL | NULL | 发布日期 |
| official_link | VARCHAR | 500 | NULL | NULL | 官方地址 |
| review_count | VARCHAR | 50 | NULL | NULL | 评价数量 |
| follow_count | VARCHAR | 50 | NULL | NULL | 关注数量 |
| download_count | INT | - | NOT NULL | 0 | 下载次数 |
| view_count | INT | - | NOT NULL | 0 | 浏览次数 |
| is_featured | TINYINT | 1 | NOT NULL | 0 | 是否为精选资源 |
| is_hot | TINYINT | 1 | NOT NULL | 0 | 是否为热门资源 |
| is_new | TINYINT | 1 | NOT NULL | 0 | 是否为新资源 |
| status | VARCHAR | 255 | NOT NULL | 'active' | 资源状态 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- INDEX: `name`, `rating`, `is_featured`, `is_hot`, `is_new`, `status`
- INDEX: `download_count`, `view_count`
- FULLTEXT: `name`, `description`

---

## 3. 资源链接表 (resource_links)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，链接ID |
| resource_id | INT | - | NOT NULL | - | 资源ID，外键 |
| platform | VARCHAR | 100 | NOT NULL | - | 网盘平台名称 |
| url | VARCHAR | 1000 | NOT NULL | - | 下载链接 |
| password | VARCHAR | 50 | NULL | NULL | 提取密码 |
| status | VARCHAR | 255 | NOT NULL | 'active' | 链接状态 |
| sort_order | INT | - | NOT NULL | 0 | 排序权重 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- FOREIGN KEY: `resource_id` REFERENCES `resource(id)` ON DELETE CASCADE
- INDEX: `resource_id`, `status`, `sort_order`

---

## 4. 文章分类表 (article_categories)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，分类ID |
| category_code | VARCHAR | 50 | NOT NULL | - | 分类代码 |
| category_name | VARCHAR | 100 | NOT NULL | - | 分类名称 |
| description | TEXT | - | NULL | NULL | 分类描述 |
| sort_order | INT | - | NOT NULL | 0 | 排序权重 |
| is_active | TINYINT | 1 | NOT NULL | 1 | 是否启用(0:否,1:是) |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- UNIQUE KEY: `category_code`
- INDEX: `sort_order`, `is_active`

---

## 5. 文章信息表 (articles)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，文章ID |
| category_id | INT | - | NOT NULL | - | 分类ID，外键 |
| title | VARCHAR | 300 | NOT NULL | - | 文章标题 |
| summary | TEXT | - | NULL | NULL | 文章摘要 |
| content | LONGTEXT | - | NOT NULL | - | 文章内容 |
| author | VARCHAR | 100 | NOT NULL | - | 作者 |
| author_avatar | VARCHAR | 500 | NULL | NULL | 作者头像URL |
| featured_image | VARCHAR | 500 | NULL | NULL | 文章配图 |
| tags | JSON | - | NULL | NULL | 文章标签(JSON数组) |
| read_time | VARCHAR | 20 | NULL | NULL | 预估阅读时间 |
| view_count | INT | - | NOT NULL | 0 | 浏览次数 |
| like_count | INT | - | NOT NULL | 0 | 点赞次数 |
| comment_count | INT | - | NOT NULL | 0 | 评论次数 |
| is_featured | TINYINT | 1 | NOT NULL | 0 | 是否为推荐文章 |
| is_top | TINYINT | 1 | NOT NULL | 0 | 是否置顶 |
| status | ENUM | - | NOT NULL | 'published' | 文章状态('draft','published','archived') |
| publish_date | TIMESTAMP | - | NULL | NULL | 发布时间 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- FOREIGN KEY: `category_id` REFERENCES `article_categories(id)` ON DELETE RESTRICT
- INDEX: `category_id`, `author`, `is_featured`, `is_top`, `status`
- INDEX: `view_count`, `like_count`, `publish_date`
- FULLTEXT: `title`, `summary`, `content`

---

## 表关系说明

1. **资源与下载链接**：一对多关系
   - 一个资源可以有多个下载链接
   - 下载链接通过`resource_id`外键关联资源表

2. **文章与分类**：多对一关系
   - 每篇文章属于一个分类
   - 文章通过`category_id`外键关联分类表

3. **扩展性考虑**：
   - 使用JSON字段存储数组类型数据（platforms, gallery）
   - tags字段改为VARCHAR类型便于查询
   - 预留了各种统计字段（浏览量、下载量、点赞数等）
   - 支持软删除和状态管理
   - 添加了排序权重字段便于管理

## 性能优化建议

1. **索引优化**：
   - 为常用查询字段创建索引
   - 为全文搜索字段创建FULLTEXT索引

2. **分页查询优化**：
   - 使用LIMIT + OFFSET进行分页
   - 考虑使用游标分页优化大数据量场景

3. **缓存策略**：
   - 热门资源和文章可考虑Redis缓存
   - 分类数据适合应用层缓存

4. **读写分离**：
   - 考虑主从架构分离读写操作
   - 统计数据可使用异步更新
