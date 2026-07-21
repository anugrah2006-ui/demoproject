
import { GEMINI_PERSONA_PROMPT } from '../prompts';
import { logger } from '../../logger';
import { ChatMessage, ChatApiError } from '../types';
import { getGeminiModel } from '../config';

export async function chat(messages: ChatMessage[]): Promise<string | null> {
  const startTime = Date.now();
  if (!process.env.GOOGLE_API_KEY) {
    throw new ChatApiError('gemini', 500, 'Missing GOOGLE_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'gemini', type: 'chat' });
  try {
    const model = getGeminiModel(GEMINI_PERSONA_PROMPT);
    
    const formattedMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    const result = await model.generateContent({
      contents: formattedMessages
    });
    
    logger.info('[CHAT] Provider API Response Received', {
      provider: 'gemini',
      type: 'chat',
      executionTimeMs: Date.now() - startTime,
    });
    
    return result.response.text();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('gemini', status, `Gemini chat failed: ${errorMessage}`, stack);
  }
}

export async function stream(messages: ChatMessage[]): Promise<AsyncIterable<unknown>> {
  const startTime = Date.now();
  if (!process.env.GOOGLE_API_KEY) {
    throw new ChatApiError('gemini', 500, 'Missing GOOGLE_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'gemini', type: 'stream' });
  try {
    const model = getGeminiModel(GEMINI_PERSONA_PROMPT);
    
    const formattedMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    const resultStream = await model.generateContentStream({
      contents: formattedMessages
    });
    
    logger.info('[CHAT] Provider API Response Received / Stream Initiated', {
      provider: 'gemini',
      type: 'stream',
      executionTimeMs: Date.now() - startTime,
    });
    
    // Convert GoogleGenerativeAI Stream to standard AsyncIterable containing delta
    async function* generateStream() {
      for await (const chunk of resultStream.stream) {
        yield {
          choices: [
            {
              delta: {
                content: chunk.text()
              }
            }
          ]
        };
      }
    }
    
    return generateStream();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('gemini', status, `Gemini stream failed: ${errorMessage}`, stack);
  }
}

export async function summarizeConversation(messages: ChatMessage[]): Promise<string | null> {
  const startTime = Date.now();
  if (!process.env.GOOGLE_API_KEY) {
    throw new ChatApiError('gemini', 500, 'Missing GOOGLE_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'gemini', type: 'summarize' });
  try {
    const model = getGeminiModel('Summarize the following conversation concisely.');
    
    const formattedMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    const result = await model.generateContent({
      contents: formattedMessages
    });
    
    logger.info('[CHAT] Provider API Response Received', {
      provider: 'gemini',
      type: 'summarize',
      executionTimeMs: Date.now() - startTime,
    });
    
    return result.response.text();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('gemini', status, `Gemini summarize failed: ${errorMessage}`, stack);
  }
}
