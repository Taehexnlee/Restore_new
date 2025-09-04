// API/Data/StoreContext.cs
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Product> Products { get; set; }

    // ✅ 새로 추가
    public required DbSet<Basket> Baskets { get; set; }
}