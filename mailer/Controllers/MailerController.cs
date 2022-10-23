using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;


namespace mailer.Controllers;

public class MailController : ControllerBase
{

    private readonly ILogger<MailController> _logger;
    private readonly IMailerService _service;
    public MailController(ILogger<MailController> logger, IMailerService service)
    {
        _logger = logger;
        _service = service;
    }
    
    
    public async Task<EmailSendResponseDto> SendEmail(EmailDataDto dto)
    {
        _logger.LogInformation("Email was sent 20");
        EmailSendResponseDto mail =  await _service.MailSend(dto);
        _logger.LogInformation("Email was sent");
        return mail;
    }
}

