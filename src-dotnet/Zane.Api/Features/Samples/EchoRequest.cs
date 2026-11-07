using System.ComponentModel.DataAnnotations;

namespace Zane.Api.Features.Samples;

/// <summary>
/// 示例请求模型：用于验证 DataAnnotations + AddValidation() 的统一 400 响应。
/// </summary>
public sealed class EchoRequest
{
    [Required(ErrorMessage = "message 不能为空。")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "message 长度须为 1–200 个字符。")]
    public string Message { get; init; } = string.Empty;
}

public sealed record EchoResponse(string Message);
