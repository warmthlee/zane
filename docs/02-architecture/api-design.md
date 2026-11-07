# API 设计约定

## 基础约定

- 前缀：`/api/v1`，通过 `MapGroup("/api/v1")` 组织。
- 格式：JSON，UTF-8。
- 资源名复数、kebab-case：`/notes`、`/feed-sources`。
- 时间使用 ISO 8601 UTC；服务端统一使用 `TimeProvider`。
- 返回类型使用 `TypedResults`，便于 OpenAPI 推导与测试。

## .NET 10 实现约定

- 端点使用 Minimal APIs，按 feature 拆分扩展方法。
- DTO 使用 record + DataAnnotations；`AddValidation()` 自动返回 400。
- 错误统一 ProblemDetails；未处理异常由 `IExceptionHandler` 转换。
- OpenAPI 3.1 由 `AddOpenApi()` 生成，`.NET 10` 支持 YAML 输出。
- JSON 使用 source-generated 上下文。
- 不手写 Swagger/NSwag 注解；XML 注释进入文档。

## 响应结构

成功：

```json
{
  "data": {},
  "meta": { "requestId": "req_123" }
}
```

列表：

```json
{
  "data": [],
  "meta": { "requestId": "req_123", "nextCursor": "..." }
}
```

错误（ProblemDetails 扩展）：

```json
{
  "type": "https://zane.dev/errors/note-not-found",
  "title": "Note not found",
  "status": 404,
  "detail": "记录不存在",
  "code": "NOTE_NOT_FOUND",
  "requestId": "req_123"
}
```

校验错误使用 `ValidationProblemDetails`，包含字段错误字典。

## 状态码

| 码 | 场景 |
| --- | --- |
| 200 | 查询/更新成功 |
| 201 | 创建成功 |
| 204 | 删除成功 |
| 400 | 参数校验失败 |
| 404 | 资源不存在 |
| 409 | 状态冲突 |
| 429 | 请求过于频繁 |
| 500 | 未预期错误 |
| 503 | 依赖不可用（数据库/外部源） |

鉴权落地前不返回 401/403；写接口通过网络层限制访问。

## 核心端点

### 系统

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/health` | 健康检查（数据库、版本、运行时长） |

### 记录

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/notes` | 列表，支持 `q`、`tag`、`status`、分页 |
| POST | `/notes` | 创建 |
| GET | `/notes/{id}` | 详情 |
| PATCH | `/notes/{id}` | 更新 |
| DELETE | `/notes/{id}` | 删除 |
| GET | `/notes/{id}/export` | 导出 Markdown/JSON |

### 内容

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/patterns` | 最佳实践列表 |
| GET | `/patterns/{id}` | 详情 |
| GET | `/cheatsheets` | Cheat Sheet 列表 |
| GET | `/cheatsheets/{id}` | 详情 |
| GET | `/mvps` | MVP 注册表 |

### 聚合

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/feeds` | 按源分组的缓存 |
| GET | `/feeds/{source}` | 单个数据源缓存，含 `fetchedAt` |
| POST | `/feeds/{source}/refresh` | 手动刷新（本机/内网） |

### 工具

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/tools` | 工具目录 |
| POST | `/tools/{slug}/run` | 需要服务端的工具（如适用） |

### 延后端点（当前不实现）

- `/auth/*`（ADR-007）。
- `/notes/{id}/sync`、`/sync-targets/*`（ADR-008）。

## 校验

- DTO 使用 DataAnnotations：`[Required]`、`[StringLength]`、`[Range]`。
- 跨字段规则使用自定义 `ValidationAttribute` 或 handler 内校验。
- 校验失败统一返回 `ValidationProblemDetails`。
- 前端表单校验仅用于体验，服务端校验为准。

## 分页

- `limit`（默认 20，最大 100）+ `cursor`。
- 响应 `meta.nextCursor`；没有更多时省略。
- 排序稳定（如 `updated_at desc, id desc`）。

## 幂等与并发

- 创建类接口可由前端生成幂等键（如需要）。
- 更新使用 `updated_at` 或行版本做乐观并发检查。
- 冲突返回 409，并说明当前状态。

## 契约生成

1. 服务端生成 OpenAPI 3.1：`/openapi/v1.json` 或 `.yaml`。
2. CI/本地脚本生成 `src/api-client`。
3. 前端只使用生成类型，不手写重复 DTO。
4. 契约变更与前后端同批发布。

## 限流与超时

- 外部数据接口返回缓存，不在请求中同步抓取。
- 写接口在本机/内网外不可达（网络层限制）。
- 外部调用设置超时、重试上限与熔断/降级。
