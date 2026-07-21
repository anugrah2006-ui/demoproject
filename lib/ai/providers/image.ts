import { HfInference } from '@huggingface/inference';
import { logger } from '../../logger';
import { ChatApiError } from '../types';

const apiKey = process.env.HUGGINGFACE_API_KEY || '';
const hf = new HfInference(apiKey);

export async function generateImage(prompt: string): Promise<string | null> {
  const startTime = Date.now();
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new ChatApiError('huggingface', 500, 'Missing HUGGINGFACE_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'huggingface' });
  try {
    const response = await hf.textToImage({
      // We can use a fast SDXL lightning model or similar for good fashion/grooming results
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: {
        negative_prompt: 'ugly, blurry, deformed, text, watermark',
      }
    }) as unknown as Blob;
    
    // The response is a Blob. We can convert to base64 or return as ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:${response.type};base64,${base64}`;

    logger.info('[CHAT] Provider API Response Received', {
      provider: 'huggingface',
      executionTimeMs: Date.now() - startTime,
    });
    
    return dataUrl;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('huggingface', status, `Image generation failed: ${errorMessage}`, stack);
  }
}
