using token.Data;
using token.Dtos;
using token.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
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

    public ResponseTokenDto<string> CreateToken(string userId)
    {
        try
        {
            var tokenValue = Guid.NewGuid().ToString();
            var token = new Token()
            {
                Value = tokenValue,
                UserId = userId
            };

            _dbContext.Tokens.Add(token);
            _dbContext.SaveChanges();

            var jwtToken = GenerateJwtToken(token);

            return new ResponseTokenDto<string>()
            {
                Status = HttpStatusCode.Created,
                Message = "token_creation_success",
                Data = jwtToken,
                Errors = null
            };
        }
        catch (Exception exception)
        {
            return new ResponseTokenDto<string>()
            {
                Status = HttpStatusCode.PreconditionFailed,
                Message = "token_creation_failed",
                Data = null,
                Errors = exception
            };
        }
    }

    public ResponseTokenDto<string> DestroyToken(string tokenValue)
    {
        try
        {
            var token = _dbContext.Tokens.FirstOrDefault(t => t.Value == tokenValue);
            if (token != null)
            {
                _dbContext.Tokens.Remove(token);
                _dbContext.SaveChanges();
            }

            return new ResponseTokenDto<string>()
            {
                Status = HttpStatusCode.OK,
                Message = "token_destroying_success",
                Data = null,
                Errors = null
            };
        }
        catch (Exception exception)
        {
            return new ResponseTokenDto<string>()
            {
                Status = HttpStatusCode.PreconditionFailed,
                Message = "token_creation_failed",
                Data = null,
                Errors = exception
            };
        }
    }

    public ResponseTokenDto<Token> DecodeToken(string tokenValue)
    {
        try
        {
            var token = _dbContext.Tokens.FirstOrDefault(t => t.Value == tokenValue);

            if (token == null)
            {
                return new ResponseTokenDto<Token>()
                {
                    Status = HttpStatusCode.NotFound,
                    Message = "token_decode_not_found",
                    Data = null,
                    Errors = null
                };
            }

            return new ResponseTokenDto<Token>()
            {
                Status = HttpStatusCode.OK,
                Message = "token_decode_success",
                Data = token,
                Errors = null,
            };

        }
        catch (Exception exception)
        {
            return new ResponseTokenDto<Token>()
            {
                Status = HttpStatusCode.PreconditionFailed,
                Message = "token_creation_failed",
                Data = null,
                Errors = exception
            };
        }
    }


    private string GenerateJwtToken(Token token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
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