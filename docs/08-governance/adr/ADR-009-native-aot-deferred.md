# ADR-009 · 初期不启用 Native AOT

- 日期：2026-11-07
- 状态：已接受
- 关联：ADR-004

## 背景

.NET 10 支持 Native AOT，可缩短启动时间、降低内存占用。但 EF Core、部分序列化与动态特性对 AOT/裁剪有额外限制，需要额外配置与验证。

## 决策

初期采用常规 JIT 发布（`dotnet publish -c Release`），不启用 Native AOT。优先保证 EF Core、OpenAPI 生成与后台任务的稳定性。

满足以下条件后再评估：

- 主要依赖均支持 AOT/裁剪。
- 有明确的启动时间或内存压力。
- 具备完整的运行时回归测试。

## 影响

- 启动时间与镜像体积不是当前优化目标。
- 代码仍保持 AOT 友好：优先 source-generated JSON、避免不必要的动态反射。
