using Microsoft.AspNetCore.Mvc;
using token.Dtos;
using token.Models;
using token.Services;

namespace token.Controllers;

public class TokenController : ControllerBase
{
    private readonly ITokenService _tokenService;

    public TokenController(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }


    public ActionResult<ResponseTokenDto<string>> CreateToken(string userId)
    {
        return _tokenService.CreateToken(userId);
    }

    public ActionResult<ResponseTokenDto<string>> DestroyToken(string token)
    {
      
        return _tokenService.DestroyToken(token);
    }

    public ActionResult<ResponseTokenDto<Token>> DecodeToken(string token)
    {
        return _tokenService.DecodeToken(token);
    }
}