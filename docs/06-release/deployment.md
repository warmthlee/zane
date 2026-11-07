# 部署方案

## 环境

| 环境 | 用途 | 前端 | 后端 | 数据库 |
| --- | --- | --- | --- | --- |
| local | 开发 | Vite dev server | `dotnet run` | 本地 SQLite |
| preview | 发布前验证 | 静态产物 | 独立进程 | 数据库副本 |
| production | 线上 | 1Panel/Nginx | systemd/1Panel 托管 Kestrel | 生产 SQLite |

## 前端 CI（现有）

`.github/workflows/deploy.yml`：

1. push 到 `main`。
2. `actions/setup-node`（Node 20）。
3. `npm ci` + `npm run build`。
4. 通过 `burnett01/rsync-deployments` 将 `dist/` 同步到 1Panel 服务器。

所需 secrets：

| Secret | 说明 |
| --- | --- |
| `SERVER_HOST` | 服务器地址 |
| `SERVER_USER` | 部署用户 |
| `SSH_PRIVATE_KEY` | SSH 私钥 |
| `DEPLOY_PATH` | 站点目录 |

注意：rsync 使用 `--delete`，会删除目标目录中不存在于 `dist/` 的文件。

前端源码固定为 `src/`，Vite 配置与 `index.html` 在仓库根目录；建站脚本据此调整构建与产物路径。

## 后端部署（规划）

1. 安装 .NET 10 Runtime（或使用自包含发布）。
2. `dotnet publish src-dotnet/Zane.Api -c Release -o /opt/zane/api`。
3. 配置 `appsettings.Production.json` 与环境变量：连接字符串、日志级别。
4. 执行迁移：`dotnet ef database update` 或发布时生成的迁移包。
5. 由 systemd/1Panel 启动并托管进程。
6. 健康检查 `/api/v1/health`。

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
