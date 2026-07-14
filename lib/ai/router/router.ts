import { Schema, SchemaType } from '@google/generative-ai';
import { ROUTER_SYSTEM_PROMPT } from '../prompts';
import { logger } from '../../logger';
import { RouterResponse, ChatApiError } from '../types';
import { getGeminiModel } from '../config';

const routerSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    intent: {
      type: SchemaType.STRING,
      description: "The primary intent of the user's message.",
    },
    confidence: {
      type: SchemaType.NUMBER,
      description: "Confidence score between 0.0 and 1.0",
    },
    tools: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
      description: "List of recommended tools to satisfy this intent (e.g., 'vision', 'gemini', 'image', 'search', 'trends')",
    },
  },
  required: ['intent', 'confidence', 'tools'],
};

export async function determineIntent(message: string): Promise<RouterResponse> {
  const startTime = Date.now();
  if (!process.env.GOOGLE_API_KEY) {
    throw new ChatApiError('gemini-router', 500, 'Missing GOOGLE_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'gemini-router' });
  try {
    const model = getGeminiModel(ROUTER_SYSTEM_PROMPT, {
        responseMimeType: 'application/json',
        responseSchema: routerSchema,
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    const parsed = JSON.parse(text) as RouterResponse;

    logger.info('[CHAT] Provider API Response Received', {
      provider: 'gemini-router',
      intent: parsed.intent,
      confidence: parsed.confidence,
      executionTimeMs: Date.now() - startTime,
    });

    return parsed;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('gemini-router', status, `Intent routing failed: ${errorMessage}`, stack);
  }
}
