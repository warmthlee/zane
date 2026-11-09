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
| 204 | 删除成功、口令校验成功 |
| 400 | 参数校验失败 |
| 401 | 共享口令缺失或错误（仅 Memos 写接口与解锁） |
| 404 | 资源不存在 |
| 409 | 状态冲突 |
| 429 | 请求过于频繁、口令尝试超限 |
| 500 | 未预期错误 |
| 503 | 依赖不可用（数据库/外部源）、口令未配置 |

用户鉴权落地前不返回 403；`401` 仅表示 Memos 共享口令错误，不表示用户身份。写接口仍通过网络层限制访问。

## 核心端点

### 系统

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/health` | 健康检查（数据库、版本、运行时长） |

### 文章与长文记录

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/notes` | 列表，支持 `q`、`tag`、`status`、分页 |
| POST | `/notes` | 创建 |
| GET | `/notes/{id}` | 详情 |
| PATCH | `/notes/{id}` | 更新 |
| DELETE | `/notes/{id}` | 删除 |
| GET | `/notes/{id}/export` | 导出 Markdown/JSON |

### 想法流（Memos）

写入需要共享口令，请求头：`X-Memo-Passphrase: <passphrase>`。口令只放在请求头，不放 query、URL 或日志。

| 方法 | 路径 | 说明 | 保护 |
| --- | --- | --- | --- |
| GET | `/memos` | 时间线，支持 `limit`、`cursor`、`tag` | 公开读 |
| GET | `/memos/calendar` | 最近 52 周按站点时区聚合，返回全部日期 | 公开读 |
| POST | `/memos` | 创建想法，正文 1–500 字 | 口令 |
| PATCH | `/memos/{id}` | 编辑正文并重新解析标签 | 口令 |
| DELETE | `/memos/{id}` | 软删除 | 口令 |
| POST | `/memos/unlock` | 校验口令，成功 `204`，错误 `401` | 限流 |

- 标签由服务端从正文解析，语法 `#标签#`，支持 `#技术/React#`；`tag` 参数按标签值（不含 `#`）精确筛选。
- `GET /memos/calendar` 返回 `timeZone`、`startDate`、`endDate`、`total`、`maxCount`、`days[]`；`days` 覆盖 364 天，未来日期 `count` 为 0。
- 软删除资源不参与列表、标签筛选与日历聚合；重复删除返回 `404`。
- 口令尝试与写操作限流默认 5 次 / 5 分钟；超限 `429`。
- 未配置 `Memos:Passphrase` 时写接口与 `unlock` 返回 `503`，错误码 `MEMO_PASSPHRASE_NOT_CONFIGURED`。

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
