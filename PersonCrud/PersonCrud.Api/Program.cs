using FluentValidation;
using Microsoft.EntityFrameworkCore;
using PersonCrud.Api.Endpoints;
using PersonCrud.Api.Models;
using PersonCrud.Api.Validators;
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});

builder.Services.AddScoped<IValidator<Person>, PersonValidator>();

var app = builder.Build();
app.UseCors(MyAllowSpecificOrigins);

app.MapPersonEndpoints();

app.Run();
