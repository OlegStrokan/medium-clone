

using Microsoft.EntityFrameworkCore;
using token.Data;
using token.Services;

namespace TokenService;

public class Startup
{
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("PostgreSQL")));
            services.AddTransient<ITokenServices, TokenServices>();
            services.AddControllers();

            services.AddSingleton<IRabbitMqService>( new RabbitMqService("localhost", "guest", "guest", "5672", "/", "token_queue_service"));
            //services.AddHostedService<MessageBusSubscriber>();

            // services.AddSingleton<IEventProcessor, EventProcessor>(); 
            // services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            // services.AddScoped<IPlatformDataClient, PlatformDataClient>();

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
                dbContext.Database.Migrate();
            }
            
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage(); 
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            
        }
}