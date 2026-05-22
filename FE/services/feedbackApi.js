import { get, post } from "./api";
import { VERIFIED_FEEDBACK } from "../data/mockData";

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const publicFeedback = (items) =>
  items.map(({ evidenceNote, ...feedback }) => feedback);

export const submitFeedback = (payload) => post("/feedback", payload);

export const getVerifiedFeedback = async (params = {}) => {
  try {
    const data = await get("/feedback/verified", params);
    return {
      items: publicFeedback(data?.items || data || []),
      source: data?.source || "backend",
    };
  } catch {
    await delay();
    const items = params.catalogPlantId
      ? VERIFIED_FEEDBACK.filter(
          (feedback) => feedback.catalogPlantId === params.catalogPlantId,
        )
      : VERIFIED_FEEDBACK;

    return {
      items: publicFeedback(items),
      source: "mock-fallback",
    };
  }
};
