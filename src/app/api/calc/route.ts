import { NextRequest, NextResponse } from 'next/server';
import { getCalcData } from '@/lib/node-apis';

// Route Handler — 给浏览器端 CSR fetch 使用
// 实际逻辑在 @/lib/node-apis 中，Server Components 也直接调用同一个函数
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const a = parseFloat(searchParams.get('a') || '0');
  const b = parseFloat(searchParams.get('b') || '0');
  const op = searchParams.get('op') || 'add';

  const result = getCalcData(a, b, op);

  if ('error' in result) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
