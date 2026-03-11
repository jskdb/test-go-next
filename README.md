# Go + Next.js 多渲染模式全栈示例

基于 **Next.js 14 App Router** + **EdgeOne Go Cloud Functions** + **Node.js API Routes** 的全栈项目，展示 SSR / CSR / SSG 三种渲染模式以及 Go + Node.js 双后端引擎的混合使用。

## 项目结构

```
go-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根 Layout
│   │   ├── page.tsx                # 首页 — 导航 + API 一览
│   │   ├── ssr/page.tsx            # ⚡ SSR — Server Components
│   │   ├── csr/page.tsx            # 🖥️ CSR — Client Rendering
│   │   ├── ssg/                    # 📦 SSG — Static Generation
│   │   │   ├── page.tsx            #     Server Component (构建时)
│   │   │   └── SSGClient.tsx       #     Client Component (运行时)
│   │   └── api/                    # Node.js API Routes
│   │       ├── time/route.ts       #     /api/time — 服务端时间
│   │       ├── env/route.ts        #     /api/env — 运行环境信息
│   │       └── calc/route.ts       #     /api/calc — 计算器
│   └── ...
├── cloud-functions/                # Go Cloud Functions
│   ├── hello.go                    #     /hello — Go 版本信息
│   ├── health.go                   #     /health — 健康检查
│   ├── echo.go                     #     /echo — 请求回显
│   └── api/
│       ├── users.go                #     /api/users — 用户列表
│       ├── [id].go                 #     /api/:id — 单动态参数
│       ├── files/[[path]].go       #     /api/files/* — Catch-All
│       ├── products/.../reviews/   #     双动态参数
│       └── users/.../comments/     #     三层动态参数
├── package.json
├── next.config.mjs
└── tsconfig.json
```

## 三种渲染模式

| 模式 | 路由 | 原理 | 后端 |
|------|------|------|------|
| **SSR** | `/ssr` | Server Components 在服务端调用 API，首屏直出完整数据 | Go + Node.js |
| **CSR** | `/csr` | 纯客户端渲染，浏览器 fetch 调用 API，交互式调试面板 | Go + Node.js |
| **SSG** | `/ssg` | 构建时 Node.js 预渲染静态内容，运行时客户端 fetch 补充动态数据 | Go + Node.js |

## 双后端引擎

### Go Cloud Functions (8 个接口)
- `/hello` — Go 版本信息 (`runtime.Version()`)
- `/health` — 健康检查 (`time.Now()`)
- `/echo` — 请求回显 (`io.ReadAll`, `encoding/json`)
- `/api/users` — 用户列表
- `/api/:id` — 单动态参数 (`strings.Split`)
- `/api/products/:pid/reviews/:rid` — 双动态参数
- `/api/users/:uid/posts/:pid/comments/:cid` — 三层动态参数
- `/api/files/*` — Catch-All 路由

### Node.js API Routes (3 个接口)
- `/api/time` — 服务端时间 (`Intl.DateTimeFormat`, `Date`)
- `/api/env` — 运行环境 (`os.cpus()`, `os.totalmem()`)
- `/api/calc?a=10&b=3&op=add` — 计算器 (Query Params 解析)

## 本地开发

```bash
# 安装依赖
npm install

# 启动 Next.js 开发服务器
npm run dev
# 访问 http://localhost:3000

# 启动 EdgeOne Go Functions 开发服务器（另一个终端）
npx edgeone pages dev
# Go API 运行在 http://localhost:8088
```

## 构建

```bash
npm run build
```
