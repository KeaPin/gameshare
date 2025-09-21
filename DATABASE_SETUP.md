# 数据库设置指南

本项目使用 MySQL 数据库，支持本地开发和 Cloudflare Hyperdrive 生产环境。

## 数据库配置

### 本地开发环境

数据库连接信息：
```javascript
DB_CONFIG = {
    'host': '1.12.227.13',
    'port': 3306,
    'user': 'games',
    'password': 'nxxbf2kJBfS4zjHN',
    'database': 'games',
    'charset': 'utf8mb4'
}
```

### 生产环境 (Cloudflare)

- **Hyperdrive 连接池ID**: `9d030398267f4296a84aec1a4b24ea7e`
- 已在 `wrangler.jsonc` 中配置 Hyperdrive 绑定

## 数据库结构

本项目包含以下6个核心数据表：

1. **category** - 分类表（支持多层级分类）
2. **resource** - 资源信息表（游戏资源）
3. **resource_link** - 资源下载链接表
4. **article** - 文章信息表（攻略、新闻）
5. **resource_category** - 资源分类关系表
6. **article_category** - 文章分类关系表

详细的表结构请查看 `database_schema.sql` 文件。

## 项目文件结构

```
src/
├── lib/
│   ├── db-config.ts          # 数据库配置
│   ├── database.ts           # 数据库连接和操作工具
│   ├── models/               # 数据模型
│   │   ├── ResourceModel.ts  # 资源数据模型
│   │   ├── ArticleModel.ts   # 文章数据模型
│   │   ├── CategoryModel.ts  # 分类数据模型
│   │   └── index.ts          # 模型导出
│   └── utils/
│       └── id-generator.ts   # ID生成工具
├── types/
│   └── database.ts           # 数据库类型定义
└── app/
    └── api/
        └── test/             # 测试API路由
            ├── db/           # 数据库连接测试
            └── seed/         # 种子数据填充
```

## 安装依赖

确保安装了必要的数据库依赖：

```bash
npm install mysql2
```

## 数据库测试

### 1. 测试数据库连接

访问测试API来验证数据库连接：

```bash
# 测试连接
curl http://localhost:3000/api/test/db

# 测试插入操作
curl -X POST http://localhost:3000/api/test/db \
  -H "Content-Type: application/json" \
  -d '{"action": "test_insert"}'

# 测试查询操作
curl -X POST http://localhost:3000/api/test/db \
  -H "Content-Type: application/json" \
  -d '{"action": "test_query"}'

# 清理测试数据
curl -X POST http://localhost:3000/api/test/db \
  -H "Content-Type: application/json" \
  -d '{"action": "cleanup"}'
```

### 2. 填充种子数据

使用种子API填充基础测试数据：

```bash
# 填充所有种子数据
curl -X POST http://localhost:3000/api/test/seed \
  -H "Content-Type: application/json" \
  -d '{"action": "seed_all"}'

# 只填充分类数据
curl -X POST http://localhost:3000/api/test/seed \
  -H "Content-Type: application/json" \
  -d '{"action": "seed_categories"}'

# 只填充资源数据
curl -X POST http://localhost:3000/api/test/seed \
  -H "Content-Type: application/json" \
  -d '{"action": "seed_resources"}'

# 只填充文章数据
curl -X POST http://localhost:3000/api/test/seed \
  -H "Content-Type: application/json" \
  -d '{"action": "seed_articles"}'
```

## 数据模型使用示例

### 资源操作

```typescript
import { ResourceModel } from '@/lib/models';

// 获取精选资源
const featuredResources = await ResourceModel.getFeaturedResources(8);

// 获取资源详情
const resource = await ResourceModel.getResourceById('resource_id_here');

// 搜索资源
const searchResults = await ResourceModel.searchResources('关键词', {
  page: 1,
  limit: 12,
  category_id: 'category_id_here'
});
```

### 文章操作

```typescript
import { ArticleModel } from '@/lib/models';

// 获取文章列表
const articles = await ArticleModel.getArticles({
  page: 1,
  limit: 10
});

// 获取文章详情
const article = await ArticleModel.getArticleById('article_id_here');

// 增加浏览次数
await ArticleModel.incrementViewCount('article_id_here');
```

### 分类操作

```typescript
import { CategoryModel } from '@/lib/models';

// 获取所有分类
const categories = await CategoryModel.getCategories();

// 获取分类树
const categoryTree = await CategoryModel.getCategoryTree();

// 获取游戏平台分类
const platforms = await CategoryModel.getGamePlatformCategories();
```

## 环境变量

确保设置了正确的环境变量（.env.local）：

```env
# 数据库配置
DB_HOST=1.12.227.13
DB_PORT=3306
DB_USER=games
DB_PASSWORD=nxxbf2kJBfS4zjHN
DB_NAME=games
DB_CHARSET=utf8mb4

# 环境标识
NODE_ENV=development

# Cloudflare Hyperdrive ID
HYPERDRIVE_ID=9d030398267f4296a84aec1a4b24ea7e
```

## 部署注意事项

### 本地开发
- 直接连接 MySQL 数据库
- 使用连接池管理连接

### Cloudflare Workers 生产环境
- 通过 Hyperdrive 代理连接
- 自动获得连接池和性能优化
- 需要在 Cloudflare Dashboard 中配置 Hyperdrive

## 故障排除

### 常见问题

1. **连接超时**
   - 检查网络连接
   - 确认数据库服务器可访问

2. **认证失败**
   - 确认用户名和密码正确
   - 检查数据库权限设置

3. **TypeScript 类型错误**
   - 确保导入了正确的类型定义
   - 运行 `npm run cf-typegen` 更新类型

### 调试方法

1. 使用测试API检查连接状态
2. 查看控制台输出的错误信息
3. 检查数据库日志

## 更新日志

- **2024-12-21**: 初始数据库设计和连接设置
- **2024-12-21**: 添加 Cloudflare Hyperdrive 支持
- **2024-12-21**: 完善数据模型和测试API
