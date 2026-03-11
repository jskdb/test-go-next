'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface ApiConfig {
  method: string;
  route: string;
  desc: string;
  runtime: 'Go' | 'Node.js';
  params: { name: string; placeholder: string }[];
  body?: string;
}

const APIs: { section: string; items: ApiConfig[] }[] = [
  {
    section: 'Go Cloud Functions',
    items: [
      { method: 'GET', route: '/hello', desc: '返回 Go 版本信息', runtime: 'Go', params: [] },
      { method: 'GET', route: '/health', desc: '健康检查', runtime: 'Go', params: [] },
      {
        method: 'POST', route: '/echo', desc: '请求回显', runtime: 'Go',
        params: [],
        body: '{"message": "hello from CSR"}',
      },
      { method: 'GET', route: '/api/users', desc: '用户列表', runtime: 'Go', params: [] },
      {
        method: 'GET', route: '/api/{id}', desc: '单动态参数', runtime: 'Go',
        params: [{ name: 'id', placeholder: '42' }],
      },
      {
        method: 'GET', route: '/api/products/{productId}/reviews/{reviewId}',
        desc: '双动态参数', runtime: 'Go',
        params: [
          { name: 'productId', placeholder: 'sku-001' },
          { name: 'reviewId', placeholder: '7' },
        ],
      },
      {
        method: 'GET', route: '/api/users/{userId}/posts/{postId}/comments/{commentId}',
        desc: '三层动态参数', runtime: 'Go',
        params: [
          { name: 'userId', placeholder: 'u-100' },
          { name: 'postId', placeholder: 'p-200' },
          { name: 'commentId', placeholder: 'c-300' },
        ],
      },
      {
        method: 'GET', route: '/api/files/{path}', desc: 'Catch-All 路由', runtime: 'Go',
        params: [{ name: 'path', placeholder: 'docs/readme.md' }],
      },
    ],
  },
  {
    section: 'Next.js API Routes (Node.js)',
    items: [
      { method: 'GET', route: '/api/time', desc: '服务端时间', runtime: 'Node.js', params: [] },
      { method: 'GET', route: '/api/env', desc: '运行环境信息', runtime: 'Node.js', params: [] },
      {
        method: 'GET', route: '/api/calc', desc: '计算器', runtime: 'Node.js',
        params: [
          { name: 'a', placeholder: '12' },
          { name: 'b', placeholder: '5' },
          { name: 'op', placeholder: 'mul' },
        ],
      },
    ],
  },
];

interface Result {
  url: string;
  status: number | null;
  data: string;
  duration: number;
  error: boolean;
}

function buildUrl(api: ApiConfig, values: Record<string, string>): string {
  // Node.js calc: query params
  if (api.route === '/api/calc') {
    const a = values['a'] || '12';
    const b = values['b'] || '5';
    const op = values['op'] || 'mul';
    return `/api/calc?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}&op=${encodeURIComponent(op)}`;
  }

  if (api.params.length === 0) return api.route;

  // catch-all
  if (api.route === '/api/files/{path}') {
    const val = values['path'] || 'docs/readme.md';
    return '/api/files/' + val;
  }

  // dynamic params
  let path = api.route;
  api.params.forEach((p) => {
    path = path.replace(`{${p.name}}`, encodeURIComponent(values[p.name] || p.placeholder));
  });
  return path;
}

export default function CSRPage() {
  const [results, setResults] = useState<Record<string, Result>>({});
  const [paramValues, setParamValues] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getValues = (key: string, params: ApiConfig['params']) => {
    if (paramValues[key]) return paramValues[key];
    const defaults: Record<string, string> = {};
    params.forEach((p) => (defaults[p.name] = p.placeholder));
    return defaults;
  };

  const updateParam = (key: string, paramName: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], [paramName]: value },
    }));
  };

  const sendRequest = async (api: ApiConfig, key: string) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    const values = getValues(key, api.params);
    const url = buildUrl(api, values);

    const start = performance.now();
    try {
      const opts: RequestInit = { method: api.method };
      if (api.body) {
        opts.body = api.body;
        opts.headers = { 'Content-Type': 'application/json' };
      }
      const res = await fetch(url, opts);
      const text = await res.text();
      const duration = Math.round(performance.now() - start);

      let formatted: string;
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        formatted = text;
      }

      setResults((prev) => ({
        ...prev,
        [key]: { url, status: res.status, data: formatted, duration, error: !res.ok },
      }));
    } catch (e) {
      const duration = Math.round(performance.now() - start);
      setResults((prev) => ({
        ...prev,
        [key]: { url, status: null, data: (e as Error).message, duration, error: true },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const sendAll = async () => {
    let idx = 0;
    const promises: Promise<void>[] = [];
    APIs.forEach((section) => {
      section.items.forEach((api) => {
        const key = `${idx}`;
        promises.push(sendRequest(api, key));
        idx++;
      });
    });
    await Promise.all(promises);
  };

  let itemIdx = 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← 首页</Link>
        <h1>CSR 模式</h1>
        <span className={styles.badge}>Client-Side Rendering</span>
        <button className={styles.btnAll} onClick={sendAll}>全部调用</button>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <h2>🖥️ 客户端渲染 — 交互式 API 调试面板</h2>
          <p>
            本页面使用 <code>&apos;use client&apos;</code>，所有数据请求在浏览器中发起。
            支持同时调用 <strong className={styles.goText}>Go Cloud Functions</strong> 和
            <strong className={styles.nodeText}> Next.js API Routes</strong>，
            可自定义参数，实时查看响应。
          </p>
          <div className={styles.flow}>
            <span className={styles.flowStep}>浏览器</span>
            <span className={styles.flowArrow}>→</span>
            <span className={styles.flowStep}>fetch()</span>
            <span className={styles.flowArrow}>→</span>
            <div className={styles.flowFork}>
              <span className={styles.flowStepGo}>Go Functions</span>
              <span className={styles.flowStepNode}>Node.js API</span>
            </div>
            <span className={styles.flowArrow}>→</span>
            <span className={styles.flowStep}>更新 DOM</span>
          </div>
        </div>

        {APIs.map((section, si) => (
          <div key={si} className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={si === 0 ? styles.langGo : styles.langNode}>
                {si === 0 ? 'Go' : 'Node'}
              </span>
              {section.section}
            </h3>
            {section.items.map((api) => {
              const key = `${itemIdx}`;
              const result = results[key];
              const isLoading = loading[key];
              const currentIdx = itemIdx;
              itemIdx++;

              return (
                <div
                  key={currentIdx}
                  className={`${styles.card} ${
                    result
                      ? result.error
                        ? styles.cardError
                        : api.runtime === 'Go'
                          ? styles.cardGoOk
                          : styles.cardNodeOk
                      : ''
                  }`}
                >
                  <div className={styles.cardHeader}>
                    <span className={api.method === 'GET' ? styles.methodGet : styles.methodPost}>
                      {api.method}
                    </span>
                    <code className={styles.route}>{api.route}</code>
                    <span className={styles.desc}>{api.desc}</span>
                    <span className={api.runtime === 'Go' ? styles.runtimeGo : styles.runtimeNode}>
                      {api.runtime}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.inputRow}>
                      {api.params.map((p) => (
                        <div key={p.name} className={styles.inputGroup}>
                          <label>{p.name}</label>
                          <input
                            type="text"
                            defaultValue={p.placeholder}
                            placeholder={p.placeholder}
                            onChange={(e) => updateParam(key, p.name, e.target.value)}
                          />
                        </div>
                      ))}
                      <button
                        className={styles.btnSend}
                        disabled={isLoading}
                        onClick={() => sendRequest(api, key)}
                      >
                        {isLoading ? '请求中...' : '发送'}
                      </button>
                    </div>

                    {result && (
                      <div className={styles.result}>
                        <div className={styles.resultHeader}>
                          <code className={styles.resultUrl}>{result.url}</code>
                          <span className={styles.duration}>{result.duration}ms</span>
                          <span className={result.error ? styles.statusError : styles.statusOk}>
                            {result.status ?? 'ERR'}
                          </span>
                        </div>
                        <pre className={styles.json}>{result.data}</pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </main>
    </div>
  );
}
