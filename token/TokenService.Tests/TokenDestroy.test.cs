using System.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using token.Data;
using token.Models;
using token.Services;

namespace TokenServices.Tests;

[TestFixture]
public class TokenDestroy
{
    private ITokenService _tokenService;
    private AppDbContext _dbContext;
    private IConfiguration _configuration;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql("Server=localhost;User ID=stroka01;Password=token;Port=5434;Database=token_db;")
            .Options;
        _dbContext = new AppDbContext(options);

        _tokenService = new TokenService(_configuration, _dbContext);

    }

    [TearDown]
    public void TearDown()
    {
        _dbContext.Dispose();
    }

    [Test]
    public void DestroyToken_Successfully()
    {

        var tokenValue = "some_token_value";
        _dbContext.Tokens.Add(new Token
        {
            Value = tokenValue,
            Id = "23",
            UserId = "12"
        });
        _dbContext.SaveChanges();

        var result = _tokenService.DestroyToken(tokenValue);

        Assert.AreEqual(HttpStatusCode.OK, result.Status);
        Assert.AreEqual("token_destroying_success", result.Message);
        Assert.IsNull(result.Data);
        Assert.IsNull(result.Errors);

        Assert.IsFalse(_dbContext.Tokens.Any(t => t.Value == tokenValue));
    }

    [Test]
    public void DestroyToken_Invalid()
    {
        
        var tokenValue = "valid_token_value";
        _dbContext.Tokens.Add(new Token
        {
            Value = tokenValue,
            Id = "23",
            UserId = "12"
        });
        _dbContext.SaveChanges();

   
        var result = _tokenService.DestroyToken("invalid_token_value");

 
        Assert.AreEqual(HttpStatusCode.OK, result.Status);
        Assert.IsNotNull(_dbContext.Tokens.FirstOrDefault(t => t.Value == tokenValue));

    }

    [Test]
    public void DestroyToken_Failed()
    {
    }
}