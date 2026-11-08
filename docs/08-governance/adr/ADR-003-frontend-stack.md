# ADR-003 · 前端技术栈

- 日期：2026-11-07
- 状态：已接受

## 背景

需要跨页面状态、统一设计 token、快速构建与较低维护成本。

## 决策

React + TypeScript + Vite + Redux Toolkit + Tailwind CSS + shadcn/ui。

- 服务端状态优先 RTK Query。
- 跨页面 UI 状态使用普通 slice。
- Tailwind 作为唯一样式方案，token 集中配置为 CSS 变量。
- shadcn/ui 作为唯一组件来源：通过 CLI 复制到 `src/components/ui/`，随源码维护。
- 无特殊情况必须优先使用 shadcn/ui，不另起组件库或重复实现基础组件。
- API 类型来自 OpenAPI 生成的客户端。

## 备选

- Vue：团队与生态偏好不符。
- Next.js：当前不需要 SSR/SSG，增加复杂度。
- 传统组件库（Ant Design、MUI 等）：运行时依赖重、定制成本高，容易破坏设计体系。
- 纯手写组件：重复实现可访问性、焦点管理与交互细节，维护成本高。

## 影响

- 需要遵守 RTK、Tailwind 与 shadcn/ui 约定。
- 组件源码属于项目，升级需手动比对上游变更。
- 需要维护 OpenAPI 客户端生成步骤。
- 不使用服务端渲染，首屏性能依赖代码分割与缓存策略。
