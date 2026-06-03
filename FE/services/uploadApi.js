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

export const compressImage = (file, maxWidth = 1280, maxHeight = 1280, quality = 0.8) => {
  return new Promise((resolve) => {
    // Chỉ nén nếu file thực sự là ảnh và không phải ảnh GIF động
    if (!file || !file.type.startsWith("image/") || file.type === "image/gif") {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Tính toán kích thước mới dựa trên maxWidth và maxHeight, bảo toàn tỷ lệ khung hình
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Nén và chuyển đổi sang webp
        const outputType = "image/webp";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file); // Fallback nếu nén lỗi
              return;
            }
            // Tạo file mới với định dạng .webp
            const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], newFileName, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file); // Fallback nếu load ảnh lỗi
    };
    reader.onerror = () => resolve(file); // Fallback nếu đọc file lỗi
  });
};

export const uploadImage = async (file) => {
  if (!file) throw new Error("Please select an image file.");
  if (!IMAGE_UPLOAD_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, or GIF images are supported.");
  }

  // Thực hiện nén ảnh trước khi upload
  const compressedFile = await compressImage(file);

  if (compressedFile.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error("Image size must be 5MB or smaller.");
  }

  const formData = new FormData();
  formData.append("file", compressedFile);

  const response = await post("/upload/image", formData);
  const imageUrl = normalizeImageUrl(response);

  if (!imageUrl) throw new Error("Upload succeeded but no image URL was returned.");

  return imageUrl;
};
