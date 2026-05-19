using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonCrud.Api.Models;

namespace PersonCrud.Api.Endpoints;

public static class PersonEndpoints
{
    public static void MapPersonEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/people");

        // GET ALL
        group.MapGet("/", async (
            [FromServices] AppDbContext db) =>
        {
            var people = await db.People.AsNoTracking().ToListAsync();
            return Results.Ok(people);
        });

        // GET BY ID
        group.MapGet("/{id:int}", async (
            [FromRoute] int id,
            [FromServices] AppDbContext db) =>
        {
            var person = await db.People.FindAsync(id);

            return person is null
                ? Results.NotFound()
                : Results.Ok(person);
        })
        .WithName("GetPersonById");

        // CREATE
        group.MapPost("/", async (
            [FromServices] IValidator<CreatePersonDto> validator,
            [FromServices] AppDbContext db,
            [FromBody] CreatePersonDto dto) =>
        {
            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var person = new Person
            {
                FirstName   = dto.FirstName,
                LastName    = dto.LastName,
                Email       = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                DateOfBirth = dto.DateOfBirth,
                Address     = dto.Address,
                City        = dto.City,
                Country     = dto.Country,
                IsActive    = dto.IsActive,
                Status      = dto.Status,
                CreatedAt   = DateTime.UtcNow
            };

            db.People.Add(person);
            await db.SaveChangesAsync();

            return Results.CreatedAtRoute(
                "GetPersonById",
                new { id = person.Id },
                person);
        });

        // UPDATE
        group.MapPut("/{id:int}", async (
            [FromRoute] int id,
            [FromServices] IValidator<UpdatePersonDto> validator,
            [FromServices] AppDbContext db,
            [FromBody] UpdatePersonDto dto) =>
        {
            if (id != dto.Id)
                return Results.BadRequest("Route id does not match body id.");

            var validation = await validator.ValidateAsync(dto);

            if (!validation.IsValid)
                return Results.ValidationProblem(validation.ToDictionary());

            var person = await db.People.FindAsync(id);

            if (person is null)
                return Results.NotFound();

            person.FirstName   = dto.FirstName;
            person.LastName    = dto.LastName;
            person.Email       = dto.Email;
            person.PhoneNumber = dto.PhoneNumber;
            person.DateOfBirth = dto.DateOfBirth;
            person.Address     = dto.Address;
            person.City        = dto.City;
            person.Country     = dto.Country;
            person.IsActive    = dto.IsActive;
            person.Status      = dto.Status;
            person.UpdatedAt   = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Results.Ok(person);
        });

        // DELETE
        group.MapDelete("/{id:int}", async (
            [FromRoute] int id,
            [FromServices] AppDbContext db) =>
        {
            var person = await db.People.FindAsync(id);

            if (person is null)
                return Results.NotFound();

            db.People.Remove(person);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}