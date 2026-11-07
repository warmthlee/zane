using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Zane.Api.Data;

namespace Zane.Api.Tests;

/// <summary>
/// 测试宿主：使用独立的临时 SQLite 文件并应用迁移，避免污染开发数据库。
/// </summary>
public class ZaneApiFactory : WebApplicationFactory<Program>
{
    private readonly string _databasePath =
        Path.Combine(Path.GetTempPath(), $"zane-tests-{Guid.NewGuid():N}.db");

    protected virtual string ConnectionString => $"Data Source={_databasePath}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((_, configuration) =>
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:Default"] = ConnectionString,
            }));
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);

        try
        {
            using var scope = host.Services.CreateScope();
            scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.Migrate();
        }
        catch (Exception)
        {
            // 数据库不可用的场景由健康检查的 503 测试覆盖，这里不阻断宿主启动。
        }

        return host;
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (!disposing)
        {
            return;
        }

        foreach (var path in new[] { _databasePath, $"{_databasePath}-shm", $"{_databasePath}-wal" })
        {
            try
            {
                File.Delete(path);
            }
            catch (IOException)
            {
                // 临时文件清理失败不影响测试结果。
            }
        }
    }
}
