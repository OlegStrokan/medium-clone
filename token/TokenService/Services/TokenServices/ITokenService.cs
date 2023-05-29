using token.Dtos;
using token.Models;

namespace token.Services;

public interface ITokenServices
{
    ResponseTokenDto<string> CreateToken(string userId);
    
    ResponseTokenDto<string> DestroyToken(string userId);
   
    ResponseTokenDto<Token> DecodeToken(string token);
}