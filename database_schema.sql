-- 游戏分享网站数据库建表语句
-- 创建时间: 2024-12-21
-- 说明: 包含游戏分类、游戏信息、下载链接、文章分类、文章信息五个核心表

-- 设置字符集和排序规则
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. 游戏分类表 (category)
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键，分类ID',
  `level` int NOT NULL DEFAULT '0' COMMENT '分类层级',
  `parent_id` int NOT NULL DEFAULT '0' COMMENT '父分类ID',
  `type` varchar(50) NOT NULL COMMENT '分类类型，如Android、iOS、Windows、Mac、Linux',
  `name` varchar(100) NOT NULL COMMENT '分类名称，如RPG、策略',
  `alias` varchar(255) COMMENT '资源别名',
  `description` varchar(255) COMMENT '分类描述',
  `icon` varchar(255) NOT NULL COMMENT '分类图标',
  `weight` int NOT NULL DEFAULT '0' COMMENT '排序权重',
  `status` varchar(255) NOT NULL DEFAULT 'active' COMMENT '资源状态',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游戏分类表';
-- ----------------------------
-- 2. 资源信息表 (resource)
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键，资源ID',
  `name` varchar(255) NOT NULL COMMENT '资源名称',
  `alias` varchar(255) COMMENT '资源别名',
  `description` varchar(512) COMMENT '资源描述',
  `rating` decimal(3,1) DEFAULT 10 COMMENT '资源评分(0.0-10.0)',
  `thumbnail` varchar(512) DEFAULT NULL COMMENT '主图片URL',
  `gallery` text DEFAULT NULL COMMENT '图片画廊(JSON数组)',
  `tags` varchar(255) DEFAULT NULL COMMENT '资源标签',
  `developer` varchar(255) DEFAULT NULL COMMENT '开发商',
  `publisher` varchar(255) DEFAULT NULL COMMENT '发行商',
  `platforms` varchar(255) DEFAULT NULL COMMENT '支持平台(JSON数组)',
  `version` varchar(50) DEFAULT NULL COMMENT '资源版本',
  `size` varchar(50) DEFAULT NULL COMMENT '资源大小',
  `language` varchar(255) DEFAULT NULL COMMENT '支持语言',
  `details` text COMMENT '资源详情',
  `release_date` date DEFAULT NULL COMMENT '发布日期',
  `official_link` varchar(512) DEFAULT NULL COMMENT '官方地址',
  `comment_count` int DEFAULT 0 COMMENT '评价数量',
  `view_count` int DEFAULT 0 COMMENT '浏览次数',
  `like_count` int DEFAULT 0 COMMENT '点赞次数',
  `download_count` int DEFAULT 0 COMMENT '下载次数',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否为精选资源',
  `is_hot` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否为热门资源',
  `is_new` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否为新资源',
  `weight` int NOT NULL DEFAULT '0' COMMENT '排序权重',
  `status` varchar(255) NOT NULL DEFAULT 'active' COMMENT '资源状态',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_rating` (`rating`),
  KEY `idx_featured_hot_new` (`is_featured`,`is_hot`,`is_new`),
  KEY `idx_status` (`status`),
  KEY `idx_download_count` (`download_count`),
  KEY `idx_view_count` (`view_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源信息表';

-- ----------------------------
-- 3. 资源链接表 (resource_link)
-- ----------------------------
DROP TABLE IF EXISTS `resource_link`;
CREATE TABLE `resource_link` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键，链接ID',
  `resource_id` int NOT NULL COMMENT '资源ID，外键',
  `platform` varchar(100) NOT NULL COMMENT '网盘平台名称',
  `url` varchar(1000) NOT NULL COMMENT '下载链接',
  `password` varchar(50) DEFAULT NULL COMMENT '提取密码',
  `status` varchar(255) NOT NULL DEFAULT 'active' COMMENT '链接状态',
  `weight` int NOT NULL DEFAULT '0' COMMENT '排序权重',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_resource_id` (`resource_id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort_order` (`sort_order`),
  CONSTRAINT `fk_resource_links_resource_id` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源链接表';

-- ----------------------------
-- 4. 文章信息表 (article)
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键，文章ID',
  `title` varchar(512) NOT NULL COMMENT '文章标题',
  `summary` text COMMENT '文章摘要',
  `content` text NOT NULL COMMENT '文章内容',
  `thumbnail` varchar(512) DEFAULT NULL COMMENT '文章配图',
  `tags` text DEFAULT NULL COMMENT '文章标签',
  `view_count` int NOT NULL DEFAULT '0' COMMENT '浏览次数',
  `like_count` int NOT NULL DEFAULT '0' COMMENT '点赞次数',
  `comment_count` int NOT NULL DEFAULT '0' COMMENT '评论次数',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否为推荐文章',
  `is_top` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否置顶',
  `status` text NOT NULL DEFAULT 'active' COMMENT '文章状态',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_view_count` (`view_count`),
  KEY `idx_like_count` (`like_count`),
  CONSTRAINT `fk_articles_category_id` FOREIGN KEY (`category_id`) REFERENCES `article_categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章信息表';
