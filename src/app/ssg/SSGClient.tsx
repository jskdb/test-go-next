'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Article {
  id: number;
  title: string;
  summary: string;
  author: string;
  date: string;
}

interface GoApiResult {
  route: string;
  data: Record<string, unknown> | null;
  error: string | null;
  duration: number;
}

interface Props {
  buildTime: string;
  nodeVersion: string;
  articles: Article[];
}

export default function SSGClient({ buildTime, nodeVersion, articles }: Props) {
  const [goResults, setGoResults] = useState<GoApiResult[]>([]);
  const [goLoading, setGoLoading] = useState(false);
  const [nodeResult, setNodeResult] = useState<GoApiResult | null>(null);
  const [nodeLoading, setNodeLoading] = useState(false);

  // 客户端动态请求 Node.js /api/time
  const fetchNodeTime = async () => {
    setNodeLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/time');
      const data = await res.json();
      setNodeResult({
        route: '/api/time',
        data,
        error: null,
        duration: Math.round(performance.now() - start),
      });
    } catch (e) {
      setNodeResult({
        route: '/api/time',
        data: null,
        error: (e as Error).message,
        duration: Math.round(performance.now() - start),
      });
    } finally {
      setNodeLoading(false);
    }
  };

  // 客户端动态请求 Go API
  const fetchGoApis = async () => {
    setGoLoading(true);
    const routes = ['/hello', '/health', '/api/users'];
    const results = await Promise.all(
      routes.map(async (route) => {
        const start = performance.now();
        try {
          const res = await fetch(route);
          const data = await res.json();
          return { route, data, error: null, duration: Math.round(performance.now() - start) };
        } catch (e) {
          return { route, data: null, error: (e as Error).message, duration: Math.round(performance.now() - start) };
        }
      })
    );
    setGoResults(results);
    setGoLoading(false);
  };

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← 首页</Link>
        <h1>SSG 模式</h1>
        <span className={styles.badge}>Static Generation</span>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <h2>📦 静态生成 — 构建时预渲染 + 运行时动态补充</h2>
          <p>
            本页面在 <strong>构建时</strong> 通过 Node.js 预生成静态内容（文章列表），
            部署后由浏览器动态请求 <strong className={styles.goText}>Go API</strong> 和
            <strong className={styles.nodeText}> Node.js API</strong> 获取实时数据。
          </p>
          <div className={styles.flow}>
            <div className={styles.flowColumn}>
              <span className={styles.flowLabel}>构建时</span>
              <div className={styles.flowRow}>
                <span className={styles.flowStepNode}>Node.js 预生成 HTML</span>
                <span className={styles.flowArrow}>→</span>
                <span className={styles.flowStep}>静态 HTML + 文章数据</span>
              </div>
            </div>
            <div className={styles.flowColumn}>
              <span className={styles.flowLabel}>运行时</span>
              <div className={styles.flowRow}>
                <span className={styles.flowStep}>浏览器 fetch</span>
                <span className={styles.flowArrow}>→</span>
                <div className={styles.flowFork}>
                  <span className={styles.flowStepGo}>Go Functions</span>
                  <span className={styles.flowStepNode}>Node.js API</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 静态生成内容 — Node.js 构建时数据 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.langNode}>Node</span>
            构建时静态内容 (SSG)
          </h3>
          <div className={styles.buildInfo}>
            <span>构建时间: <code>{buildTime}</code></span>
            <span>Node 版本: <code>{nodeVersion}</code></span>
          </div>
          <div className={styles.articles}>
            {articles.map((article) => (
              <div key={article.id} className={styles.articleCard}>
                <div className={styles.articleHeader}>
                  <h4>{article.title}</h4>
                  <span className={article.author === 'Go' ? styles.langGo : styles.langNode}>
                    {article.author}
                  </span>
                </div>
                <p>{article.summary}</p>
                <span className={styles.articleDate}>{article.date}</span>
              </div>
            ))}
          </div>
          <div className={styles.note}>
            ⬆️ 以上内容在 <code>next build</code> 时就已经嵌入 HTML，查看源代码可见。
          </div>
        </div>

        {/* 动态内容 — Node.js API */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.langNode}>Node</span>
            运行时动态数据 — Node.js API
          </h3>
          <div className={styles.dynamicBlock}>
            <button
              className={styles.btnFetch}
              onClick={fetchNodeTime}
              disabled={nodeLoading}
            >
              {nodeLoading ? '请求中...' : '获取服务器时间 /api/time'}
            </button>
            {nodeResult && (
              <div className={`${styles.resultCard} ${nodeResult.error ? styles.resultError : styles.resultNodeOk}`}>
                <div className={styles.resultHeader}>
                  <code>{nodeResult.route}</code>
                  <span className={styles.duration}>{nodeResult.duration}ms</span>
                </div>
                <pre className={styles.json}>
                  {nodeResult.error ? nodeResult.error : JSON.stringify(nodeResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 动态内容 — Go API */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.langGo}>Go</span>
            运行时动态数据 — Go Cloud Functions
          </h3>
          <div className={styles.dynamicBlock}>
            <button
              className={styles.btnFetch}
              onClick={fetchGoApis}
              disabled={goLoading}
            >
              {goLoading ? '请求中...' : '批量调用 Go API (/hello, /health, /api/users)'}
            </button>
            {goResults.length > 0 && (
              <div className={styles.resultList}>
                {goResults.map((r, i) => (
                  <div key={i} className={`${styles.resultCard} ${r.error ? styles.resultError : styles.resultGoOk}`}>
                    <div className={styles.resultHeader}>
                      <code>{r.route}</code>
                      <span className={styles.duration}>{r.duration}ms</span>
                    </div>
                    <pre className={styles.json}>
                      {r.error ? r.error : JSON.stringify(r.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.note}>
          💡 SSG 的典型场景：博客首页在构建时预渲染文章列表（SEO 友好），评论数、点赞数等实时数据由客户端 fetch 补充。
        </div>
      </main>
    </>
  );
}
