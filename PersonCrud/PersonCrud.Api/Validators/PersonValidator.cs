using FluentValidation;
using PersonCrud.Api.Models;

namespace PersonCrud.Api.Validators;

public class PersonValidator : AbstractValidator<Person>
{
    public PersonValidator()
    {
        RuleFor(p => p.FirstName)
        .NotEmpty().WithMessage("FirstName can not be empty")
        .MaximumLength(30)
        .WithMessage("FirstName can not exceed 30 characters");

        RuleFor(p => p.LastName)
       .NotEmpty().WithMessage("LastName can not be empty")
       .MaximumLength(30)
       .WithMessage("LastName can not exceed 30 characters");
    }
}
