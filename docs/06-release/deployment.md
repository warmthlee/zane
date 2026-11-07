# 部署方案

## 环境

| 环境 | 用途 | 前端 | 后端 | 数据库 |
| --- | --- | --- | --- | --- |
| local | 开发 | Vite dev server | `dotnet run` | 本地 SQLite |
| preview | 发布前验证 | 静态产物 | 独立进程 | 数据库副本 |
| production | 线上 | 1Panel/Nginx | systemd/1Panel 托管 Kestrel | 生产 SQLite |

## CI 流水线（现有）

`.github/workflows/ci.yml` 在所有分支的 push 与 pull request 上执行，Node 24、.NET SDK 10.0.x：

| Job | 命令 | 作用 |
| --- | --- | --- |
| `frontend` | `npm ci`、`npm run lint`、`npm run build` | 前端类型检查与构建 |
| `backend` | `dotnet restore`、`dotnet build src-dotnet/Zane.sln -c Release`、`dotnet test src-dotnet/Zane.sln -c Release --no-build` | 后端编译与测试 |
| `contract` | `npm ci`、`npm run api:generate`、`git diff --exit-code -- src/api-client` | 契约生成物必须与提交内容一致 |
| `migration` | `dotnet tool restore`、`dotnet ef migrations has-pending-model-changes`、`dotnet ef database update`（空库执行两次） | 确认模型已有迁移，且迁移可重复应用 |
| `package` | `dotnet publish src-dotnet/Zane.Api -c Release -o publish/api`、`dotnet ef migrations bundle` | 仅 `main` 的 push 运行；上传 `zane-api` artifact（含自包含 `efbundle`），保留 14 天 |

`contract` job 首次运行会联网下载脚本中固定的 `openapi-typescript@7.13.0` 与 `typescript@5.9.3`；随后以 `git diff --exit-code` 判定契约漂移，任何生成物变化都必须提交。

## 前端部署

`.github/workflows/deploy.yml`：

1. push 到 `main`。
2. `actions/setup-node`（Node 24）。
3. `npm ci` + `npm run build`。
4. 通过 `burnett01/rsync-deployments` 将 `dist/` 同步到 1Panel 服务器。

`deploy.yml` 只发布静态前端；后端按下一节的 `zane-api` 产物发布。

所需 secrets：

| Secret | 说明 |
| --- | --- |
| `SERVER_HOST` | 服务器地址 |
| `SERVER_USER` | 部署用户 |
| `SSH_PRIVATE_KEY` | SSH 私钥 |
| `DEPLOY_PATH` | 站点目录 |

注意：rsync 使用 `--delete`，会删除目标目录中不存在于 `dist/` 的文件。

前端源码固定为 `src/`，Vite 配置与 `index.html` 在仓库根目录；建站脚本据此调整构建与产物路径。

## 后端部署

后端使用 `main` 上 CI `package` job 产出的 `zane-api` artifact（已含自包含 `efbundle`），不在生产机安装 SDK。

```bash
# 1. 下载最近一次 main 构建的产物
gh run download <run-id> -n zane-api -D /tmp/zane-api

# 2. 同步到发布目录（--delete 只清理产物目录，不触碰 /var/lib/zane）
rsync -avzr --delete /tmp/zane-api/ server:/opt/zane/api/

# 3. 备份数据库
ssh server 'cp /var/lib/zane/zane.db /var/lib/zane/backup/zane-$(date +%F-%H%M).db'

# 4. 应用迁移（迁移包只执行未应用的迁移，可重复运行）
ssh server 'cd /opt/zane/api && ./efbundle --connection "Data Source=/var/lib/zane/zane.db"'

# 5. 重启进程并验证
ssh server 'sudo systemctl restart zane-api'
curl -f http://127.0.0.1:5080/api/v1/health
```

1. 生产机安装 .NET 10 Runtime（或改用自包含发布）。
2. 配置 `appsettings.Production.json` 与环境变量：连接字符串、日志级别。
3. `efbundle` 由 CI 用 `dotnet ef migrations bundle --self-contained -r linux-x64` 生成，按迁移历史只执行待应用迁移；执行前必须先完成上面的数据库备份。
4. 由 systemd/1Panel 启动并托管进程。
5. 健康检查 `/api/v1/health`。

示例 systemd 单元（示意）：

```ini
[Unit]
Description=Zane API
After=network.target

[Service]
WorkingDirectory=/opt/zane/api
ExecStart=/usr/bin/dotnet /opt/zane/api/Zane.Api.dll
Restart=always
Environment=ASPNETCORE_URLS=http://127.0.0.1:5080
Environment=ConnectionStrings__Default=Data Source=/var/lib/zane/zane.db

[Install]
WantedBy=multi-user.target
```

## 反向代理

```text
Nginx / 1Panel
  ├── /            → 前端静态文件（SPA 回退 index.html）
  └── /api/*       → http://127.0.0.1:5080
```

- 写接口在鉴权落地前通过 Nginx 白名单/VPN/内网限制。
- 传递 `X-Forwarded-For` 与 `X-Forwarded-Proto`。
- 配置请求体大小与超时。

## SQLite 持久化

- 数据库文件放在 `/var/lib/zane/` 等持久化目录，不随发布覆盖。
- 服务账号对目录有读写权限，Web 静态目录不可访问该文件。
- 每日备份，保留至少 7 份。
- 备份前执行 `PRAGMA wal_checkpoint(TRUNCATE);`。
- 定期演练恢复。

## 配置与密钥

- 环境变量使用双下划线映射：`ConnectionStrings__Default`。
- 密钥通过服务器环境或密钥管理注入，不写入仓库。
- 不同环境使用独立数据库与配置。
- 密钥轮换后重启服务并验证。

## 发布顺序

1. 备份数据库。
2. 发布后端（向后兼容）。
3. 执行迁移。
4. 发布前端。
5. 健康检查与冒烟测试。

## 监控与告警

- 进程存活检查。
- `/api/v1/health` 返回数据库状态。
- OpenTelemetry 指标与错误日志。
- 外部数据抓取失败告警。
- 磁盘空间（SQLite 与备份）监控。
