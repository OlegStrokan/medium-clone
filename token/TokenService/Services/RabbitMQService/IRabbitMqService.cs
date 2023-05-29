
namespace token.Services;

public interface IRabbitMqService
{
    void Consume(Action<string> handleMessage);
    void SendMessage(string message);
}