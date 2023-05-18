using token.Dtos;
using token.Models;

namespace token.Services;

public interface ITokenService
{
    ResponseTokenDto CreateToken(string userId);
    
    ResponseTokenDto DestroyToken(string userId);
   
    ResponseTokenDto DecodeToken(string token);
}