
namespace TokenService.Services.RabbitMQService;

public interface IRabbitMqService
{
    void PublishMessage(string queueName, string message);
    void StartListening(string queueName, Action<string> onMessageReceived);
}