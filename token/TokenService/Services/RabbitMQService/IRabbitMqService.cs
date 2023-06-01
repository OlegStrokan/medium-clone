
namespace TokenService.Services.RabbitMQService;

public interface IRabbitMqService : IDisposable
{
    void PublishMessage(string message);
    void StartListening(Action<string> onMessageReceived);
}