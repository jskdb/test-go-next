/**
 * Node.js 共享业务逻辑
 *
 * 这些函数被两处调用：
 * 1. Server Components（如 SSR 页面）— 直接 import 调用，零网络开销
 * 2. Route Handlers（如 /api/time）— 包装为 HTTP 接口，给浏览器端 CSR fetch 用
 *
 * 这是 Next.js 推荐的做法：将逻辑提取到共享模块，避免 Server Components fetch 自己的 API Routes。
 * 参考：https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */

import os from 'os';

export function getTimeData() {
  const now = new Date();
  return {
    runtime: 'Node.js' as const,
    nodeVersion: process.version,
    timestamp: now.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    unix: Math.floor(now.getTime() / 1000),
    formatted: now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
  };
}

export function getEnvData() {
  return {
    runtime: 'Node.js' as const,
    nodeVersion: process.version,
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)} MB`,
    freeMemory: `${Math.round(os.freemem() / 1024 / 1024)} MB`,
    uptime: `${Math.round(os.uptime())} seconds`,
  };
}

export function getCalcData(a: number, b: number, op: string) {
  let result: number;
  let expression: string;

  switch (op) {
    case 'add':
      result = a + b;
      expression = `${a} + ${b}`;
      break;
    case 'sub':
      result = a - b;
      expression = `${a} - ${b}`;
      break;
    case 'mul':
      result = a * b;
      expression = `${a} × ${b}`;
      break;
    case 'div':
      if (b === 0) {
        return { error: '除数不能为 0' };
      }
      result = a / b;
      expression = `${a} ÷ ${b}`;
      break;
    default:
      return { error: `不支持的运算: ${op}，可选: add, sub, mul, div` };
  }

  return { runtime: 'Node.js' as const, expression, result, params: { a, b, op } };
}
