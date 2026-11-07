namespace Zane.Api.Features.Health;

/// <summary>
/// 占位探针：S1 阶段没有数据库可探，固定返回健康。
/// 该实现会随 S2 的 EF Core 数据库探针一起移除。
/// </summary>
public sealed class PlaceholderDatabaseHealthProbe : IDatabaseHealthProbe
{
    public Task<bool> IsHealthyAsync(CancellationToken cancellationToken) => Task.FromResult(true);
}
