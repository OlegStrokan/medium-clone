using System;
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace TokenService.Services.RabbitMQService
{
    public class RabbitMqService : IRabbitMqService
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private const string QueueName = "token_queue";

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
            _channel.QueueDeclare(queue: QueueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
        }

        public void StartListening(Action<string> handleMessage)
        {
            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += (sender, args) =>
            {
                var body = args.Body.ToArray();
                var receivedMessage = Encoding.UTF8.GetString(body);

                handleMessage?.Invoke(receivedMessage);

                // Acknowledge the message
                _channel.BasicAck(args.DeliveryTag, multiple: false);
            };

            _channel.BasicConsume(queue: QueueName, autoAck: false, consumer: consumer);
        }

        public void PublishMessage(string message)
        {
            var body = Encoding.UTF8.GetBytes(message);

            _channel.BasicPublish(exchange: "", routingKey: QueueName, basicProperties: null, body: body);
        }
        
    }
}
