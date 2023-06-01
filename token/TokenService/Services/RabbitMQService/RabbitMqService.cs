using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace TokenService.Services.RabbitMQService;

public class RabbitMqService : IRabbitMqService
{
    private readonly IConnection _connection;
    private IModel _channel;

    public RabbitMqService()
    {
        var factory = new ConnectionFactory
        {
            HostName = "localhost", // Update with your RabbitMQ server details
            Port = 5672,
            UserName = "guest",
            Password = "guest"
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
    }

    public void PublishMessage(string message)
    {
        _channel.QueueDeclare(queue: "token_queue", durable: false, exclusive: false, autoDelete: false, arguments: null);

        var body = Encoding.UTF8.GetBytes(message);

        _channel.BasicPublish(exchange: "", routingKey: "token_queue", basicProperties: null, body: body);
    }

    public void StartListening(Action<string> onMessageReceived)
    {
        _channel.QueueDeclare(queue: "token_queue", durable: false, exclusive: false, autoDelete: false, arguments: null);

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (sender, args) =>
        {
            var body = args.Body.ToArray();
            var receivedMessage = Encoding.UTF8.GetString(body);

            onMessageReceived?.Invoke(receivedMessage);

            // Acknowledge the message
            _channel.BasicAck(args.DeliveryTag, multiple: false);
        };

        _channel.BasicConsume(queue: "token_queue", autoAck: false, consumer: consumer);
    }

    public void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
    }
}