// API/Data/StoreContext.cs
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext : IdentityDbContext<User>
{
    public StoreContext(DbContextOptions<StoreContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Basket>  Baskets  { get; set; } = null!;

    public DbSet<Order> Orders { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Seed default roles using fixed GUIDs
        builder.Entity<IdentityRole>().HasData(
            new IdentityRole
            {
                Id = "e6b1b1e5-41d7-4b71-9a2c-6b8a6b6d1a11",
                Name = "Member",
                NormalizedName = "MEMBER"
            },
            new IdentityRole
            {
                Id = "4a4c1d6d-2ec3-4f1b-9a66-3d39e8a20890",
                Name = "Admin",
                NormalizedName = "ADMIN"
            }
        );
    }
}
