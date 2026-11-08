# Zane Playground

一个用于总结经验、记录想法的个人网站，也是一个孵化产品 MVP 的游乐场。

## 项目定位

- **记录**：沉淀个人思想、技术总结与最佳实践。
- **工具**：提供高频在线工具与创意 MVP，验证想法。
- **聚合**：汇总热点信息与外部工具，形成个人工作台。
- **输出**：内容可导出；社交平台一键分发作为未来能力。

## 核心能力

| 模块 | 说明 | 关键能力 |
| --- | --- | --- |
| 思想记录 | 个人笔记、总结与思考 | 标签、全文检索、导出（社交分发延后） |
| 在线工具 | 高频小工具集合 | 二维码生成、Base64 转换、ASCII 码表等 |
| 创意 MVP | 轻量创意实验 | 古诗词、英语学习、打字练习等 |
| 最佳实践 | 工程与设计经验 | 设计模式案例、可复用范式 |
| 热点聚合 | 外部信息汇总 | 百度头条、微博头条、股票行情 |
| 工具集成 | 第三方工具嵌入 | Excalidraw 等 |
| Cheat Sheet | 速查清单 | 命令、配置、流程速查 |

## 技术栈

- 前端：React + TypeScript + Vite + Redux Toolkit + Tailwind CSS + shadcn/ui（组件来源，优先使用）
- 后端：.NET 10（LTS）+ ASP.NET Core Minimal APIs
- 数据访问：EF Core 10
- 数据库：SQLite
- 契约：OpenAPI 3.1 → 生成 TypeScript 客户端
- 部署：GitHub Actions + 1Panel；前端 rsync，后端 `dotnet publish` + systemd/1Panel 进程

## 目标仓库结构

```text
src/                    # React 前端（Vite 根目录）
  api-client/           # 由 OpenAPI 生成的类型与客户端
  components/ui/        # shadcn/ui 组件
  features/             # 按领域组织
src-dotnet/             # .NET 10 API
  Zane.Api/
  Zane.Api.Tests/
  Zane.sln
docs/                   # 全生命周期项目文档
scripts/                # 发布、归档等运维脚本
```

> 前端源码已位于 `src/`；`src-dotnet/` 与生成客户端尚未建立。文档描述的是目标形态，迁移计划见 `docs/01-requirements/roadmap.md`。

## 快速开始

前端：

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run lint
npm run preview
```

后端（规划，迁移后可用）：

```bash
dotnet restore
dotnet build
dotnet run --project src-dotnet/Zane.Api
dotnet ef database update --project src-dotnet/Zane.Api
dotnet test
```

## 文档地图

完整索引见 [`docs/README.md`](docs/README.md)。

- [`AGENTS.md`](AGENTS.md)：面向所有 AI Agent 的通用契约
- [`CLAUDE.md`](CLAUDE.md)：Claude Code 工作入口
- [`docs/01-requirements/prd/`](docs/01-requirements/prd/)：分模块 PRD
- [`docs/08-governance/adr/`](docs/08-governance/adr/)：独立 ADR
- `docs/00-overview/`～`docs/09-reference/`：从立项到运维的项目全生命周期文档

## 项目状态

- 阶段：文档先行，前端在 `src/`，后端待落地。
- 前端 UI：Tailwind + shadcn/ui，组件优先复用。
- 后端技术栈：.NET 10 + EF Core 10 + SQLite。
- 鉴权与社交分发：延后（ADR-007、ADR-008）。
- 事实来源：仓库文档优先于聊天记录。
