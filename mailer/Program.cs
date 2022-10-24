using mailer.Controllers;
using MassTransit;
using MassTransit.AspNetCoreIntegration;
var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddSingleton<IMailerService, MailerService>();

builder.Services.AddMassTransit(x =>
{
    x.AddBus(provider => Bus.Factory.CreateUsingRabbitMq(config =>
    {
        config.Host(new Uri("rabbitmq://localhost"), h =>
        {
            h.Username("guest");
            h.Password("guest");
        });
    }));
});


// builder.Services.AddMassTransitHostedService();

var app = builder.Build();

app.MapControllers();

app.Run();
