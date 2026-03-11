import SSGClient from './SSGClient';
import styles from './page.module.css';

// 构建时静态数据（模拟从 Node.js 端在 build-time 获取的数据）
// 在真实场景中这些可以来自数据库、CMS 等
const buildTimeData = {
  buildTime: new Date().toISOString(),
  nodeVersion: process.version,
  articles: [
    {
      id: 1,
      title: '理解 SSG：构建时静态生成',
      summary: 'SSG (Static Site Generation) 在构建时生成 HTML，部署后无需服务端渲染。适合博客、文档等内容不频繁更新的场景。',
      author: 'Node.js',
      date: '2026-03-10',
    },
    {
      id: 2,
      title: 'Go Cloud Functions 入门',
      summary: '使用 Go 语言编写轻量级的云函数，通过文件系统路由约定实现 RESTful API。',
      author: 'Go',
      date: '2026-03-09',
    },
    {
      id: 3,
      title: 'CSR vs SSR vs SSG 对比',
      summary: '三种渲染模式各有优劣：CSR 适合交互密集型应用，SSR 适合 SEO 要求高的页面，SSG 适合静态内容。',
      author: 'Node.js',
      date: '2026-03-08',
    },
  ],
};

// SSG: 这个 Server Component 在 build 时执行
// 静态内容由 Node.js 在构建时生成，动态数据由客户端 fetch Go API 补充
export default function SSGPage() {
  return (
    <div className={styles.container}>
      <SSGClient
        buildTime={buildTimeData.buildTime}
        nodeVersion={buildTimeData.nodeVersion}
        articles={buildTimeData.articles}
      />
    </div>
  );
}
