using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;

namespace mailer.Controllers;

[ApiController]
[Route("/")]
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
        return await _service.MailSend(dto);
    }
}

