using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using PersonCrud.Api.Models;

namespace PersonCrud.Api.Endpoints;

public static class PersonEndpoints
{
    public static void MapPersonEndpoints(this WebApplication app)
    {
        app.MapGet("/api/people", async (AppDbContext context) =>
        {
            try
            {
                var people = await context.People.ToListAsync(); // retriving all rows and columns from the database (select Id,FirstName,LastName from People)
                return Results.Ok(people); // 200 Ok + pass data
            }
            catch (Exception ex)
            {
                return Results.InternalServerError(ex.Message); // 500 Internal Server Error + error message
            }
        }
        );


        app.MapGet("/api/people/{id:int}", async (int id, AppDbContext context) =>
        {
            try
            {
                var person = await context.People.FindAsync(id);

                if (person is null)
                {
                    return Results.NotFound();
                }

                return Results.Ok(person); // 200 Ok + pass data
            }
            catch (Exception ex)
            {
                return Results.InternalServerError(ex.Message); // 500 Internal Server Error + error message
            }
        }
        ).WithName("GetPersonById");


        app.MapPost("/api/people", async (IValidator<Person> personValidator, AppDbContext context, Person person) =>
        {
            try
            {
                var validationResult = await personValidator.ValidateAsync(person);

                if (!validationResult.IsValid)
                {
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                context.People.Add(person);
                await context.SaveChangesAsync();
                return Results.CreatedAtRoute("GetPersonById", new { id = person.Id }, person); // 201 Created + location of the resource + created data
            }
            catch (Exception ex)
            {
                return Results.InternalServerError(ex.Message); // 500 Internal Server Error + error message
            }
        }
        );

        app.MapPut("/api/people/{id:int}", async (IValidator<Person> personValidator, int id, AppDbContext context, Person person) =>
       {
           try
           {
               var validationResult = await personValidator.ValidateAsync(person);

               if (!validationResult.IsValid)
               {
                   return Results.ValidationProblem(validationResult.ToDictionary());
               }
               if (id != person.Id)
               {
                   return Results.BadRequest("Id mismatch");
               }

               if (!await context.People.AnyAsync(p => p.Id == id))
               {
                   return Results.NotFound();
               }

               context.People.Update(person);
               await context.SaveChangesAsync();
               return Results.NoContent(); // 204 No Content
           }
           catch (Exception ex)
           {
               return Results.InternalServerError(ex.Message); // 500 Internal Server Error + error message
           }
       }
       );


        app.MapDelete("/api/people/{id:int}", async (int id, AppDbContext context) =>
       {
           try
           {
               var person = await context.People.FindAsync(id);
               if (person is null)
               {
                   return Results.NotFound();
               }

               context.People.Remove(person);
               await context.SaveChangesAsync();
               return Results.NoContent(); // 204 No Content
           }
           catch (Exception ex)
           {
               return Results.InternalServerError(ex.Message); // 500 Internal Server Error + error message
           }
       }
       );
    }
}
