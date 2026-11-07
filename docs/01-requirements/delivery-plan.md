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
| S1 | 后端 walking skeleton | S0 | `src-dotnet/` 解决方案、健康检查、OpenAPI | PLAT-02、PLAT-05、PLAT-06 | todo |
| S2 | EF Core 最小模型 | S1 | `Note` 实体、`AppDbContext`、首个迁移 | PLAT-03 | todo |
| S3 | 前端工程化补齐 | S0 | Tailwind + shadcn/ui、`@/` 别名、目录重构 | PLAT-01、PLAT-11 | todo |
| S4 | 接通契约 | S1、S3 | `src/api-client` 生成、前端调用健康接口 | PLAT-04 | todo |
| S5 | CI 与发布门禁 | S1、S4 | 前后端构建测试流水线 | PLAT-07 | todo |

S2 与 S3 互不依赖，可放在不同会话里并行推进；S4 必须等两者都完成。

## S0 · 固化文档基线

**目标**：先把文档与规约落成一个可回退的提交，后续代码改动不夹带文档漂移。

**任务**

- [ ] 确认工作区只有文档类改动（`git status`）。
- [ ] 按目录分组提交；提交信息说明结构与技术基线变更。
- [ ] 确认提交后工作区干净。

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

- [ ] 创建 `src-dotnet/Zane.sln`、`Zane.Api`（Minimal APIs）、`Zane.Api.Tests`（xUnit）。
- [ ] 测试项目引用 API 项目，`dotnet test` 可执行。
- [ ] `GET /api/v1/health` 返回 `TypedResults`，数据库不可用时 503。
- [ ] 接入 `AddOpenApi()` / `MapOpenApi()`，暴露 `/openapi/v1.json`。
- [ ] 统一 ProblemDetails 与 `IExceptionHandler`。
- [ ] 请求模型使用 `AddValidation()` + DataAnnotations（至少一个示例端点）。
- [ ] 至少一条健康检查测试。

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

- [ ] `Note` 实体 + `IEntityTypeConfiguration<Note>`。
- [ ] `AppDbContext` 注册到 DI，连接串走配置。
- [ ] 首个迁移 `InitialCreate`，可在空库建表。
- [ ] SQLite 启用 WAL、`foreign_keys`、`busy_timeout`。
- [ ] 时间统一 UTC，使用 `TimeProvider` 取时。
- [ ] 健康检查加入数据库探针。

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

- [ ] 安装并配置 Tailwind（`@tailwindcss/vite`）。
- [ ] 配置 `@/` 别名（`tsconfig` + `vite.config.ts`）。
- [ ] `npx shadcn@latest init`，落地 `components.json` 与 `src/lib/utils.ts`。
- [ ] 按需 `npx shadcn@latest add` 首批组件（button、card、input）。
- [ ] 把 `App.tsx` 拆到 `app/`、`features/`、`components/`。
- [ ] 现有页面视觉与交互不回归。

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

- [ ] 确定生成工具（`openapi-typescript` 或 Kiota）并写入脚本。
- [ ] 生成物落到 `src/api-client/`，纳入版本控制。
- [ ] 前端通过生成客户端调用健康接口。
- [ ] 页面展示后端状态（成功 / 失败 / 加载中）。
- [ ] 后端端点变更时重新生成，脚本可一条命令完成。

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

- [ ] CI 增加 `dotnet build` 与 `dotnet test`。
- [ ] 保留前端 `npm ci` + `npm run build` + `npm run lint`。
- [ ] 后端 `dotnet publish` 产物进入发布流程。
- [ ] 更新 [`../06-release/deployment.md`](../06-release/deployment.md) 的实际路径与命令。
- [ ] 发布前检查清单补充迁移演练。

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

- [ ] **G1 结构**：`src/`、`src-dotnet/`、`src/api-client/` 同时存在且可独立构建。
- [ ] **G2 构建**：`npm run build`、`npm run lint`、`dotnet build`、`dotnet test` 全部通过。
- [ ] **G3 契约**：OpenAPI 可访问，生成客户端与后端端点一致。
- [ ] **G4 数据**：空库可迁移建表，写入数据重启后仍在。
- [ ] **G5 健康**：数据库可用返回 200，不可用返回 503。
- [ ] **G6 错误模型**：异常与校验失败均返回 ProblemDetails。
- [ ] **G7 文档一致**：`docs/README.md` 索引、backlog 状态、changelog 与实际一致。
- [ ] **G8 可发布**：CI 通过对应用例，回滚步骤可执行。

阶段 1 出口只证明**骨架可用**，不证明 PRD-01 的记录功能完成；记录 CRUD 按 `feature-backlog.md` 的 NOTE-01～03 继续推进。

## 交接摘要

每个步骤结束时由该会话填写，下一会话开始前必须先读对应行。

| 步骤 | 已完成 | 已定契约 | 下一步前置 |
| --- | --- | --- | --- |
| S0 | 已按目录分组提交：`.gitignore`、`.ai/`+`.claude/`、根入口文档（README/AGENTS/CLAUDE）、`docs/` 重组，共 4 次提交 | 后续每步提交单独成次且信息带步骤 ID（如 `feat(S1): …`）；文档入口为 `docs/README.md`，交付计划为 `docs/01-requirements/delivery-plan.md` | 工作树干净；本机 .NET SDK 10.0.403 可用；S1 需新建 `src-dotnet/Zane.sln`、`Zane.Api`、`Zane.Api.Tests` |
| S1 | 待填写 | 待填写 | 待填写 |
| S2 | 待填写 | 待填写 | 待填写 |
| S3 | 待填写 | 待填写 | 待填写 |
| S4 | 待填写 | 待填写 | 待填写 |
| S5 | 待填写 | 待填写 | 待填写 |

## 验收记录

| 日期 | 步骤 | 命令 | 结果 | 遗留 |
| --- | --- | --- | --- | --- |
| 2026-11-07 | S0 | `git status --porcelain` | 无输出，工作区干净 | 无 |
| 2026-11-07 | S0 | `git log -1 --stat` | `51ae210 docs(S0): 文档按生命周期目录重组并移除旧目录`，61 个文件全部为 `docs/` 下文档 | 无 |

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
