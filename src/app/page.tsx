import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Go + Next.js 多渲染模式示例</h1>
        <span className={styles.badge}>Full-Stack Demo</span>
      </header>

      <main className={styles.main}>
        <p className={styles.desc}>
          基于 Next.js App Router + EdgeOne Go Cloud Functions + Node.js API Routes 的全栈项目，
          展示 <strong>SSR / CSR / SSG</strong> 三种渲染模式以及两种后端技术（Go 和 Node.js）的混合使用。
        </p>

        <div className={styles.cards}>
          <Link href="/ssr" className={styles.card}>
            <div className={styles.cardIcon}>⚡</div>
            <h2>SSR 模式</h2>
            <p>服务端渲染 — Server Components 在服务端并行调用 Go Functions 和 Node.js API，首屏直出完整数据。</p>
            <div className={styles.cardFeatures}>
              <span className={styles.tagGo}>Go API</span>
              <span className={styles.tagNode}>Node.js API</span>
              <span className={styles.tag}>Server Components</span>
              <span className={styles.tag}>全栈一体化</span>
            </div>
          </Link>

          <Link href="/csr" className={styles.card}>
            <div className={styles.cardIcon}>🖥️</div>
            <h2>CSR 模式</h2>
            <p>客户端渲染 — 交互式调试面板，浏览器运行时 fetch 调用 Go API 和 Node.js API，支持参数输入。</p>
            <div className={styles.cardFeatures}>
              <span className={styles.tagGo}>Go API</span>
              <span className={styles.tagNode}>Node.js API</span>
              <span className={styles.tag}>use client</span>
              <span className={styles.tag}>前后端分离</span>
            </div>
          </Link>

          <Link href="/ssg" className={styles.card}>
            <div className={styles.cardIcon}>📦</div>
            <h2>SSG 模式</h2>
            <p>静态生成 — 构建时通过 Node.js API 预取数据嵌入 HTML，部分数据由客户端动态请求 Go API 补充。</p>
            <div className={styles.cardFeatures}>
              <span className={styles.tagGo}>Go API (客户端)</span>
              <span className={styles.tagNode}>Node.js API (构建时)</span>
              <span className={styles.tag}>Static Generation</span>
            </div>
          </Link>
        </div>

        <section className={styles.routes}>
          <h3>API 接口一览</h3>
          <div className={styles.routeGroup}>
            <h4 className={styles.routeGroupTitle}>
              <span className={styles.langGo}>Go</span>
              Go Cloud Functions
            </h4>
            <div className={styles.routeList}>
              {[
                { method: 'GET', route: '/hello', desc: '基础示例 — Go 版本信息' },
                { method: 'GET', route: '/health', desc: '健康检查 — 状态 + 时间戳' },
                { method: 'ANY', route: '/echo', desc: '请求回显 — method/headers/body' },
                { method: 'GET', route: '/api/users', desc: '用户列表（静态路由）' },
                { method: 'GET', route: '/api/:id', desc: '单动态参数' },
                { method: 'GET', route: '/api/products/:pid/reviews/:rid', desc: '双动态参数' },
                { method: 'GET', route: '/api/users/:uid/posts/:pid/comments/:cid', desc: '三层动态参数' },
                { method: 'GET', route: '/api/files/*', desc: 'Catch-All 路由' },
              ].map((r, i) => (
                <div key={i} className={styles.routeItem}>
                  <span className={r.method === 'ANY' ? styles.methodAny : styles.methodGet}>{r.method}</span>
                  <code>{r.route}</code>
                  <span className={styles.routeDesc}>{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.routeGroup}>
            <h4 className={styles.routeGroupTitle}>
              <span className={styles.langNode}>Node</span>
              Next.js API Routes (Node.js)
            </h4>
            <div className={styles.routeList}>
              {[
                { method: 'GET', route: '/api/time', desc: '服务端时间 — 多时区格式' },
                { method: 'GET', route: '/api/env', desc: '运行环境 — OS/CPU/内存信息' },
                { method: 'GET', route: '/api/calc?a=10&b=3&op=add', desc: '计算器 — 四则运算' },
              ].map((r, i) => (
                <div key={i} className={styles.routeItem}>
                  <span className={styles.methodGet}>{r.method}</span>
                  <code>{r.route}</code>
                  <span className={styles.routeDesc}>{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
