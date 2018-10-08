using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace api.Helpers.Startup
{
    public static class Configure
    {
        public static void ConfigureCors(this IApplicationBuilder app)
        {
            app.UseCors(options =>
                options.WithOrigins("http://localhost:8080")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());

//            app.UseCors(x => x
//                .AllowAnyOrigin()
//                .AllowAnyMethod()
//                .AllowAnyHeader()
//                .AllowCredentials()
//                .Build());
        }

        public static void ConfigureSwagger(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Kanban API");
                c.RoutePrefix = string.Empty;
            });
        }

        public static void ConfigureLogging(this IApplicationBuilder app, IConfiguration config,
            ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(config.GetSection("Logging"));
            loggerFactory.AddDebug();
        }
    }
}