using FluentValidation;
using PersonCrud.Api.Models;

namespace PersonCrud.Api.Validators;

public class CreatePersonDtoValidator : AbstractValidator<CreatePersonDto>
{
    public CreatePersonDtoValidator()
    {
        RuleFor(p => p.FirstName)
            .NotEmpty().WithMessage("First Name is required")
            .MaximumLength(30).WithMessage("First Name cannot exceed 30 characters");

        RuleFor(p => p.LastName)
            .NotEmpty().WithMessage("Last Name is required")
            .MaximumLength(30).WithMessage("Last Name cannot exceed 30 characters");

        RuleFor(p => p.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(100).WithMessage("Email cannot exceed 100 characters");

        RuleFor(p => p.PhoneNumber)
            .NotEmpty().WithMessage("Phone Number is required")
            .MaximumLength(20).WithMessage("Phone Number cannot exceed 20 characters");

        RuleFor(p => p.DateOfBirth)
            .NotEmpty().WithMessage("Date Of Birth is required")
            .LessThan(DateTime.Today).WithMessage("Date Of Birth must be in the past");

        RuleFor(p => p.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(200).WithMessage("Address cannot exceed 200 characters");

        RuleFor(p => p.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(50).WithMessage("City cannot exceed 50 characters");

        RuleFor(p => p.Country)
            .NotEmpty().WithMessage("Country is required")
            .MaximumLength(50).WithMessage("Country cannot exceed 50 characters");

        RuleFor(p => p.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(s => s == "active" || s == "inactive")
            .WithMessage("Status must be 'active' or 'inactive'");
    }
}

public class UpdatePersonDtoValidator : AbstractValidator<UpdatePersonDto>
{
    public UpdatePersonDtoValidator()
    {
        RuleFor(p => p.Id)
            .GreaterThan(0).WithMessage("Id must be a valid positive number");

        RuleFor(p => p.FirstName)
            .NotEmpty().WithMessage("First Name is required")
            .MaximumLength(30).WithMessage("First Name cannot exceed 30 characters");

        RuleFor(p => p.LastName)
            .NotEmpty().WithMessage("Last Name is required")
            .MaximumLength(30).WithMessage("Last Name cannot exceed 30 characters");

        RuleFor(p => p.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(100).WithMessage("Email cannot exceed 100 characters");

        RuleFor(p => p.PhoneNumber)
            .NotEmpty().WithMessage("Phone Number is required")
            .MaximumLength(20).WithMessage("Phone Number cannot exceed 20 characters");

        RuleFor(p => p.DateOfBirth)
            .NotEmpty().WithMessage("Date Of Birth is required")
            .LessThan(DateTime.Today).WithMessage("Date Of Birth must be in the past");

        RuleFor(p => p.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(200).WithMessage("Address cannot exceed 200 characters");

        RuleFor(p => p.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(50).WithMessage("City cannot exceed 50 characters");

        RuleFor(p => p.Country)
            .NotEmpty().WithMessage("Country is required")
            .MaximumLength(50).WithMessage("Country cannot exceed 50 characters");

        RuleFor(p => p.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(s => s == "active" || s == "inactive")
            .WithMessage("Status must be 'active' or 'inactive'");
    }
}