using Microsoft.EntityFrameworkCore;
using Zane.Api.Data;
using Zane.Api.Domain;

namespace Zane.Api.Tests;

public sealed class NotePersistenceTests
{
    [Fact]
    public async Task Note_PersistsAcrossDbContextRestarts()
    {
        var databasePath = Path.Combine(Path.GetTempPath(), $"zane-note-{Guid.NewGuid():N}.db");
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite($"Data Source={databasePath}")
            .AddInterceptors(new SqlitePragmaInterceptor())
            .Options;

        var now = new DateTimeOffset(2026, 11, 7, 8, 0, 0, TimeSpan.Zero);
        var timeProvider = new FixedTimeProvider(now);
        Guid noteId;

        await using (var db = new AppDbContext(options))
        {
            await db.Database.MigrateAsync();

            var note = Note.Create("标题", "正文", NoteStatus.Draft, timeProvider);
            noteId = note.Id;
            db.Notes.Add(note);
            await db.SaveChangesAsync();
        }

        // 新的 DbContext 与新的连接，模拟进程重启后的读取。
        await using (var db = new AppDbContext(options))
        {
            var note = await db.Notes.SingleAsync(item => item.Id == noteId);

            Assert.Equal("标题", note.Title);
            Assert.Equal("正文", note.ContentMd);
            Assert.Equal(NoteStatus.Draft, note.Status);
            Assert.Equal(now, note.CreatedAt);
            Assert.Equal(TimeSpan.Zero, note.CreatedAt.Offset);
            Assert.Equal(now, note.UpdatedAt);
            Assert.Null(note.PublishedAt);
        }

        DeleteDatabaseFiles(databasePath);
    }

    [Fact]
    public async Task SqlitePragmas_AreAppliedOnConnectionOpen()
    {
        var databasePath = Path.Combine(Path.GetTempPath(), $"zane-pragma-{Guid.NewGuid():N}.db");
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite($"Data Source={databasePath}")
            .AddInterceptors(new SqlitePragmaInterceptor())
            .Options;

        await using (var db = new AppDbContext(options))
        {
            await db.Database.OpenConnectionAsync();
            var connection = db.Database.GetDbConnection();

            Assert.Equal("wal", await ScalarAsync(connection, "PRAGMA journal_mode;"));
            Assert.Equal("1", await ScalarAsync(connection, "PRAGMA foreign_keys;"));
            Assert.Equal("5000", await ScalarAsync(connection, "PRAGMA busy_timeout;"));

            await db.Database.CloseConnectionAsync();
        }

        DeleteDatabaseFiles(databasePath);
    }

    private static async Task<string?> ScalarAsync(System.Data.Common.DbConnection connection, string sql)
    {
        await using var command = connection.CreateCommand();
        command.CommandText = sql;
        return (await command.ExecuteScalarAsync())?.ToString();
    }

    private static void DeleteDatabaseFiles(string databasePath)
    {
        foreach (var path in new[] { databasePath, $"{databasePath}-shm", $"{databasePath}-wal" })
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

    private sealed class FixedTimeProvider(DateTimeOffset utcNow) : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => utcNow;
    }
}
