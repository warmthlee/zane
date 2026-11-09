# 阶段 3 交付计划（首页、想法流与全局入口 H0–H6）

本文管理阶段 2 前端基线之后的一次全局入口迭代：把首页从博客式结构收敛为**轻量想法首页**，建立六模块主导航，落地浅/深/跟随系统三态主题，并为尚未实现的模块提供状态明确的入口页；同时新增 **Memos 想法流后端**（SQLite、`#标签#`、共享口令、52 周日历）与文章完整 Markdown 渲染。步骤编号使用 `H0–H6`，与阶段 1 的 `S0–S5`、阶段 2 的 `P0–P7` 区分。

## 与路线图的关系

- 本计划是**首页、想法流与全局入口迭代**，不等同于 [`roadmap.md`](roadmap.md) 中按业务模块划分的“阶段 3”。
- 工具（PRD-02）、热点（PRD-05）、MVP（PRD-03）的业务功能仍按各自 PRD 单独排期；本阶段只提供入口、状态说明与路由，不实现具体能力。
- 想法流的业务需求见 [`prd/prd-09-memos.md`](prd/prd-09-memos.md)；文章呈现补充见 [`prd/prd-01-notes.md`](prd/prd-01-notes.md) 的 `NOTE-13` / `NOTE-14`。
- 阶段 2 的 P0–P7 记录与验收结论保持不变；本计划在其之上增量推进。
- 用户鉴权（ADR-007）与社交分发（ADR-008）仍延后。Memos 使用共享口令保护写操作（ADR-010），但**不是用户鉴权**，不提供按用户隔离与所有者判断。

## 范围

### 纳入

- 轻量首页：六模块导航下方为 52 周想法日历，其后为想法输入框与时间线，底部为 5 条最近文章。
- Memos 后端：实体、软删除、EF Core 迁移、标签解析、CRUD、共享口令、限流、游标分页、52 周日历聚合、OpenAPI 与前端客户端。
- 想法流前端：输入、编辑、删除确认、标签筛选、口令解锁、加载/空/错误/提交中状态。
- 想法日历：导航下方第一块内容，最近 52 周，品牌橙 5 档，移动端内部横向滚动，可访问性摘要。
- 六模块主导航：主页、文章、文档、工具、广场、学习；右侧关于、GitHub 外链、主题切换。
- 主题三态：浅色 / 深色 / 跟随系统；持久化、系统偏好跟随、首屏无闪烁。
- 模块落地页：`/docs`、`/tools`、`/playground`、`/learn`、`/feeds`，状态明确、无死链。
- 文章：完整 Markdown 渲染（`react-markdown` + `remark-gfm`），首页 5 条紧凑文章行，保留 `/notes` 完整列表。
- 响应式、键盘可访问性、焦点与 `prefers-reduced-motion`。
- 前后端测试更新与文档同步。

### 不纳入

- 用户鉴权、多用户、每条想法的所有者与权限判断（MEMO-11，ADR-007）。
- 社交平台分发（ADR-008）。
- 想法 Markdown/富文本、图片上传、附件、评论、点赞、转发。
- 文章元数据迁移到 frontmatter（NOTE-14）；阶段 3 元数据仍暂存在 `src/features/notes/data.ts`。
- 工具、热点、MVP 的真实业务功能与数据接入。
- 文章编辑页、自动保存、删除、导出（依赖写接口与鉴权）。
- 通用贡献日历多色扩展（PLAT-14）；阶段 3 只实现想法色系。
- SSR/SEO 专项。
- 引入新的第三方组件库；继续使用 shadcn/ui + lucide-react + 现有设计 token。

## 前置条件

- 阶段 2 的 P0–P7 已 `done`（见 [`delivery-plan-phase2.md`](delivery-plan-phase2.md)）。
- 前端基线命令可用：`npm run build`、`npm run lint`、`npm run test:run`。
- 后端基线命令可用：`dotnet build`、`dotnet test`；`src-dotnet/` 已存在，`/api/v1/health` 可用。
- 当前测试基线：前端 7 个测试文件、57 项通过；后端 7 项通过。H4A–H4C 会新增测试，H6 更新基线数字。
- 本地与生产具备 `Memos__Passphrase` 注入方式；开发环境可使用用户机密，禁止提交明文。
- SQLite 数据库可写；迁移在空库与已有库副本上均可执行。
- 现有路由与旧链接归一化逻辑保持不变。

## 决策

| 编号 | 决策 | 推荐值 | 确认状态 |
| --- | --- | --- | --- |
| D1 | 首页定位 | 轻量想法首页：导航 → 想法日历 → 想法流 → 最近文章 | 已确认（2026-11-09） |
| D2 | 主导航 | 六模块「主页/文章/文档/工具/广场/学习」+ 右侧关于/GitHub/主题 | 已确认（2026-11-09） |
| D3 | 主题切换 | 浅色 / 深色 / 跟随系统三态 | 已确认（2026-11-09） |
| D4 | 未实现模块 | 提供状态明确的落地页，不做假功能、不放假数据 | 默认采纳，待确认 |
| D5 | 旧导航项 | 分类/文库/归档/作者保留路由，移出主导航，页脚提供入口 | 默认采纳，待确认 |
| D6 | 首页取舍 | 移除 Hero、后端状态条、内容板块、引用块、内容方向、写作方向与统计条；仅保留 5 条最近文章 | 已确认（2026-11-09），取代旧 D6 |
| D7 | 品牌与语言 | 品牌改为 `zane playground`，`index.html` 使用 `zh-CN` | 默认采纳，待确认 |
| D8 | 主题存储 | 继续使用 `blog-theme`，兼容旧值 `light` / `dark` | 已确认（2026-11-09） |
| D9 | 想法持久化 | 后端 Memos + SQLite，不使用 Markdown 文件或 localStorage | 已确认（2026-11-09） |
| D10 | 写保护 | 创建/编辑/删除需要共享口令，服务端校验 | 已确认（2026-11-09） |
| D11 | 标签语法 | `#养花#`、`#技术/React#`；服务端解析并从正文保留 | 已确认（2026-11-09） |
| D12 | 文章处理 | 文章继续以 Markdown 文档存放；阶段 3 先做完整渲染与首页列表 | 已确认（2026-11-09） |
| D13 | 首页文章列表 | 5 条紧凑行：日期、分类、标题、阅读时长；完整列表进入 `/notes` | 默认采纳（2026-11-09） |
| D14 | 想法日历 | 导航下方第一块；最近 52 周；品牌橙 5 档；移动端横向滚动一年 | 已确认（2026-11-09） |
| D15 | 权限判断 | 当前不做每条想法的权限判断，任何持有口令的人可修改全部想法；记录为未来 MEMO-11 | 已确认（2026-11-09） |
| D16 | 站点时区 | `Site:TimeZone`，默认 `Asia/Shanghai`；日历按本地日期聚合 | 默认采纳（2026-11-09） |
| D17 | 文章渲染 | `react-markdown` + `remark-gfm`，完整渲染，不启用原始 HTML | 已确认（2026-11-09） |
| D18 | 删除策略 | 想法软删除，`deleted_at` 非空即排除 | 默认采纳（2026-11-09） |
| D19 | 分页 | 默认 20 条，`limit` + `cursor`，`created_at desc, id desc` | 默认采纳（2026-11-09） |
| D20 | 口令会话 | 前端解锁后保存在 `sessionStorage`；401 时清除；不写 `localStorage` | 默认采纳（2026-11-09） |
| D21 | 日历接口 | 一次返回 364 天，含 0 计数、`total`、`maxCount`、`timeZone` | 默认采纳（2026-11-09） |
| D22 | 日历 token | `--heatmap-memo-0..4`；未来文章/工具使用独立前缀，组件以 `tone` 选择 | 已确认色系（2026-11-09） |
| D23 | 前端数据流 | 沿用 `useAsyncData` + `src/api-client/client.ts`，不为 Memos 迁移到 RTK Query | 默认采纳（2026-11-09） |
| D24 | 文章元数据 | 阶段 3 保留 `data.ts`；frontmatter 迁移延后到 NOTE-14 | 已确认（2026-11-09） |
| D25 | 文章安全 | 不渲染原始 HTML；链接与图片由渲染器默认处理 | 默认采纳（2026-11-09） |

产品范围决策 D1、D6、D9–D12、D14、D15、D17、D22、D24 已确认；D13、D16 与技术实现细节 D18–D21、D23、D25 采用默认值，如无异议随对应步骤执行。D4、D5、D7 仍待产品确认，不影响 H4A–H4C 的文档准备；H1–H3 启动前仍需确认。

## 信息架构与路由表

| 路径 | 页面 | 主导航 | 说明 |
| --- | --- | --- | --- |
| `/` | 主页 | 是 | 轻量想法首页 |
| `/notes` | 文章 | 是 | 现有文章列表与详情入口 |
| `/notes/:noteId` | 文章详情 | — | 完整 Markdown 渲染 |
| `/docs` | 文档 | 是 | 本文档库的入口与状态页 |
| `/tools` | 工具 | 是 | 工具规划与状态页 |
| `/playground` | 广场 | 是 | MVP 规划与状态页 |
| `/learn` | 学习 | 是 | 学习路径与分类入口 |
| `/feeds` | 热点 | 否 | 从首页或模块页进入 |
| `/about` | 关于 | 右侧入口 | 现有页面 |
| `/categories/:categoryId` | 分类 | 否 | 保留路由，页脚入口 |
| `/library` | 文库 | 否 | 保留路由，页脚入口 |
| `/archive` | 归档 | 否 | 保留路由，页脚入口 |
| `/author` | 作者 | 否 | 保留路由，页脚入口 |
| `*` | 404 | — | 现有页面 |

## 使用方式

- 状态取值：`todo` / `doing` / `done` / `blocked` / `dropped`。
- 每步开始前把状态改为 `doing`；完成后补「验收记录」并改为 `done`。
- **一步未通过验收，不开始下一步的主要工作**；允许在同一步内返工。
- 验收证据写命令与实际输出摘要，不写「已验证」这类无证据结论。
- 一步一会话；会话之间只依赖 Git 提交、本文、交接摘要与 `.ai/` 归档。

### 开工条件

- H1–H3 仍需 D4–D7 经产品侧确认；H4A 可在 D9–D25 范围内先行，并与 H1–H3 并行。
- 产品侧通过 `/step H<n>` 明确指定步骤后，该步状态改为 `doing` 再实现；未收到 `/step` 时不改业务代码。
- 每步结束时按验收表逐条跑命令，更新状态、验收记录与交接摘要。

### 收工清单

1. 按该步骤「验收」表逐条执行命令，记录真实输出摘要。
2. 全部通过才改 `done`；否则改 `blocked` 并写明缺什么。
3. 提交，提交信息带步骤 ID，例如 `feat(H4A): Memos 后端与口令`。
4. 归档：`npm run session:save -- "H4A · Memos 后端与口令" done "<证据摘要>"`。
5. 填写「交接摘要」对应行，三列都要有内容。

### 交接摘要格式

- **已完成**：本步实际交付了什么（对应到具体路径与命令）。
- **已定契约**：下一步必须遵守的接口、命名、数据结构、配置键。
- **下一步前置**：下一个会话开始前必须存在的文件、命令或决策。

## 总览

| 步骤 | 主题 | 依赖 | 主要产出 | 状态 |
| --- | --- | --- | --- | --- |
| H0 | 阶段 3 规划与决策确认 | — | 本文、PRD-09、决策表、索引登记 | done |
| H1 | 主题三态基线 | H0 确认 | `features/ui/theme.ts`、`ThemeSwitcher`、slice/store/layout 调整、首屏脚本 | todo |
| H2 | 六模块主导航与页脚 | H1 | `SiteHeader` 重写、移动菜单、页脚快捷链接 | todo |
| H3 | 模块落地页与路由 | H2 | `moduleCatalog`、`ModuleLandingPage`、五条新路由 | todo |
| H4A | Memos 后端与口令 | D9–D25（可并行 H1–H3） | `Memo`、`MemoTag`、迁移、CRUD、口令、日历聚合、OpenAPI | todo |
| H4B | 轻量想法首页 | H2、H3、H4A | `HomePage` 重写、想法输入/时间线、贡献日历、5 条文章、客户端扩展 | todo |
| H4C | 文章 Markdown 渲染 | H4B | `import.meta.glob`、`react-markdown` + `remark-gfm`、目录与代码复制 | todo |
| H5 | 响应式与质量收口 | H4C | 1280/768/375、日历滚动、键盘、焦点、完整测试 | todo |
| H6 | 文档同步与出口验收 | H5 | 设计/需求/changelog/README 同步、验收记录 | todo |

## H0 · 阶段 3 规划与决策确认

**目标**：在改业务代码前，把首页定位、想法流、导航结构、主题策略、模块入口与验收方式固化成文档。

**任务**

- [x] 建立本文档，记录范围、前置条件、决策与步骤。
- [x] 登记 `docs/README.md` 的「01 · 需求与路线」索引。
- [x] 在 `docs/08-governance/changelog.md` 记录阶段 3 计划。
- [x] 2026-11-09 重定基线：D1/D6 改为轻量想法首页；新增 D9–D25、H4A–H4C。
- [x] 新增 [`prd/prd-09-memos.md`](prd/prd-09-memos.md)，登记 `MEMO-01`～`MEMO-12`。
- [x] 更新 `docs/02-architecture/`、`docs/03-design/`、`docs/05-quality/`、`docs/06-release/` 中的 Memos、日历与口令契约。
- [ ] 与产品侧确认 D4–D7；确认前 H1–H3 保持 `todo`，H4A 可按 D9–D25 的已确认项与默认值推进。

**产出**：阶段 3 的文档契约；本步不修改业务代码。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 工作区 | `git status --porcelain` | 仅文档、索引与 changelog 改动 |
| 文档链接 | 人工检查 `docs/README.md` | 可跳转到本文、PRD-09 与 ADR-010 |
| 构建不受影响 | 如改动代码再运行 `npm run build` | 通过；纯文档改动不强制 |
| 静态检查 | 如改动代码再运行 `npm run lint` | 通过（允许既有 shadcn warning） |

**回退**：删除本文与索引/changelog 条目；不影响现有代码。

## H1 · 主题三态基线

**目标**：把“用户偏好”和“实际生效主题”分离，支持浅色、深色、跟随系统，并保证首屏无闪烁。

**任务**

- [ ] 新增 `src/features/ui/theme.ts`：
  - `ThemeMode = 'light' | 'dark'`、`ThemePreference = ThemeMode | 'system'`。
  - `THEME_STORAGE_KEY = 'blog-theme'`、`SYSTEM_DARK_QUERY`。
  - `isThemePreference()`、`readStoredThemePreference()`（兼容旧值）、`getSystemTheme()`。
  - `resolveInitialThemePreference()`（默认 `system`）、`resolveEffectiveTheme()`。
  - `applyThemeToDocument()`、`watchSystemTheme()`（兼容旧版 Safari 的 `addListener`）。
- [ ] `src/features/ui/uiSlice.ts`：`UiState.theme` 改为 `ThemePreference`；删除 `toggleTheme`，新增 `setThemePreference`。
- [ ] `src/features/notes/types.ts`：移除 `ThemeMode`，更新引用。
- [ ] `src/app/store.ts`：继续持久化 `blog-theme`，值为偏好字符串。
- [ ] `src/main.tsx`：首屏前应用生效主题。
- [ ] `src/app/layouts/AppLayout.tsx`：`system` 时监听系统变化，计算生效主题，写入 `data-theme`。
- [ ] 新增 `src/components/layout/ThemeSwitcher.tsx`：Sun/Moon/Monitor 三段按钮，`role="group" aria-label="主题"`，按钮带 `aria-label`、`aria-pressed`、`title`。
- [ ] `index.html`：`lang="zh-CN"`、标题与 description、防闪烁内联脚本。
- [ ] 更新 `src/app/theme.test.tsx`：三态切换、持久化、系统 fallback、旧值兼容、`.dark` 同步。

**产出**：可持久化、可跟随系统、无闪烁的主题三态基线。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run` | 主题相关测试全部通过 |
| 三态 | 点击浅色/深色/跟随系统 | `.dark`、`colorScheme`、`data-theme` 正确；按钮 `aria-pressed` 唯一 |
| 持久化 | 刷新页面 | 偏好保持；旧值 `'light'`/`'dark'` 可识别 |
| 系统跟随 | 切换系统深浅色 | `system` 模式下实时更新；手动模式不受影响 |
| 无闪烁 | 刷新深色页面 | 首帧即为深色，不出现浅色闪白 |

**回退**：回退本步提交，恢复两态主题；`blog-theme` 旧值仍可读。

## H2 · 六模块主导航与页脚

**目标**：用六模块主导航替换现有 7 项导航，并提供移动端折叠菜单、关于/GitHub/主题入口。

**任务**

- [ ] `SiteHeader` 主导航改为 `/`、`/notes`、`/docs`、`/tools`、`/playground`、`/learn`。
- [ ] 右侧增加关于、GitHub 外链（`target="_blank" rel="noreferrer"`，`ExternalLink` 图标）与 `ThemeSwitcher`。
- [ ] 桌面横向布局；移动端 `Menu` / `X` 折叠面板，`aria-expanded`、`aria-controls`。
- [ ] 路由变化与 `Escape` 自动收起移动菜单。
- [ ] 当前项使用 `aria-current="page"`；品牌文案改为 `zane playground`。
- [ ] `SiteFooter` 增加模块与旧路由快捷链接。
- [ ] 更新 `src/app/accessibility.test.tsx` 的导航数量、主题控件、品牌与键盘流程断言。

**产出**：六模块导航与页脚入口，桌面/移动端均可用。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run` | 导航与可访问性测试通过 |
| 路由 | 逐项点击六个模块 | 均进入对应页面，激活态唯一 |
| 移动端 | 375 宽度打开/关闭菜单 | 菜单可用；`Escape` 与路由跳转后收起 |
| 外链 | 点击 GitHub | 新窗口打开仓库；不劫持当前页面 |
| 键盘 | Tab 顺序 | 品牌 → 主导航 → 关于 → GitHub → 主题，焦点可见 |

**回退**：回退本步提交，恢复 7 项导航与文字主题按钮。

## H3 · 模块落地页与路由

**目标**：为文档、工具、广场、学习、热点提供状态明确的入口页，避免导航出现死链。

**任务**

- [ ] 新增 `src/features/modules/moduleCatalog.ts`：五个模块的标题、描述、状态、条目与说明。
- [ ] 新增 `src/pages/ModuleLandingPage.tsx`：复用 `PageHeader`、`SectionHeader`、`Card`、`surface`、`eyebrow`。
- [ ] 有已有内容的条目提供 `to` 路由（如 `/categories/reference`、`/categories/learning`）；未实现条目只展示状态。
- [ ] 页面底部提供 `role="status"` 的建设状态说明。
- [ ] `src/app/routes.tsx` 增加 `/docs`、`/tools`、`/playground`、`/learn`、`/feeds`。
- [ ] 保留分类、文库、归档、作者、关于、404 路由。
- [ ] 更新 `src/app/routes.test.tsx`，覆盖五个新页面的渲染与状态文案。

**产出**：五个可深链的模块入口页，状态清晰、无假功能。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run` | 新路由测试通过 |
| 深链 | 直接访问五条新路由并刷新 | 正常渲染；每页唯一 `h1` |
| 状态 | 人工检查页面 | 「整理中 / 即将上线 / 规划中」等状态清晰 |
| 死链 | 检查所有卡片 | 未实现条目不渲染为可点击链接 |
| 旧路由 | 访问原有路由 | 不受影响 |

**回退**：删除新增页面与路由；导航中的对应入口恢复为隐藏或移除。

## H4A · Memos 后端与口令

**目标**：为首页想法流提供可持久化、可编辑、可删除、可聚合的后端能力，并用共享口令保护写操作。

**任务**

- [ ] 领域模型：
  - `src-dotnet/Zane.Api/Domain/Memo.cs`：`Guid Id`、`string Content`、`DateTimeOffset CreatedAt`、`DateTimeOffset UpdatedAt`、`DateTimeOffset? DeletedAt`；`Create` 使用 `TimeProvider` 与 `Guid.CreateVersion7(now)`，`Update` / `SoftDelete` 使用 `TimeProvider` 更新时间。
  - `src-dotnet/Zane.Api/Domain/MemoTag.cs`：`Guid Id`、`Guid MemoId`、`string Tag`。
  - 标签解析器：按 PRD-09 的正则提取、去重、限长；单标签 ≤32 字符，每条 ≤8 个。
- [ ] 数据层：
  - `AppDbContext` 增加 `DbSet<Memo>`、`DbSet<MemoTag>`。
  - `MemoConfiguration` / `MemoTagConfiguration` 使用 snake_case 表列名、`content` 最大 500、索引与级联删除。
  - 软删除查询过滤器默认排除 `DeletedAt != null`；需要时按命名过滤器 `IgnoreQueryFilters`。
  - 新增迁移 `AddMemos`；在空库与已有库副本上执行。
- [ ] 端点（`Features/Memos/`）：
  - DTO：`MemoCreateRequest` / `MemoUpdateRequest`（`[Required]`、`[StringLength(500, MinimumLength = 1)]`）、`MemoResponse`（含 `tags`）、`MemoCalendarResponse`；使用 source-generated JSON。
  - `GET /api/v1/memos?limit=20&cursor=...&tag=...`：按 `created_at desc, id desc`，返回 `{ data, meta.nextCursor }`。
  - `GET /api/v1/memos/calendar`：按 `Site:TimeZone` 聚合最近 52 周，返回 364 天、`total`、`maxCount`、`timeZone`、`startDate`、`endDate`。
  - `POST /api/v1/memos`：创建，`201`。
  - `PATCH /api/v1/memos/{id}`：编辑并重新解析标签，`200`。
  - `DELETE /api/v1/memos/{id}`：软删除，`204`；重复删除 `404`。
  - `POST /api/v1/memos/unlock`：校验口令，成功 `204`，失败 `401`。
- [ ] 口令与限流（ADR-010）：
  - 配置 `Memos:Passphrase`（环境变量 `Memos__Passphrase`），最小长度 8；不写仓库。
  - SHA-256 + `CryptographicOperations.FixedTimeEquals`；请求头 `X-Memo-Passphrase`。
  - 未配置时写接口与 `unlock` 返回 `503`（`MEMO_PASSPHRASE_NOT_CONFIGURED`）。
  - 解锁与写操作按来源 IP 固定窗口限流，默认 5 次 / 5 分钟，超限 `429`。
- [ ] 站点时区：
  - 配置 `Site:TimeZone`，默认 `Asia/Shanghai`；启动时校验 IANA 时区，无效则启动失败。
  - 日历按本地日期分组：SQL 只按 UTC 范围取 `created_at`，应用层用 `TimeZoneInfo` 转换，避免依赖 SQLite 时区函数；补跨 UTC 日期边界测试。
- [ ] 契约与测试：
  - OpenAPI 包含全部 Memos 端点、请求头与错误码；运行 `npm run api:generate` 更新 `src/api-client/`。
  - 领域测试：标签解析、长度、去重、上限。
  - 集成测试：创建/编辑/软删除、列表分页、标签筛选、口令 401/429/503、日历聚合、迁移可重复应用。
  - 时间使用固定 `TimeProvider`，断言数据库存储为 UTC。

**产出**：Memos 数据模型、迁移、CRUD、口令、日历聚合与生成客户端。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 后端构建 | `dotnet build src-dotnet/Zane.sln` | 通过 |
| 后端测试 | `dotnet test src-dotnet/Zane.sln` | 全部通过，新增 Memos 用例通过 |
| 迁移 | `dotnet ef database update --project src-dotnet/Zane.Api` | 空库与已有库副本均可执行 |
| 契约 | `npm run api:generate`、`git diff --exit-code -- src/api-client` | 生成物与提交一致 |
| CRUD | 手工或集成测试 | 创建/编辑/删除/重新解析标签正确 |
| 口令 | 正确/缺失/错误/超限 | 204/401/401/429；未配置返回 503 |
| 日历 | 固定时区与固定时间 | 364 天、日期边界、`total`、`maxCount` 正确 |
| 软删除 | 删除后查询 | 列表、标签筛选、日历均排除 |

**回退**：回退本步提交并删除 `AddMemos` 迁移；数据库恢复备份；前端未接入时不受影响。

## H4B · 轻量想法首页

**目标**：把首页重写为「导航 → 想法日历 → 想法流 → 最近文章」，并接通 H4A 的 Memos 接口与口令流程。

**任务**

- [ ] 客户端扩展 `src/api-client/client.ts`：支持 POST/PATCH/DELETE、JSON body、`204`、自定义请求头、ProblemDetails 错误归一化；不手改 `schema.ts`。
- [ ] 新增 `src/features/memos/`：
  - `types.ts`、`repository.ts` / `api.ts`：列表、创建、编辑、删除、日历、解锁。
  - `useMemos`：游标分页、加载/空/错误/重试、创建/编辑/删除后的刷新。
  - `useMemoCalendar`：日历加载、错误、刷新。
  - `passphrase.ts`：`sessionStorage` 读写（键 `zane-memo-passphrase`）、401 清除、内存缓存。
- [ ] 新增组件：
  - `ContributionCalendar`：`tone` prop，7×52 网格、5 档色阶、月份标签、图例、摘要、格子 `title`、`aria-label`；移动端内部横向滚动并默认滚到最右。
  - `MemoComposer`：多行输入、字数、`Ctrl/Cmd + Enter`、提交中禁用、未解锁时弹口令。
  - `MemoTimeline`：按自然日分组、标签胶囊、行内编辑、删除确认。
  - `PassphraseDialog`：使用 shadcn `Dialog`；错误提示、提交中、取消。
- [ ] 重写 `src/pages/HomePage.tsx`：
  - 顺序：日历 → 想法（`h2` + 输入框 + 时间线）→ 最近文章。
  - 页面 `h1` 使用 `sr-only`「zane playground · 想法」；日历、想法、最近文章各用一个 `h2`。
  - 移除 Hero、`BackendStatus`、内容板块、引用块、内容方向、写作方向与统计条。
  - 保留 `listRecentNotes` 的 5 条文章行：日期、分类、标题、阅读时长；进入 `/notes/:id`，底部「全部文章 →」。
  - 三个区块独立加载/空/错误；单个失败不阻塞其他区块。
  - 不删除 `contentCategories`（分类页、归档页、筛选与旧导航仍使用）、`authorProfile.stats` 或 `stats`（`AboutPage` 仍使用）；只移除 `HomePage` 对 `focusAreas` 等旧区块的引用，确认无其他引用后再删除数据。
- [ ] 标签筛选：点击胶囊设置 `tag` 状态并请求列表；提供「全部」清除。
- [ ] 新建/删除后刷新日历；编辑不改变日历计数，但更新列表。
- [ ] 样式 token：`--heatmap-memo-0..4`，浅/深主题分别定义；不使用硬编码颜色。
- [ ] 测试：
  - 未解锁/解锁流程、错误口令、401 清除会话。
  - 创建/编辑/删除、标签筛选、提交中禁用。
  - 日历 5 档分档、摘要、图例、移动端滚动容器。
  - 首页 h1/h2、5 条文章、空/错误状态。
  - 更新 `routes.test.tsx`、`states.test.tsx`、`accessibility.test.tsx`。

**产出**：可用的轻量想法首页与想法流交互。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run` | 首页、想法、日历相关测试通过 |
| 区块顺序 | 人工检查 | 导航下第一块为日历，其后想法，底部最近文章 |
| 创建 | 解锁后提交 | 新想法立即出现在时间线，日历当天 +1 |
| 编辑 | 行内编辑 | 正文与标签更新；日历计数不变 |
| 删除 | 确认删除 | 列表与日历立即排除；刷新后不出现 |
| 标签 | 点击 `#养花#` | 列表按标签筛选；「全部」恢复 |
| 口令 | 错误口令 / 401 | 提示错误；清除会话并要求重新解锁 |
| 日历 | 52 周、5 档、摘要 | 日期与颜色正确；移动端容器内部滚动 |
| 文章 | 首页 5 条 | 进入对应详情；「全部文章」进入 `/notes` |
| 响应式 | 1280 / 768 / 375 | 无页面横向溢出；日历可横向滚动 |

**回退**：恢复旧首页；Memos 后端与日历接口保留，不影响其他页面。

## H4C · 文章 Markdown 渲染

**目标**：把现有 `.md` 文章从手工导入、分区渲染升级为完整 Markdown 渲染，同时保留目录、锚点与代码复制。

**任务**

- [ ] 新增依赖：`react-markdown`、`remark-gfm`；不引入原始 HTML 插件。
- [ ] `src/features/notes/content/postContent.ts`：使用 `import.meta.glob('./posts/*.md', { query: '?raw', import: 'default', eager: true })` 自动收集正文，移除手工逐个 import。
- [ ] `NoteBody` 重写：
  - 使用 `react-markdown` + `remark-gfm` 渲染标题、列表、表格、引用、链接、代码块。
  - `components` 映射：标题加稳定 `id` 与 `scroll-mt`；代码块加复制按钮；外链加 `rel="noreferrer"`。
  - 标题锚点函数与目录共用；重复标题追加 `-2`、`-3`。
  - 目录从 Markdown 标题提取，忽略 fenced code block 内的 `#`。
- [ ] 文章元数据继续来自 `src/features/notes/data.ts`；不迁移 frontmatter（NOTE-14 延后）。
- [ ] 首页最近文章使用同一份 `posts` 元数据，保持 5 条紧凑行。
- [ ] 测试：
  - 标题、列表、表格、引用、链接、代码块渲染。
  - 目录锚点、重复标题、代码复制。
  - 原始 HTML 不被执行。
  - 更新受影响的文章详情测试。

**产出**：完整 Markdown 文章渲染与稳定的目录/代码复制体验。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run` | Markdown 与目录测试通过 |
| 渲染 | 打开文章详情 | 标题、列表、表格、引用、链接、代码块完整 |
| 目录 | 点击目录项 | 跳到对应标题；重复标题锚点唯一 |
| 代码 | 点击复制 | 内容进入剪贴板，有成功反馈 |
| 安全 | 正文含 HTML 片段 | 作为文本显示，不执行 |
| 兼容 | 8 篇现有文章 | 均可渲染，无空白或报错 |

**回退**：恢复 `NoteBody` 与手工 import；已渲染文章内容不受影响。

## H5 · 响应式与质量收口

**目标**：确认新导航、想法首页、日历与文章详情在三种宽度和键盘操作下可用。

**任务**

- [ ] 1280 / 768 / 375 检查横向溢出、导航折叠、日历滚动、想法输入与时间线。
- [ ] 键盘 Tab 顺序与焦点可见性：导航、主题、口令、输入、编辑、删除、日历。
- [ ] `prefers-reduced-motion` 下无夸张动效。
- [ ] 主题切换后文本、表面、日历 5 档与图例对比度正常。
- [ ] 口令错误、限流、网络失败、空数据等状态可恢复。
- [ ] 修复测试与样式问题，确保完整测试通过。

**产出**：可交付的响应式与可访问性基线。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run`、`dotnet test src-dotnet/Zane.sln` | 全部通过 |
| 响应式 | 1280 / 768 / 375 | `scrollWidth ≤ innerWidth`；日历容器内部滚动 |
| 键盘 | 主流程 | 导航、主题、口令、想法、日历均可键盘完成 |
| 对比度 | 浅/深主题 | 正文与图例达标；5 档相邻可区分 |
| 动效 | `prefers-reduced-motion: reduce` | 过渡与滚动动效被抑制 |

**回退**：按问题单独修复；不改变既定信息架构。

## H6 · 文档同步与出口验收

**目标**：让文档、测试与实现一致，完成阶段 3 出口。

**任务**

- [ ] 更新 `docs/03-design/page-specifications.md`：轻量首页、想法流、日历、文章列表与详情。
- [ ] 更新 `docs/03-design/design-system.md`：想法色阶、`tone` 契约与贡献日历组件规范。
- [ ] 更新 `docs/02-architecture/api-design.md`、`backend-and-data.md`：Memos 端点、表、口令、时区与限流。
- [ ] 更新 `docs/06-release/deployment.md`：`Memos__Passphrase`、`Site__TimeZone` 与写接口限制。
- [ ] 更新 `docs/08-governance/changelog.md`：H0–H6 的 Added/Changed/Deferred。
- [ ] 更新 `docs/README.md`：PRD-09 索引、阶段 3 描述与测试基线数字。
- [ ] 在本文补 H0–H6 验收记录与交接摘要，状态改为 `done`。
- [ ] 执行 GH1–GH7 出口门禁。

**产出**：阶段 3 文档闭环与验收证据。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run`、`dotnet test src-dotnet/Zane.sln` | 全部通过 |
| 契约 | `npm run api:generate`、`git diff --exit-code -- src/api-client` | 生成物一致 |
| 文档 | 人工核对索引、PRD、设计文档、changelog、本文 | 与实际一致 |
| 验收记录 | 人工检查 | 每步有命令与输出摘要 |
| 出口 | GH1–GH7 | 全部勾选 |

**回退**：文档与代码分开提交，可分别回退。

## 阶段出口

H0–H6 全部 `done` 后执行一次整体验收：

- [ ] **GH1 文档契约**：本文、PRD-09、`README.md`、设计文档与 changelog 一致；路由表与实际一致。
- [ ] **GH2 主题**：浅/深/跟随系统三态可用；持久化、系统跟随、首屏无闪烁。
- [ ] **GH3 导航**：六模块全部可达；激活态、移动菜单、关于/GitHub/主题可用。
- [ ] **GH4 首页与想法流**：日历、输入、时间线、口令、标签筛选、5 条文章完整；创建/编辑/删除与 401/429/503 正确。
- [ ] **GH5 文章 Markdown**：完整渲染、目录、锚点、代码复制与 HTML 安全通过。
- [ ] **GH6 质量**：前端 `build`/`lint`/`test:run`、后端 `build`/`test`、迁移与契约生成全部通过；三种宽度无页面横向溢出。
- [ ] **GH7 文档**：索引、PRD、设计文档、changelog、验收记录、交接摘要与实际一致。

阶段 3 出口只证明**首页、想法流与文章呈现基线可用**，不证明工具、热点、MVP 的业务能力完成，也不证明用户鉴权落地。

## 验收记录

| 日期 | 步骤 | 命令 | 结果 | 遗留 |
| --- | --- | --- | --- | --- |
| 2026-11-09 | H0 | `git status --porcelain` | 仅 `docs/01-requirements/delivery-plan-phase3.md`、`docs/README.md`、`docs/08-governance/changelog.md` | 无 |
| 2026-11-09 | H0 | `npm run build` | 通过：`✓ built in 640ms`；CSS 48.83 kB、JS 439.31 kB | 无 |
| 2026-11-09 | H0 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告 | 无 |
| 2026-11-09 | H0 | 索引 | `docs/README.md` 已登记本文并可跳转 | 待产品确认 D4–D7；确认前不启动 H1–H3 |
| 2026-11-09 | H0 重定基线 | 文档评审 | 新增 PRD-09、MEMO-01～12、H4A–H4C、日历与口令契约；仅文档改动 | 待执行 H4A；未运行构建 |
| 2026-11-09 | H0 重定基线 | `git status --porcelain` | 仅 `docs/` 下 27 个文件（25 修改、2 新增）；未触及 `src/` 与 `src-dotnet/` | 无 |

## 交接摘要

| 步骤 | 已完成 | 已定契约 | 下一步前置 |
| --- | --- | --- | --- |
| H0 | 建立阶段 3 交付计划、决策表、路由表、H0–H6 步骤与 GH1–GH7 出口；`docs/README.md` 索引与 changelog 已登记；2026-11-09 重定基线为轻量想法首页并新增 PRD-09、Memos 后端与 H4A–H4C | 步骤前缀 `H0–H6`；出口门禁 `GH1–GH7`；首页顺序：导航 → 日历 → 想法 → 最近文章；六模块路径 `/`、`/notes`、`/docs`、`/tools`、`/playground`、`/learn`；热点 `/feeds` 仅从首页/模块页进入；主题存储键 `blog-theme`；Memos 写接口使用 `X-Memo-Passphrase`；配置键 `Memos:Passphrase`、`Site:TimeZone` | 待产品确认 D4–D7；H1–H3 启动前仍需 `/step H<n>`；H4A 可按 D9–D25 先行；现有测试仍按两态主题、7 项导航与旧首页结构，H1/H2/H4B 需同步更新 |
| H1 |  |  |  |
| H2 |  |  |  |
| H3 |  |  |  |
| H4A |  |  |  |
| H4B |  |  |  |
| H4C |  |  |  |
| H5 |  |  |  |
| H6 |  |  |  |

## 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 共享口令泄漏 | 任何获得口令的人可修改全部想法 | 口令只走请求头；不写日志/URL/`localStorage`；限流；写接口网络限制；未来 MEMO-11 用用户鉴权替换 |
| 口令配置缺失 | 生产写接口不可用或误开放 | 缺失时写接口 503；部署检查清单加入 `Memos__Passphrase`；发布前冒烟 |
| 范围扩张 | 想法流被做成完整社交产品 | 本阶段只做短文本、标签、CRUD、日历；评论/图片/Markdown/多用户明确排除 |
| 时区/跨日聚合错误 | 日历日期与用户认知不一致 | 统一 UTC 存储；按 `Site:TimeZone` 分组；固定 `TimeProvider` 测试跨日边界 |
| 日历性能 | 每次渲染 364 格导致卡顿 | 服务端一次聚合；前端纯展示；避免逐格请求 |
| 移动端横向溢出 | 页面整体可左右拖动 | 日历放进 `overflow-x-auto` 容器；页面级断言 `scrollWidth ≤ innerWidth` |
| Markdown 注入 | 文章正文执行脚本 | 不启用原始 HTML；使用 `react-markdown` 默认转义；外链 `rel="noreferrer"` |
| 现有测试耦合旧首页/两态主题/7 项导航 | 测试失败阻塞 | H1/H2/H4B/H4C 同步更新 `theme.test.tsx`、`accessibility.test.tsx`、`routes.test.tsx`、`states.test.tsx` |
| SQLite 单实例写入 | 并发写冲突或锁等待 | 保持短事务；WAL 与 `busy_timeout`；写接口限流；不水平扩展写进程 |
| 文章元数据暂存 `data.ts` | 内容新增仍需改代码 | 阶段 3 接受；NOTE-14 迁移 frontmatter 并补构建期校验 |

## 变更规则

- 增删步骤必须同步修改本文总览、阶段出口与 `docs/08-governance/changelog.md`。
- 验收项变化同步 `docs/05-quality/acceptance-criteria.md`。
- 决策 D4–D7 如被否决，先改本文决策表与受影响步骤，再调整实现。
- Memos 需求变化先改 PRD-09，再同步本文、backlog 与架构/设计文档。
- 本计划不改变路线图的业务阶段划分；工具、热点、MVP 仍按各自 PRD 单独排期。
