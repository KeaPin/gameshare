import { getCloudflareContext } from '@opennextjs/cloudflare';

type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

async function sendToExternalEndpoint(payload: LogPayload) {
  try {
    const { env, ctx } = getCloudflareContext();
    const endpoint = (env as any)?.LOG_ENDPOINT as string | undefined;
    if (!endpoint) return;

    const req = fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // 确保在 Workers 环境里日志上报不会阻塞主响应
    ctx?.waitUntil?.(req);
  } catch (_) {
    // 静默失败，避免影响主流程
  }
}

function writeConsole(level: LogLevel, payload: LogPayload) {
  const text = `[${payload.timestamp}] [${payload.level}] ${payload.message}`;
  if (level === 'error') {
    console.error(text, payload.meta);
  } else if (level === 'warn') {
    console.warn(text, payload.meta);
  } else {
    console.log(text, payload.meta);
  }
}

async function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload: LogPayload = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString()
  };
  writeConsole(level, payload);
  await sendToExternalEndpoint(payload);
}

export function logInfo(message: string, meta?: Record<string, unknown>) {
  return log('info', message, meta);
}

export function logWarn(message: string, meta?: Record<string, unknown>) {
  return log('warn', message, meta);
}

export function logError(message: string, meta?: Record<string, unknown>) {
  return log('error', message, meta);
}


