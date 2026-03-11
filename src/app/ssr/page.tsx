import Link from 'next/link';
import styles from './page.module.css';
// 共享 Node.js 业务逻辑 — Server Components 直接 import 调用，零网络开销
// 同一份逻辑也被 Route Handlers（/api/time 等）使用，给浏览器端 CSR fetch 调用
import { getTimeData, getEnvData, getCalcData } from '@/lib/node-apis';

// SSR 页面必须每次请求都在服务端执行（时间、内存等数据是实时的）
export const dynamic = 'force-dynamic';

interface ApiResult {
  name: string;
  route: string;
  data: Record<string, unknown> | null;
  error: string | null;
  duration: number;
}

// 将 Node.js 直接调用包装为统一的 ApiResult 格式
function callNodeFn(route: string, fn: () => Record<string, unknown>): ApiResult {
  const start = Date.now();
  try {
    const data = fn();
    return { name: route, route, data, error: null, duration: Date.now() - start };
  } catch (e) {
    return { name: route, route, data: null, error: (e as Error).message, duration: Date.now() - start };
  }
}

export default async function SSRPage() {
  // Node.js：直接 import 共享逻辑调用（与 /api/* Route Handlers 使用同一份代码）
  // Server Components 不 fetch 自己的 API Routes，直接调函数，零网络开销
  const results: ApiResult[] = [
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
          <h2>⚡ 服务端渲染 — Node.js Server Components</h2>
          <p>
            本页面使用 Next.js <strong>Server Components</strong>，
            在服务端直接调用 <strong className={styles.nodeText}>Node.js 逻辑函数</strong>（与 API Routes 共享同一份代码），
            数据在服务端获取后直接嵌入 HTML 返回，浏览器无需额外请求。
          </p>
          <p style={{ marginTop: '8px' }}>
            Go API 是独立部署的服务，通过 CSR 页面在浏览器端 fetch 调用（经网关路由分发），不在 SSR 中跨服务请求。
          </p>
          <div className={styles.flow}>
            <span className={styles.flowStep}>浏览器请求</span>
            <span className={styles.flowArrow}>→</span>
            <span className={styles.flowStep}>Next.js Server</span>
            <span className={styles.flowArrow}>→</span>
            <span className={styles.flowStepNode}>直接调用 Node.js 逻辑函数</span>
            <span className={styles.flowArrow}>→</span>
            <span className={styles.flowStep}>渲染 HTML 返回</span>
          </div>
        </div>

        {/* Node.js SSR Results */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.langNode}>Node</span>
            Node.js Server Component 直接调用响应
          </h3>
          <div className={styles.results}>
            {results.map((r, i) => (
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
          💡 查看网页源代码（Ctrl+U / Cmd+U），所有 Node.js API 数据已经嵌入 HTML 中 —— 这就是 SSR 的效果。
          Go API 数据请前往 <Link href="/csr" style={{ color: 'var(--accent)' }}>CSR 页面</Link> 查看（浏览器端 fetch）。
        </div>
      </main>
    </div>
  );
}
