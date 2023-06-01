using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

using token.Models;
using TokenService.Dtos;
using TokenService.Services.RabbitMQService;
using TokenService.Services.TokenServices;

namespace TokenService.Controllers;

public class TokenController : ControllerBase
{
    private readonly ITokenServices _tokenService;
    private readonly IRabbitMqService _rabbitMqService;


    public TokenController(ITokenServices tokenService, IRabbitMqService rabbitMqService)
    {
        _tokenService = tokenService;
        _rabbitMqService = rabbitMqService;
        rabbitMqService.StartListening(HandleMessage);
   
    }


    private void HandleMessage(string message)
    {
        Console.WriteLine(message);
        dynamic payload = JsonConvert.DeserializeObject(message);
        switch (payload.Action)
        {
            case "token_create":
            {
                ActionResult<ResponseTokenDto<string>> response = CreateToken(payload.UserId);

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


    
        public ActionResult<ResponseTokenDto<string>> CreateToken(string userId)
        {
            ActionResult<ResponseTokenDto<string>> response = _tokenService.CreateToken(userId);

            var rabbitMqService = HttpContext.RequestServices.GetService<IRabbitMqService>();
            rabbitMqService.PublishMessage("hello");
            
            var message = JsonConvert.SerializeObject(response);


            SendEvent(message);

            return response;
        }
        
        public ActionResult<ResponseTokenDto<string>> DestroyToken(string token)
        {
            ActionResult<ResponseTokenDto<string>> response = _tokenService.DestroyToken(token);

            var message = JsonConvert.SerializeObject(response);

            SendEvent(message);


            return response;
        }
        
        public ActionResult<ResponseTokenDto<Token>> DecodeToken(string token)
        {
            ActionResult<ResponseTokenDto<Token>> response = _tokenService.DecodeToken(token);

            var message = JsonConvert.SerializeObject(response);

            SendEvent(message);

            return response;
        }

        private void SendEvent<T>( T eventData)
        {
            var message = JsonConvert.SerializeObject(eventData);

            _rabbitMqService.PublishMessage(message);
        }
    }