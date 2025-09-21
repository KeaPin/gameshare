# 游戏分享网站数据库设计（更新版）

基于当前项目的数据结构分析，设计以下6个核心数据库表：

## 1. 分类表 (category)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，分类ID |
| level | INT | - | NOT NULL | 0 | 分类层级 |
| parent_id | INT | - | NOT NULL | 0 | 父分类ID |
| type | VARCHAR | 50 | NOT NULL | - | 分类类型，如Android、iOS、Windows等 |
| name | VARCHAR | 100 | NOT NULL | - | 分类名称 |
| alias | VARCHAR | 255 | NULL | NULL | 分类别名 |
| description | VARCHAR | 255 | NULL | NULL | 分类描述 |
| icon | VARCHAR | 255 | NOT NULL | - | 分类图标 |
| weight | INT | - | NOT NULL | 0 | 排序权重 |
| status | VARCHAR | 255 | NOT NULL | 'active' | 分类状态 |
| created_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- INDEX: `level`, `parent_id`, `type`, `weight`, `status`

---

## 2. 资源信息表 (resource)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，资源ID |
| name | VARCHAR | 255 | NOT NULL | - | 资源名称 |
| alias | VARCHAR | 255 | NULL | NULL | 资源别名 |
| description | VARCHAR | 512 | NULL | NULL | 资源描述 |
| rating | DECIMAL | 3,1 | NULL | 10 | 资源评分(0.0-10.0) |
| thumbnail | VARCHAR | 512 | NULL | NULL | 主图片URL |
| gallery | TEXT | - | NULL | NULL | 图片画廊 |
| tags | VARCHAR | 255 | NULL | NULL | 资源标签 |
| developer | VARCHAR | 255 | NULL | NULL | 开发商 |
| publisher | VARCHAR | 255 | NULL | NULL | 发行商 |
| platforms | VARCHAR | 255 | NULL | NULL | 支持平台 |
| version | VARCHAR | 50 | NULL | NULL | 资源版本 |
| size | VARCHAR | 50 | NULL | NULL | 资源大小 |
| language | VARCHAR | 255 | NULL | NULL | 支持语言 |
| details | TEXT | - | NULL | NULL | 资源详情 |
| release_date | TEXT | - | NULL | NULL | 发布日期 |
| official_link | VARCHAR | 512 | NULL | NULL | 官方地址 |
| comment_count | INT | - | NULL | 0 | 评论数量 |
| view_count | INT | - | NULL | 0 | 浏览次数 |
| like_count | INT | - | NULL | 0 | 点赞次数 |
| download_count | INT | - | NULL | 0 | 下载次数 |
| is_featured | TINYINT | 1 | NOT NULL | 0 | 是否为精选资源 |
| is_hot | TINYINT | 1 | NOT NULL | 0 | 是否为热门资源 |
| is_new | TINYINT | 1 | NOT NULL | 0 | 是否为新资源 |
| weight | INT | - | NOT NULL | 0 | 排序权重 |
| status | VARCHAR | 255 | NOT NULL | 'active' | 资源状态 |
| created_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- INDEX: `name`, `rating`, `is_featured`, `is_hot`, `is_new`, `status`
- INDEX: `download_count`, `view_count`, `like_count`

---

## 3. 资源链接表 (resource_link)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，链接ID |
| resource_id | INT | - | NOT NULL | - | 资源ID，外键 |
| platform | VARCHAR | 100 | NOT NULL | - | 网盘平台名称 |
| url | VARCHAR | 1000 | NOT NULL | - | 下载链接 |
| password | VARCHAR | 50 | NULL | NULL | 提取密码 |
| status | VARCHAR | 255 | NOT NULL | 'active' | 链接状态 |
| weight | INT | - | NOT NULL | 0 | 排序权重 |
| created_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- FOREIGN KEY: `resource_id` REFERENCES `resource(id)` ON DELETE CASCADE
- INDEX: `resource_id`, `status`, `weight`

---

## 4. 文章信息表 (article)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，文章ID |
| title | VARCHAR | 512 | NOT NULL | - | 文章标题 |
| summary | TEXT | - | NULL | NULL | 文章摘要 |
| content | TEXT | - | NOT NULL | - | 文章内容 |
| thumbnail | VARCHAR | 512 | NULL | NULL | 文章配图 |
| tags | TEXT | - | NULL | NULL | 文章标签 |
| view_count | INT | - | NOT NULL | 0 | 浏览次数 |
| like_count | INT | - | NOT NULL | 0 | 点赞次数 |
| comment_count | INT | - | NOT NULL | 0 | 评论次数 |
| is_featured | TINYINT | 1 | NOT NULL | 0 | 是否为推荐文章 |
| is_top | TINYINT | 1 | NOT NULL | 0 | 是否置顶 |
| status | TEXT | - | NOT NULL | 'active' | 文章状态 |
| created_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY: `id`
- INDEX: `status`, `view_count`, `like_count`
- INDEX: `is_featured`, `is_top`

---

## 5. 资源分类关系表 (resource_category)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，关系ID |
| resource_id | INT | - | NOT NULL | - | 资源ID，外键 |
| category_id | INT | - | NOT NULL | - | 分类ID，外键 |
| created_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY: `id`
- UNIQUE KEY: `uk_resource_category` (`resource_id`,`category_id`)
- FOREIGN KEY: `resource_id` REFERENCES `resource(id)` ON DELETE CASCADE
- FOREIGN KEY: `category_id` REFERENCES `category(id)` ON DELETE CASCADE
- INDEX: `resource_id`, `category_id`

---

## 6. 文章分类关系表 (article_category)

| 字段名 | 数据类型 | 长度 | 是否为空 | 默认值 | 说明 |
|-------|---------|------|---------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键，关系ID |
| article_id | INT | - | NOT NULL | - | 文章ID，外键 |
| category_id | INT | - | NOT NULL | - | 分类ID，外键 |
| created_time | DATETIME | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY: `id`
- UNIQUE KEY: `uk_article_category` (`article_id`,`category_id`)
- FOREIGN KEY: `article_id` REFERENCES `article(id)` ON DELETE CASCADE
- FOREIGN KEY: `category_id` REFERENCES `category(id)` ON DELETE CASCADE
- INDEX: `article_id`, `category_id`

---

## 表关系说明

### 1. 多对多关系

**资源与分类**：多对多关系
- 一个资源可以属于多个分类
- 一个分类可以包含多个资源
- 通过`resource_category`关系表实现

**文章与分类**：多对多关系
- 一篇文章可以属于多个分类
- 一个分类可以包含多篇文章
- 通过`article_category`关系表实现

### 2. 一对多关系

**资源与下载链接**：一对多关系
- 一个资源可以有多个下载链接
- 下载链接通过`resource_id`外键关联资源表

**分类层级关系**：自关联关系
- 分类支持多层级结构
- 通过`parent_id`字段实现父子关系

### 3. 设计特点

1. **灵活的分类系统**：
   - 支持多层级分类结构
   - 支持按平台类型（Android、iOS等）分类
   - 支持图标和别名

2. **多对多关系**：
   - 资源和文章都可以属于多个分类
   - 提高了数据的灵活性和可扩展性

3. **统一的字段命名**：
   - 统一使用`created_time`和`updated_time`
   - 状态字段统一为VARCHAR类型

4. **性能优化**：
   - 为常用查询字段添加索引
   - 使用唯一索引防止重复关联
   - 合理的外键约束保证数据完整性

## 查询示例

### 获取资源及其分类
```sql
SELECT r.*, c.name as category_name 
FROM resource r
JOIN resource_category rc ON r.id = rc.resource_id
JOIN category c ON rc.category_id = c.id
WHERE r.status = 'active';
```

### 获取文章及其分类
```sql
SELECT a.*, c.name as category_name 
FROM article a
JOIN article_category ac ON a.id = ac.article_id
JOIN category c ON ac.category_id = c.id
WHERE a.status = 'active';
```

### 获取某个分类下的所有资源
```sql
SELECT r.* 
FROM resource r
JOIN resource_category rc ON r.id = rc.resource_id
WHERE rc.category_id = ? AND r.status = 'active';
```
