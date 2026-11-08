using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace Zane.Api.Tests;

public sealed class HealthEndpointTests(ZaneApiFactory factory) : IClassFixture<ZaneApiFactory>
{
    private readonly ZaneApiFactory _factory = factory;

    [Fact]
    public async Task GetHealth_ReturnsOkWithJson()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/v1/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);

        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal("healthy", json.RootElement.GetProperty("status").GetString());
        Assert.Equal("zane-api", json.RootElement.GetProperty("service").GetString());
    }

    [Fact]
    public async Task GetHealth_ReturnsServiceUnavailable_WhenDatabaseCannotConnect()
    {
        using var failingFactory = new UnreachableDatabaseFactory();
        var client = failingFactory.CreateClient();

        var response = await client.GetAsync("/api/v1/health");

        Assert.Equal(HttpStatusCode.ServiceUnavailable, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task GetOpenApi_ContainsHealthEndpoint()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/openapi/v1.json");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("/api/v1/health", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task UnhandledException_ReturnsProblemDetails()
    {
        using var throwingFactory = _factory.WithWebHostBuilder(builder => builder.UseEnvironment("Testing"));
        var client = throwingFactory.CreateClient();

        var response = await client.GetAsync("/api/v1/samples/throw");

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Echo_ReturnsValidationProblem_WhenMessageIsEmpty()
    {
        using var testingFactory = _factory.WithWebHostBuilder(builder => builder.UseEnvironment("Testing"));
        var client = testingFactory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/v1/samples/echo", new { message = "" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    private sealed class UnreachableDatabaseFactory : ZaneApiFactory
    {
        protected override string ConnectionString => $"Data Source={Path.Combine(
            Path.GetTempPath(),
            Guid.NewGuid().ToString("N"),
            "missing-directory",
            "zane.db")}";
    }
}
