namespace mailer.Controllers;

public record EmailSendResponseDto
{
    public int Status { get; set; }
    public string Message { get; set; }
};