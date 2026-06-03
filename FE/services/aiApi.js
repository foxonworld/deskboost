import { get, post } from "./api";

const USE_MOCK_AI = import.meta.env.VITE_USE_MOCK_AI === "true";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const now = () => new Date().toISOString();

const defaultQuota = () => ({
  hasVerifiedPlant: false,
  chat: {
    limit: 5,
    used: 0,
    remaining: 5,
    resetAt: null,
  },
  diagnosis: {
    limit: 2,
    used: 0,
    remaining: 2,
    resetAt: null,
  },
  source: "local-fallback",
});

const mockDialogs = [
  {
    id: "dlg_mock_001",
    plantId: "user-1",
    plantName: "Spikey",
    title: "Watering guidance",
    lastMessage: "Water only when soil is dry.",
    createdAt: now(),
    messages: [
      { role: "user", content: "How often should I water it?" },
      {
        role: "assistant",
        content: "Check the top soil first; snake plants prefer drying out.",
      },
    ],
  },
];

const makePlantReply = ({ plantId, message, plantContext }) => {
  const plantName =
    plantContext?.nickname || plantContext?.name || "selected plant";
  const species = plantContext?.species || "plant";
  const status = plantContext?.status || "unknown";

  return {
    dialogId: `dlg_mock_${Date.now()}`,
    plantId,
    reply: `Mock AI care reply for ${plantName} (${species}). Current status: ${status}. Based on your question: "${message}", keep advice focused on watering, light, soil, and visible health only.`,
    disclaimer:
      "AI advice is for reference only. Backend AI is not connected yet.",
    createdAt: now(),
    source: "mock-fallback",
  };
};

const fallback = async (factory) => {
  await delay();
  return factory();
};

const requestOrExplicitMock = async (requestFn, fallbackFn) => {
  if (USE_MOCK_AI) return fallback(fallbackFn);
  return requestFn();
};

const toDiagnoseFormData = ({ imageFile, plantId, question } = {}) => {
  if (!(imageFile instanceof File)) {
    throw new Error("Please select a valid image file before diagnosing.");
  }

  const formData = new FormData();
  formData.append("Image", imageFile);
  if (plantId) formData.append("PlantId", plantId);
  if (question) formData.append("Question", question);
  return formData;
};

const formatConfidence = (confidence) => {
  if (typeof confidence !== "number") return null;
  return `${Math.round(confidence * 100)}%`;
};

const normalizeDiagnosisResult = (result) => {
  if (!result || result.source === "mock-fallback") return result;

  const confidenceText = formatConfidence(result.confidence);
  const summaryParts = [];
  if (result.message) summaryParts.push(result.message);
  if (result.disease) summaryParts.push(`Detected: ${result.disease}`);
  if (confidenceText) summaryParts.push(`Confidence: ${confidenceText}`);
  if (result.severity) summaryParts.push(`Severity: ${result.severity}`);

  const recommendations = [
    result.cause ? `Cause: ${result.cause}` : null,
    result.treatment ? `Treatment: ${result.treatment}` : null,
    result.prevention ? `Prevention: ${result.prevention}` : null,
  ].filter(Boolean);

  if (!recommendations.length && Array.isArray(result.suggestions)) {
    result.suggestions.slice(0, 3).forEach((item) => {
      const itemConfidence = formatConfidence(item.probability);
      recommendations.push(
        itemConfidence ? `${item.name} (${itemConfidence})` : item.name,
      );
    });
  }

  return {
    ...result,
    summary: summaryParts.join(" · "),
    recommendations,
  };
};

export const diagnosePlant = (payload = {}) =>
  requestOrExplicitMock(
    async () => normalizeDiagnosisResult(await post("/ai/diagnose", toDiagnoseFormData(payload))),
    () => ({
      diagnosisId: `diag_mock_${Date.now()}`,
      plantId: payload?.plantId,
      summary:
        "Mock diagnosis fallback. Backend AI diagnose endpoint is unavailable.",
      recommendations: [
        "Check light exposure.",
        "Avoid overwatering.",
        "Inspect leaves weekly.",
      ],
      createdAt: now(),
      source: "mock-fallback",
    }),
  );

export const sendPlantContextChatMessage = ({
  plantId,
  message,
  history = [],
  plantContext,
  diagnosisResultId,
}) => {
  const payload = {
    plantId,
    message,
    history,
    plantContext,
    diagnosisResultId,
  };
  return requestOrExplicitMock(
    () => post("/ai/chat", payload),
    () => makePlantReply(payload),
  );
};

export const chatWithAI = sendPlantContextChatMessage;

export const getMyAiDialogs = (params) =>
  requestOrExplicitMock(
    () => get("/ai/dialogs", params),
    () => ({ items: mockDialogs, source: "mock-fallback" }),
  );

export const getMyAiDialog = (id) =>
  requestOrExplicitMock(
    () => get(`/ai/dialogs/${id}`),
    () => mockDialogs.find((dialog) => dialog.id === id) || null,
  );

export const getAiConfigStatus = () =>
  requestOrExplicitMock(
    () => get("/admin/ai-config/status"),
    () => ({
      provider: "gemini",
      configured: false,
      mode: "mock-fallback",
      lastCheckedAt: now(),
    }),
  );

export const getAiQuota = () =>
  requestOrExplicitMock(
    async () => {
      try {
        return await get("/ai/quota");
      } catch (err) {
        if (err?.status === 404) return defaultQuota();
        throw err;
      }
    },
    defaultQuota,
  );

// Backward-compatible aliases during MVP cleanup.
export const apiDiagnoseImage = (
  imageFile,
  plantId,
  question = "What is wrong with this plant?",
) => diagnosePlant({ plantId, imageFile, question });

export const apiChatWithAI = (message, history = [], plantId, plantContext) =>
  sendPlantContextChatMessage({ plantId, message, history, plantContext });
