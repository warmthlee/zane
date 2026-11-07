# 开发流程

## 环境要求

- .NET SDK 10（后端）。
- Node.js 22+（前端构建与会话归档脚本）。
- npm（仓库使用 `package-lock.json`）。
- Git。

## 初始化

前端：

```bash
npm install
npm run dev -- --host 0.0.0.0
```

后端（迁移后）：

```bash
dotnet restore
dotnet ef database update --project src-dotnet/Zane.Api
dotnet run --project src-dotnet/Zane.Api
```

## 常用命令

| 命令 | 用途 | 状态 |
| --- | --- | --- |
| `npm run dev` | 前端开发服务器 | 可用 |
| `npm run build` | 前端类型检查 + 构建 | 可用 |
| `npm run lint` | oxlint | 可用 |
| `npm run preview` | 预览前端产物 | 可用 |
| `dotnet build` | 后端编译 | 规划 |
| `dotnet run --project src-dotnet/Zane.Api` | 启动后端 | 规划 |
| `dotnet test` | 后端测试 | 规划 |
| `dotnet ef migrations add <Name> --project src-dotnet/Zane.Api` | 新增迁移 | 规划 |
| `dotnet ef database update --project src-dotnet/Zane.Api` | 应用迁移 | 规划 |

规划中的命令在迁移完成前不可用，不要假设其存在。

## 分支与提交

- 主分支：`main`，保持可发布。
- 功能分支：`feat/<short-name>`；修复：`fix/<short-name>`；文档：`docs/<short-name>`。
- 提交信息使用 Conventional Commits：
  - `feat: 新增二维码工具`
  - `fix: 修复记录检索大小写问题`
  - `docs: 拆分 PRD 与 ADR`
  - `chore: 升级 EF Core`
- 一个提交只做一件事，避免混合重构与功能。

## 开发顺序

1. 在对应 PRD（`docs/01-requirements/prd/`）中确认需求与验收。
2. 在 `docs/01-requirements/feature-backlog.md` 登记 ID 与优先级。
3. 用 `.claude/commands/plan-task.md` 明确范围与验证命令。
4. 先写实体与 DTO，再写端点，最后写界面。
5. 实现空状态、错误态与加载态。
6. 运行前端 build/lint、后端 build/test。
7. 更新文档；架构变化新增 ADR。

## 后端开发约定

- 端点按领域放在 `Features/<Domain>/`，用扩展方法注册 route group。
- DTO 使用 record + DataAnnotations；`AddValidation()` 统一校验。
- 返回 `TypedResults`；错误使用 ProblemDetails。
- 数据访问只通过 EF Core；DI 注入 `AppDbContext`。
- 时间使用注入的 `TimeProvider`。
- 后台任务使用 `BackgroundService`，不要在请求线程做外部抓取。
- 新增外部依赖前先确认其超时、重试与降级策略。

## 数据库变更

1. 新增迁移，不修改历史迁移。
2. 在本地空库与现有库副本上各执行一次。
3. 涉及数据回填时，迁移必须可重复执行或明确一次性。
4. 发布前备份生产 SQLite。
5. 回滚方案：恢复备份 + 回退代码，不反向执行破坏性迁移。

## 契约变更

1. 修改服务端 DTO/端点。
2. 运行 `npm run api:generate` 重新生成 `src/api-client/Zane.Api.json` 与 `schema.ts`（生成器版本固定在脚本内，不手改生成物）。
3. 前端使用生成类型适配。
4. 契约变更与前后端同批发布。

## 代码评审清单

- 范围是否与任务一致。
- 是否引入不必要依赖。
- 错误分支、空状态、权限是否正确。
- 是否有敏感信息进入日志或仓库。
- EF Core 查询是否有 N+1 或全表加载。
- 文档与 ADR 是否同步。
- 测试是否覆盖关键路径。

## 完成定义（Definition of Done）

- 功能符合验收标准。
- 前端 `npm run build`、`npm run lint` 通过。
- 后端 `dotnet build`、`dotnet test` 通过（迁移后）。
- 新增/修改逻辑有对应测试。
- 文档更新（PRD、接口、数据模型、ADR 至少其一）。
- 无调试代码、无临时开关。
- 可在预览环境验证。

## 调试与问题定位

- 前端：浏览器 DevTools + React DevTools + Redux DevTools。
- 后端：结构化日志、请求 ID、OpenTelemetry。
- 数据库：只读检查 SQLite；写操作走迁移或脚本。
- 外部数据源：先看缓存与 `last_fetched_at`，再查适配器日志。
