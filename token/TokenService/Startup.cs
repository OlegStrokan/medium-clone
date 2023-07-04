using Microsoft.EntityFrameworkCore;
using TokenService.Controllers;
using TokenService.Data;
using TokenService.Services.RabbitMQService;
using TokenService.Services.TokenServices;


namespace TokenService;

public class Startup
{
    private readonly IWebHostEnvironment _environment;

    public Startup(IConfiguration configuration, IWebHostEnvironment environment)
    {
        Configuration = configuration;
        _environment = environment;
    }

    public IConfiguration Configuration { get; }


    public void ConfigureServices(IServiceCollection services)
        {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(Configuration.GetConnectionString("PostgreSQL")));
        services.AddTransient<ITokenServices, TokenServices>();
        services.AddTransient<IRabbitMqService, RabbitMqService>();

        services.AddControllers().AddApplicationPart(typeof(TokenController).Assembly);

        var serviceProvider = services.BuildServiceProvider();
        var tokenController = serviceProvider.GetService<TokenController>();
        var rabbitMqService = serviceProvider.GetService<IRabbitMqService>();

        if (tokenController != null)
        {
            rabbitMqService.StartListening(tokenController.HandleMessage);
        }
        else
        {
            throw new Exception("TokenController is not registered in the service provider.");
        }

    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {

        app.UseRouting();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
}

        //app.UseHttpsRedirection();


        app.UseAuthorization();

        app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
    }
}
