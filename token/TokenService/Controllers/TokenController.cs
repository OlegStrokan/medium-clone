using System.Net;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using token.Models;
using TokenService.Dtos;
using TokenService.Services.RabbitMQService;
using TokenService.Services.TokenServices;

namespace TokenService.Controllers;

[ApiController]
[Route("token")]
public class TokenController : ControllerBase
{
    private readonly ITokenServices _tokenService;
    private readonly IRabbitMqService _rabbitMqService;


    public TokenController(ITokenServices tokenService, IRabbitMqService rabbitMqService)
    {
        _tokenService = tokenService;
        _rabbitMqService = rabbitMqService;
        _rabbitMqService.StartListening("token_queue", HandleMessage);
    }

    public void HandleMessage(string message)
    {
        dynamic payload = JsonConvert.DeserializeObject(message);
        switch (payload.pattern.ToString())
        {
            case "token_create":
            {
                var response = new ResponseTokenDto<string>()
                {
                    Status = HttpStatusCode.Created,
                    Message = "Token has been successfully created",
                    Data = "sodifj",
                    Errors = null
                };

                SendEvent(response);
                break;
            }
            case "token_destroy":
            {
                ActionResult<ResponseTokenDto<string>> response = DestroyToken(payload.Token);

                SendEvent(response);
                break;
            }
                ;
            case "token_decode":
            {
                ActionResult<ResponseTokenDto<Token>> response = DecodeToken(payload.Token);

                SendEvent(response);
                break;
            }
        }
    }


    [HttpPost("/create")]
    public ActionResult<ResponseTokenDto<string>> CreateToken(string userId)
    {
        return _tokenService.CreateToken(userId);
    }

    [HttpPost("/destroy")]
    public ActionResult<ResponseTokenDto<string>> DestroyToken(string token)
    {
        return _tokenService.DestroyToken(token);
    }

    [HttpPost("/decode")]
    public ActionResult<ResponseTokenDto<Token>> DecodeToken(string token)
    {
        return _tokenService.DecodeToken(token);
    }

    private void SendEvent<T>(T eventData)
    {
        var message = JsonConvert.SerializeObject(eventData);
        _rabbitMqService.PublishMessage("token_queue", message);
    }
}