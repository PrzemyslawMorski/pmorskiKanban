using System.Text;
using data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Swagger;

namespace api
{
    public class Startup
    {
private readonly IHostingEnvironment _env;
        private readonly IConfiguration _config;
        private readonly ILoggerFactory _loggerFactory;

        public Startup(IHostingEnvironment env, IConfiguration config,
            ILoggerFactory loggerFactory)
        {
            _env = env;
            _config = config;
            _loggerFactory = loggerFactory;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidAudience = _config["Jwt:Issuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]))
            };
        });

            var logger = _loggerFactory.CreateLogger<Startup>();
            logger.LogInformation($"Environment: {_env.EnvironmentName}");

            services.AddDbContext<KanbanContext>(options =>
                options.UseSqlServer(_config.GetConnectionString("KanbanDb"),
                b => b.MigrationsAssembly("kanban-api-data-migrations")));

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials()
                .Build());
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info
                {
                    Title = "Kanban API",
                    Version = "v1",
                    Description = "Kanban API is a back-end service for a Kanban React application as a subject of my engineer's thesis.",
                    Contact = new Contact
                    {
                        Name = "Przemysław Morski",
                        Email = "morski.przemek@gmail.com"
                    }
                });
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Kanban API");
                c.RoutePrefix = string.Empty;
            });

            //app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseMvc();
        }
    }
}