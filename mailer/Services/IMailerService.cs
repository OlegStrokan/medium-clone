using System;
using System.Threading.Tasks;

namespace mailer.Controllers;

public interface IMailerService
{
     Task<EmailSendResponseDto> MailSend(EmailDataDto dto);

}