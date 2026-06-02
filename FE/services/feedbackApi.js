import { get, post } from "./api";

const normalizeItems = (data) => (Array.isArray(data) ? data : data?.items || data?.data || []);
const firstValue = (...values) =>
  values.find((value) => value !== undefined && value !== null) ?? "";

export const normalizeFeedback = (feedback = {}) => ({
  id: firstValue(feedback.id, feedback.Id),
  customerAlias: firstValue(feedback.customerAlias, feedback.userName, feedback.UserName, feedback.displayName),
  rating: Number(firstValue(feedback.rating, feedback.Rating, 0)),
  comment: firstValue(feedback.comment, feedback.message, feedback.Message),
  marketplaceItemId: firstValue(feedback.marketplaceItemId, feedback.MarketplaceItemId),
  purchaseChannel: firstValue(feedback.purchaseChannel, feedback.channel),
  publicImageUrls: firstValue(feedback.publicImageUrls, feedback.PublicImageUrls, []),
  isVerified: Boolean(firstValue(feedback.isVerified, feedback.IsVerified, feedback.verified, feedback.verifiedAt, feedback.VerifiedAt)),
  verificationType: firstValue(feedback.verificationType, feedback.trustType),
  createdAt: firstValue(feedback.createdAt, feedback.CreatedAt),
});

export const toFeedbackPayload = (payload = {}) => ({
  message: payload.message || payload.comment,
  rating: Number(payload.rating || 0),
});

export const submitFeedback = (payload) =>
  post("/feedback", toFeedbackPayload(payload)).then((response) => ({
    ...response,
    id: response?.id,
    message: response?.message,
  }));

export const getVerifiedFeedback = async (params = {}) => {
  try {
    const data = await get("/feedback/verified", params);
    return {
      items: normalizeItems(data)
        .map((item) => ({ ...normalizeFeedback(item), isVerified: true }))
        .filter((feedback) => feedback.comment),
      source: data?.source || "backend",
      supported: true,
    };
  } catch (error) {
    console.warn("[DeskBoost] Verified feedback endpoint unavailable", error);
    return {
      items: [],
      source: "backend-unavailable",
      supported: false,
      blocker: error?.status === 404 ? "missing-verified-feedback-endpoint" : "verified-feedback-unavailable",
    };
  }
};
