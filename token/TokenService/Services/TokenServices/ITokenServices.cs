using token.Models;
using TokenService.Dtos;

namespace TokenService.Services.TokenServices;

public interface ITokenServices
{
    ResponseTokenDto<string> CreateToken(string userId);
    
    ResponseTokenDto<string> DestroyToken(string userId);
   
    ResponseTokenDto<Token> DecodeToken(string token);
}