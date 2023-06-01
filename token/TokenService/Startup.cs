

using Microsoft.EntityFrameworkCore;

using token.Data;
using token.Services;

namespace TokenMicroservice;

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
            

            // Register RabbitMQ service
            services.AddSingleton<IRabbitMqService>(provider =>
            {
                // Read the RabbitMQ connection settings from configuration
                var configuration = provider.GetRequiredService<IConfiguration>();
                var hostname = configuration["RabbitMQ:Hostname"];
                var username = configuration["RabbitMQ:Username"];
                var password = configuration["RabbitMQ:Password"];
                var port = configuration["RabbitMQ:Port"];
                var virtualHost = configuration["RabbitMQ:VirtualHost"];
                var queueName = configuration["RabbitMQ:QueueName"];

                // Create and return an instance of RabbitMqService
                return new RabbitMqService(hostname, username, password, port, virtualHost, queueName);
            });

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