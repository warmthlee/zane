# 阶段 2 交付计划（前端页面 P0–P7）

本文管理阶段 1 出口之后的前端页面建设：把现有单体页面拆成可深链的路由页面，落地 Tailwind + shadcn/ui 设计基线，补齐加载/空/错误状态与前端测试。步骤编号使用 `P0–P7`，与阶段 1 的 `S0–S5` 区分。

## 与路线图的关系

- 本计划是**前端页面基线**，不等同于 [`roadmap.md`](roadmap.md) 中按业务模块划分的“阶段 2（在线工具与 Cheat Sheet）”。
- 工具与 Cheat Sheet（PRD-02 / PRD-07）不在本计划内；本计划完成后按独立计划推进，可复用 P1–P3 的路由与组件基线。
- 笔记后端 CRUD（NOTE-01～NOTE-03）不在本计划内；本计划先用 mock repository 完成页面，接口落地后按 P5 的替换点接入真实契约。
- 鉴权（ADR-007）与社交分发（ADR-008）仍延后，不实现编辑、删除、同步等写入口。

## 范围

### 纳入

- 现有 7 个视图的**路由化与页面拆分**：首页、文章（笔记）、分类、文库、归档、关于、作者。
- 设计系统基线：Tailwind token、shadcn/ui 组件、`dark` 主题、焦点与动效规范。
- 通用页面骨架与加载/空/错误状态组件。
- 前端测试基础设施与 CI 门禁。
- 文档、索引与验收记录同步。

### 不纳入

- 后端接口变更、EF Core 迁移、`NOTE-01～03` 的实现。
- 笔记编辑页、自动保存、删除、导出（依赖写接口与鉴权）。
- 在线工具、Cheat Sheet、Playground、最佳实践、热点聚合页面。
- 用户鉴权、社交平台分发、SSR/ SEO 专项。

## 前置条件

- 阶段 1 的 S0–S5 已 `done`（见 [`delivery-plan.md`](delivery-plan.md)）。
- 前端依赖现状：React 19、Vite 8、Tailwind CSS 4、shadcn/ui 基础组件；尚未安装 React Router、Redux Toolkit、前端测试框架。
- 后端契约当前仅有 `GET /api/v1/health`；笔记接口尚未实现。
- 本机 Node 24、npm 可用；后端改动不参与本计划验收。

## 决策（P0 确认后生效）

| 编号 | 决策 | 推荐值 | 确认状态 |
| --- | --- | --- | --- |
| D1 | 信息架构 | 保留现有博客型内容，路径化；平台模块路径预留但不实现 | 已确认（2026-11-08） |
| D2 | 页面目录 | 路由页面放 `src/pages/`；领域组件与数据放 `src/features/<domain>/` | 已确认（2026-11-08） |
| D3 | 样式迁移 | 增量迁移：P2 建 token 桥接，P4–P6 逐页迁移，P7 删除 `app.css` 残留 | 已确认（2026-11-08） |
| D4 | 数据来源 | 页面阶段使用 `repository` 异步 mock；接口落地后由生成客户端替换，不手写重复 DTO | 已确认（2026-11-08） |
| D5 | 状态管理 | P2 引入 Redux Toolkit 承载主题与文库筛选；服务端数据等 NOTE 接口落地后再用 RTK Query | 已确认（2026-11-08） |
| D6 | 测试 | P7 引入 Vitest + React Testing Library；路由用 `createMemoryRouter` 测试 | 已确认（2026-11-08） |

### 推荐路由表（D1）

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页/工作台 | Hero、最近笔记、内容板块、阅读台账 |
| `/notes` | 笔记列表 | 搜索、分类/标签/年份、收藏/草稿/在读筛选写入 query |
| `/notes/:noteId` | 笔记详情 | 目录、正文、代码复制、上下篇 |
| `/categories/:categoryId` | 分类 | 使用 `contentCategories[].id`，不使用中文名作路径 |
| `/library` | 文库 | 收藏、草稿、在读 |
| `/archive` | 归档 | 年份/分类/标签模式写入 query |
| `/author` | 作者 | 保留现有页面；P6 评估是否与 `/about` 合并 |
| `/about` | 关于 | 保留现有页面 |
| `*` | 404 | 说明原因并提供返回首页入口 |

旧链接兼容：`#articles`、`#category`、`#archive`、`?post=<id>` 在 P1 重定向到新路径。

## 使用方式

- 状态取值：`todo` / `doing` / `done` / `blocked` / `dropped`。
- 每步开始前把状态改为 `doing`；完成后补「验收记录」并改为 `done`。
- **一步未通过验收，不开始下一步的主要工作**；允许在同一步内返工。
- 验收证据写命令与实际输出摘要，不写「已验证」这类无证据结论。
- 一步一会话；会话之间只依赖 Git 提交、本文、交接摘要与 `.ai/` 归档。

### 开工（新会话第一句话）

```text
读 docs/01-requirements/delivery-plan-phase2.md 与 AGENTS.md，执行 P1。
先核对进入条件，把 P1 状态改为 doing，再按任务清单实现；
结束时按验收表逐条跑命令，更新状态、验收记录与交接摘要。
```

Claude Code 中可使用 `/step P1`；若命令模板尚未支持 `P*` 步骤，按本文手动执行。命令模板见 [`../../.claude/commands/step.md`](../../.claude/commands/step.md)。

### 收工清单

1. 按该步骤「验收」表逐条执行命令，记录真实输出摘要。
2. 全部通过才改 `done`；否则改 `blocked` 并写明缺什么。
3. 提交，提交信息带步骤 ID，例如 `feat(P1): 路由骨架与页面拆分`。
4. 归档：`npm run session:save -- "P1 · 路由骨架与页面拆分" done "<证据摘要>"`。
5. 填写「交接摘要」对应行，三列都要有内容。

### 交接摘要格式

- **已完成**：本步实际交付了什么（对应到具体路径与命令）。
- **已定契约**：下一步必须遵守的接口、命名、数据结构、配置键。
- **下一步前置**：下一个会话开始前必须存在的文件、命令或决策。

## 总览

| 步骤 | 主题 | 依赖 | 主要产出 | 状态 |
| --- | --- | --- | --- | --- |
| P0 | 基线与路由表确认 | — | 决策记录、路由表、目录约定 | done |
| P1 | 路由骨架与页面拆分 | P0 | React Router、`app/layouts`、`pages/` | done |
| P2 | 设计系统与主题基线 | P1 | token 对齐、`dark` 主题、Redux UI slice、shadcn 组件落地 | done |
| P3 | 通用页面组件与数据状态 | P2 | `PageHeader`/`EmptyState`/`ErrorState`/`LoadingSkeleton`、`useAsyncData` | done |
| P4 | 首页/工作台 | P3 | 路由化首页、三态、响应式 | done |
| P5 | 笔记列表与详情 | P3 | `/notes`、`/notes/:noteId`、mock repository、三态 | done |
| P6 | 分类/归档/文库/关于/作者 | P5 | 剩余页面路由化、死代码清理 | done |
| P7 | 样式收口、测试与质量门禁 | P4、P5、P6 | 删除 `app.css` 残留、Vitest、CI 门禁 | done |

## P0 · 基线与路由表确认

**目标**：在改代码前把信息架构、路由、目录、样式、数据与状态策略固化成文档，避免后续返工。

**任务**

- [x] 确认 D1 路由表：每个现有页面有唯一路径，平台模块路径只预留不实现。
- [x] 确认 D2 目录约定：`src/pages/` 与 `src/features/<domain>/` 的职责边界。
- [x] 确认 D3 样式迁移顺序与 `app.css` 的最终去留。
- [x] 确认 D4 mock 数据边界与未来契约替换点。
- [x] 确认 D5 状态方案：主题/文库筛选进 Redux，服务端数据等 RTK Query。
- [x] 确认 D6 测试范围与 CI 命令。
- [x] 把确认结果写入本文「决策」与「交接摘要」。

**产出**：已确认的决策记录；本步不修改业务代码。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 工作区 | `git status --porcelain` | 仅文档、索引与命令模板改动 |
| 路由覆盖 | 人工核对本文件、`page-specifications.md` 与现有导航 | 现有页面均有路径，无重复或遗漏 |
| 构建不受影响 | `npm run build`、`npm run lint` | 通过（本步无业务代码改动） |

**回退**：修改或撤销本文；不影响现有代码。

## P1 · 路由骨架与页面拆分

**目标**：引入 React Router，把 `App.tsx` 拆成路由页面，现有视觉与交互不回归。

**任务**

- [x] 安装 `react-router-dom`（当前稳定版，React 19 兼容）。
- [x] 新增 `src/app/router.tsx` 定义路由；`src/app/layouts/AppLayout.tsx` 承载 `SiteHeader`、`SiteFooter` 与 `<Outlet />`。
- [x] 按 D1 建立 `src/pages/` 下的路由页面；领域组件仍留在 `src/features/notes/`。
- [x] 移除 `activeView` 与视图切换代码；导航改用 `<NavLink>` / `useNavigate`。
- [x] 筛选、选中文章、归档模式改用 URL（`useSearchParams` / `useParams`）。
- [x] 旧链接重定向：`#articles`、`#category`、`#archive`、`?post=<id>` 映射到新路径。
- [x] 本步只改结构，不改 `app.css` 与页面视觉。

**产出**：可深链、可前进后退的路由骨架。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建 | `npm run build` | 通过 |
| 静态检查 | `npm run lint` | 通过 |
| 路由可达 | `npm run dev` 后直接访问 `/`、`/notes`、`/notes/<id>`、`/categories/<id>`、`/library`、`/archive`、`/author`、`/about` | 均渲染对应页面，刷新不 404 |
| 历史 | 浏览器前进/后退 | 页面与 URL 一致，不回到错误视图 |
| 旧链接 | 访问 `/#articles`、`/?post=typescript-utility-types` | 重定向到新路径 |
| 无残留 | `grep -rn "activeView" src` | 无结果 |
| 视觉 | 对比改造前后的首页与文章页 | 结构与样式无回归 |

**回退**：回退本步提交，`App.tsx` 恢复单体实现。

## P2 · 设计系统与主题基线

**目标**：让 Tailwind + shadcn/ui 成为可用的唯一样式体系基础，主题切换同时作用于新旧样式。

**任务**

- [x] 按 [`design-system.md`](../03-design/design-system.md) 对齐 `src/styles/index.css` 的 token（background/surface/text/border/accent/code-bg/semantic）。
- [x] 把 `app.css` 的 `--bg`、`--text`、`--border`、`--accent` 等改为引用新 token，消除重复色值。
- [x] 主题类从 `.theme-dark` 迁移到 `.dark`；如需过渡，保留一个版本兼容选择器。
- [x] 新增 `src/app/store.ts`、`src/features/ui/uiSlice.ts`，承载主题与文库筛选；初始化尊重 `prefers-color-scheme` 与 localStorage。
- [x] 在 `SiteHeader`、`SiteFooter` 和至少一个卡片区使用 shadcn `Button` / `Card` / `Input`。
- [x] 补充 `:focus-visible` 与 `prefers-reduced-motion` 样式。

**产出**：统一的 token 与主题基线，shadcn 组件在真实页面可用。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 主题联动 | 切换深浅色 | body、旧样式卡片、shadcn Button/Card/Input 同时变化 |
| 持久化 | 刷新页面 | 主题保持；首次访问尊重系统偏好 |
| token 审计 | `grep` 检查硬编码主色 | 页面不再新增设计文档之外的硬编码颜色 |
| 可访问性 | 键盘 Tab | 所有可操作元素焦点可见 |

**回退**：回退本步提交，恢复 `.theme-dark` 与旧 token。

## P3 · 通用页面组件与数据状态

**目标**：抽出页面骨架与加载/空/错误状态，后续页面不重复实现。

**任务**

- [x] 新增 `PageHeader`、`SectionHeader`、`EmptyState`、`ErrorState`、`LoadingSkeleton`、`TagPill`、`SearchField`、`FilterTabs`；优先用 shadcn 组件组合。
- [x] 新增 `src/hooks/useAsyncData.ts`：支持 `AbortSignal`、loading/error/empty、重试。
- [x] 定义统一的异步状态类型；错误消息从 `ApiError` / ProblemDetails 归一化。
- [x] 在首页或笔记页接入至少一个真实用例，验证三态。

**产出**：可复用的页面组件与异步状态 hook。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 三态 | 手动触发 loading / empty / error | 均有明确文案与可操作下一步 |
| 主题 | 深浅色切换 | 组件颜色与焦点样式正常 |
| 键盘 | Tab / Enter | 主要操作可完成 |

**回退**：删除新增组件与 hook；页面恢复原实现。

## P4 · 首页/工作台

**目标**：用路由与共享组件重建首页，保留现有信息结构。

**任务**

- [x] 保留 Hero、内容板块、精选内容、阅读台账、内容方向、统计区。
- [x] 最近文章从 notes repository 读取，展示 loading / empty / error。
- [x] 所有 CTA 改为路由链接；分类卡进入 `/categories/:categoryId`。
- [x] 未上线入口（RSS、订阅、Newsletter）明确标注或移除。
- [x] 首页不承载业务编辑入口。

**产出**：路由化、可降级的首页。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 响应式 | 1280 / 768 / 375 宽度 | 无横向滚动，主要区块可读 |
| 键盘流程 | Tab → Enter 进入文章、分类、切换主题 | 全流程可完成 |
| 降级 | mock repository 返回错误 | 显示 ErrorState 与重试，不白屏 |

**回退**：恢复旧首页视图；路由与共享组件不受影响。

## P5 · 笔记列表与详情

**目标**：把文章模块落到 `/notes` 与 `/notes/:noteId`，筛选进入 URL，具备完整三态。

**任务**

- [x] 新增 `src/features/notes/repository.ts`：`listNotes(params)`、`getNote(id)` 异步 mock，支持延迟与可控失败（测试用）。
- [x] 列表：搜索、分类/标签/年份、收藏/草稿/在读筛选写入 query params；提供清除筛选。
- [x] 详情：标题、元信息、摘要、标签、目录、正文、代码块复制、上下篇、收藏/草稿/进度。
- [x] 列表选中项与详情联动；直接打开详情时可通过导航返回列表。
- [x] 实现加载骨架、空结果、错误重试。
- [x] 不接后端；在 repository 顶部标注未来替换为生成客户端的位置。

**产出**：可用的笔记列表与详情页面，数据层可单点替换。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 深链 | 直接访问 `/notes/<id>` 并刷新 | 正常渲染 |
| 筛选 | 组合筛选后刷新/后退 | URL 与结果一致 |
| 三态 | 空结果、加载中、请求失败 | 均有对应界面与下一步 |
| 交互 | 代码复制、目录跳转、上下篇 | 可用；键盘可操作 |
| 类型边界 | 检查 repository | 不新增与未来服务端重复的 DTO；标注替换点 |

**回退**：路由页面独立，可按提交回退；mock repository 可保留。

## P6 · 分类/归档/文库/关于/作者

**目标**：剩余页面路由化并复用共享组件；清理视图状态与死代码。

**任务**

- [x] `/categories/:categoryId`：分类信息、文章网格、标签统计。
- [x] `/archive`：年份/分类/标签模式写入 query；分组列表。
- [x] `/library`：收藏、草稿、在读三栏；空态。
- [x] `/author` 与 `/about`：保留现有内容；按 P0 决策评估是否合并。
- [x] 新增 404 页面。
- [x] 删除不再使用的 `ViewMode`、视图切换代码与死 CSS selector。

**产出**：全部现有页面路由化，导航 active 状态正确。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 路由覆盖 | 逐页访问 D1 路由表 | 全部可达；404 生效 |
| 导航状态 | 各页面顶部导航 | 当前项高亮正确 |
| 死代码 | `grep -rn "ViewMode\|activeView" src` | 无结果 |
| 响应式 | 三种宽度 | 布局可用 |

**回退**：按页面独立提交，可单独回退。

## P7 · 样式收口、测试与质量门禁

**目标**：完成 Tailwind/shadcn 迁移，补前端测试与 CI 门禁，形成可交付基线。

**任务**

- [x] 删除 `app.css` 中已迁移的 selector；目标为页面不再依赖 `app.css`。
- [x] 安装并配置 Vitest、`@testing-library/react`、`@testing-library/user-event`、jsdom；新增 `npm run test` / `npm run test:run`。
- [x] 测试覆盖：repository 筛选、URL 参数、主题持久化、关键路由渲染、空/错误态。
- [x] 可访问性检查：语义标签、焦点可见、对比度、`aria-label`、`prefers-reduced-motion`。
- [x] CI 增加前端测试步骤（`npm run test:run`）。
- [x] 更新 `docs/README.md`、`changelog.md` 与本文交接摘要。

**产出**：样式收口、测试通过、CI 可门禁的前端基线。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建 | `npm run build` | 通过 |
| 静态检查 | `npm run lint` | 通过 |
| 测试 | `npm run test:run` | 全部通过 |
| 样式依赖 | 检查页面 import 与 `app.css` 使用 | 页面不依赖 `app.css`；剩余规则有说明 |
| 主流程 | 读文章、筛选、切主题 | 手动走通 |
| CI | 推送分支 | 前端 build/lint/test 全部通过 |
| 文档 | 人工核对索引与交接摘要 | 与实际一致 |

**回退**：测试与样式收口分开提交，可分别回退。

## 阶段出口

P0–P7 全部 `done` 后执行一次整体验收：

- [x] **G1 路由**：D1 路由表全部可达，刷新与前进后退正常，旧链接重定向生效。
- [x] **G2 设计**：页面使用 Tailwind token 与 shadcn 组件；深浅主题同时生效。
- [x] **G3 状态**：所有数据页面具备加载、空、错误三态与可操作下一步。
- [x] **G4 数据**：页面数据只通过 repository 读取，替换点单一。
- [x] **G5 质量**：`npm run build`、`npm run lint`、`npm run test:run` 全通过；CI 绿灯。
- [x] **G6 文档**：索引、changelog、交接摘要与实际一致。

阶段 2 出口只证明**前端页面基线可用**，不证明 NOTE-01～03 的后端能力完成。

## 验收记录

| 日期 | 步骤 | 命令 | 结果 | 遗留 |
| --- | --- | --- | --- | --- |
| 2026-11-08 | P0 | 人工确认 D1–D6 | 决策已按推荐值写入本文；未改动业务代码 | 无 |
| 2026-11-08 | P0 | `npm run build` | 通过：33 modules，`✓ built in 680ms`；CSS 47.71 kB、JS 262.83 kB | 无 |
| 2026-11-08 | P0 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告 | 无 |
| 2026-11-08 | P1 | `npm run build` | 通过：62 modules，`✓ built in 1.48s`；CSS 47.71 kB、JS 359.71 kB | 无 |
| 2026-11-08 | P1 | `npm run lint` | 退出码 0；仅既有 `button.tsx:66` shadcn 警告；本次新增的 `LibraryState` / `NoteBody` 警告已消除 | 无 |
| 2026-11-08 | P1 | 无头 Edge 渲染路由 | 全部 PASS：`/`、`/notes`、`/notes/typescript-utility-types`、`/categories/learning`、`/library`、`/archive`、`/author`、`/about`、未知路径 404 | 未做像素级前后对比 |
| 2026-11-08 | P1 | CDP 前进/后退 | PASS：首页 → 文章 → 笔记详情；`history.back()` 回 `/notes`，`history.forward()` 回到同一笔记 | 无 |
| 2026-11-08 | P1 | 旧链接 | PASS：`/#articles` → `/notes`；`/?post=typescript-utility-types` → `/notes/typescript-utility-types`；`/?view=library`、`/?view=archive` 已验证 | 修复：`normalizeLegacyUrl()` 必须在 `createBrowserRouter()` 前执行 |
| 2026-11-08 | P1 | `grep -rn "activeView\|ViewMode" src` | 无结果 | 无 |
| 2026-11-08 | P1 | 样式回归 | `git diff -- src/styles src/index.css` 为空；首页与笔记详情截图渲染正常 | 后端未启动，首页健康横幅显示 502（既有行为，与本步无关） |
| 2026-11-08 | P2 | `npm run build` | 通过：182 modules，`✓ built in 1.05s`；CSS 48.86 kB、JS 417.70 kB | 无 |
| 2026-11-08 | P2 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告 | 无 |
| 2026-11-08 | P2 | 无头 Edge 主题联动 | 全部 PASS：`body` 颜色与渐变、旧样式 `.hero-card`、shadcn `Card` / `Button` / `Input` 随 `.dark` 同时变化 | 读取 Button 计算样式前需等待 400ms 过渡完成，否则拿到中间值 |
| 2026-11-08 | P2 | 持久化与系统偏好 | PASS：`blog-theme` 刷新后仍为 `"dark"`；清空 localStorage 并模拟 `prefers-color-scheme: dark` 时首次加载为深色 | 无 |
| 2026-11-08 | P2 | token 审计 | `grep` 仅命中 `index.css` 的 token 定义与 `app.css` 阴影黑色；无 `.theme-dark`、无页面级硬编码主色 | `app.css` 仍有旧 selector，按 D3 留到 P4–P7 逐页迁移 |
| 2026-11-08 | P2 | 键盘与动效 | PASS：Tab 焦点轮廓 `2px solid rgb(199,119,78)`；`prefers-reduced-motion: reduce` 下 `scrollBehavior: auto` | 无 |
| 2026-11-08 | P2 | 视觉截图 | 首页与笔记详情浅/深色截图正常；导航、卡片、筛选按钮与输入框主题一致 | 后端未启动，首页健康横幅显示 502（既有行为，与本步无关） |
| 2026-11-08 | P3 | `npm run build` | 通过：194 modules，`✓ built in 1.28s`；CSS 55.35 kB、JS 422.80 kB | 无 |
| 2026-11-08 | P3 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告，新增 hook 警告已消除 | 无 |
| 2026-11-08 | P3 | CDP 三态 | loading：暂停 health 请求后可见「正在检测后端健康状态…」与 `aria-busy` 骨架；error：继续请求得到 502 后显示 `role="alert"`、「无法连接后端」、状态码 502 与「重新检测」；empty：`/notes?q=__no_match__` 显示「没有匹配的文章」、说明文案与「清除筛选」，点击后列表恢复且 `q` 从 URL 移除 | loading 通过 CDP Fetch 暂停请求触发，未改业务代码 |
| 2026-11-08 | P3 | CDP 主题 | PASS：`.dark` 下筛选 pill 的背景与边框、`PageHeader` 表面均随主题变化 | 无 |
| 2026-11-08 | P3 | CDP 键盘 | PASS：首次 Tab 焦点轮廓可见；聚焦「年份」后 Enter 触发筛选，URL 写入 `mode=year` | 无 |
| 2026-11-08 | P3 | 视觉截图 | 首页 loading / error、笔记 empty 与深色筛选态截图正常；组件间距、焦点与 token 颜色一致 | `NoteSidePanel` 的 `tag-pill` 与 `LibraryPage` 的 `empty-state` 仍用旧样式，按计划留到 P6/P7 |
| 2026-11-08 | P4 | `npm run build` | 通过：195 modules，`✓ built in 999ms`；CSS 55.66 kB、JS 423.98 kB | 无 |
| 2026-11-08 | P4 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告 | 无 |
| 2026-11-08 | P4 | CDP CTA 与入口审计 | 全部 PASS：Hero → `/notes/typescript-utility-types`、`/notes`；6 张分类卡 → `/categories/<id>`；归档 → `/archive`；台账 → `/notes`；文章卡 → `/notes/<id>`；页脚仅 Email/GitHub；页面无 `订阅`/`RSS`/`Newsletter`、无编辑入口、无 `#` 死链 | 发现并修复：`Button asChild` 的 `<a>` 继承 UA 蓝色、`.post-footer` 的 readTime 被挤成三行；`a` 重置移入 `@layer base`，PostCard 的 readTime 改为 `whitespace-nowrap` 并允许 footer 换行 |
| 2026-11-08 | P4 | CDP 响应式 | PASS：1280/768/375 下 `scrollWidth` 分别为 1265/753/375，均不大于 `innerWidth`；Hero、内容板块、精选内容、阅读台账、内容方向、统计区全部存在，分类卡可见、Hero 标题字号 ≥ 28px | 无 |
| 2026-11-08 | P4 | CDP 键盘流程 | PASS：Tab 10 次聚焦「阅读最新笔记」，Enter 进入 `/notes/typescript-utility-types`；Tab 14 次聚焦首个分类卡，Enter 进入 `/categories/learning`；Tab 9 次聚焦主题按钮，Enter 切换 `.dark` 并完成深浅色切换 | 无 |
| 2026-11-08 | P4 | CDP 降级三态 | PASS：`sessionStorage['zane-notes-repository-mode']='error'` 时显示 `role="alert"`「精选内容加载失败」+「重试」，Hero 仍在；切到 `empty` 后点「重试」显示「还没有可展示的文章」+「浏览文章列表」→ `/notes`，文章卡为 0；`success` 重启时 250ms 内捕获 loading 骨架，结束后渲染 3 张卡片 | 可控失败通过 `sessionStorage` 测试缝触发，未改业务代码 |
| 2026-11-08 | P4 | 视觉截图 | 首页 1280/768/375、分类区、精选区、深色、error、empty 截图正常；CTA 主按钮文字为 `--primary-foreground`，文章卡 readTime 单行 | 粘性头部会遮住 `scrollIntoView` 顶部的 section 标题，不影响正常滚动阅读；留待 P7 样式收口评估 `scroll-margin-top` |
| 2026-11-08 | P5 | `npm run build` | 通过：195 modules，`✓ built in 1.22s`；CSS 55.82 kB、JS 426.53 kB | 无 |
| 2026-11-08 | P5 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告 | 无 |
| 2026-11-08 | P5 | CDP 深链 | PASS：直接访问 `/notes/typescript-utility-types` 并刷新，标题、3 节目录、3 个正文 section、1 个代码复制控件、上一篇/下一篇和标签均正常 | 无 |
| 2026-11-08 | P5 | CDP 筛选 | PASS：点击 `#React` 写入 `?tag=React&mode=tag`；搜索 `React` 后合并为 1 条结果且 tag pill `aria-pressed=true`；刷新后 `q/tag/输入值/结果数` 保持一致；打开笔记后 `history.back()` 回到 `/notes` 且 query 与结果数不变 | `setFilters` 仍使用 `replace`，筛选步骤本身不进入历史栈；后退场景验证的是「筛选 → 详情 → 返回」 |
| 2026-11-08 | P5 | CDP 三态 | PASS：测试侧把 250ms mock 延迟放慢到 1.4s 后捕获「正在加载文章列表」与 `aria-busy`，且无旧列表项；`empty` 模式显示「暂时没有文章」；筛选无结果显示「没有匹配的文章」+「清除筛选」并可恢复 8 条；列表错误显示「文章列表加载失败」+「重试」并可恢复；详情错误显示「笔记加载失败」+「重试」；未知 id 显示空态并链接回 `/notes` | 加载态通过 `Page.addScriptToEvaluateOnNewDocument` 放慢 `setTimeout` 捕获，未改业务代码 |
| 2026-11-08 | P5 | CDP 交互 | PASS：目录第 2 节激活，滚动到距顶部 96px；代码复制后按钮变「已复制」，剪贴板内容含 `type User =`；下一篇进入 `/notes/react-state-patterns`，上一篇返回；Tab 49 次聚焦列表项后 Enter 打开笔记，当前列表项 `aria-current="page"` 与详情路由一致 | 从页面顶部 Tab 到列表需要 49 次，筛选面板与标签云在列表之前；可考虑 P6/P7 增加列表跳转或折叠筛选 |
| 2026-11-08 | P5 | 类型边界 | `repository.ts` 只导出 `ListNotesParams`、`NotesRequestOptions` 与函数；参数复用 `Post` / `StatusFilter`，未新增服务端 DTO；顶部注释标明未来替换为 `src/api-client` 生成客户端 | 发现 `list-item` 与 Tailwind 的 `display: list-item` 工具类同名，列表链接出现浏览器项目符号；本步用内联 `display: block` 修正，建议 P7 样式收口时重命名旧 selector |
| 2026-11-08 | P6 | `npm run build` | 通过：195 modules，`✓ built in 1.19s`；CSS 56.12 kB、JS 428.58 kB | 无 |
| 2026-11-08 | P6 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告 | 无 |
| 2026-11-08 | P6 | CDP 路由覆盖 | 全部 PASS：直接访问 D1 的 `/`、`/notes`、`/notes/typescript-utility-types`、`/categories/learning`、`/library`、`/archive`、`/author`、`/about` 均渲染对应页面；`/missing-page` 显示 404「这个页面不存在。」；`/categories/not-a-category` 保留 URL 并显示同一 404；每页导航均为 7 个 `A` 链接 | 无 |
| 2026-11-08 | P6 | CDP 导航状态 | PASS：各页面唯一激活项分别为 首页/文章/文章/分类/文库/归档/作者/关于，404 无激活项；激活项带 `aria-current="page"`，背景色 `rgba(199,119,78,.12)`，未激活项透明 | 激活高亮通过 `.main-nav a[aria-current='page']` 提供，不再依赖按钮状态 |
| 2026-11-08 | P6 | CDP 分类页 | PASS：`/categories/learning` 标题「技术学习分享」、3 张文章卡、9 个标签统计链接（均指向 `/notes?tag=…&mode=tag` 且带篇数 `aria-label`）、3 条专栏快捷链接；当前分类链接 `aria-current="page"`，统计为 `3 篇文章 / 9 标签数` | 标签统计与文章网格均来自 `listNotes({ category })`；本轮验收只覆盖成功态 |
| 2026-11-08 | P6 | CDP 归档页 | PASS：默认年份模式无 query、1 组 8 条；切到分类写入 `?group=category` 并显示 6 组；直接访问并刷新 `?group=tag` 保留 query 并显示 24 组；所有条目均为 `/notes/<id>` 链接，模式按钮 `aria-pressed` 正确 | `group=year` 继续省略参数，以保持 URL 简洁 |
| 2026-11-08 | P6 | CDP 文库页 | PASS：三栏标题为收藏/草稿/在读，计数 `1/1/3`，每栏链接数 `1/1/3`，桌面三列宽约 362px；清空 `localStorage` 的收藏/草稿/进度后刷新，三栏均显示空态「暂无收藏/暂无草稿/暂无在读文章」，计数 `0/0/0` | 空态测试通过注入脚本在页面加载前写入空值，未改业务代码 |
| 2026-11-08 | P6 | 作者/关于决策 | D1 未要求合并；两页内容定位不同（作者档案 vs 关于博客），保留 `/author`、`/about` 独立路由与现有内容，导航激活正确 | 合并与否留待产品侧后续决定，本步不扩张 |
| 2026-11-08 | P6 | 死代码检查 | `grep -rn "ViewMode\|activeView" src` 无结果；`viewMode/view-toggle/view-switch/list-view/grid-view` 无结果；删除未再使用的 `archiveGroups` 导出、`ArchiveGroup` 类型与 `.archive-tab` CSS selector | `app.css` 其余旧 selector 仍供页面布局使用，按 P7 统一收口 |
| 2026-11-08 | P6 | CDP 响应式 | PASS：1280/768/375 下分类、归档、文库页面 `scrollWidth` 均不超过 `innerWidth`（如 1265/1280、753/768、375/375），关键面板均渲染 | 未做像素级视觉快照；P7 统一做样式与可访问性收口 |
| 2026-11-08 | P7 | `npm run build` | 通过：196 modules，`✓ built in 0.93s`；CSS 48.8 kB、JS 439.18 kB | 无 |
| 2026-11-08 | P7 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告 | 无 |
| 2026-11-08 | P7 | `npm run test:run` | 通过：Test Files 7 passed (7)，Tests 55 passed (55)，约 18s | 运行环境中 jsdom 每个测试文件重建一次，Vitest 建议可用 `pool: 'vmThreads'` 提速；本步不改 |
| 2026-11-08 | P7 | 样式依赖检查 | `grep -rn "app.css" src` 无结果；`src/styles/app.css` 已删除且 `main.tsx` 不再 import；`index.css` 只保留设计 token、最小 base 重置、`:focus-visible` 与 `prefers-reduced-motion`；`list-item` 等旧类名已随组件改写移除 | 无 |
| 2026-11-08 | P7 | CDP 路由与主流程 | 全部 PASS：9 条路由（含 404）逐页唯一 `h1`；文章页 3 个 section、目录 3 个按钮与 section 一一对应、复制按钮与标签可用；`/notes` 输入 `React` 后 URL 写入 `?q=React`、列表收敛为 1 条且 `aria-pressed` 正确；主题按钮切换到深色后 `blog-theme="dark"`、刷新保持，再切回浅色 | 无 |
| 2026-11-08 | P7 | CDP 可访问性与响应式 | PASS：`main` 唯一，主导航/`Toggle theme`/`Quick summary` 均有 `aria-label`，页脚为 `footer`；Tab 后焦点轮廓 `2px solid rgb(199,119,78)`；正文对比度 12.91、次要文字 6.17；1280/768/375 下 8 个页面 `scrollWidth ≤ innerWidth` 且每页 1 个 `h1` | 无 |
| 2026-11-08 | P7 | token 对比度测试 | `src/styles/index.test.ts` 16 项通过：浅/深主题下 foreground、muted、`primary-foreground/primary`、`brand-text` 对 background/card 均 ≥ 4.5:1；新增 `--brand-text` 修复小字号强调文字（浅色 `#8F4F2E`、深色 `#D39B75`），浅色 `--primary-foreground` 改为 `#1E1B1A` 使填充按钮文字达标，`docs/03-design/design-system.md` 同步登记 | 主强调 `#C7774E` 本身保持不变；填充与文字组合改用可访问的 foreground |
| 2026-11-08 | P7 | CI 配置 | `.github/workflows/ci.yml` 前端 job 顺序为 `npm ci` → `npm run lint` → `npm run test:run` → `npm run build` | 推送后 CI [#42485253915](https://github.com/warmthlee/zane/actions/runs/42485253915) 四个任务全部 success，详见 G5 出口记录 |
| 2026-11-08 | P7 | 文档一致性 | `docs/README.md` 质量基线、`docs/05-quality/test-strategy.md` 当前状态、`docs/08-governance/changelog.md` P7 条目、`docs/03-design/design-system.md` token 表与本文交接摘要已同步 | 无 |
| 2026-11-08 | 出口 | G1 路由 | 生产构建预览下 9 条路由全部 PASS：每页唯一 `h1`、路径匹配、无横向溢出；详情刷新保留路由；`history.back()` 回 `/notes`、`history.forward()` 回详情；`/#articles`、`/?post=typescript-utility-types`、`/?view=library`、`/?view=archive` 均重定向到目标路由 | 无 |
| 2026-11-08 | 出口 | G2 设计 | PASS：浅色 `body` `rgb(247,243,238)`、`brand-text` `rgb(143,79,46)`、主按钮 `rgb(199,119,78)` + `rgb(30,27,26)`；深色对应 `rgb(30,27,26)` / `rgb(211,155,117)`；页面渲染 14 个 shadcn `[data-slot="button"]`；深浅主题切换即时生效 | 未做像素级视觉快照 |
| 2026-11-08 | 出口 | G3 状态 | PASS：客户端切换笔记捕获到 `aria-busy` 骨架「正在加载笔记」；`/notes?q=__no_match__` 显示「没有匹配的文章」与「清除筛选」，点击后恢复列表；repository `error` 模式下首页、笔记列表、详情、分类、归档、文库均出现对应 `role="alert"` 与「重试」；`empty` 模式下六类页面均显示对应空态与下一步 | 首页同时存在后端健康告警，验收脚本按标题定位目标告警 |
| 2026-11-08 | 出口 | G4 数据 | PASS：`posts` 仅由 `repository.ts` 与其测试导入；HomePage 不再直接读取 `posts`，文章总数改走 `countNotes()`，最新笔记链接在数据未就绪时回退 `/notes`；新增 `countNotes` 的 success/empty/error 测试 | 分类、统计、作者资料、页脚社交链接等站点静态元数据仍直接来自 `data.ts`，不属于笔记数据；如后端化需另立步骤 |
| 2026-11-08 | 出口 | G5 质量 | 本地：`npm run build` 通过（196 modules）；`npm run lint` 退出码 0（仅既有 warning）；`npm run test:run` 7 文件 57 项通过；后端 `dotnet build` 0 警告 0 错误、`dotnet test` 7 项通过。CI：[#42485253915](https://github.com/warmthlee/zane/actions/runs/42485253915) 在 `feat/phase2-frontend-baseline` 上 4 个任务全部 success（前端构建与检查、后端构建与测试、OpenAPI 契约一致性、数据库迁移演练）；「后端发布产物」按配置仅在 `main` push 时运行，本分支为 skipped | 未合并 `main`，发布产物任务未触发 |
| 2026-11-08 | 出口 | G6 文档 | 索引、设计 token、测试策略、changelog、交付计划 P0–P7 状态、出口结论与交接摘要已核对一致 | 无 |

## 交接摘要

| 步骤 | 已完成 | 已定契约 | 下一步前置 |
| --- | --- | --- | --- |
| P0 | D1–D6 已按推荐值确认；路由表、目录、样式迁移、mock 数据、Redux 与测试范围写入本文；`npm run build` / `npm run lint` 已验证 | 路由页面放 `src/pages/`，领域组件放 `src/features/<domain>/`；样式增量迁移并在 P7 收口；页面数据先走 repository mock；P2 引入 Redux Toolkit，RTK Query 等 NOTE 接口；P7 引入 Vitest + RTL | React Router 已安装（`react-router-dom@7.18.5`）；P1 开始时只需拆分页面与路由，不再重复安装 |
| P1 | `react-router-dom@7.18.5` 已接入；`src/app/router.tsx`、`app/layouts/AppLayout.tsx` 与 `src/pages/` 9 个路由页面完成；筛选/归档模式改用 URL；旧链接归一化；Library context 与 provider 拆分；build/lint 通过 | 路由表与 D1 一致；筛选参数为 `q/category/year/tag/status/mode`，归档模式为 `group`；`useLibraryState` 从 `libraryContext.ts` 导入，`LibraryStateProvider` 从 `LibraryState.tsx` 导入；`normalizeLegacyUrl()` 必须先于 `createBrowserRouter()`；笔记正文用 `key={post.id}` 重置滚动/目录状态 | P2 可开始：`app.css` 与视觉未改，Redux 尚未引入；按 P2 先对齐 token、`.dark` 与 UI slice |
| P2 | `@reduxjs/toolkit` / `react-redux` 接入；`src/features/ui/uiSlice.ts` 承载主题与文库默认筛选，`src/app/store.ts` 持久化，`src/app/hooks.ts` 提供类型化 hooks；`main.tsx` 注入 Provider 并在首屏前应用 `.dark`；`index.css` token 对齐设计文档，新增 `.dark`、`:focus-visible`、`prefers-reduced-motion` 与最小 preflight 替代；`app.css` 改为引用设计 token；`SiteHeader` / `SiteFooter` 使用 shadcn `Button`，首页阅读台账使用 `Card`，笔记搜索使用 `Input` | 主题状态在 `ui.theme`（`light \| dark`），持久化键 `blog-theme`；文库默认筛选在 `ui.libraryStatus`（`all \| favorites \| drafts \| reading`），持久化键 `blog-filter-status`；URL 仍是筛选的显式来源，Redux 只提供默认值；`.dark` 只挂在 `<html>`，不再使用 `.theme-dark`；旧 `--accent` 变量已移除，统一用 `--primary`；新增颜色走 `index.css` token，不在组件内写死 | P3 可直接复用 `--success` / `--warning` / `--danger` / `--info`、`--code-bg`、`--brand-strong` / `--brand-soft`；新增通用组件优先用 shadcn；`app.css` 仍有大量旧 selector，P4–P7 逐页迁移，P7 前不宣称样式收口 |
| P3 | `src/components/common/` 新增 `PageHeader`、`SectionHeader`、`EmptyState`、`ErrorState`、`LoadingSkeleton`、`TagPill`、`SearchField`、`FilterTabs` 与 barrel `index.ts`；`src/lib/asyncState.ts` 统一 `AsyncState` / `AsyncError` 与 `normalizeAsyncError`；`src/hooks/useAsyncData.ts` 支持 `AbortSignal`、空结果、`key` 重载与 `retry`；`BackendStatus` 接入 health 真实请求；`NotesLayout`、首页 section、笔记筛选、标签云与空列表已使用新组件 | 通用组件从 `@/components/common` 导入；`useAsyncData(load, { key, isEmpty })` 返回 `state/data/error/isLoading/isSuccess/isEmpty/isError/retry`，默认把 `null`、`undefined` 与空数组判为空，`key` 变化会中止旧请求并重新加载；错误统一为 `AsyncError { title, message, status?, code? }`；交互型 `TagPill` 输出 `aria-pressed`，`FilterTabs` 用 `role="group"`；`EmptyState` / `ErrorState` 分别使用 `role="status"` / `role="alert"`，操作按钮由调用方传入 | P4 可直接复用通用组件与 `useAsyncData`；首页最近文章仍读同步 `data.ts`，P4/P5 接入 repository 时用 `useAsyncData` 包一层即可；`NoteSidePanel` 与 `LibraryPage` 的旧 `tag-pill` / `empty-state` 留到 P6/P7，`app.css` 对应 selector 暂不删除 |
| P4 | `src/features/notes/repository.ts` 新增 `listRecentNotes({ limit, signal, delayMs })`，用可中止延迟模拟请求并支持 `success/error/empty` 测试模式；`HomePage` 改用 `useAsyncData` 加载最近文章，精选区具备 loading/empty/error；Hero、section、分类卡、台账与文章卡 CTA 全部改为 `Link`，分类卡按 `contentCategories[].id` 进入 `/categories/:categoryId`；`PostCard` 移除 `onOpen`，阅读动作改为路由链接并修正 readTime 换行；Header 移除「订阅」，Footer 移除 `#newsletter` 锚点，`socials` 仅保留 Email/GitHub；`index.css` 在 `@layer base` 补 `a { color: inherit; text-decoration: inherit }` | repository 入口为 `listRecentNotes(options): Promise<Post[]>`，`signal` 必传以支持中止；测试模式键为 `sessionStorage['zane-notes-repository-mode']`（`success \| error \| empty`），默认 `success`；首页三态通过 `useAsyncData` 的 `isEmpty` 判定；`PostCard` 仅接收 `post/progress/isFavorite/isDraft/variant/onToggleFavorite`，打开文章由内部 `<Link to={`/notes/${post.id}`}>` 完成；`a` 颜色重置必须留在 `@layer base`，否则会覆盖 Tailwind `text-*` 工具类 | P5 可在同一 `repository.ts` 扩展 `listNotes(params)` / `getNote(id)`，沿用 `signal` 与 `delayMs`；笔记列表/详情改用 `Link`，不要恢复 `onOpen`；筛选与状态写 URL 的既有契约不变；首页加载态不要回退到同步 `posts.slice()` |
| P5 | `repository.ts` 扩展 `listNotes(params)` / `getNote(id)` / `listRecentNotes`，统一可中止延迟与 `success/error/empty` 测试模式，并标注生成客户端替换点；`useNotesFilters` 改为输出 `listParams` / `listKey`，搜索、分类、年份、标签、收藏/草稿/在读全部进入 repository 查询；`NotesSidebar` 用 `useAsyncData` 渲染 loading/empty/error+retry，空态区分「暂时没有文章」与「没有匹配的文章」；`NotesList` 改为保留 query 的 `Link` 并高亮当前项；`NoteDetailPage` 用 `getNote` 加载正文，上下篇复用筛选后的 `listNotes`，具备 loading/error/not-found；`NoteBody` 为代码块增加复制按钮与 `aria-live`，目录跳转加 `scroll-mt-24` | repository 函数签名为 `listNotes(params, { signal, delayMs })`、`getNote(id, { signal, delayMs }): Promise<Post \| null>`；`ListNotesParams` 字段为 `q/category/year/tag/status/favoriteIds/draftIds/readingProgress`，空值或 `全部` 视为不过滤；`empty` 模式下列表返回 `[]`、单篇返回 `null`；列表项 `Link` 必须保留 `search`，详情页上下篇以筛选结果为上下文；代码复制按钮的无障碍名称以「复制第 N 段代码」开头 | P6 迁移分类/归档/文库/作者页时优先复用 `listNotes`，不要继续直接读取 `posts`；`list-item` 与 Tailwind `display:list-item` 冲突需在 P7 重命名旧 class；`NoteSidePanel` 的旧 `tag-pill` 与 `LibraryPage` 的 `empty-state` 仍待 P6/P7 迁移 |
| P6 | `CategoryPage` 改用 `listNotes({ category })`，输出分类信息、文章网格、标签统计与专栏快捷链接；`ArchivePage` 改用 `listNotes({})` 后按 `year/category/tag` 客户端分组，模式写入 `group` query，节点全部改为 `Link`；`LibraryPage` 改用单次 `listNotes({})`，按收藏/草稿/在读生成三栏并复用 `EmptyState`；`NotFoundPage` 改用 `PageHeader` + shadcn `Button`；`SiteHeader` 全部改为 `Link` 并补 `aria-current` 高亮；删除 `archiveGroups`、`ArchiveGroup` 与 `.archive-tab` CSS | 分类路由继续使用 `contentCategories[].id`，不以中文名为路径；归档 `group=year` 省略参数，`category/tag` 写 `?group=…`，刷新保留；文库从本地库状态按收藏/草稿 ID 顺序与 `readingProgress > 0` 派生，不新增接口；顶部导航为 7 个 `Link`，当前项 `aria-current="page"` 且样式为 `.main-nav a[aria-current='page']`；未知路由与无效分类都渲染 404，后者保留原 URL；作者与关于保留独立路由，不合并 | P7 可开始样式收口：页面仍依赖 `category-panel`、`tag-pill`、`library-*`、`archive-*` 与 `PageHeader` 等 class/token；`app.css` 尚未删除；测试应覆盖归档分组、文库空态与导航激活；`list-item` 与 Tailwind `display:list-item` 的命名冲突仍待 P7 处理 |
| P7 | `src/styles/app.css` 删除、`main.tsx` import 移除，页面与组件全部改为 Tailwind utility + `src/lib/styles.ts` 共享组合；`vite.config.ts` 接入 Vitest 5 + jsdom + Testing Library，新增 `src/test/setup.ts` 与 `npm run test` / `npm run test:run`；新增 7 个测试文件共 55 项，覆盖 repository 筛选、URL 参数、主题持久化、路由渲染、空/错误态、语义与 aria、token 对比度、焦点与 reduced-motion；抽出 `appRoutes` 与 `createAppStore` 供 `createMemoryRouter` 测试复用；CI 前端 job 增加 `npm run test:run`；新增 `--brand-text` 并把浅色 `--primary-foreground` 改为 `#1E1B1A`，修正小字号强调文字与填充按钮对比度 | 测试命令：`npm run test`（watch）、`npm run test:run`（CI/一次性）；测试路由用 `createMemoryRouter(appRoutes)`，store 用 `createAppStore({ ui })`；repository 测试模式仍为 `sessionStorage['zane-notes-repository-mode'] = success \| error \| empty`；CSS token 测试通过 `index.css?raw` 导入，`test.css` 必须保持 `true`，否则 raw 导入为空；样式约定：小字号强调文字用 `text-brand-text`，填充按钮用 `bg-primary text-primary-foreground`，不要用 `text-primary` 当浅色底文字；新增样式只写 Tailwind utility 与 `index.css` token，`app.css` 已不存在 | 阶段 2 出口 G1–G6 已全部通过；代码已提交为 `9771c38` 并推送到 `feat/phase2-frontend-baseline`，CI [#42485253915](https://github.com/warmthlee/zane/actions/runs/42485253915) 四个任务 success；尚未合并 `main`；jsdom 每个测试文件重建一次，如需提速可评估 `pool: 'vmThreads'`，不影响验收 |

## 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 信息架构未确认就开始写页面 | 大量返工 | P0 未确认不进入 P1；D1 变更先改本文 |
| 样式迁移工时被低估 | 页面半新半旧 | 按页迁移；P7 前不宣称完成；`app.css` 残留必须记录 |
| mock 数据与未来契约漂移 | 接接口时二次重写 | repository 单点替换；生成客户端后删除 mock 专用类型 |
| 引入 Router 导致视觉回归 | 现有页面退化 | P1 只改结构不改样式；逐页对比 |
| 无无头浏览器 | 视觉与交互验证不完整 | 用 RTL + 手动清单；验收记录写明未覆盖项 |
| 后端笔记接口未就绪 | 页面无法验证真实数据 | 页面阶段用 mock；接口落地后按 P5 替换点接入 |

## 变更规则

- 增删步骤必须同步修改本文总览、阶段出口与 `docs/08-governance/changelog.md`。
- 验收项变化同步 `docs/05-quality/acceptance-criteria.md`。
- 本计划不改变路线图的业务阶段划分；工具、Cheat Sheet 等模块仍按各自 PRD 单独排期。
