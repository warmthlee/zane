using Zane.Api.Data;
using Zane.Api.Features.Health;
using Zane.Api.Features.Samples;
using Zane.Api.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddValidation();
builder.Services.AddProblemDetails();
builder.Services.AddDataAccess();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<IDatabaseHealthProbe, DatabaseHealthProbe>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

app.MapOpenApi();
app.MapHealthEndpoints();

// 示例端点只用于验证校验与错误模型，生产环境不注册。
if (!app.Environment.IsProduction())
{
    app.MapSampleEndpoints();
}

app.Run();

public partial class Program;
