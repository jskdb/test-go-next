/** @type {import('next').NextConfig} */
const nextConfig = {
  // 不使用 output: 'export'，保留 SSR 能力
  // 部署到 EdgeOne Pages 时由平台处理
  trailingSlash: false,
};

export default nextConfig;
