# Changelog

## Marketplace Multiple Images Support

Date: 2026-06-11

### Frontend changes

- Admin Marketplace now manages product `images[]` alongside the legacy root `imageUrl` field.
- Admin image tools support adding by URL, uploading, previewing, selecting a primary image, deleting images, URL dedupe, and stable `sortOrder` values.
- Admin create/update requests send `imageUrl` as the selected primary image and `images: [{ imageUrl, sortOrder, isPrimary }]` as the canonical gallery payload.
- Marketplace list still renders only the primary image.
- Marketplace detail renders a gallery with large image, thumbnails, image switching, and fallback to `imageUrl` when `images[]` is empty.
- Marketplace image normalization supports legacy `imageUrl`, new `images[]`, `sortOrder`, and `isPrimary`.

### Backend contract

- `POST /api/admin/marketplace-items` and `PUT /api/admin/marketplace-items/{id}` accept:
  - root `imageUrl` for backward compatibility / selected primary image.
  - `images[]` items with `imageUrl`, `sortOrder`, and `isPrimary`.
- PUT semantics:
  - omitted/null `images` keeps existing images.
  - empty `images: []` removes all images.
  - populated `images[]` replaces all existing images.
- Public/admin responses return root `imageUrl` plus `images[]` items containing `id`, `imageUrl`, `sortOrder`, and `isPrimary`.

### Validation results

- Public `GET /api/marketplace-items` passed and returns root `imageUrl` plus `images[]`.
- Public `GET /api/marketplace-items/{id}` passed and returns root `imageUrl` plus `images[]`.
- Admin `POST /api/admin/marketplace-items` with two images passed; follow-up public detail returned both images and preserved primary image.
- Admin `PUT /api/admin/marketplace-items/{id}` with omitted `images` passed; existing images were preserved.
- Admin `PUT /api/admin/marketplace-items/{id}` with replacement `images[]` currently returns `500` with message `Lỗi lưu dữ liệu ảnh.` on the deployed backend. FE request payload matches the finalized contract, so this remains a backend persistence issue to resolve before replacement, delete-secondary, change-primary, and remove-all image edits can persist through PUT.
- QA-created marketplace items were deleted after validation.
