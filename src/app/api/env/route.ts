import { NextResponse } from 'next/server';
import { getEnvData } from '@/lib/node-apis';

// Route Handler — 给浏览器端 CSR fetch 使用
// 实际逻辑在 @/lib/node-apis 中，Server Components 也直接调用同一个函数
export async function GET() {
  return NextResponse.json(getEnvData());
}
