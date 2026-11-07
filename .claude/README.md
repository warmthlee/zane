# Claude Code 工作目录

本目录保存 Claude Code 专属的工作流文件。通用契约以根目录 `AGENTS.md` 为准，项目事实来源为 `docs/`。

## 文件

| 文件 | 说明 |
| --- | --- |
| [`../CLAUDE.md`](../CLAUDE.md) | Claude Code 入口与架构摘要 |
| [`../AGENTS.md`](../AGENTS.md) | 跨 Agent 通用契约 |
| [`commands/plan-task.md`](commands/plan-task.md) | 新任务规划模板 |
| [`commands/verify-task.md`](commands/verify-task.md) | 完成前验证模板 |
| [`commands/step.md`](commands/step.md) | 按交付计划执行单个步骤（`/step S1`） |

## 工作流

1. 阅读 `CLAUDE.md` 与 `AGENTS.md`，确认命令、架构与边界。
2. 阶段 1 的 S0–S5 使用 `/step S1`：新会话只做一个步骤，状态与验收写回 `docs/01-requirements/delivery-plan.md`。
3. 其他新任务使用 `/plan-task`：目标、范围、验收标准、验证命令。
4. 实现后使用 `/verify-task`：范围、build/lint、文档一致性。
5. 长期决策新增独立 ADR（`../docs/08-governance/adr/`），并登记到 `decision-log.md` 与 ADR 索引。
6. 会话记录通过 `npm run session:save` 归档到 `.ai/`。

## 相关入口

- [`../docs/README.md`](../docs/README.md)：文档总索引。
- [`../.ai/README.md`](../.ai/README.md)：会话归档说明。
- [`../docs/04-development/ai-collaboration.md`](../docs/04-development/ai-collaboration.md)：协作模型。
