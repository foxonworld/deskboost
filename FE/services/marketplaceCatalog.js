const getItems = (response) =>
  Array.isArray(response) ? response : response?.items || response?.data || [];

const getPagination = (response) =>
  Array.isArray(response) ? null : response?.pagination || response?.Pagination || null;

const uniqueById = (items) => {
  const seenIds = new Set();

  return items.filter((item) => {
    const id = item?.id ?? item?.Id;
    if (id === undefined || id === null || id === "") return true;

    const key = String(id);
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });
};

export const normalizeMarketplaceCategory = (category) =>
  typeof category === "string" ? category.trim().toLowerCase() : "";

const categoryPriorities = {
  plant: 0,
  pot: 1,
  soil: 2,
  fertilizer: 3,
  accessory: 4,
  other: 5,
};

export const getMarketplaceCategoryPriority = (category) =>
  categoryPriorities[normalizeMarketplaceCategory(category)] ?? 6;

export const filterMarketplacePlants = (
  plants,
  { searchTerm = "", category = "all", sortBy = "popular" } = {},
) => {
  const normalizedFilter = normalizeMarketplaceCategory(category);
  const normalizedSearch = String(searchTerm).toLowerCase();

  return plants
    .filter((plant) => plant.status === "Active" || plant.status === "Out of Stock")
    .filter((plant) => {
      const matchesSearch = String(plant.name || "").toLowerCase().includes(normalizedSearch);
      const matchesCategory = normalizedFilter === "all"
        || normalizeMarketplaceCategory(plant.category) === normalizedFilter;
      return matchesSearch && matchesCategory;
    })
    .map((plant, index) => ({ plant, index }))
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "priceAsc") comparison = a.plant.price - b.plant.price;
      if (sortBy === "priceDesc") comparison = b.plant.price - a.plant.price;
      if (sortBy === "popular" && normalizedFilter === "all") {
        comparison = getMarketplaceCategoryPriority(a.plant.category)
          - getMarketplaceCategoryPriority(b.plant.category);
      }

      return comparison || a.index - b.index;
    })
    .map(({ plant }) => plant);
};

export const getAllMarketplacePlants = async (fetchPage) => {
  const firstResponse = await fetchPage();
  const pagination = getPagination(firstResponse);
  const totalPages = Number(pagination?.totalPages);
  const currentPage = Number(pagination?.page);
  const firstPage = Number.isInteger(currentPage) && currentPage > 0 ? currentPage : 1;
  const items = [...getItems(firstResponse)];

  if (!Number.isInteger(totalPages) || totalPages <= firstPage) {
    return {
      ...(Array.isArray(firstResponse) ? {} : firstResponse),
      items: uniqueById(items),
    };
  }

  for (let page = firstPage + 1; page <= totalPages; page += 1) {
    const response = await fetchPage({ page });
    items.push(...getItems(response));
  }

  return {
    ...(Array.isArray(firstResponse) ? {} : firstResponse),
    items: uniqueById(items),
  };
};
