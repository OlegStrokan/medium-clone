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
        services.AddSingleton<IRabbitMqService, RabbitMqService>();

        services.AddControllers().AddApplicationPart(typeof(TokenController).Assembly);

        // Build the service provider
      
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