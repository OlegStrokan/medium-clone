using token.Interfaces;

namespace token.Dtos;

public class ResponseTokenDto
{
    public int Status { get; set; }
    public string Message { get; set; }
    public IError Errors { get; set; }
}