import { NextResponse } from 'next/server';
import { getEnvData } from '@/lib/node-apis';

// 声明为动态路由 — 内存/uptime 等数据是实时变化的，不应被构建时缓存
export const dynamic = 'force-dynamic';

// Route Handler — 给浏览器端 CSR fetch 使用
// 实际逻辑在 @/lib/node-apis 中，Server Components 也直接调用同一个函数
export async function GET() {
  return NextResponse.json(getEnvData());
}
