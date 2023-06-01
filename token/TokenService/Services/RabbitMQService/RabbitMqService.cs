using RabbitMQ.Client;
using System.Text;
using token.Services;
using RabbitMQ.Client.Events;

public class RabbitMqService : IRabbitMqService
{
    private readonly ConnectionFactory _connectionFactory;
    private readonly string _queueName;

    public RabbitMqService(string hostname, string username, string password, string port, string virtualHost, string queueName)
    {
        _connectionFactory = new ConnectionFactory
        {
            HostName = hostname,
            Port = int.Parse(port),
            UserName = username,
            Password = password,
            VirtualHost = virtualHost
        };
        _queueName = queueName;
    }

    public void Consume(Action<string> handleMessage)
    {
        using (var connection = _connectionFactory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queue: _queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, args) =>
            {
                var message = Encoding.UTF8.GetString(args.Body.ToArray());
                handleMessage(message);
            };

            channel.BasicConsume(queue: _queueName, autoAck: true, consumer: consumer);
            Console.ReadLine();
        }
    }
    
    public void SendMessage(string message)
    {
        using (var connection = _connectionFactory.CreateConnection())
        using (var channel = connection.CreateModel())
        {
            channel.QueueDeclare(queue: _queueName,
                durable: false,
                exclusive: false,
                autoDelete: false,
                arguments: null);

            var body = Encoding.UTF8.GetBytes(message);

            channel.BasicPublish(exchange: "",
                routingKey: _queueName,
                basicProperties: null,
                body: body);
        }
    }
    
    
}