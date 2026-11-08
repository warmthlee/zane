using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Zane.Api.Data;

public static class DataServiceCollectionExtensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services)
    {
        services.AddDbContext<AppDbContext>((serviceProvider, options) =>
        {
            // 在解析 DbContext 时读取配置，使测试与环境变量覆盖能够生效。
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var connectionString = configuration.GetConnectionString("Default")
                ?? throw new InvalidOperationException("缺少连接字符串 ConnectionStrings:Default。");

            options
                .UseSqlite(connectionString)
                .AddInterceptors(new SqlitePragmaInterceptor());
        });

        return services;
    }
}
