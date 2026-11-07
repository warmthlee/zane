namespace Zane.Api.Features.Samples;

/// <summary>
/// 非生产环境的示例端点：校验与异常模型的验收载体，不进入生产环境。
/// 同时排除在 OpenAPI 之外，避免开发环境下的契约生成物随宿主环境漂移。
/// </summary>
public static class SampleEndpoints
{
    public static IEndpointRouteBuilder MapSampleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/samples")
            .WithTags("Samples")
            .ExcludeFromDescription();

        group.MapPost("/echo", (EchoRequest request) => TypedResults.Ok(new EchoResponse(request.Message)))
            .WithName("Echo")
            .WithSummary("回显请求内容，用于验证请求校验")
            .Produces<EchoResponse>(StatusCodes.Status200OK)
            .ProducesValidationProblem();

        group.MapGet("/throw", (ILoggerFactory loggerFactory) =>
            {
                var logger = loggerFactory.CreateLogger("Zane.Api.Features.Samples.Throw");
                logger.LogWarning("触发示例异常，用于验证 ProblemDetails 输出。");
                throw new InvalidOperationException("示例异常：用于验证全局错误处理。");
            })
            .WithName("Throw")
            .WithSummary("故意抛出异常，仅非生产环境可用")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        return app;
    }
}
