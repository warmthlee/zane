namespace Zane.Api.Domain;

public enum NoteStatus
{
    Draft,
    Published,
    Archived,
}

/// <summary>
/// 思想记录。时间统一以 UTC 写入，由注入的 <see cref="TimeProvider"/> 取时。
/// </summary>
public sealed class Note
{
    private Note()
    {
    }

    public Guid Id { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string ContentMd { get; private set; } = string.Empty;

    public NoteStatus Status { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset UpdatedAt { get; private set; }

    public DateTimeOffset? PublishedAt { get; private set; }

    public static Note Create(string title, string contentMd, NoteStatus status, TimeProvider timeProvider)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentNullException.ThrowIfNull(contentMd);
        ArgumentNullException.ThrowIfNull(timeProvider);

        var now = timeProvider.GetUtcNow();

        return new Note
        {
            Id = Guid.CreateVersion7(now),
            Title = title,
            ContentMd = contentMd,
            Status = status,
            CreatedAt = now,
            UpdatedAt = now,
            PublishedAt = status == NoteStatus.Published ? now : null,
        };
    }
}
