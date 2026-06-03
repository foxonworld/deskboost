using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Auth.Commands;

public record GoogleLoginCommand(string IdToken) : IRequest<AuthResponse>;
