# 速查表

## 命令

前端（当前可用）：

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run lint
npm run preview
npm run session:save -- "标题" done "备注"
npm run session:summary
npx shadcn@latest add <component>   # 添加 UI 组件到 src/components/ui
```

后端（迁移后）：

```bash
dotnet restore
dotnet build
dotnet test
dotnet run --project src-dotnet/Zane.Api
dotnet ef migrations add <Name> --project src-dotnet/Zane.Api
dotnet ef database update --project src-dotnet/Zane.Api
dotnet publish src-dotnet/Zane.Api -c Release -o ./publish
```

## 目录

```text
src/                  前端（Vite 根目录）
  api-client/         OpenAPI 生成的客户端
  components/ui/      shadcn/ui 组件
src-dotnet/           .NET 10 后端
  Zane.Api/
  Zane.Api.Tests/
  Zane.sln
docs/                 生命周期文档
scripts/              运维脚本
.ai/                  会话归档
```

## 关键路径

| 路径 | 说明 |
| --- | --- |
| `src/components/ui/` | shadcn/ui 组件（入库） |
| `src/app/` | 路由、store、providers |
| `src-dotnet/Zane.Api/Features/` | 按领域组织的端点 |
| `src-dotnet/Zane.Api/Data/` | `AppDbContext` 与实体配置 |
| `src-dotnet/Zane.Api/Migrations/` | EF Core 迁移 |
| `docs/01-requirements/prd/` | 分模块 PRD |
| `docs/08-governance/adr/` | 独立 ADR |
| `.ai/session-archive.db` | 会话归档 |

## 环境变量

| 变量 | 用途 |
| --- | --- |
| `ConnectionStrings__Default` | SQLite 连接字符串（规划） |
| `ASPNETCORE_URLS` | Kestrel 监听地址 |
| `Logging__LogLevel__Default` | 日志级别 |
| `SERVER_HOST` / `SERVER_USER` / `SSH_PRIVATE_KEY` / `DEPLOY_PATH` | CI 发布 secrets |

## SQLite 操作

```bash
# 备份（先 checkpoint）
sqlite3 /var/lib/zane/zane.db "PRAGMA wal_checkpoint(TRUNCATE);"
cp /var/lib/zane/zane.db backups/zane-$(date +%Y%m%d).db

# 查看 EF Core 迁移历史
sqlite3 /var/lib/zane/zane.db "SELECT * FROM __EFMigrationsHistory ORDER BY MigrationId;"

# 完整性检查
sqlite3 /var/lib/zane/zane.db "PRAGMA integrity_check;"
```

## Git

```bash
git switch -c feat/note-search
git add -A
git commit -m "feat: 支持笔记全文检索"
git push -u origin feat/note-search
```

## 排障

| 现象 | 排查 |
| --- | --- |
| 页面空白 | 构建产物、控制台错误、API 基地址 |
| API 502 | .NET 进程是否存活、Kestrel 地址、Nginx 反代 |
| API 400 | DataAnnotations 校验、ProblemDetails 字段错误 |
| SQLite locked | 长事务、多实例、未开 WAL、busy_timeout |
| 迁移失败 | 副本演练、`__EFMigrationsHistory`、备份恢复 |
| 聚合为空 | 数据源可用性、BackgroundService 日志、缓存时间 |
| 发布未生效 | CI 状态、`DEPLOY_PATH`、缓存与 `index.html` |

## 文档入口

- 总索引：`docs/README.md`
- PRD：`docs/01-requirements/prd/`
- 架构：`docs/02-architecture/system-architecture.md`
- ADR：`docs/08-governance/adr/`
- 发布：`docs/06-release/release-process.md`
