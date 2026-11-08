# 阶段 1 交付计划（步骤 0–5）

本文管理阶段 1「平台迁移与记录能力」的落地顺序与验收门禁。路线图定义阶段目标，本文定义**可执行的步骤、产出与验收证据**。

## 使用方式

- 状态取值：`todo` / `doing` / `done` / `blocked` / `dropped`。
- 每步开始前把状态改为 `doing`；完成后补「验收记录」并改为 `done`。
- **一步未通过验收，不开始下一步的主要工作**；允许在同一步内返工。
- 验收证据写命令与实际输出摘要，不写「已验证」这类无证据结论。
- 步骤只覆盖阶段 1 的骨架与记录能力；鉴权、社交分发不在范围内（ADR-007、ADR-008）。

## 会话边界（一步一会话）

每个步骤单独开一个会话，不把多个步骤塞进同一段上下文。会话之间**不依赖聊天记忆**，只依赖四个落盘载体：

| 载体 | 作用 | 写入时机 |
| --- | --- | --- |
| Git 提交 | 代码与文档的唯一事实 | 步骤结束时 |
| 本文「总览」与「验收记录」 | 进度与验收证据 | 开始与结束时 |
| 「交接摘要」 | 下一步的已定契约与前置 | 结束时 |
| `.ai/` 归档 | 会话级摘要 | 结束时 |

### 开工（新会话第一句话）

```text
读 docs/01-requirements/delivery-plan.md 与 AGENTS.md，执行 S1。
先核对进入条件，把 S1 状态改为 doing，再按任务清单实现；
结束时按验收表逐条跑命令，更新状态、验收记录与交接摘要。
```

Claude Code 中可直接用 `/step S1`，模板在 [`../../.claude/commands/step.md`](../../.claude/commands/step.md)。

### 收工清单

1. 按该步骤「验收」表逐条执行命令，记录真实输出摘要。
2. 全部通过才改 `done`；否则改 `blocked` 并写明缺什么。
3. 提交，提交信息带步骤 ID，例如 `feat(S1): 后端 walking skeleton`。
4. 归档：`npm run session:save -- "S1 · 后端 walking skeleton" done "dotnet build/test 通过，health 200"`。
5. 填写「交接摘要」的对应行，三行都要有内容。

### 交接摘要格式

- **已完成**：本步实际交付了什么（对应到具体路径与端点）。
- **已定契约**：下一步必须遵守的接口、命名、数据结构、配置键。
- **下一步前置**：下一个会话开始前必须存在的文件、命令或决策。

## 总览

| 步骤 | 主题 | 依赖 | 主要产出 | 对应需求 | 状态 |
| --- | --- | --- | --- | --- | --- |
| S0 | 固化文档基线 | — | 文档基线提交 | PLAT-01 | done |
| S1 | 后端 walking skeleton | S0 | `src-dotnet/` 解决方案、健康检查、OpenAPI | PLAT-02、PLAT-05、PLAT-06 | done |
| S2 | EF Core 最小模型 | S1 | `Note` 实体、`AppDbContext`、首个迁移 | PLAT-03 | done |
| S3 | 前端工程化补齐 | S0 | Tailwind + shadcn/ui、`@/` 别名、目录重构 | PLAT-01、PLAT-11 | done |
| S4 | 接通契约 | S1、S3 | `src/api-client` 生成、前端调用健康接口 | PLAT-07、PLAT-09 | done |
| S5 | CI 与发布门禁 | S1、S4 | 前后端构建测试流水线 | PLAT-12 | done |

S2 与 S3 互不依赖，可放在不同会话里并行推进；S4 必须等两者都完成。

## S0 · 固化文档基线

**目标**：先把文档与规约落成一个可回退的提交，后续代码改动不夹带文档漂移。

**任务**

- [x] 确认工作区只有文档类改动（`git status`）。
- [x] 按目录分组提交；提交信息说明结构与技术基线变更。
- [x] 确认提交后工作区干净。

**产出**：一个只含文档的基线提交。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 工作区干净 | `git status --porcelain` | 无输出 |
| 提交存在 | `git log -1 --stat` | 只包含文档与配置文件 |

**回退**：`git revert` 该提交；不修改历史。

## S1 · 后端 walking skeleton

**目标**：先让「进程启动 → 健康检查 → OpenAPI → 测试」这条链路跑通，再谈业务。

**任务**

- [x] 创建 `src-dotnet/Zane.sln`、`Zane.Api`（Minimal APIs）、`Zane.Api.Tests`（xUnit）。
- [x] 测试项目引用 API 项目，`dotnet test` 可执行。
- [x] `GET /api/v1/health` 返回 `TypedResults`，数据库不可用时 503。
- [x] 接入 `AddOpenApi()` / `MapOpenApi()`，暴露 `/openapi/v1.json`。
- [x] 统一 ProblemDetails 与 `IExceptionHandler`。
- [x] 请求模型使用 `AddValidation()` + DataAnnotations（至少一个示例端点）。
- [x] 至少一条健康检查测试。

**产出**：可 `dotnet run` 的 API 骨架与可执行的测试项目。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建 | `dotnet build src-dotnet/Zane.sln` | 0 error |
| 测试 | `dotnet test src-dotnet/Zane.sln` | 全部通过 |
| 健康检查 | `curl -i http://localhost:5000/api/v1/health` | 200 + JSON |
| 契约 | `curl -s http://localhost:5000/openapi/v1.json` | 含 health 端点 |
| 错误模型 | 触发一个异常端点 | `application/problem+json` |

**回退**：删除 `src-dotnet/`，不影响现有前端。

## S2 · EF Core 最小模型

**目标**：让数据结构由迁移管理，健康检查反映真实数据库状态。

**任务**

- [x] `Note` 实体 + `IEntityTypeConfiguration<Note>`。
- [x] `AppDbContext` 注册到 DI，连接串走配置。
- [x] 首个迁移 `InitialCreate`，可在空库建表。
- [x] SQLite 启用 WAL、`foreign_keys`、`busy_timeout`。
- [x] 时间统一 UTC，使用 `TimeProvider` 取时。
- [x] 健康检查加入数据库探针。

**产出**：`src-dotnet/Zane.Api/Data/`、`Migrations/` 与迁移命令可复现。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 迁移生成 | `dotnet ef migrations add InitialCreate --project src-dotnet/Zane.Api` | 生成迁移文件且无警告 |
| 空库建表 | `dotnet ef database update --project src-dotnet/Zane.Api` | 成功，`__EFMigrationsHistory` 有记录 |
| 持久化 | 写入一条记录后重启进程再读 | 数据仍在 |
| 健康检查 | 断开数据库文件权限后请求 health | 503 |

**回退**：删除本地 `.db` 文件并回退迁移提交；线上未部署前无数据风险。

## S3 · 前端工程化补齐

**目标**：现有页面外观不变，但具备后续开发所需的样式与组件基线。

**任务**

- [x] 安装并配置 Tailwind（`@tailwindcss/vite`）。
- [x] 配置 `@/` 别名（`tsconfig` + `vite.config.ts`）。
- [x] `npx shadcn@latest init`，落地 `components.json` 与 `src/lib/utils.ts`。
- [x] 按需 `npx shadcn@latest add` 首批组件（button、card、input）。
- [x] 把 `App.tsx` 拆到 `app/`、`features/`、`components/`。
- [x] 现有页面视觉与交互不回归。

**产出**：符合 [`../02-architecture/frontend-architecture.md`](../02-architecture/frontend-architecture.md) 的目录结构。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 构建 | `npm run build` | 通过 |
| 静态检查 | `npm run lint` | 通过 |
| 组件来源 | 检查 `src/components/ui/` | 来自 shadcn CLI，已入库 |
| 视觉 | 本地 `npm run dev` 打开首页 | 与改版前一致 |

**回退**：目录重构单独提交，可按提交回退而不影响样式引入。

## S4 · 接通契约

**目标**：前端类型不再手写，全部来自服务端 OpenAPI。

**任务**

- [x] 确定生成工具（`openapi-typescript` 或 Kiota）并写入脚本。
- [x] 生成物落到 `src/api-client/`，纳入版本控制。
- [x] 前端通过生成客户端调用健康接口。
- [x] 页面展示后端状态（成功 / 失败 / 加载中）。
- [x] 后端端点变更时重新生成，脚本可一条命令完成。

**产出**：`src/api-client/` 与一个真实调用后端的前端界面。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 重新生成 | `npm run api:generate` | 无 diff 或 diff 仅反映后端改动 |
| 联调 | 同时启动前后端，打开页面 | 显示后端健康状态 |
| 降级 | 停掉后端后刷新 | 显示错误态，不白屏 |
| 类型来源 | 搜索手写 `fetch(` 调用 | 仅存在于客户端封装内 |

**回退**：删除生成物并回退脚本改动；后端不受影响。

## S5 · CI 与发布门禁

**目标**：把本地验收固化为流水线，避免「本地能过、合并后挂」。

**任务**

- [x] CI 增加 `dotnet build` 与 `dotnet test`。
- [x] 保留前端 `npm ci` + `npm run build` + `npm run lint`。
- [x] 后端 `dotnet publish` 产物进入发布流程。
- [x] 更新 [`../06-release/deployment.md`](../06-release/deployment.md) 的实际路径与命令。
- [x] 发布前检查清单补充迁移演练。

**产出**：可复现的 CI 配置与对齐的发布文档。

**验收**

| 检查 | 命令 | 预期 |
| --- | --- | --- |
| 流水线 | 推送测试提交到分支 | 前后端步骤全部通过 |
| 失败可见 | 故意引入编译错误 | 流水线失败且指出位置 |
| 文档一致 | 对照 CI 配置检查发布文档 | 命令与路径一致 |

**回退**：回退工作流文件；发布脚本与文档同时回退。

## 阶段验收（阶段 1 出口）

六步全部 `done` 后执行一次整体验收，结果写入本文「验收记录」。

- [x] **G1 结构**：`src/`、`src-dotnet/`、`src/api-client/` 同时存在且可独立构建。
- [x] **G2 构建**：`npm run build`、`npm run lint`、`dotnet build`、`dotnet test` 全部通过。
- [x] **G3 契约**：OpenAPI 可访问，生成客户端与后端端点一致。
- [x] **G4 数据**：空库可迁移建表，写入数据重启后仍在。
- [x] **G5 健康**：数据库可用返回 200，不可用返回 503。
- [x] **G6 错误模型**：异常与校验失败均返回 ProblemDetails。
- [x] **G7 文档一致**：`docs/README.md` 索引、backlog 状态、changelog 与实际一致。
- [x] **G8 可发布**：CI 通过对应用例，回滚步骤可执行。

阶段 1 出口只证明**骨架可用**，不证明 PRD-01 的记录功能完成；记录 CRUD 按 `feature-backlog.md` 的 NOTE-01～03 继续推进。

## 交接摘要

每个步骤结束时由该会话填写，下一会话开始前必须先读对应行。

| 步骤 | 已完成 | 已定契约 | 下一步前置 |
| --- | --- | --- | --- |
| S0 | 已按目录分组提交：`.gitignore`、`.ai/`+`.claude/`、根入口文档（README/AGENTS/CLAUDE）、`docs/` 重组，共 4 次提交 | 后续每步提交单独成次且信息带步骤 ID（如 `feat(S1): …`）；文档入口为 `docs/README.md`，交付计划为 `docs/01-requirements/delivery-plan.md` | 工作树干净；本机 .NET SDK 10.0.403 可用；S1 需先移除 `.gitignore` 中的 `*.sln` 规则，再新建 `src-dotnet/Zane.sln`、`Zane.Api`、`Zane.Api.Tests` |
| S1 | `src-dotnet/Zane.sln`（.sln 格式）、`Zane.Api`（`/api/v1/health`、`/openapi/v1.json`、ProblemDetails + `IExceptionHandler`、`AddValidation()` 示例端点）、`Zane.Api.Tests`（xUnit 5 条）、仓库级 `NuGet.Config`；`.gitignore` 移除 `*.sln`、忽略 `bin/`/`obj/` | 端口 5000；健康响应 `{status,service,checkedAtUtc}`；错误统一 `application/problem+json`；示例端点仅在非 Production 映射于 `/api/v1/samples/*`；`IDatabaseHealthProbe` 是数据库探针扩展点；`public partial class Program` 供测试宿主 | S2 注册 `AppDbContext` 并移除 `PlaceholderDatabaseHealthProbe`，让健康检查走真实数据库探针；连接串走配置；`dotnet ef` 工具可用 |
| S2 | `Domain/Note.cs`（`Guid` v7、UTC `DateTimeOffset`、`TimeProvider`）、`Data/AppDbContext.cs`、`NoteConfiguration`、`SqlitePragmaInterceptor`、`DatabaseHealthProbe`、`Migrations/InitialCreate`；根目录 `dotnet-tools.json` 固定 `dotnet-ef` 10.0.14 | 表 `notes`（`id,title,content_md,status,created_at,updated_at,published_at`）；状态以字符串存 `Draft/Published/Archived`；时间统一 UTC；连接串键 `ConnectionStrings:Default`；`AddDataAccess()` 在解析 `DbContext` 时读配置；WAL / `foreign_keys=ON` / `busy_timeout=5000` 由连接拦截器应用；健康检查 `CanConnectAsync` 失败返回 503 | S2 完成，S3（前端）可独立开始；部署或本地运行前先 `dotnet ef database update`，否则健康检查 503；`dotnet ef` 为本地工具，克隆后需 `dotnet tool restore` |
| S3 | Tailwind CSS v4（`@tailwindcss/vite`，仅 `theme` + `utilities` 层）、`@/` 别名（`vite.config.ts` + `tsconfig.app.json`）、shadcn/ui 初始化（`components.json`、`src/lib/utils.ts`）与 `button`/`card`/`input`；目录重构为 `src/app/`、`src/components/{layout,ui}/`、`src/features/notes/{components,content}/` 与 `data.ts`/`types.ts`/`utils.tsx`、`src/styles/{index.css,app.css}` | 路径别名 `@/` = `src/`；样式入口顺序 `index.css` → `app.css`，`app.css` 保持无 `@layer` 以覆盖 Tailwind 与 shadcn token；`--card/--border/--accent` 等同名 token 由 `app.css` 后加载胜出；不引入 Tailwind preflight，`@layer base` 仅保留 box-sizing/border 最小重置；shadcn 组件源码入库，`cn` 来自 `cn` 包 | S4 依赖 S1、S3 均完成；需要在 `src/api-client/` 生成类型并让前端调用 `/api/v1/health`；后端端口 5000，前端尚未配置 `/api` 代理，S4 一并处理 |
| S4 | `src/api-client/`：`Zane.Api.json`（后端构建时由 `Microsoft.Extensions.ApiDescription.Server` 输出）、`schema.ts`（`openapi-typescript` 生成）、`client.ts`（唯一 `fetch` 封装，含超时与 `ApiError`）；`npm run api:generate` 一条命令重建；首页新增 `BackendStatus` 展示加载/成功/失败；Vite dev 代理 `/api` → `http://localhost:5000` | 生成器为 `openapi-typescript@7.13.0`，因项目用 TypeScript 7，经 `npx` 同时固定 `typescript@5.9.3` 运行；生成物入库、不手改；API 基址 `VITE_API_BASE_URL`（默认为空，同源 `/api`）；HTTP 失败抛 `ApiError`（携带 ProblemDetails），网络失败由调用方捕获 | S5 需同时具备 .NET SDK 与 Node；CI 中 `npm run api:generate` 首次会联网拉取固定的 npx 包，并需校验生成后无 diff；生产由 Nginx 反代 `/api` 到后端 |
| S5 | 新增 `.github/workflows/ci.yml`：`frontend`（`npm ci`/`lint`/`build`）、`backend`（restore/build/test Release）、`contract`（`npm run api:generate` 后 `git diff --exit-code src/api-client`）、`migration`（待迁移模型检查 + 空库两次 `database update`）、`package`（仅 main push：`dotnet publish` + 自包含 `efbundle`，上传 `zane-api` 14 天）；`deploy.yml` Node 20→24；`npm run release:check` 扩为前后端 build/test + 迁移演练；示例端点加 `ExcludeFromDescription()` 修复契约随宿主环境漂移；`docs/06-release/deployment.md` 改为按 artifact 发布 | Node 24、.NET SDK 10.0.x；artifact 名 `zane-api`，含 `publish/api` 与 `efbundle`；契约以 `src/api-client` 为准，生成物不含 samples；生产路径 `/opt/zane/api`、数据库 `/var/lib/zane/zane.db`、端口 `127.0.0.1:5080`；迁移用 `cd /opt/zane/api && ./efbundle --connection "Data Source=/var/lib/zane/zane.db"` | 首次 `main` push 后确认 `package` job 与 artifact 可下载；生产机安装 .NET 10 Runtime；下一步进入阶段 1 出口验收 G1–G8 |

## 验收记录

| 日期 | 步骤 | 命令 | 结果 | 遗留 |
| --- | --- | --- | --- | --- |
| 2026-11-07 | S0 | `git status --porcelain` | 无输出，工作区干净 | 无 |
| 2026-11-07 | S0 | 检查 `.gitignore` | 含 `*.sln` 规则，会忽略 `src-dotnet/Zane.sln` | S1 创建解决方案前先移除该规则，否则解决方案文件无法入库 |
| 2026-11-07 | S0 | `npm run session:save -- "S0 · 固化文档基线" done "…"` | 输出 `Archived session entry: S0 · 固化文档基线 (done)`，归档提交 `77f13df` | 无 |
| 2026-11-07 | S1 | `dotnet build src-dotnet/Zane.sln` | 0 warning，0 error | 无 |
| 2026-11-07 | S1 | `dotnet test src-dotnet/Zane.sln` | 失败 0，通过 5，总计 5 | 503 分支由占位探针 + 测试覆盖，真实数据库探针在 S2 |
| 2026-11-07 | S1 | `curl -i http://localhost:5000/api/v1/health` | `HTTP/1.1 200 OK`，`application/json`，`{"status":"healthy","service":"zane-api",...}` | 无 |
| 2026-11-07 | S1 | `curl -s http://localhost:5000/openapi/v1.json` | `200`，文档含 `"/api/v1/health"` | OpenAPI 在所有环境暴露，供 S4 生成客户端 |
| 2026-11-07 | S1 | `curl -i http://localhost:5000/api/v1/samples/throw`（`ASPNETCORE_ENVIRONMENT=Testing`） | `500`，`application/problem+json`，含 type/title/status/detail/traceId | Development 下自动 DeveloperExceptionPage 返回 HTML；异常验收须用非 Development 环境 |
| 2026-11-07 | S1 | `POST /api/v1/samples/echo`，`{"message":""}` | `400`，`application/problem+json`，`errors.Message` 命中校验 | 无 |
| 2026-11-07 | S1 | 首次 `dotnet restore` | 全局 NuGet 含不可达 `http://localhost:9090`，报 NU1301；新增仓库级 `NuGet.Config` 固定 nuget.org 后 restore 通过 | 仓库根新增 `NuGet.Config`，后续 CI 同样使用 |
| 2026-11-07 | S2 | `dotnet ef migrations add InitialCreate --project src-dotnet/Zane.Api` | `Build succeeded.` / `Done.`，无警告；生成 `20261107065027_InitialCreate` | `dotnet ef` 为本地工具 10.0.14，克隆后需 `dotnet tool restore` |
| 2026-11-07 | S2 | `dotnet ef database update --project src-dotnet/Zane.Api` | 建表成功；`__EFMigrationsHistory` 记录 `20261107065027_InitialCreate / 10.0.14` | 每次启动前须先迁移，否则健康检查 503 |
| 2026-11-07 | S2 | sqlite3 进程 A 写入，进程 B 读取 | A 写入 `持久化验证`；B 读到 `持久化验证 / Draft`，数据仍在 | EF 侧由 `Note_PersistsAcrossDbContextRestarts` 覆盖 |
| 2026-11-07 | S2 | `dotnet test src-dotnet/Zane.sln` | 失败 0，通过 7，总计 7 | 含真实数据库探针 503 测试 |
| 2026-11-07 | S2 | `curl -i http://localhost:5000/api/v1/health`（数据库可用） | `200`，`{"status":"healthy",...}` | 无 |
| 2026-11-07 | S2 | `curl -i .../health`（`ConnectionStrings__Default` 指向不存在目录） | `503`，`application/problem+json`，`数据库不可用，健康检查失败。` | 以不可达路径模拟数据库不可用；Windows 下未改文件 ACL |
| 2026-11-07 | S2 | `PRAGMA journal_mode` / `.tables` | `wal`；`notes`、`__EFMigrationsHistory`、`__EFMigrationsLock` 存在 | 无 |
| 2026-11-07 | S0 | `git log -1 --stat` | `51ae210 docs(S0): 文档按生命周期目录重组并移除旧目录`，61 个文件全部为 `docs/` 下文档 | 无 |
| 2026-11-07 | S3 | `npm run build` | `tsc -b && vite build` 通过，`✓ built in 244ms`；`index-DPNO8Els.css` 47.05 kB、`index-6uUyav89.js` 261.19 kB | 无 |
| 2026-11-07 | S3 | `npm run lint` | 退出码 0；仅 `src/components/ui/button.tsx:66` 的 `react(only-export-components)` 警告 | 警告来自 shadcn 生成物，按上游原样保留 |
| 2026-11-07 | S3 | 检查 `src/components/ui/` | `button.tsx`、`card.tsx`、`input.tsx` 由 `npx shadcn@latest add button card input` 生成，`components.json` 与 `src/lib/utils.ts` 一并入库 | 无 |
| 2026-11-07 | S3 | `npm run dev` | `http://localhost:5173/` 启动成功并返回 200 | 无 |
| 2026-11-07 | S3 | 视觉（本地 `npm run dev`） | 本机无可用无头截图（Edge headless 无输出、Playwright 浏览器 CDN 下载超时），改用 Vite SSR 渲染比对：改造前后首页 HTML **逐字节一致**（6833 字符）；`src/styles/app.css` 与改版前 `src/App.css` 逐字节一致；Tailwind 仅引入 theme/utilities，未引入会重置标题/列表/段落默认样式的 preflight | 建议人工再目视复核一次；页面视觉未做像素级截图回归 |
| 2026-11-07 | S3 | 构建产物 CSS 层序 | 产物含 `@layer theme/base/components/utilities`；`:root` 中 `--card` 先为 shadcn `oklch`，后为 `app.css` 的 `#fffaf1`，旧主题 token 胜出 | 无 |
| 2026-11-07 | S4 | `dotnet build src-dotnet/Zane.Api/Zane.Api.csproj` | 0 warning，0 error；`GenerateOpenApiDocuments` 输出 `src/api-client/Zane.Api.json`（OpenAPI 3.1.1，仅 `/api/v1/health`，无开发期 samples 端点） | 契约文件随普通 `dotnet build` 更新 |
| 2026-11-07 | S4 | `npm run api:generate` | `dotnet build` 通过后生成 `schema.ts`（37ms）；连续两次生成后 `md5sum -c` 两个文件均为 `OK`，无 diff | 生成器固定 `openapi-typescript@7.13.0` + `typescript@5.9.3`（npx），因 Project TS 7 与生成器不兼容 |
| 2026-11-07 | S4 | `dotnet build src-dotnet/Zane.sln` / `dotnet test src-dotnet/Zane.sln` | 构建 0 warning 0 error；测试失败 0，通过 7，总计 7 | 无 |
| 2026-11-07 | S4 | `npm run build` / `npm run lint` | 构建通过（CSS 47.71 kB、JS 262.83 kB）；lint 退出码 0，仅既有 shadcn button 警告 | 无 |
| 2026-11-07 | S4 | 联调：`dotnet run` + `npm run dev`，`curl http://localhost:5173/api/v1/health` | 代理返回 `200`，`{"status":"healthy","service":"zane-api","checkedAtUtc":"2026-11-07T08:10:23…"}`；首页 `200`；SSR 渲染含 `backend-status loading` 与“正在检测后端健康状态…” | 本机无无头浏览器，未做真实浏览器点击；代理、客户端与渲染分支分别验证 |
| 2026-11-07 | S4 | 客户端在线/离线调用 | 在线返回健康 JSON；指向未监听端口时抛 `TypeError: fetch failed`，由 `BackendStatus` 捕获并切换错误态 | 同上 |
| 2026-11-07 | S4 | 降级：停掉后端后请求 | 代理返回 `502`；前端页面仍返回 `200`（不白屏），组件进入错误态 | 无 |
| 2026-11-07 | S4 | `grep -rn "fetch(" src --include=*.ts --include=*.tsx` | 仅 `src/api-client/client.ts:28` 一处手写 `fetch` | 无 |
| 2026-11-07 | S5 | `npm ci && npm run lint && npm run build` | 安装 360 包；lint 退出码 0（仅既有 shadcn button 警告）；`vite build` 通过（CSS 47.71 kB、JS 262.83 kB） | 无 |
| 2026-11-07 | S5 | `dotnet restore && dotnet build -c Release --no-restore && dotnet test -c Release --no-build` | 构建 0 warning 0 error；测试失败 0，通过 7，总计 7 | 无 |
| 2026-11-07 | S5 | `npm run api:generate && git diff --exit-code -- src/api-client` | 生成成功且无 diff；另发现 `dotnet ef` 以 Development 宿主构建会写入 samples 端点，已在 `SampleEndpoints` 加 `ExcludeFromDescription()`，随后 Debug/Release/ef 构建均无 diff | 生成器仍需在 CI 联网拉取固定 npx 包 |
| 2026-11-07 | S5 | `dotnet tool restore && dotnet ef migrations has-pending-model-changes` + 空库连续两次 `dotnet ef database update` | 模型无待生成迁移；第一次应用 `20261107065027_InitialCreate`，第二次输出 `No migrations were applied` | 临时库文件执行后已清理 |
| 2026-11-07 | S5 | `npm run release:check` | 退出码 0，输出 `Release validation succeeded`，写入 `.ai/releases/latest-check.json` | 无 |
| 2026-11-07 | S5 | 推送 `ci/s5-verify`（`620a614`），GitHub Actions run [`42355472575`](https://github.com/warmthlee/zane/actions/runs/42355472575) | 结论 success：前端、后端、OpenAPI 契约一致性、数据库迁移演练 4 个 job 全部通过；`package` 按设计仅 main 运行而跳过 | `package` 已在本机用同一组命令验证 publish + efbundle；首次 main push 后需再确认 artifact |
| 2026-11-07 | S5 | 推送 `ci/s5-failure`（`4db8a81`，含故意编译错误），run [`42355566033`](https://github.com/warmthlee/zane/actions/runs/42355566033) | 结论 failure；后端 job 日志报 `/home/runner/work/zane/zane/src-dotnet/Zane.Api/CompileFailureProbe.cs(7,9): error CS0103`；契约与迁移 job 同因构建失败 | 临时分支 `ci/s5-verify`、`ci/s5-failure` 已删除 |
| 2026-11-07 | S5 | 对照 `ci.yml`/`deploy.yml` 与 `docs/06-release/deployment.md` | Node 24、.NET 10.0.x、各 job 命令、artifact `zane-api`、`/opt/zane/api`、`/var/lib/zane/zane.db`、`127.0.0.1:5080`、`efbundle` 均一致 | 无 |
| 2026-11-07 | 阶段 1 出口 | G1 `test -d src src-dotnet src/api-client` + 独立构建 | 三个目录均存在；前端 `npm run build` 与后端 `dotnet build src-dotnet/Zane.sln` 分别通过 | 无 |
| 2026-11-07 | 阶段 1 出口 | G2 `npm run build && npm run lint` + `dotnet build && dotnet test` | 前端构建 33 modules、lint 退出码 0（仅既有 shadcn 警告）；后端 0 warning 0 error，测试 7/7 通过 | 无 |
| 2026-11-07 | 阶段 1 出口 | G3 启动 API，`curl /openapi/v1.json`，并运行 `npm run api:generate && git diff --exit-code -- src/api-client` | 实时 OpenAPI、已提交 `Zane.Api.json`、`schema.ts` 的 paths 均为 `/api/v1/health`；生成后无 diff | 示例端点已排除在 OpenAPI 之外，不进入契约 |
| 2026-11-07 | 阶段 1 出口 | G4 临时空库 `dotnet ef database update` → `sqlite3` 写入 → 新进程读取 | 迁移应用 `20261107065027_InitialCreate`；新进程读到 `阶段验收 / 持久化验证 / Draft` | 临时库位于系统临时目录，验收后未入库 |
| 2026-11-07 | 阶段 1 出口 | G5 `curl /api/v1/health`（数据库可用 / 指向不存在目录） | 可用返回 `200` 与健康 JSON；不可用返回 `503`、`application/problem+json`、`数据库不可用，健康检查失败。` | 以不存在目录模拟数据库不可用 |
| 2026-11-07 | 阶段 1 出口 | G6 `POST /api/v1/samples/echo`（空 message）与 `GET /api/v1/samples/throw`（Testing 环境） | 校验失败 `400`、异常 `500`，均为 `application/problem+json`，含 type/title/status/detail/traceId | Development 下异常由 DeveloperExceptionPage 处理，验收使用 Testing |
| 2026-11-07 | 阶段 1 出口 | G7 检查 `docs/README.md` 链接、backlog、PRD-00、roadmap、changelog | 索引 55 条链接 0 缺失；修正 README 后端状态、backlog 与 PRD-00 的 PLAT 编号漂移；PLAT-01～07/09/11/12 为 done，08/13 planned，10 deferred；changelog 覆盖 S0–S5 | 修正内容已写入本次验收；`PLAT-08`（结构化日志/追踪）与 `PLAT-13`（备份导出）仍未实现 |
| 2026-11-07 | 阶段 1 出口 | G8 复核 CI run [`42355472575`](https://github.com/warmthlee/zane/actions/runs/42355472575)；运行 `npm run release:rollback`；临时库备份→删除→恢复 | CI 4 个 job success；回滚脚本退出码 0，生成 `.ai/releases/rollback-plan.json`（4 步恢复清单 + latest-check）；数据回滚演练行数 `1 → 0 → 1`，记录恢复 | 未在生产服务器执行 L1/L2 回滚；其依赖服务器保留的上一份 `dist/` 与 publish 产物 |

## 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| shadcn 组件改动上游后难以合并 | 样式分裂 | 组件视为自有代码，改动集中在 `components/ui/`，本项目内不追上游 |
| OpenAPI 生成物频繁 diff | 评审噪音 | 只在端点变更时重新生成，生成物单独提交 |
| EF Core 迁移与线上库不一致 | 启动失败 | 迁移先在副本演练，回滚前确认备份 |
| 前后端同时大改 | 定位困难 | 按步骤提交，每步可独立回退 |

## 变更规则

- 增删步骤必须改本文总览与 `roadmap.md`，并说明理由。
- 验收项变化同步 `../05-quality/acceptance-criteria.md`。
- 步骤完成与新发现写入 `../08-governance/changelog.md`；架构层决策另开 ADR。
