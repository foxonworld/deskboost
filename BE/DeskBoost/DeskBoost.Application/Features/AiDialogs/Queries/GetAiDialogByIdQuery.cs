using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.AiDialogs.Queries;

public record GetAiDialogByIdQuery(Guid DialogId, Guid UserId) : IRequest<AiDialogDetailDto?>;
