import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';

if (!process.env.GEMINI_MODEL) {
  throw new Error('CRITICAL STARTUP ERROR: Missing GEMINI_MODEL environment variable. Please define it in your .env.local file.');
}
if (!process.env.GOOGLE_API_KEY) {
  throw new Error('CRITICAL STARTUP ERROR: Missing GOOGLE_API_KEY environment variable. Please define it in your .env.local file.');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export function getGeminiModel(systemInstruction?: string, generationConfig?: GenerationConfig) {
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL as string,
    ...(systemInstruction && { systemInstruction }),
    ...(generationConfig && { generationConfig })
  });
}
