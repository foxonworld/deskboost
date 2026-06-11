const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "") ?? "";

const toImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return firstValue(image.url, image.Url, image.imageUrl, image.ImageUrl);
};

const isPrimaryImage = (image) => {
  if (!image || typeof image === "string") return false;
  return Boolean(firstValue(image.isPrimary, image.IsPrimary, image.primary, image.Primary, false));
};

const getSortOrder = (image, index) => {
  if (!image || typeof image === "string") return index;
  const sortOrder = Number(firstValue(image.sortOrder, image.SortOrder, index));
  return Number.isFinite(sortOrder) ? sortOrder : index;
};

export const normalizeMarketplaceImages = (item = {}) => {
  const rawImages = firstValue(item.images, item.Images, []);
  const imageItems = Array.isArray(rawImages)
    ? [...rawImages].sort((a, b) => getSortOrder(a, 0) - getSortOrder(b, 0))
    : [];
  const primaryFromImages = imageItems.find(isPrimaryImage);
  const primaryUrl = firstValue(
    item.primaryImageUrl,
    item.PrimaryImageUrl,
    toImageUrl(item.primaryImage),
    toImageUrl(item.PrimaryImage),
    toImageUrl(primaryFromImages),
    item.imageUrl,
    item.ImageUrl,
    item.image,
    item.Image,
  );

  const urls = [...imageItems.map(toImageUrl), primaryUrl, item.imageUrl, item.ImageUrl, item.image, item.Image]
    .filter(Boolean);

  const images = Array.from(new Set(urls));
  return {
    images,
    primaryImage: primaryUrl || images[0] || "",
  };
};
