using RabbitMQ.Client;
using System.Text;
using token.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

public class RabbitMqService : IRabbitMqService
{
    private readonly ConnectionFactory _connectionFactory;

    public RabbitMqService(string hostname, string username, string password)
    {
        _connectionFactory = new ConnectionFactory
        {
            HostName = hostname,
            UserName = username,
            Password = password
        };
    }

    public void Consume(string queueName, Action<string> handleMessage)
    {
        using (var connection = _connectionFactory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (sender, args) =>
            {
                var message = Encoding.UTF8.GetString(args.Body.ToArray());
                handleMessage(message);
            };
            channel.BasicConsume(queueName, autoAck: true, consumer);
        }
    }
    
    public void Publish(string queueName, string message)
    {
        using (var connection = _connectionFactory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

            var body = Encoding.UTF8.GetBytes(message);

            channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: body);
        }
    }
    
}