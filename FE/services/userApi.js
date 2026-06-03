import { get, put, post } from "./api";

const unwrapProfile = (response = {}) =>
  response.user || response.profile || response.data || response;

const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null) ?? "";

const pickAvatarUrl = (source = {}) =>
  firstValue(
    source.avatarUrl,
    source.AvatarUrl,
    source.avatar,
    source.Avatar,
    source.imageUrl,
    source.ImageUrl,
    source.photoUrl,
    source.PhotoUrl,
    source.profileImageUrl,
    source.ProfileImageUrl,
    source.avatar_url,
    source.image_url,
    source.photo_url,
    source.profile_image_url,
  );

export const normalizeUserProfile = (user = {}) => {
  const source = unwrapProfile(user);
  const displayName = firstValue(
    source.fullName,
    source.name,
    source.displayName,
    source.full_name,
    source.Name,
    source.FullName,
  );

  return {
    ...source,
    displayName,
    fullName: firstValue(source.fullName, source.FullName, displayName),
    name: firstValue(source.name, source.Name, displayName),
    avatarUrl: pickAvatarUrl(source),
    phone: firstValue(source.phone, source.phoneNumber, source.phone_number, source.Phone, source.PhoneNumber),
    email: firstValue(source.email, source.Email),
    claimedPlantsCount: Number(firstValue(source.claimedPlantsCount, source.ClaimedPlantsCount, source.claimed_plants_count, 0)) || 0,
  };
};

export const toUserProfilePayload = (payload = {}) => ({
  fullName: payload.fullName || payload.displayName || payload.name,
  name: payload.name || payload.displayName || payload.fullName,
  avatarUrl: payload.avatarUrl,
  phone: payload.phone,
});

export const getMe = () => get("/users/me").then(normalizeUserProfile);
export const updateMe = (payload) =>
  put("/users/me", toUserProfilePayload(payload)).then(normalizeUserProfile);
export const changePassword = (currentPassword, newPassword) =>
  post("/users/me/change-password", { currentPassword, newPassword });
