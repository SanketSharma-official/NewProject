using Microsoft.EntityFrameworkCore;

namespace PersonCrud.Api.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        // Seed some data
        // I want to insert some data in People table, while creating the database

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>(mb =>
        {
            mb.Property(p => p.FirstName).IsRequired().HasMaxLength(30);
            mb.Property(p => p.LastName).IsRequired().HasMaxLength(30);
            mb.HasData(
                new Person { Id = 1, FirstName = "John", LastName = "Doe" },
                new Person { Id = 2, FirstName = "Ravindra", LastName = "Devrani" }
            );
        });
        base.OnModelCreating(modelBuilder);
    }
    public DbSet<Person> People { get; set; }
}
