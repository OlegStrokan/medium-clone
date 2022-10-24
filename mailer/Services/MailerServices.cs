using System.Net;
using System.Net.Mail;

namespace mailer.Controllers;

public class MailerService : IMailerService
{
    public async Task<EmailSendResponseDto> MailSend(EmailDataDto dto)
    {
        DotNetEnv.Env.Load();
        MailAddress from = new MailAddress(dto.From);
        MailAddress to = new MailAddress(dto.To);
        MailMessage m = new MailMessage(from, to);
        m.Subject = dto.Subject;
        m.Body = dto.Html;
        SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
        smtp.Credentials = new NetworkCredential("somemail@gmail.com", "mypassword");
        smtp.EnableSsl = true;
        await smtp.SendMailAsync(m);

        EmailSendResponseDto obj = new EmailSendResponseDto();
        obj.Status = 200;
        obj.Message = "mail_send_success";

        return obj;
    }
}