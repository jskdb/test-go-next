import { NextResponse } from 'next/server';
import { getTimeData } from '@/lib/node-apis';

// 声明为动态路由 — 时间数据每次请求都不同，不应被构建时缓存
export const dynamic = 'force-dynamic';

// Route Handler — 给浏览器端 CSR fetch 使用
// 实际逻辑在 @/lib/node-apis 中，Server Components 也直接调用同一个函数
export async function GET() {
  return NextResponse.json(getTimeData());
}
