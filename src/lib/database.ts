/**
 * 数据库连接工具类
 * 适配 PostgreSQL（pg）并支持 Cloudflare Hyperdrive
 */

import { Pool, PoolClient } from 'pg';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDbConfig } from './db-config';
import { logError } from './utils/logger';

// 全局连接池实例（本地/Node 环境使用）
let pool: Pool | null = null;

function getOrCreatePool(): Pool {
  if (!pool) {
    const config = getDbConfig();
    pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 60000,
    });
  }
  return pool;
}

// 将 MySQL 风格占位符 ? 转换为 PostgreSQL 风格 $1..$n
function toPgQuery(sql: string, params: any[] = []): { text: string; values: any[] } {
  if (!params || params.length === 0) {
    return { text: sql, values: [] };
  }
  let index = 0;
  const text = sql.replace(/\?/g, () => `$${++index}`);
  return { text, values: params };
}

/**
 * 执行查询语句
 */
export async function query<T = any[]>(sql: string, params?: any[]): Promise<T> {
  // 优先尝试 Cloudflare Workers + Hyperdrive
  try {
    const { env, ctx } = getCloudflareContext();
    if (env && (env as any).HYPERDRIVE && typeof (env as any).HYPERDRIVE.connectionString === 'string') {
      const { Client } = await import('pg');
      const client = new Client({ connectionString: (env as any).HYPERDRIVE.connectionString });
      await client.connect();
      try {
        const { text, values } = toPgQuery(sql, params);
        const result = await client.query(text, values);
        // 在响应返回后再关闭连接
        ctx?.waitUntil?.(client.end());
        return result.rows as unknown as T;
      } catch (error) {
        ctx?.waitUntil?.(client.end());
        await logError('DB query via Hyperdrive failed', { sql, params, error: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    }
  } catch (_) {
    // 非 Workers 环境，降级使用本地连接池
  }

  const { text, values } = toPgQuery(sql, params);
  const pool = getOrCreatePool();
  const result = await pool.query(text, values);
  return result.rows as unknown as T;
}

/**
 * 执行写操作（INSERT/UPDATE/DELETE）
 */
export async function execute(sql: string, params?: any[]): Promise<{ rowCount: number }> {
  // 优先尝试 Cloudflare Workers + Hyperdrive
  try {
    const { env, ctx } = getCloudflareContext();
    if (env && (env as any).HYPERDRIVE && typeof (env as any).HYPERDRIVE.connectionString === 'string') {
      const { Client } = await import('pg');
      const client = new Client({ connectionString: (env as any).HYPERDRIVE.connectionString });
      await client.connect();
      try {
        const { text, values } = toPgQuery(sql, params);
        const result = await client.query(text, values);
        ctx?.waitUntil?.(client.end());
        return { rowCount: result.rowCount ?? 0 };
      } catch (error) {
        ctx?.waitUntil?.(client.end());
        await logError('DB execute via Hyperdrive failed', { sql, params, error: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    }
  } catch (_) {
    // 非 Workers 环境，降级使用本地连接池
  }

  const { text, values } = toPgQuery(sql, params);
  const pool = getOrCreatePool();
  const result = await pool.query(text, values);
  return { rowCount: result.rowCount ?? 0 };
}

/**
 * 简单事务封装（本地/Node 环境使用）
 */
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getOrCreatePool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 关闭数据库连接池（本地/Node 环境）
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * 测试数据库连接
 */
export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT 1 as test');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Cloudflare Workers 环境的数据库连接（直接使用 Hyperdrive）
 */
export function createWorkerDatabase(env: CloudflareEnv) {
  return {
    async query<T = any[]>(sql: string, params?: any[]): Promise<T> {
      const { Client } = await import('pg');
      const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
      await client.connect();
      try {
        const { text, values } = toPgQuery(sql, params);
        const result = await client.query(text, values);
        return result.rows as unknown as T;
      } finally {
        await client.end();
      }
    },

    async execute(sql: string, params?: any[]): Promise<{ rowCount: number }> {
      const { Client } = await import('pg');
      const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
      await client.connect();
      try {
        const { text, values } = toPgQuery(sql, params);
        const result = await client.query(text, values);
        return { rowCount: result.rowCount ?? 0 };
      } finally {
        await client.end();
      }
    }
  };
}
