-- 游戏分享网站数据库建表语句
-- 创建时间: 2024-12-21
-- 说明: 包含6个核心表，所有ID字段使用32位字符串

-- ID字段说明：
-- 所有ID字段使用VARCHAR(32)类型，存储32位字符串（如UUID去掉连字符）
-- 示例：6a9d4b8c3e7f1a2b5c8e9d0f3a6b7c8d
-- 应用程序需要在插入数据时生成32位唯一字符串ID

-- 设置字符集和排序规则
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. 游戏分类表 (category)
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` varchar(32) NOT NULL COMMENT '主键，分类ID',
  `level` int NOT NULL DEFAULT '0' COMMENT '分类层级',
  `parent_id` varchar(32) DEFAULT NULL COMMENT '父分类ID',
  `type` varchar(50) NOT NULL COMMENT '分类类型，如Android、iOS、Windows、Mac、Linux',
  `name` varchar(100) NOT NULL COMMENT '分类名称，如RPG、策略',
  `alias` varchar(255) COMMENT '资源别名',
  `description` varchar(255) COMMENT '分类描述',
  `icon` varchar(255) NOT NULL COMMENT '分类图标',
  `weight` int NOT NULL DEFAULT '0' COMMENT '排序权重',
  `status` varchar(255) NOT NULL DEFAULT 'active' COMMENT '资源状态',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游戏分类表';
-- ----------------------------
-- 2. 资源信息表 (resource)
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id` varchar(32) NOT NULL COMMENT '主键，资源ID',
  `name` varchar(255) NOT NULL COMMENT '资源名称',
  `alias` varchar(255) COMMENT '资源别名',
  `description` varchar(512) COMMENT '资源描述',
  `rating` decimal(3,1) DEFAULT 10 COMMENT '资源评分(0.0-10.0)',
  `thumbnail` varchar(512) DEFAULT NULL COMMENT '主图片URL',
  `galleries` text DEFAULT NULL COMMENT '图片画廊',
  `tags` varchar(255) DEFAULT NULL COMMENT '资源标签',
  `developer` varchar(255) DEFAULT NULL COMMENT '开发商',
  `publisher` varchar(255) DEFAULT NULL COMMENT '发行商',
  `platforms` varchar(255) DEFAULT NULL COMMENT '支持平台',
  `version` varchar(50) DEFAULT NULL COMMENT '资源版本',
  `size` varchar(50) DEFAULT NULL COMMENT '资源大小',
  `language` varchar(255) DEFAULT NULL COMMENT '支持语言',
  `detail` text COMMENT '资源详情',
  `release_date` text DEFAULT NULL COMMENT '发布日期',
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
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
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
  `id` varchar(32) NOT NULL COMMENT '主键，链接ID',
  `resource_id` varchar(32) NOT NULL COMMENT '资源ID，外键',
  `platform` varchar(255) NOT NULL COMMENT '网盘平台名称',
  `url` varchar(255) NOT NULL COMMENT '下载链接',
  `password` varchar(50) DEFAULT NULL COMMENT '提取密码',
  `status` varchar(255) NOT NULL DEFAULT 'active' COMMENT '链接状态',
  `weight` int NOT NULL DEFAULT '0' COMMENT '排序权重',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_resource_id` (`resource_id`),
  KEY `idx_status` (`status`),
  KEY `idx_weight` (`weight`),
  CONSTRAINT `fk_resource_link_resource_id` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源链接表';

-- ----------------------------
-- 4. 文章信息表 (article)
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` varchar(32) NOT NULL COMMENT '主键，文章ID',
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
  `status` varchar(255) NOT NULL DEFAULT 'active' COMMENT '文章状态',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_view_count` (`view_count`),
  KEY `idx_like_count` (`like_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章信息表';

-- ----------------------------
-- 5. 资源分类关系表 (resource_category)
-- ----------------------------
DROP TABLE IF EXISTS `resource_category`;
CREATE TABLE `resource_category` (
  `id` varchar(32) NOT NULL COMMENT '主键，关系ID',
  `resource_id` varchar(32) NOT NULL COMMENT '资源ID，外键',
  `category_id` varchar(32) NOT NULL COMMENT '分类ID，外键',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_resource_category` (`resource_id`,`category_id`),
  KEY `idx_resource_id` (`resource_id`),
  KEY `idx_category_id` (`category_id`),
  CONSTRAINT `fk_resource_category_resource_id` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resource_category_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源分类关系表';

-- ----------------------------
-- 6. 文章分类关系表 (article_category)
-- ----------------------------
DROP TABLE IF EXISTS `article_category`;
CREATE TABLE `article_category` (
  `id` varchar(32) NOT NULL COMMENT '主键，关系ID',
  `article_id` varchar(32) NOT NULL COMMENT '文章ID，外键',
  `category_id` varchar(32) NOT NULL COMMENT '分类ID，外键',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_article_category` (`article_id`,`category_id`),
  KEY `idx_article_id` (`article_id`),
  KEY `idx_category_id` (`category_id`),
  CONSTRAINT `fk_article_category_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_article_category_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类关系表';

-- 重新启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- 数据库初始化完成
-- ----------------------------
