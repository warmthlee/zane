using Zane.Api.Data;

namespace Zane.Api.Features.Health;

/// <summary>
/// 数据库探针：无法连接数据库时健康检查返回 503。
/// </summary>
public sealed class DatabaseHealthProbe(AppDbContext dbContext) : IDatabaseHealthProbe
{
    public async Task<bool> IsHealthyAsync(CancellationToken cancellationToken)
    {
        try
        {
            return await dbContext.Database.CanConnectAsync(cancellationToken);
        }
        catch (Exception)
        {
            // 探针本身不得抛异常，连接失败按不健康处理。
            return false;
        }
    }
}
