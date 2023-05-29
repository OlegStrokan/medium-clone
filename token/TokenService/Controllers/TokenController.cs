using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using token.Dtos;
using token.Models;
using token.Services;

namespace token.Controllers;


[Route("api/token")]
[ApiController]
public class TokenController : ControllerBase
{
 
    private readonly ITokenServices _tokenService;
    private readonly IRabbitMqService _rabbitMqService;


    public TokenController(ITokenServices tokenService, IRabbitMqService rabbitMqService)
    {
        Console.WriteLine("hello");
        _tokenService = tokenService;
        _rabbitMqService = rabbitMqService;
        _rabbitMqService.Consume(HandleMessage);
    }

    private void HandleMessage(string message)
    {
        
        Console.WriteLine(message);
        dynamic payload = JsonConvert.DeserializeObject(message);
        switch (payload.Action)
        {
            case "create_token":
            {
                ActionResult<ResponseTokenDto<string>> response = CreateToken(payload.UserId);

                SendResponse("token_create", response);
                
            }
                ;
                break;
            case "destroy_token":
            {
                ActionResult<ResponseTokenDto<string>> response = DestroyToken(payload.Token);

                SendResponse("token_destroy", response);

            }
                ;
                break;
            case "decode_token":
            {
                ActionResult<ResponseTokenDto<Token>> response = DecodeToken(payload.Token);

                SendResponse("token_decode", response);
            }
                break;
        }

      
    }
    
    
    [HttpPost("create")]
    public ActionResult<ResponseTokenDto<string>> CreateToken(string userId)
    {
        return _tokenService.CreateToken(userId);
    }

    [HttpPost("destroy")]
    public ActionResult<ResponseTokenDto<string>> DestroyToken(string token)
    {
        return _tokenService.DestroyToken(token);
    }

    [HttpPost("decode")]
    public ActionResult<ResponseTokenDto<Token>> DecodeToken(string token)
    {
        return _tokenService.DecodeToken(token);
    }
    
    private void SendResponse<T>(ActionResult<ResponseTokenDto<T>> response)
    {
        string message = response.Value.ToString();
        _rabbitMqService.SendMessage(message);
    }
}