using Microsoft.EntityFrameworkCore;
using token.Data;
using token.Dtos;
using token.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace token.Services;

public class TokenService : ITokenService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration, AppDbContext dbContext)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }
    
    public ResponseTokenDto CreateToken(string userId)
    {
        var tokenValue = Guid.NewGuid().ToString();
        var token = new Token()
        {
            Value = tokenValue,
            UserId = userId
        };
    }

    public ResponseTokenDto DestroyToken(string userId)
    {
        
    }

    public ResponseTokenDto DecodeToken(string token)
    {
       
    }


    private string GenerateJwtToken(Token token)
    {
        var tokenHandler  = new  JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSecret"]);
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("userId", token.UserId),
                new Claim("tokenValue", token.Value)
            }),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
        };

        var createdToken = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(createdToken);

    }
}