# 前端架构

## 目录结构（目标）

前端以仓库根目录的 `src/` 为源码根，Vite 配置与 `index.html` 保留在根目录（通用 Vite 实践）。

```text
src/
  main.tsx            # 应用入口
  App.tsx             # 根组件
  app/                # router、store、providers
  api-client/         # 由 OpenAPI 生成的类型与客户端（生成物）
  components/
    ui/               # shadcn/ui 组件（项目自有代码，纳入版本控制）
    layout/           # 布局、导航、页脚
  features/           # notes/tools/feeds/cheatsheets/mvps/patterns
  hooks/              # 跨领域 hooks
  lib/
    api/              # 请求封装与错误归一化
    utils.ts          # cn() 等通用工具
  styles/             # Tailwind 入口与全局样式
components.json       # shadcn/ui 配置（别名、样式、rsc=false）
index.html
vite.config.ts
```

- 路径别名：`@/*` → `src/*`，在 `tsconfig` 与 `vite.config.ts` 中保持一致。
- 按领域而不是按文件类型组织，`features/notes` 内同时包含组件、slice、API 调用与类型。
- 通用代码只在被两个以上领域复用时上移到 `components/`、`hooks/` 或 `lib/`。

## 组件策略：shadcn/ui 优先

shadcn/ui 是组件的**来源**，不是运行时组件库：组件源码通过 CLI 复制到 `src/components/ui/`，由项目拥有并维护。

- 无特殊情况必须优先使用 shadcn/ui，不另起第二套组件库。
- 添加组件：`npx shadcn@latest add <component>`；生成文件必须提交。
- 底层使用 Radix primitives，天然具备键盘操作与焦点管理；不要绕过其可访问性行为。
- 样式通过 Tailwind 类与 CSS 变量定制，不改组件对外 API 语义。
- 缺少组件时，优先用已有 shadcn 组件组合；仍不满足再在 `components/` 写自定义组件，并说明原因。
- 不直接依赖 Radix 原始包编写可替代组件。
- 扩展或修改 `components/ui/` 中的文件时，保持与上游结构一致，便于后续升级。

## 契约与类型

- 服务端 OpenAPI 3.1 是唯一契约来源。
- `src/api-client` 由生成脚本产出（当前为 `openapi-typescript`，命令 `npm run api:generate`），纳入版本控制，不手改。
- `Zane.Api.json` 由后端构建时输出到 `src/api-client/`，`schema.ts` 是唯一类型来源；手写 `fetch` 只允许出现在 `client.ts` 封装内。
- 前端不手写与服务端重复的 DTO。
- 表单体验校验可用 Zod，但不得替代服务端校验。

## 路由

- 使用 React Router。
- 路由按领域懒加载。
- 当前无鉴权，管理类页面仅在本地/内网可用；公网不暴露写入口。
- 公开页面：工具、Cheat Sheet、最佳实践、聚合。

主要路由：

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页/工作台 | 最近记录、常用工具、热点摘要 |
| `/notes`、`/notes/:id` | 记录列表与详情 | 编辑入口仅本地/内网 |
| `/tools`、`/tools/:slug` | 工具列表与工具页 | 无需登录 |
| `/playground` | MVP 入口 | 独立路由 |
| `/patterns` | 最佳实践 | — |
| `/feeds` | 热点聚合 | 读取缓存 |
| `/cheatsheets` | Cheat Sheet | — |
| `/admin/*` | 管理 | 仅本地/内网，鉴权延后 |

## 状态管理

| Slice / 方案 | 内容 |
| --- | --- |
| RTK Query | 服务端数据：记录、内容、聚合、工具目录 |
| `notes` slice | 草稿、筛选条件、编辑态 |
| `ui` slice | 主题、侧栏、全局提示 |

原则：

- 服务端状态优先 RTK Query，不复制进普通 slice。
- 草稿与筛选条件可持久化。
- 异步副作用放在 RTK Query 或 thunk，不写在 reducer。
- 派生数据用 selector。

## 样式

- Tailwind 是唯一样式方案，设计 token 映射为 shadcn/ui 的 CSS 变量（`--background`、`--foreground`、`--primary` 等）。
- 深浅主题通过 `dark` class 实现。
- 颜色、间距、圆角不得在组件中散落硬编码。
- 自定义样式优先用 `cn()` 合并类名，不写内联样式。
- 不引入重型组件库；shadcn/ui 不构成运行时依赖。

## 请求层

- 使用生成的 API 客户端；统一 baseURL、超时与错误归一化。
- 错误映射为可展示消息；ProblemDetails 的 `title`/`detail` 可作为来源。
- 外部数据展示 `fetchedAt`，过期时提示。

## 质量要求

- TypeScript 严格模式，禁止 `any` 逃逸。
- 每个 feature 有核心逻辑单元测试。
- 表单、空状态、加载态、错误态必须实现。
- 可访问性：键盘可操作、焦点可见、语义化标签、对比度达标；优先保留 shadcn/Radix 的默认行为。

## 与后端边界

- 前端不直接访问 SQLite，不持有第三方密钥。
- 外部数据通过后端接口获取。
- 纯计算工具优先在前端完成。
