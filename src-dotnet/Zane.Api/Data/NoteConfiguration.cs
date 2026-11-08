using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Zane.Api.Domain;

namespace Zane.Api.Data;

public sealed class NoteConfiguration : IEntityTypeConfiguration<Note>
{
    public void Configure(EntityTypeBuilder<Note> builder)
    {
        builder.ToTable("notes");

        builder.HasKey(note => note.Id);
        builder.Property(note => note.Id).HasColumnName("id");

        builder.Property(note => note.Title)
            .HasColumnName("title")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(note => note.ContentMd)
            .HasColumnName("content_md")
            .IsRequired();

        builder.Property(note => note.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(note => note.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(note => note.UpdatedAt).HasColumnName("updated_at").IsRequired();
        builder.Property(note => note.PublishedAt).HasColumnName("published_at");

        builder.HasIndex(note => new { note.Status, note.UpdatedAt });
        builder.HasIndex(note => note.PublishedAt);
    }
}
