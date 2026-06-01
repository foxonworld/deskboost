using DeskBoost.Application.Common.Models;
using MediatR;

namespace DeskBoost.Application.Features.Marketplace.Queries;

public record GetMarketplaceItemByIdQuery(Guid Id) : IRequest<MarketplaceItemDto?>;
