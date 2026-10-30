# 发布与运维最小闭环

## 发布目标

为了让 AI 生成的代码能够真正上线，需要建立最小但完整的发布流程：构建、验证、发布、检查、回滚。

## 流程

1. 准备阶段
   - 确认变更范围
   - 检查是否存在未完成的风险项
   - 记录本次发布的目标和验收标准

2. 验证阶段
   - `npm install`
   - `npm run build`
   - `npm run lint`
   - 检查关键页面是否可用

3. 发布阶段
   - 将构建产物上传到目标托管平台
   - 记录版本号、环境和发布时间
   - 保留回滚脚本或回滚步骤说明

4. 发布后检查
   - 页面是否正常渲染
   - 资源路径是否正确
   - 关键交互是否仍然可用

5. 回滚阶段
   - 保留上一个稳定版本
   - 提供可执行回滚说明
   - 记录失败原因与修复路径

## 可执行脚本

本项目已增加以下脚本：

```bash
npm run release:check
npm run release:deploy
npm run release:rollback
```

- `release:check` 运行构建和 lint 作为发布门禁，生成 `.ai/releases/latest-check.json`
- `release:deploy` 将 `dist/` 发布到 GitHub Pages 的 `gh-pages` 分支，并生成 `.ai/releases/latest-deploy.json`
- `release:rollback` 生成备用回滚清单，记录恢复步骤和发布风险

## 运维建议

- 区分 `dev` / `prod` / `preview` 这类环境，但不要在初期过度抽象。
- 每次发布都附上变更摘要和验收清单。
- 对 AI 生成的代码要求增加最终人工确认，避免“看起来正常但缺少业务判断”的错误发布。

## 当前项目适配性

目前已选定 GitHub Pages 作为正式托管平台，因为该仓库本身在 GitHub 上，且静态站点的发布流程最适合该项目的规模和节奏。

部署时可使用以下环境变量：

```bash
GITHUB_PAGES_BRANCH=gh-pages
GITHUB_PAGES_REMOTE=origin
GITHUB_PAGES_REMOTE_URL=https://github.com/warmthlee/zane.git
GITHUB_REPOSITORY=warmthlee/zane
```

在 CI 或本地有 GitHub 权限时，可以执行：

```bash
npm run release:deploy
```

这将把 `dist/` 输出发布到 `gh-pages` 分支，并记录 `.ai/releases/latest-deploy.json`。对于没有 GitHub 推送权限的本地环境，脚本会在发布前输出明确错误，避免误以为成功发布。

这比提前引入复杂监控平台更符合当前阶段的项目规模。
