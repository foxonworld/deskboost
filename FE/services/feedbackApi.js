import { get, post } from "./api";

const normalizeItems = (data) => (Array.isArray(data) ? data : data?.items || data?.data || []);

export const normalizeFeedback = (feedback = {}) => ({
  id: feedback.id,
  customerAlias: feedback.customerAlias || feedback.userName || feedback.displayName || "",
  rating: Number(feedback.rating || 0),
  comment: feedback.comment || feedback.message || "",
  catalogPlantId: feedback.catalogPlantId || feedback.marketplacePlantId || feedback.plantId,
  purchaseChannel: feedback.purchaseChannel || feedback.channel || "",
  isVerified: Boolean(feedback.isVerified ?? feedback.verified ?? feedback.verifiedAt),
  verificationType: feedback.verificationType || feedback.trustType || "",
  createdAt: feedback.createdAt,
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
    return {
      items: [],
      source: "backend-unavailable",
      supported: false,
      blocker: error?.status === 404 ? "missing-verified-feedback-endpoint" : "verified-feedback-unavailable",
    };
  }
};
