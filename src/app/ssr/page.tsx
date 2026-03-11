import Link from 'next/link';
import styles from './page.module.css';
// 共享 Node.js 业务逻辑 — Server Components 直接 import 调用，零网络开销
// 同一份逻辑也被 Route Handlers（/api/time 等）使用，给浏览器端 CSR fetch 调用
import { getTimeData, getEnvData, getCalcData } from '@/lib/node-apis';

// Go Cloud Functions 是外部服务，需要完整 URL
const GO_API_BASE = process.env.API_BASE || 'http://localhost:8088';

interface ApiResult {
  name: string;
  route: string;
  runtime: 'Go' | 'Node.js';
  data: Record<string, unknown> | null;
  error: string | null;
  duration: number;
}

// 调用外部 Go Cloud Functions — 需要绝对 URL
async function fetchGoApi(route: string): Promise<ApiResult> {
  const start = Date.now();
  try {
    const res = await fetch(`${GO_API_BASE}${route}`, { cache: 'no-store' });
    const data = await res.json();
    return { name: route, route, runtime: 'Go', data, error: null, duration: Date.now() - start };
  } catch (e) {
    return { name: route, route, runtime: 'Go', data: null, error: (e as Error).message, duration: Date.now() - start };
  }
}

// 将 Node.js 直接调用包装为统一的 ApiResult 格式
function callNodeFn(route: string, fn: () => Record<string, unknown>): ApiResult {
  const start = Date.now();
  try {
    const data = fn();
    return { name: route, route, runtime: 'Node.js', data, error: null, duration: Date.now() - start };
  } catch (e) {
    return { name: route, route, runtime: 'Node.js', data: null, error: (e as Error).message, duration: Date.now() - start };
  }
}

export default async function SSRPage() {
  // Go API：并行 fetch 外部服务
  const goResults = await Promise.all([
    fetchGoApi('/hello'),
    fetchGoApi('/health'),
    fetchGoApi('/api/users'),
    fetchGoApi('/api/42'),
    fetchGoApi('/api/products/sku-001/reviews/7'),
    fetchGoApi('/api/users/u-100/posts/p-200/comments/c-300'),
    fetchGoApi('/api/files/docs/readme.md'),
  ]);

  // Node.js：直接 import 共享逻辑调用（与 /api/* Route Handlers 使用同一份代码）
  const nodeResults: ApiResult[] = [
    callNodeFn('/api/time', getTimeData),
    callNodeFn('/api/env', getEnvData),
    callNodeFn('/api/calc?a=12&b=5&op=mul', () => getCalcData(12, 5, 'mul')),
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← 首页</Link>
        <h1>SSR 模式</h1>
        <span className={styles.badge}>Server Components</span>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <h2>⚡ 服务端渲染 — Go + Node.js 双引擎</h2>
          <p>
            本页面使用 Next.js <strong>Server Components</strong>，在服务端同时执行：
            <strong className={styles.goText}> Go Cloud Functions</strong>（fetch 外部服务）和
            <strong className={styles.nodeText}> Node.js 逻辑</strong>（直接内联调用，无需 fetch 自身 API）。
            数据在服务端获取后直接嵌入 HTML 返回，浏览器无需额外请求。
          </p>
          <div className={styles.flow}>
            <span className={styles.flowStep}>浏览器请求</span>
            <span className={styles.flowArrow}>→</span>
            <span className={styles.flowStep}>Next.js Server</span>
            <span className={styles.flowArrow}>→</span>
            <div className={styles.flowFork}>
              <span className={styles.flowStepGo}>fetch → Go Cloud Functions</span>
              <span className={styles.flowStepNode}>直接调用 Node.js 逻辑</span>
            </div>
            <span className={styles.flowArrow}>→</span>
            <span className={styles.flowStep}>渲染 HTML 返回</span>
          </div>
        </div>

        {/* Go API Results */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.langGo}>Go</span>
            Go Cloud Functions 响应
          </h3>
          <div className={styles.results}>
            {goResults.map((r, i) => (
              <div key={i} className={`${styles.card} ${r.error ? styles.cardError : styles.cardGoOk}`}>
                <div className={styles.cardHeader}>
                  <code className={styles.route}>{r.route}</code>
                  <span className={styles.duration}>{r.duration}ms</span>
                  <span className={r.error ? styles.statusError : styles.statusOk}>
                    {r.error ? 'ERROR' : 'OK'}
                  </span>
                </div>
                <pre className={styles.json}>
                  {r.error ? r.error : JSON.stringify(r.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Node.js API Results */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.langNode}>Node</span>
            Node.js 内联调用响应（等价 API Routes）
          </h3>
          <div className={styles.results}>
            {nodeResults.map((r, i) => (
              <div key={i} className={`${styles.card} ${r.error ? styles.cardError : styles.cardNodeOk}`}>
                <div className={styles.cardHeader}>
                  <code className={styles.route}>{r.route}</code>
                  <span className={styles.duration}>{r.duration}ms</span>
                  <span className={r.error ? styles.statusError : styles.statusOk}>
                    {r.error ? 'ERROR' : 'OK'}
                  </span>
                </div>
                <pre className={styles.json}>
                  {r.error ? r.error : JSON.stringify(r.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.note}>
          💡 查看网页源代码（Ctrl+U / Cmd+U），所有 Go 和 Node.js API 数据已经嵌入 HTML 中 —— 这就是 SSR 的效果。
        </div>
      </main>
    </div>
  );
}
