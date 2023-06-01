using System.Net;

namespace TokenService.Dtos;

public class ResponseTokenDto<T>
{
    public HttpStatusCode Status { get; set; }
    public string Message { get; set; }
    public Exception? Errors { get; set; }
    
    public T? Data { get; set; }
}