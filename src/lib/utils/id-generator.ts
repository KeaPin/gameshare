/**
 * ID 生成工具
 * 生成32位字符串ID
 */

import { randomBytes } from 'crypto';

/**
 * 生成32位字符串ID
 * @returns 32位字符串ID
 */
export function generateId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * 生成UUID格式的ID（去掉连字符后的32位字符串）
 * @returns 32位字符串ID
 */
export function generateUUID(): string {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  return uuid.replace(/-/g, '');
}

/**
 * 验证ID格式是否正确（32位十六进制字符串）
 * @param id 待验证的ID
 * @returns 是否有效
 */
export function isValidId(id: string): boolean {
  return /^[a-f0-9]{32}$/.test(id);
}
