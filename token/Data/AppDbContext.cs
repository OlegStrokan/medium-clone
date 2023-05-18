using Microsoft.EntityFrameworkCore;
using token.Models;

namespace token.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opt) : base(opt)
    {
        
    }
    
    public DbSet<Token> Tokens { get; set; }
}