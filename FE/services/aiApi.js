import { post } from './api';

/**
 * AI API – proxy to Gemini via backend
 * The backend holds the Gemini API key; FE just sends requests here.
 * TODO: connect to backend when ready
 */

/**
 * Send a plant image (base64) for AI diagnosis.
 * @param {string} base64Image - data URL from FileReader
 * @returns {Promise<{ diagnosis: string, recommendations: string[] }>}
 */
export const apiDiagnoseImage = (base64Image) =>
  post('/ai/diagnose', { image: base64Image });

/**
 * Send a chat message to the AI plant assistant.
 * @param {string} message - user message
 * @param {Array}  history - previous messages [{ role, content }]
 * @returns {Promise<{ reply: string }>}
 */
export const apiChatWithAI = (message, history = []) =>
  post('/ai/chat', { message, history });
