# 会话归档规范

## 目的

AI 会话是项目记忆的一部分，应可恢复、可追溯，而不是一次性聊天记录。

## 记录内容

每次任务至少保留：

- 任务标题与目标。
- 范围（做什么 / 不做什么）。
- 关键决策与理由。
- 代码变更摘要。
- 验证命令与结果。
- 发布、回滚与遗留风险。

## 存放位置

| 位置 | 内容 |
| --- | --- |
| `.ai/session-archive.db` | 结构化归档（SQLite） |
| `.ai/session-archive.json` | 便于查看与迁移的快照 |
| `docs/08-governance/decision-log.md` | 长期有效的决策 |
| `docs/08-governance/changelog.md` | 版本级变更 |
| `docs/08-governance/risk-register.md` | 风险与缓解 |

## 使用方式

```bash
npm run session:save -- "任务标题" done "验证：build/lint 通过"
npm run session:summary
```

状态取值：`pending`、`in_progress`、`done`、`blocked`。

依赖 `node:sqlite`，需要 Node 22+。

## 与文档的分工

- 会话归档记录“这次任务发生了什么”。
- `decision-log` 记录“以后仍然生效的结论”。
- `changelog` 记录“版本层面发生了什么”。
- 不要把未定稿的讨论直接写入决策记录。

## 保留与恢复

- 归档文件随仓库或外部同步保存，不依赖单一工具。
- 恢复上下文时，按“代码 → docs → 归档 → 聊天”顺序读取。
- 归档中的结论与 docs 冲突时，以 docs 为准并修正归档。

## 隐私

- 不记录密钥、Token、个人敏感信息。
- 外部平台账号只记录标识，不记录凭据。
- 发布记录中的链接需确认可公开。
