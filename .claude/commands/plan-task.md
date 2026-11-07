# /plan-task

开始新任务时使用。先定义边界，再写代码。

## 必需输入

- 目标：要达成什么。
- 范围：做什么 / 不做什么。
- 约束：技术、产品、时间。
- 验收标准：可观察的完成条件。
- 验证方式：要运行的命令或手动检查。

## 步骤

1. 用一句话复述任务。
2. 对照 `AGENTS.md` 与 `docs/00-overview/scope-and-principles.md` 确认边界。
3. 在 `docs/01-requirements/feature-backlog.md` 登记或核对功能 ID。
4. 列出可能改动的文件与模块。
5. 列出验证命令（当前至少 `npm run build`、`npm run lint`）。
6. 记录风险与需要人工确认的事项。

## 输出

- 任务目标
- 范围（in / out）
- 影响文件
- 验证步骤
- 开放风险
- 明确的完成 / 未完成边界
