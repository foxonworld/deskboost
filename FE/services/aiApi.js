import { post } from "./api";

export const diagnosePlant = (payload) => post("/ai/diagnose", payload);
export const chatWithAI = (payload) => post("/ai/chat", payload);

// Backward-compatible aliases during MVP cleanup.
export const apiDiagnoseImage = (
  imageBase64,
  plantId,
  question = "What is wrong with this plant?",
) => diagnosePlant({ plantId, imageBase64, question });

export const apiChatWithAI = (message, history = [], plantId) =>
  chatWithAI({ plantId, message, history });
