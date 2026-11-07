# 编码规范

## 通用

- 一个文件只承担一个清晰职责；单文件超过约 300 行时评估拆分。
- 命名表达意图，避免缩写与无意义前缀。
- 注释解释“为什么”，不重复“做了什么”。
- 临时方案标注 `TODO` 与移除条件。
- 不提交调试代码、注释掉的旧实现与临时日志。

## C# / .NET 10

### C# 基础

- 目标框架 `net10.0`；启用 `<Nullable>enable</Nullable>` 与 `<ImplicitUsings>enable</ImplicitUsings>`。
- 使用 file-scoped namespace。
- 优先 `record` 表达 DTO 与不可变数据。
- 使用集合表达式 `[]`、目标类型 `new()`、primary constructors。
- 使用 C# 14 的 `field` 关键字替代手写 backing field。
- 使用扩展成员组织领域辅助方法，避免静态工具类泛滥。
- 空条件赋值（`?.` / `?[]` 在赋值左侧）可用，但不要牺牲可读性。

### Minimal APIs

- 端点按 feature 拆分扩展方法，使用 `MapGroup`。
- 返回 `TypedResults`，不要返回 `IResult` 的匿名构造。
- 请求/响应 DTO 与端点放在同一 feature 目录。
- 校验使用 DataAnnotations + `AddValidation()`；跨字段规则显式实现。
- 错误使用 ProblemDetails；异常通过 `IExceptionHandler` 统一处理。
- OpenAPI 注释写在 handler 方法上，确保进入文档。

### EF Core

- 实体配置使用 `IEntityTypeConfiguration<T>`，不把配置堆在 `OnModelCreating`。
- 只读查询使用 `AsNoTracking()` 与投影。
- 批量更新使用 `ExecuteUpdateAsync`；批量删除使用 `ExecuteDeleteAsync`。
- 迁移只增不改；命名清晰（`AddFeedItems`）。
- 不在端点中拼接 SQL；确需原生 SQL 时使用参数化查询并封装。
- 注意 EF Core 10 的 SQLite UTC 行为与参数化集合变化。

### 异步与资源

- I/O 一律 async，避免 `.Result` / `.Wait()`。
- 使用 `CancellationToken` 贯穿请求与后台任务。
- `HttpClient` 通过 `IHttpClientFactory` 获取，配置超时与重试。
- 时间通过 `TimeProvider`，便于测试。

### 日志与安全

- 使用结构化日志模板，不拼接字符串。
- 不记录密码、Token、完整连接字符串与敏感正文。
- 外部输入先校验再使用。
- 密钥从配置/环境变量读取，不写入源码。

## TypeScript / React

### TypeScript 基础

- 开启 `strict`，不使用 `any`；确需逃逸时局部标注并说明。
- 优先 `type` 定义领域模型；公共 API 类型来自 `src/api-client`。
- 表单 UX 校验可用 Zod，但服务端校验为准。
- 避免枚举值散落字符串，统一用常量或联合类型。

### React

- 函数组件 + hooks；组件只负责渲染与交互。
- 领域逻辑抽到 hooks 或纯函数。
- 列表使用稳定 key，禁止用数组索引作为可变列表 key。
- 每个路由页面提供错误边界与加载/空/错误状态。
- 副作用集中在 `useEffect` 或事件处理。

### Redux Toolkit

- 服务端数据优先 RTK Query；跨页面 UI 状态用 slice。
- 异步逻辑放在 RTK Query 或 thunk，不在 reducer 中发请求。
- 可持久化字段保持精简（草稿、主题、筛选）。

### Tailwind

- 只使用设计 token 对应类，不写任意颜色值。
- 深浅主题使用 `dark:` 变体。
- 复杂样式抽为组件，避免超长 className。
- 合并类名使用 `cn()`（`src/lib/utils.ts`），不手写字符串拼接。

### shadcn/ui

- 无特殊情况必须优先使用 shadcn/ui，不引入第二套组件库。
- 添加组件使用 `npx shadcn@latest add <component>`，生成到 `src/components/ui/`；不要手工复制粘贴或改写为另一套实现。
- 生成文件纳入版本控制；升级前对比上游变更，避免覆盖本地定制。
- 定制通过 Tailwind 类与 CSS 变量完成，保留 Radix 的键盘与焦点行为。
- 缺少所需组件时，优先用现有组件组合；仍不满足再写自定义组件，并说明原因。

## 命名

| 对象 | 规则 | 示例 |
| --- | --- | --- |
| C# 类型/成员 | PascalCase | `NoteService`、`CreatedAt` |
| C# 参数/局部变量 | camelCase | `noteId` |
| C# 私有字段 | `_camelCase` | `_db` |
| TS 组件 | PascalCase | `NoteEditor` |
| TS 函数/变量 | camelCase | `fetchNotes` |
| 常量 | UPPER_SNAKE | `MAX_TAG_COUNT` |
| 数据库表 | 复数蛇形 | `feed_items` |
| API 路径 | 复数 kebab | `/feed-sources` |

## 错误处理

- 可预期错误返回明确 ProblemDetails 类型与 `code`。
- 不可预期错误记录日志并返回通用消息。
- 前端对错误做归一化，展示可操作提示。
- 禁止空 `catch`。
- 降级路径必须显式：返回缓存、空状态或禁用功能。

## 文件组织

- 后端按 `Features/<Domain>/` 内聚端点、DTO 与处理器。
- 前端按 `features/<domain>/` 内聚组件、hook、slice 与请求。
- 通用代码只在被两个以上领域复用时上移。
- 使用路径别名，避免深层相对路径。
