import { post } from "./api";

export const submitFeedback = (payload) => post("/feedback", payload);
