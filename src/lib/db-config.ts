/**
 * 数据库配置文件
 * 支持本地开发和 Cloudflare Workers 生产环境
 * 已切换为 PostgreSQL
 */

export interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  charset: string;
}

// 本地开发环境数据库配置
export const LOCAL_DB_CONFIG: DBConfig = {
  host: 'aws-1-us-east-2.pooler.supabase.com',
  port: 6543,
  user: 'postgres.zsayottyrtreilktmreh',
  password: 'sFfQsPG8w60BWdQv',
  database: 'postgres',
  charset: 'utf8'
};

// Cloudflare Hyperdrive 连接池ID
export const HYPERDRIVE_ID = '9d030398267f4296a84aec1a4b24ea7e';

/**
 * 获取数据库配置
 * 在 Cloudflare Workers 环境中使用 Hyperdrive
 * 在本地开发环境中使用直连配置
 */
export function getDbConfig(): DBConfig {
  // 检查是否在 Cloudflare Workers 环境中
  if (typeof globalThis !== 'undefined' && 'HYPERDRIVE' in globalThis) {
    // 生产环境使用 Hyperdrive，配置将通过 Hyperdrive 自动处理
    return LOCAL_DB_CONFIG; // 这里的配置在生产不会被直接使用
  }
  
  // 本地开发环境
  return LOCAL_DB_CONFIG;
}

/**
 * 判断当前是否为生产环境（Cloudflare Workers）
 */
export function isProduction(): boolean {
  return typeof globalThis !== 'undefined' && 'HYPERDRIVE' in globalThis;
}
