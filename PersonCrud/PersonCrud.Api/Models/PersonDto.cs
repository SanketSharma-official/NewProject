namespace PersonCrud.Api.Models;

public record CreatePersonDto
(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    DateTime DateOfBirth,
    string Address,
    string City,
    string Country,
    bool IsActive,
    string Status      
);

public record UpdatePersonDto
(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    DateTime DateOfBirth,
    string Address,
    string City,
    string Country,
    bool IsActive,
    string Status       
);