/**
 * 数据库连接工具类
 * 支持 MySQL 连接池和 Cloudflare Hyperdrive
 */

import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2/promise';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDbConfig, isProduction, LOCAL_DB_CONFIG } from './db-config';

// 全局连接池实例
let pool: Pool | null = null;

/**
 * 获取数据库连接池
 */
export function getConnectionPool(): Pool {
  if (!pool) {
    const config = getDbConfig();
    
    if (isProduction()) {
      // 生产环境：使用 Hyperdrive
      // 注意：在 Cloudflare Workers 中，需要通过 env.HYPERDRIVE 访问
      // 这里创建一个基础配置，实际连接会通过 Hyperdrive 代理
      pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        charset: config.charset,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 60000,
      });
    } else {
      // 本地开发环境：直连数据库
      pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        charset: config.charset,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 60000,
      });
    }
  }
  
  return pool;
}

/**
 * 执行查询语句
 * @param sql SQL 查询语句
 * @param params 查询参数
 * @returns 查询结果
 */
export async function query<T extends RowDataPacket[]>(
  sql: string, 
  params?: any[]
): Promise<T> {
  // 优先在 Cloudflare Workers 环境下使用 Hyperdrive 的直连方式
  try {
    const { env, ctx } = getCloudflareContext();
    if (env && (env as any).HYPERDRIVE) {
      const connection = await mysql.createConnection({
        host: (env as any).HYPERDRIVE.host,
        user: (env as any).HYPERDRIVE.user,
        password: (env as any).HYPERDRIVE.password,
        database: (env as any).HYPERDRIVE.database,
        port: (env as any).HYPERDRIVE.port,
        disableEval: true,
      } as any);
      try {
        const [rows] = await connection.execute<T>(sql, params);
        // 在 Worker 被销毁前清理连接
        ctx.waitUntil(connection.end());
        return rows;
      } catch (error) {
        // 若执行失败，确保连接关闭
        ctx.waitUntil(connection.end());
        throw error;
      }
    }
  } catch (_) {
    // 本地/非 Worker 环境，继续走连接池
  }

  const connection = getConnectionPool();
  const [rows] = await connection.execute<T>(sql, params);
  return rows;
}

/**
 * 执行插入、更新、删除语句
 * @param sql SQL 语句
 * @param params 参数
 * @returns 操作结果
 */
export async function execute(
  sql: string, 
  params?: any[]
): Promise<ResultSetHeader> {
  // 优先在 Cloudflare Workers 环境下使用 Hyperdrive 的直连方式
  try {
    const { env, ctx } = getCloudflareContext();
    if (env && (env as any).HYPERDRIVE) {
      const connection = await mysql.createConnection({
        host: (env as any).HYPERDRIVE.host,
        user: (env as any).HYPERDRIVE.user,
        password: (env as any).HYPERDRIVE.password,
        database: (env as any).HYPERDRIVE.database,
        port: (env as any).HYPERDRIVE.port,
        disableEval: true,
      } as any);
      try {
        const [result] = await connection.execute<ResultSetHeader>(sql, params);
        ctx.waitUntil(connection.end());
        return result;
      } catch (error) {
        ctx.waitUntil(connection.end());
        throw error;
      }
    }
  } catch (_) {
    // 本地/非 Worker 环境，继续走连接池
  }

  const connection = getConnectionPool();
  const [result] = await connection.execute<ResultSetHeader>(sql, params);
  return result;
}

/**
 * 开始事务
 * @param callback 事务回调函数
 * @returns 事务结果
 */
export async function transaction<T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getConnectionPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 关闭数据库连接池
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
 * Cloudflare Workers 环境的数据库连接
 * 使用 Hyperdrive 进行连接
 * @param env Cloudflare 环境变量
 */
export function createWorkerDatabase(env: CloudflareEnv) {
  return {
    async query<T extends RowDataPacket[]>(sql: string, params?: any[]): Promise<T> {
      // 在 Cloudflare Workers 中通过 Hyperdrive 的 connectionString 使用标准驱动
      const connection = await mysql.createConnection(env.HYPERDRIVE.connectionString);
      try {
        const [rows] = await connection.execute<T>(sql, params);
        return rows;
      } finally {
        await connection.end();
      }
    },
    
    async execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
      const connection = await mysql.createConnection(env.HYPERDRIVE.connectionString);
      try {
        const [result] = await connection.execute<ResultSetHeader>(sql, params);
        return result;
      } finally {
        await connection.end();
      }
    }
  };
}
