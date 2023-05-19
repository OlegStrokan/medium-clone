
// // using Microsoft.EntityFrameworkCore;
// using TokenService.Data;
//
// var builder = WebApplication.CreateBuilder(args);
//
//
// builder.Services.AddControllers();
// builder.Services.
//     builder.Services.AddDbContext<AppDbContext>(opt => opt.UseInMemoryDatabase("InMem"));
//
//
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
//
// var app = builder.Build();
//
//
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }
//
// app.UseHttpsRedirection();
//
// app.UseAuthorization();
//
// app.MapControllers();
//
// app.Run();

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
            services.AddScoped<ITokenService, TokenService>();
            services.AddControllers();

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