using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public record GetMarketplacePlantByIdQuery(Guid Id) : IRequest<MarketplacePlantDto?>;
