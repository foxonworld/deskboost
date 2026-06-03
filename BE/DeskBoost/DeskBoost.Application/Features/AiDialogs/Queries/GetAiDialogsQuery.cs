using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.AiDialogs.Queries;

public record GetAiDialogsQuery(Guid UserId, Guid? PlantId = null, int? Limit = null) : IRequest<List<AiDialogListItemDto>>;
