

using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using TokenService.Data;
using TokenService.Services.RabbitMQService;
using TokenService.Services.TokenServices;


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
            
            services.AddSingleton<RabbitMqService>();


        }

    
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, RabbitMqService rabbitMqService)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
                dbContext.Database.Migrate();
            }
            
            rabbitMqService.StartListening(HandleMessage);
            
            
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
        
        private void HandleMessage(string message)
        {
            Console.WriteLine(message);
            dynamic payload = JsonConvert.DeserializeObject(message);
            Console.WriteLine(payload);
        }

}