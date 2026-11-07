namespace Zane.Api.Features.Health;

/// <summary>
/// 依赖探针：健康检查据此判断服务是否可用。
/// S1 尚无数据库，使用占位实现；S2 接入 EF Core 后替换为真实数据库探针。
/// </summary>
public interface IDatabaseHealthProbe
{
    Task<bool> IsHealthyAsync(CancellationToken cancellationToken);
}
