namespace Zane.Api.Features.Health;

/// <summary>
/// 健康检查返回体。字段保持稳定，供前端与运维探针消费。
/// </summary>
public sealed record HealthResponse(string Status, string Service, DateTimeOffset CheckedAtUtc);
