
namespace token.Services;

public interface IRabbitMqService
{
    void Consume(string queueName, Action<string> handleMessage);
    void Publish(string queueName, string message);
}