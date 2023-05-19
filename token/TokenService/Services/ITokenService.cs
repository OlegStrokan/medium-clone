using token.Dtos;
using token.Models;

namespace token.Services;

public interface ITokenService
{
    ResponseTokenDto<string> CreateToken(string userId);
    
    ResponseTokenDto<string> DestroyToken(string userId);
   
    ResponseTokenDto<Token> DecodeToken(string token);
}