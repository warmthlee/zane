# 变更记录

格式参考 Keep a Changelog；版本遵循语义化版本。文档与代码变更分别标注。

## [Unreleased]

### Added

- 全生命周期文档结构：立项、需求、架构、设计、开发、质量、发布、运营、治理、参考。
- 分模块 PRD：`docs/01-requirements/prd/`（平台、文章与长文记录、工具、MVP、最佳实践、聚合、集成、Cheat Sheet、非功能、想法流）。
- 独立 ADR：`docs/08-governance/adr/`（ADR-001～010）。
- 阶段 1 交付计划：`docs/01-requirements/delivery-plan.md`（步骤 S0–S5、分步验收与出口门禁）。
- 阶段 2 前端页面交付计划：`docs/01-requirements/delivery-plan-phase2.md`（步骤 P0–P7、分步验收与阶段出口）。
- 阶段 3 首页、想法流与全局入口交付计划：`docs/01-requirements/delivery-plan-phase3.md`（步骤 H0–H6、轻量想法首页、想法日历、Memos 后端与口令、六模块导航、主题三态、模块落地页与出口门禁 GH1–GH7）。
- PRD-09 想法流（Memos）：`docs/01-requirements/prd/prd-09-memos.md`，登记 `MEMO-01`～`MEMO-12`；首页短想法使用后端 `memos` 表，`#标签#` 语法，共享口令保护写操作，最近 52 周日历。
- 阶段 3 文章呈现补充：`NOTE-13` 静态文章完整 Markdown 渲染，`NOTE-14` 元数据迁移到 frontmatter；`NOTE-14` 延后执行。
- 通用贡献日历多色扩展登记为 `PLAT-14`：想法使用 `--heatmap-memo-*`，未来文章、工具使用独立色系。
- ADR-010：想法流使用共享口令保护创建/编辑/删除，作为用户鉴权落地前的临时写保护；不替代网络限制。
- 阶段 2 · P1 路由骨架：React Router 7 路由化，页面拆分到 `src/pages/`，筛选与归档模式进入 URL，旧 hash/query 链接归一化；`/step` 支持 `P*` 步骤。
- 阶段 2 · P2 设计系统与主题基线：`index.css` 对齐设计 token 与 `.dark`，`app.css` 改为引用 token；引入 Redux Toolkit 承载主题与文库默认筛选，主题持久化并尊重 `prefers-color-scheme`；Header/Footer、首页台账与笔记搜索接入 shadcn `Button` / `Card` / `Input`；补充 `:focus-visible` 与 `prefers-reduced-motion`。
- 阶段 2 · P3 通用页面组件与数据状态：新增 `PageHeader`、`SectionHeader`、`EmptyState`、`ErrorState`、`LoadingSkeleton`、`TagPill`、`SearchField`、`FilterTabs`；新增 `useAsyncData` 与统一 `AsyncState` / `AsyncError`，health 请求接入 loading/error/retry，笔记筛选空态提供「清除筛选」下一步。
- 阶段 2 · P4 首页/工作台：新增 `src/features/notes/repository.ts` 的 `listRecentNotes`（可中止延迟与 `success/error/empty` 测试模式）；首页最近文章改用 `useAsyncData`，精选区具备 loading/empty/error 与重试；Hero、内容板块、精选内容、阅读台账与文章卡 CTA 全部改为路由链接，分类卡进入 `/categories/:categoryId`；移除 Header「订阅」、Footer `#newsletter` 与 RSS/Newsletter 数据入口；`PostCard` 打开文章改为 `Link`，并修复 readTime 换行与 `Button asChild` 链接颜色。
- 阶段 2 · P5 笔记列表与详情：`repository.ts` 扩展 `listNotes(params)` 与 `getNote(id)`（可中止延迟、`success/error/empty` 测试模式，顶部标注生成客户端替换点）；列表筛选全部进入 query params 并由 repository 查询，支持清除筛选；列表改为保留 query 的 `Link` 并高亮当前项；详情用 `getNote` 加载，具备骨架、错误重试、不存在空态，目录跳转带 `scroll-mt`，代码块增加复制按钮，上下篇复用筛选后的列表；列表与详情直接访问/刷新可用。
- 阶段 2 · P6 分类/归档/文库/关于/作者：分类页接入 repository 并输出文章网格、标签统计与专栏链接；归档页按年份/分类/标签分组，模式写入 `group` query 且刷新保留；文库页改为收藏/草稿/在读三栏并补齐空态；404 与顶部导航改用共享组件和 `Link`，导航补齐 `aria-current` 高亮；删除未使用的 `archiveGroups`、`ArchiveGroup` 与 `.archive-tab` CSS；作者与关于保留独立路由。
- 阶段 2 · P7 样式收口、测试与质量门禁：删除 `src/styles/app.css` 及其 import，页面与组件全部改用 Tailwind utility + `src/lib/styles.ts` 共享组合 + `index.css` 设计 token；收紧表面/眉题/胶囊样式并移除 `list-item` 等旧类名冲突；新增 Vitest 5 + jsdom + Testing Library 配置与 `npm run test` / `npm run test:run`，7 个测试文件，随阶段出口补充至 57 项，覆盖 repository 筛选、URL 参数、主题持久化、关键路由、空/错误态、语义与 aria、token 对比度、焦点与 reduced-motion；新增 `--brand-text` 并调整浅色 `--primary-foreground`，修复小字号强调文字与填充按钮的 WCAG AA 对比度；CI 前端 job 增加 `npm run test:run`；同步更新设计 token、测试策略与文档索引。
- 阶段 2 · 出口验收 G1–G6：生产构建预览下验证 9 条路由、刷新/前进后退、4 条旧链接重定向、深浅主题 token、六类数据页面空/错误态、加载骨架与响应式；`posts` 收敛到 repository（新增 `countNotes`），站点静态元数据仍来自 `data.ts`；前端 57 项测试与后端 7 项测试通过；分支 `feat/phase2-frontend-baseline` 推送后 CI [#42485253915](https://github.com/warmthlee/zane/actions/runs/42485253915) 四个任务全部 success。
- `AGENTS.md`（中文跨 Agent 契约）与 `CLAUDE.md`（Claude Code 入口）。
- shadcn/ui 作为唯一 UI 组件来源：CLI 加入 `src/components/ui/`，组件源码入库。
- 阶段 1 · S0 固化文档基线：文档与协作契约按目录分组提交，工作区回到干净状态。
- 阶段 1 · S1 后端 walking skeleton：`src-dotnet/`（`Zane.sln`、`Zane.Api`、`Zane.Api.Tests`）、`/api/v1/health`、`/openapi/v1.json`、ProblemDetails + `IExceptionHandler`、`AddValidation()` 示例端点与 xUnit 测试。
- 阶段 1 · S2 EF Core 最小模型：`Note` 实体与 `AppDbContext`、`InitialCreate` 迁移、SQLite WAL/外键/忙等待设置、健康检查接入真实数据库探针。
- 阶段 1 · S3 前端工程化补齐：Tailwind CSS v4（仅 theme + utilities，不引入 preflight 以保持既有视觉）、`@/` 别名、shadcn/ui 初始化与 `button`/`card`/`input`；前端目录重构为 `app/`、`components/`、`features/notes/`、`lib/`、`styles/`。
- 阶段 1 · S4 接通契约：后端构建时输出 `src/api-client/Zane.Api.json`，`npm run api:generate` 生成 `schema.ts` 与类型化 `client.ts`；首页新增后端健康状态条，Vite dev 代理 `/api` 到本地后端。
- 阶段 1 · S5 CI 与发布门禁：GitHub Actions 覆盖前后端 build/test、OpenAPI 契约一致性与数据库迁移演练；`main` 构建上传 `zane-api` artifact（含自包含 `efbundle`）；`npm run release:check` 同步扩展为本地发布门禁。

### Changed

- 后端从 Node 切换为 .NET 10（LTS）+ ASP.NET Core Minimal APIs。
- 数据访问采用 EF Core 10；数据库保持 SQLite。
- 项目结构改为前端 `src/`、后端 `src-dotnet/`、生成客户端 `src/api-client/`。
- API 契约以 OpenAPI 3.1 为唯一来源，前端类型由生成客户端提供。
- 项目定位更新为“总结经验、记录想法 + 产品 MVP 游乐场”。
- 主题切换从 `.theme-dark` 迁移到 `<html class="dark">`；旧 `--accent` 样式变量由设计 token `--primary` 取代。
- 前端样式完成 Tailwind 迁移：`app.css` 删除，遗留 selector 与页面级旧类名一并移除；`index.css` 仅保留 token、base 重置、焦点与 reduced-motion 规则。
- 首页定位从“混合式首页”收敛为“轻量想法首页”：导航下第一块为想法日历，其后为想法输入与时间线，底部为 5 条最近文章；移除 Hero、后端状态条、内容板块、引用块、内容方向、写作方向与统计条。
- 阶段 3 范围从“仅首页与全局入口”扩展为“首页 + 想法流 + 全局入口”：新增 Memos 后端、EF Core 迁移、口令保护与 OpenAPI 契约；用户鉴权仍延后。

### Deferred

- 用户鉴权（ADR-007）。
- 社交平台一键分发（ADR-008）。
- 想法按用户隔离与所有者权限（MEMO-11，依赖 ADR-007）。
- 文章元数据迁移到 frontmatter（NOTE-14）；阶段 3 先完成渲染与首页列表。
- 通用贡献日历多色扩展（PLAT-14）；阶段 3 只实现想法色系。

### Planned

- 文章与长文记录 CRUD 与检索（NOTE-01～NOTE-03）。
- 想法流 CRUD、标签、口令与日历（MEMO-01～MEMO-10）。
- 静态文章完整 Markdown 渲染（NOTE-13）。
- 结构化日志与请求追踪（PLAT-08）、备份与导出脚本（PLAT-13）。

## [0.0.0] - 2026-10-29

### Added（初始版本）

- 初始前端原型与基础博客页面。
- 发布脚本与会话归档脚本。

---

## 记录规则

- 每次发布追加版本号与日期。
- 分类使用 Added / Changed / Fixed / Removed / Security。
- 破坏性变更单独标注，并链接 ADR。
- 文档结构变更也在此登记。
