import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Go + Next.js — 多渲染模式全栈示例',
  description: '基于 Next.js App Router + Go Cloud Functions + Node.js API Routes 的多渲染模式全栈示例',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
