using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.AiDialogs.Queries;

public record GetAiDialogsQuery(Guid UserId) : IRequest<List<AiDialogListItemDto>>;
