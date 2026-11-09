# 术语表

| 术语 | 英文/标识 | 定义 |
| --- | --- | --- |
| 思想记录 / 文章 | Note | 一篇可检索的长文记录，可包含 Markdown 正文、标签与状态；与首页短想法分开 |
| 想法 | Memo | 首页的短文本记录，纯文本、`#标签#`、可编辑/删除；存储于 `memos` |
| 想法流 | Memo Stream | 首页按时间倒序展示想法的区块，含输入框、时间线与标签筛选 |
| 共享口令 | Memo Passphrase | 保护 Memos 写操作的单一共享秘密，不是用户鉴权 |
| 贡献日历 | Contribution Calendar | 按天聚合记录数量的 7×N 网格，颜色深浅表示强度 |
| 同步目标 | Sync Target | 外部社交平台账号或渠道（延后能力） |
| 在线工具 | Tool | 无状态、打开即用的实用工具，如二维码、Base64、ASCII |
| 创意 MVP | Playground / MVP | 用于验证想法的轻量产品实验，可独立上下线 |
| 最佳实践 | Pattern | 设计模式、工程经验与可复用案例 |
| 热点聚合 | Feed | 来自百度、微博、股票等外部源的信息汇总 |
| 数据源适配器 | Feed Adapter | 封装单个外部数据源的抓取、归一化与降级逻辑 |
| 集成 | Integration | 嵌入或对接的第三方工具，如 Excalidraw |
| Cheat Sheet | Cheatsheet | 面向速查的命令、配置或流程清单 |
| PRD | Product Requirements Document | 单个功能域的需求文档，按模块独立存放 |
| ADR | Architecture Decision Record | 单个架构决策记录，按决策独立存放 |
| Minimal API | Minimal APIs | ASP.NET Core 中以 lambda/方法注册端点的轻量方式 |
| EF Core | Entity Framework Core | .NET 的对象关系映射与迁移框架 |
| shadcn/ui | shadcn/ui | 基于 Tailwind 与 Radix 的组件源码集合，通过 CLI 复制到项目，由项目维护 |
| 发布门禁 | Release Gate | 发布前必须通过的构建、检查与验收流程 |
| 会话归档 | Session Archive | 记录 AI 任务目标、决策与验证结果的结构化档案 |

## 命名约定

- 数据库表使用复数蛇形命名：`notes`、`note_tags`、`memos`、`memo_tags`、`feed_items`。
- API 路径使用复数 kebab-case：`/api/v1/notes`、`/feed-sources`。
- C# 类型与成员使用 PascalCase；局部变量与参数使用 camelCase。
- 前端领域类型使用 PascalCase：`Note`、`FeedItem`。
- 文档目录使用两位数字前缀表示生命周期顺序；PRD/ADR 使用独立文件。
