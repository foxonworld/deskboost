import { post } from "./api";

export const IMAGE_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

export const validateImageFile = (file) => {
  if (!file) return "Please select an image file.";
  if (!IMAGE_UPLOAD_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WebP, or GIF images are supported.";
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return "Image size must be 5MB or smaller.";
  }
  return "";
};

const normalizeImageUrl = (response = {}) =>
  response.url ||
  response.imageUrl ||
  response.secureUrl ||
  response.data?.url ||
  "";

export const uploadImage = async (file) => {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const formData = new FormData();
  formData.append("file", file);

  const response = await post("/upload/image", formData);
  const imageUrl = normalizeImageUrl(response);

  if (!imageUrl) throw new Error("Upload succeeded but no image URL was returned.");

  return imageUrl;
};
