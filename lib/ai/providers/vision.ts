import { getGeminiModel } from '../config';
import { VISION_ANALYSIS_PROMPT } from '../prompts';
import { logger } from '../../logger';
import { ChatApiError } from '../types';

export async function analyzeImage(imageBase64: string, mimeType: string, prompt: string): Promise<string> {
  const startTime = Date.now();
  if (!process.env.GOOGLE_API_KEY) {
    throw new ChatApiError('gemini-vision', 500, 'Missing GOOGLE_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'gemini-vision' });
  try {
    // We use getGeminiModel which provides the centrally configured model
    const model = getGeminiModel();
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType
      },
    };

    const fullPrompt = `${VISION_ANALYSIS_PROMPT}\n\nUser Request: ${prompt}`;
    
    const result = await model.generateContent([fullPrompt, imagePart]);
    const response = await result.response;
    
    logger.info('[CHAT] Provider API Response Received', {
      provider: 'gemini-vision',
      executionTimeMs: Date.now() - startTime,
    });
    
    return response.text();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('gemini-vision', status, `Vision analysis failed: ${errorMessage}`, stack);
  }
}
