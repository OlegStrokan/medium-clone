
namespace TokenService.Services.RabbitMQService;

public interface IRabbitMqService
{
    void PublishMessage(string message);
    void StartListening(Action<string> onMessageReceived);
}