# 阶段 3 交付计划（首页与全局入口 H0–H6）

本文管理阶段 2 前端基线之后的一次全局入口迭代：把首页从博客式结构扩展为「混合式首页」，建立六模块主导航，落地浅/深/跟随系统三态主题，并为尚未实现的模块提供状态明确的入口页。步骤编号使用 `H0–H6`，与阶段 1 的 `S0–S5`、阶段 2 的 `P0–P7` 区分。

## 与路线图的关系

- 本计划是**首页与全局入口迭代**，不等同于 [`roadmap.md`](roadmap.md) 中按业务模块划分的“阶段 3”。
- 工具（PRD-02）、热点（PRD-05）、MVP（PRD-03）的业务功能仍按各自 PRD 单独排期；本阶段只提供入口、状态说明与路由，不实现具体能力。
- 阶段 2 的 P0–P7 记录与验收结论保持不变；本计划在其之上增量推进。
- 鉴权（ADR-007）与社交分发（ADR-008）仍延后，不实现编辑、删除、同步等写入口。

## 范围

### 纳入

- 混合式首页：Hero、最新文章、探索空间（工具/广场/学习/热点）、内容板块、统计条。
- 六模块主导航：主页、文章、文档、工具、广场、学习；右侧关于、GitHub 外链、主题切换。
- 主题三态：浅色 / 深色 / 跟随系统；持久化、系统偏好跟随、首屏无闪烁。
- 模块落地页：`/docs`、`/tools`、`/playground`、`/learn`、`/feeds`，状态明确、无死链。
- 响应式、键盘可访问性、焦点与 `prefers-reduced-motion`。
- 前端测试更新与文档同步。

### 不纳入

- 工具、热点、MVP 的真实业务功能与数据接入。
- 后端接口变更、EF Core 迁移、OpenAPI 契约变更。
- 笔记编辑页、自动保存、删除、导出（依赖写接口与鉴权）。
- 用户鉴权、社交平台分发、SSR/SEO 专项。
- 引入新的第三方组件库；继续使用 shadcn/ui + lucide-react + 现有设计 token。

## 前置条件

- 阶段 2 的 P0–P7 已 `done`（见 [`delivery-plan-phase2.md`](delivery-plan-phase2.md)）。
- 前端基线命令可用：`npm run build`、`npm run lint`、`npm run test:run`。
- 当前测试基线：7 个测试文件、57 项通过。
- 后端健康接口仅用于首页 `BackendStatus`；本阶段不依赖后端新接口。
- 现有路由与旧链接归一化逻辑保持不变。

## 决策

| 编号 | 决策 | 推荐值 | 确认状态 |
| --- | --- | --- | --- |
| D1 | 首页定位 | 混合式：上半部 Hero + 最新文章，下半部工具/热点/MVP 入口 | 已确认（2026-11-09） |
| D2 | 主导航 | 六模块「主页/文章/文档/工具/广场/学习」+ 右侧关于/GitHub/主题 | 已确认（2026-11-09） |
| D3 | 主题切换 | 浅色 / 深色 / 跟随系统三态 | 已确认（2026-11-09） |
| D4 | 未实现模块 | 提供状态明确的落地页，不做假功能、不放假数据 | 默认采纳，待确认 |
| D5 | 旧导航项 | 分类/文库/归档/作者保留路由，移出主导航，页脚提供入口 | 默认采纳，待确认 |
| D6 | 首页取舍 | 移除「引用块 / 内容方向 / 写作方向」三个长区块，新增探索空间 | 默认采纳，待确认 |
| D7 | 品牌与语言 | 品牌改为 `zane playground`，`index.html` 使用 `zh-CN` | 默认采纳，待确认 |
| D8 | 主题存储 | 继续使用 `blog-theme`，兼容旧值 `light` / `dark` | 已确认（2026-11-09） |

未确认项**不视为默认可实施**。产品侧确认 D4–D7（或给出替代方案）前，H1–H6 不启动；确认后先更新本表，再按对应步骤执行。

## 信息架构与路由表

| 路径 | 页面 | 主导航 | 说明 |
| --- | --- | --- | --- |
| `/` | 主页 | 是 | 混合式首页 |
| `/notes` | 文章 | 是 | 现有笔记列表与详情入口 |
| `/notes/:noteId` | 文章详情 | — | 现有路由 |
| `/docs` | 文档 | 是 | 本文档库的入口与状态页 |
| `/tools` | 工具 | 是 | 工具规划与状态页 |
| `/playground` | 广场 | 是 | MVP 规划与状态页 |
| `/learn` | 学习 | 是 | 学习路径与分类入口 |
| `/feeds` | 热点 | 否 | 从首页「探索空间」进入 |
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

- D4–D7 经产品侧确认后，才可开始 H1。
- 产品侧通过 `/step H<n>` 明确指定步骤后，该步状态改为 `doing` 再实现；未收到 `/step` 时不改业务代码。
- 每步结束时按验收表逐条跑命令，更新状态、验收记录与交接摘要。

### 收工清单

1. 按该步骤「验收」表逐条执行命令，记录真实输出摘要。
2. 全部通过才改 `done`；否则改 `blocked` 并写明缺什么。
3. 提交，提交信息带步骤 ID，例如 `feat(H1): 主题三态基线`。
4. 归档：`npm run session:save -- "H1 · 主题三态基线" done "<证据摘要>"`。
5. 填写「交接摘要」对应行，三列都要有内容。

### 交接摘要格式

- **已完成**：本步实际交付了什么（对应到具体路径与命令）。
- **已定契约**：下一步必须遵守的接口、命名、数据结构、配置键。
- **下一步前置**：下一个会话开始前必须存在的文件、命令或决策。

## 总览

| 步骤 | 主题 | 依赖 | 主要产出 | 状态 |
| --- | --- | --- | --- | --- |
| H0 | 阶段 3 规划与决策确认 | — | 本文、决策表、索引登记 | done |
| H1 | 主题三态基线 | H0 确认 | `features/ui/theme.ts`、`ThemeSwitcher`、slice/store/layout 调整、首屏脚本 | todo |
| H2 | 六模块主导航与页脚 | H1 | `SiteHeader` 重写、移动菜单、页脚快捷链接 | todo |
| H3 | 模块落地页与路由 | H2 | `moduleCatalog`、`ModuleLandingPage`、五条新路由 | todo |
| H4 | 混合式首页 | H3 | `HomePage` 区块重排、探索空间、保留三态 | todo |
| H5 | 响应式与质量收口 | H4 | 1280/768/375、键盘、焦点、完整测试 | todo |
| H6 | 文档同步与出口验收 | H5 | 设计/需求/changelog/README 同步、验收记录 | todo |

## H0 · 阶段 3 规划与决策确认

**目标**：在改业务代码前，把首页定位、导航结构、主题策略、模块入口与验收方式固化成文档。

**任务**

- [x] 建立本文档，记录范围、前置条件、决策与步骤。
- [x] 登记 `docs/README.md` 的「01 · 需求与路线」索引。
- [x] 在 `docs/08-governance/changelog.md` 记录阶段 3 计划。
- [ ] 与产品侧确认 D4–D7；确认前 H1–H6 保持 `todo`，不修改业务代码。

**产出**：阶段 3 的文档契约；本步不修改业务代码。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 工作区 | `git status --porcelain` | 仅文档、索引与 changelog 改动 |
| 构建不受影响 | `npm run build` | 通过 |
| 静态检查 | `npm run lint` | 通过（允许既有 shadcn warning） |
| 索引 | 人工检查 `docs/README.md` | 可跳转到本文 |

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

## H4 · 混合式首页

**目标**：在保留博客入口的同时，增加工具、广场、学习、热点的探索区。

**任务**

- [ ] 区块顺序：Hero + 重点 aside → BackendStatus → 最新文章 + 阅读台账 → 探索空间 → 内容板块 → 统计条。
- [ ] 保留现有 h1 文案「把知识整理成可继续前进的东西。」、双 CTA、Quick summary。
- [ ] 保留 `useAsyncData(listRecentNotes)` 的 loading / empty / error 与重试。
- [ ] 探索空间四张卡：`/tools`、`/playground`、`/learn`、`/feeds`，使用 `Wrench`、`Sparkles`、`GraduationCap`、`Flame` 图标。
- [ ] 按 D6 移除「引用块 / 内容方向 / 写作方向」三个长区块；如否决则保留。
- [ ] 保留六张分类卡与统计条。
- [ ] 更新 `src/app/routes.test.tsx`、`src/app/states.test.tsx` 中受影响的首页断言。

**产出**：混合式首页，信息层级清晰、三态与 CTA 正常。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run` | 首页相关测试通过 |
| 区块 | 人工检查 | Hero、最新文章、探索空间、内容板块、统计条均存在 |
| 三态 | 切换 repository `success/error/empty` | 精选区分别显示文章、错误+重试、空态+下一步 |
| CTA | 点击 Hero、分类、探索空间 | 均进入正确路由 |
| 响应式 | 1280 / 768 / 375 | 无横向滚动，主要区块可读 |

**回退**：恢复旧首页区块；导航、主题与模块页不受影响。

## H5 · 响应式与质量收口

**目标**：确认新导航、首页与落地页在三种宽度和键盘操作下可用。

**任务**

- [ ] 1280 / 768 / 375 检查横向溢出、导航折叠、卡片网格。
- [ ] 键盘 Tab 顺序与焦点可见性。
- [ ] `prefers-reduced-motion` 下无夸张动效。
- [ ] 主题切换后文本与表面颜色对比度正常。
- [ ] 修复测试与样式问题，确保完整测试通过。

**产出**：可交付的响应式与可访问性基线。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run` | 全部通过 |
| 响应式 | 1280 / 768 / 375 | `scrollWidth ≤ innerWidth` |
| 键盘 | 主流程 | 导航、主题、文章与模块入口均可键盘完成 |
| 动效 | `prefers-reduced-motion: reduce` | 过渡与滚动动效被抑制 |

**回退**：按问题单独修复；不改变既定信息架构。

## H6 · 文档同步与出口验收

**目标**：让文档、测试与实现一致，完成阶段 3 出口。

**任务**

- [ ] 更新 `docs/03-design/page-specifications.md`：首页区块、六模块 IA、落地页状态。
- [ ] 更新 `docs/03-design/design-system.md`：主题三态与偏好/生效主题说明。
- [ ] 更新 `docs/08-governance/changelog.md`：H0–H6 的 Added/Changed。
- [ ] 更新 `docs/README.md`：索引与测试基线数字（如变化）。
- [ ] 在本文补 H0–H6 验收记录与交接摘要，状态改为 `done`。
- [ ] 执行 GH1–GH6 出口门禁。

**产出**：阶段 3 文档闭环与验收证据。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建/检查 | `npm run build`、`npm run lint` | 通过 |
| 测试 | `npm run test:run` | 全部通过 |
| 文档 | 人工核对索引、设计文档、changelog、本文 | 与实际一致 |
| 验收记录 | 人工检查 | 每步有命令与输出摘要 |
| 出口 | GH1–GH6 | 全部勾选 |

**回退**：文档与代码分开提交，可分别回退。

## 阶段出口

H0–H6 全部 `done` 后执行一次整体验收：

- [ ] **GH1 文档契约**：本文、`README.md`、设计文档与 changelog 一致；路由表与实际一致。
- [ ] **GH2 主题**：浅/深/跟随系统三态可用；持久化、系统跟随、首屏无闪烁。
- [ ] **GH3 导航**：六模块全部可达；激活态、移动菜单、关于/GitHub/主题可用。
- [ ] **GH4 首页**：混合式区块完整；最新文章三态与 CTA 正常；无死链。
- [ ] **GH5 质量**：`npm run build`、`npm run lint`、`npm run test:run` 全通过。
- [ ] **GH6 文档**：索引、changelog、验收记录、交接摘要与实际一致。

阶段 3 出口只证明**首页与全局入口基线可用**，不证明工具、热点、MVP 的业务能力完成。

## 验收记录

| 日期 | 步骤 | 命令 | 结果 | 遗留 |
| --- | --- | --- | --- | --- |
| 2026-11-09 | H0 | `git status --porcelain` | 仅 `docs/01-requirements/delivery-plan-phase3.md`、`docs/README.md`、`docs/08-governance/changelog.md` | 无 |
| 2026-11-09 | H0 | `npm run build` | 通过：`✓ built in 640ms`；CSS 48.83 kB、JS 439.31 kB | 无 |
| 2026-11-09 | H0 | `npm run lint` | 退出码 0；仅既有 `src/components/ui/button.tsx:66` shadcn 警告 | 无 |
| 2026-11-09 | H0 | 索引 | `docs/README.md` 已登记本文并可跳转 | 待产品确认 D4–D7；确认前不启动 H1 |

## 交接摘要

| 步骤 | 已完成 | 已定契约 | 下一步前置 |
| --- | --- | --- | --- |
| H0 | 建立阶段 3 交付计划、决策表、路由表、H0–H6 步骤与 GH1–GH6 出口；`docs/README.md` 索引与 changelog 已登记；`npm run build` / `npm run lint` 通过 | 步骤前缀 `H0–H6`；出口门禁 `GH1–GH6`；六模块路径 `/`、`/notes`、`/docs`、`/tools`、`/playground`、`/learn`；热点 `/feeds` 仅从首页进入；主题存储键继续为 `blog-theme` | 待产品确认 D4–D7，并由产品侧以 `/step H1` 指定后启动；现有测试仍按两态主题与 7 项导航，H1/H2 需同步更新 |
| H1 |  |  |  |
| H2 |  |  |  |
| H3 |  |  |  |
| H4 |  |  |  |
| H5 |  |  |  |
| H6 |  |  |  |

## 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 占位页被误认为已上线 | 用户预期落空 | 所有未实现条目带状态徽标与页脚说明，不提供可点击假入口 |
| 主题闪烁 | 刷新时浅色闪白 | `index.html` 内联脚本 + `main.tsx` 双重兜底；`blog-theme` 键不变 |
| 旧导航项可发现性下降 | 分类/文库/归档/作者入口变深 | 路由保留，页脚提供快捷链接 |
| 现有测试耦合两态主题与 7 项导航 | 测试失败阻塞 | H1/H2 同步更新 `theme.test.tsx` 与 `accessibility.test.tsx` |
| 首页区块过多 | 信息密度下降 | 按 D6 移除三个长区块；探索空间控制在四张卡 |
| 范围扩张 | 工具/热点/MVP 被提前实现 | 本阶段只做入口与状态，业务功能按各自 PRD 排期 |

## 变更规则

- 增删步骤必须同步修改本文总览、阶段出口与 `docs/08-governance/changelog.md`。
- 验收项变化同步 `docs/05-quality/acceptance-criteria.md`。
- 决策 D4–D7 如被否决，先改本文决策表与受影响步骤，再调整实现。
- 本计划不改变路线图的业务阶段划分；工具、热点、MVP 仍按各自 PRD 单独排期。
