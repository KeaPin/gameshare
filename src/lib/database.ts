/**
 * 数据库连接工具类
 * 支持 MySQL 连接池和 Cloudflare Hyperdrive
 */

import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader, OkPacket } from 'mysql2/promise';
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
        acquireTimeout: 60000,
        timeout: 60000,
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
        acquireTimeout: 60000,
        timeout: 60000,
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
      // 在 Cloudflare Workers 中，需要使用 env.HYPERDRIVE 进行连接
      // 这是一个示例实现，具体实现取决于 Hyperdrive 的 API
      const stmt = env.HYPERDRIVE.prepare(sql);
      const result = params ? await stmt.bind(...params).all() : await stmt.all();
      return result.results as T;
    },
    
    async execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
      const stmt = env.HYPERDRIVE.prepare(sql);
      const result = params ? await stmt.bind(...params).run() : await stmt.run();
      return {
        affectedRows: result.changes || 0,
        insertId: result.meta?.last_row_id || 0,
        warningStatus: 0,
        info: '',
        serverStatus: 0,
        fieldCount: 0,
        changedRows: 0
      } as ResultSetHeader;
    }
  };
}
