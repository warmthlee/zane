# /verify-task

任务收尾前使用。

## 检查项

- [ ] 改动符合约定范围，没有顺手扩张。
- [ ] 前端 `npm run build` 通过。
- [ ] 前端 `npm run lint` 通过。
- [ ] 后端 `dotnet build` 通过（后端落地后）。
- [ ] 后端 `dotnet test` 通过（后端落地后）。
- [ ] 新增逻辑有对应测试。
- [ ] 加载、空、错误、权限状态已处理。
- [ ] 相关文档已更新（PRD / 架构 / 验收）。
- [ ] 无调试代码与敏感信息。

## 最小验证命令

前端（当前可用）：

```bash
npm run build
npm run lint
```

后端（迁移后）：

```bash
dotnet build
dotnet test
```

数据库或接口变更时，额外验证：

- EF Core 迁移可正向执行，并在数据库副本上演练。
- OpenAPI 契约已重新生成 `src/api-client`。
- 错误分支返回 ProblemDetails。

## 完成规则

范围、验证结果、文档三者一致后，才能标记完成。验收结果写入任务归档或 `docs/08-governance/changelog.md`。
