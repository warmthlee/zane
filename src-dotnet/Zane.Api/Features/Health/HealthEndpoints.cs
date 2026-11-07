using Microsoft.AspNetCore.Http.HttpResults;

namespace Zane.Api.Features.Health;

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Health");

        group.MapGet("/health", GetHealth)
            .WithName("GetHealth")
            .WithSummary("返回服务健康状态")
            .Produces<HealthResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status503ServiceUnavailable);

        return app;
    }

    private static async Task<Results<Ok<HealthResponse>, ProblemHttpResult>> GetHealth(
        IDatabaseHealthProbe databaseHealthProbe,
        TimeProvider timeProvider,
        CancellationToken cancellationToken)
    {
        if (!await databaseHealthProbe.IsHealthyAsync(cancellationToken))
        {
            return TypedResults.Problem(
                title: "服务不可用",
                detail: "数据库不可用，健康检查失败。",
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        return TypedResults.Ok(
            new HealthResponse(
                Status: "healthy",
                Service: "zane-api",
                CheckedAtUtc: timeProvider.GetUtcNow()));
    }
}
