using Microsoft.EntityFrameworkCore;

namespace PersonCrud.Api.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Person> People { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>(mb =>
        {
            mb.Property(p => p.FirstName)
                .IsRequired()
                .HasMaxLength(30);

            mb.Property(p => p.LastName)
                .IsRequired()
                .HasMaxLength(30);

            mb.Property(p => p.Status)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("active");

            mb.HasData(
                new Person
                {
                    Id          = 1,
                    FirstName   = "John",
                    LastName    = "Doe",
                    Email       = "john.doe@example.com",
                    PhoneNumber = "1234567890",
                    DateOfBirth = new DateTime(1990, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    Address     = "123 Main St",
                    City        = "New York",
                    Country     = "USA",
                    IsActive    = true,
                    Status      = "active",
                    CreatedAt   = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Person
                {
                    Id          = 2,
                    FirstName   = "Ravindra",
                    LastName    = "Devrani",
                    Email       = "ravindra.devrani@example.com",
                    PhoneNumber = "0987654321",
                    DateOfBirth = new DateTime(1992, 6, 15, 0, 0, 0, DateTimeKind.Utc),
                    Address     = "456 Park Ave",
                    City        = "Mumbai",
                    Country     = "India",
                    IsActive    = true,
                    Status      = "active",
                    CreatedAt   = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        });

        base.OnModelCreating(modelBuilder);
    }
}