import OpenAI from 'openai';
import { GROK_PERSONA_PROMPT } from '../prompts';
import { logger } from '../../logger';
import { ChatMessage, ChatApiError } from '../types';

const apiKey = process.env.XAI_API_KEY || '';

const openai = new OpenAI({
  apiKey,
  baseURL: 'https://api.x.ai/v1',
});

export async function chat(messages: ChatMessage[]): Promise<string | null> {
  const startTime = Date.now();
  if (!process.env.XAI_API_KEY) {
    throw new ChatApiError('grok', 500, 'Missing XAI_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'grok', type: 'chat' });
  try {
    const response = await openai.chat.completions.create({
      model: 'grok-2-latest',
      messages: [
        { role: 'system', content: GROK_PERSONA_PROMPT },
        ...messages
      ],
    });
    
    logger.info('[CHAT] Provider API Response Received', {
      provider: 'grok',
      type: 'chat',
      executionTimeMs: Date.now() - startTime,
    });
    
    return response.choices[0].message.content;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('grok', status, `Grok chat failed: ${errorMessage}`, stack);
  }
}

export async function stream(messages: ChatMessage[]): Promise<AsyncIterable<unknown>> {
  const startTime = Date.now();
  if (!process.env.XAI_API_KEY) {
    throw new ChatApiError('grok', 500, 'Missing XAI_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'grok', type: 'stream' });
  try {
    const responseStream = await openai.chat.completions.create({
      model: 'grok-2-latest',
      messages: [
        { role: 'system', content: GROK_PERSONA_PROMPT },
        ...messages
      ],
      stream: true,
    });
    
    logger.info('[CHAT] Provider API Response Received / Stream Initiated', {
      provider: 'grok',
      type: 'stream',
      executionTimeMs: Date.now() - startTime,
    });
    
    return responseStream;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('grok', status, `Grok stream failed: ${errorMessage}`, stack);
  }
}

export async function summarizeConversation(messages: ChatMessage[]): Promise<string | null> {
  const startTime = Date.now();
  if (!process.env.XAI_API_KEY) {
    throw new ChatApiError('grok', 500, 'Missing XAI_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'grok', type: 'summarize' });
  try {
    const response = await openai.chat.completions.create({
      model: 'grok-2-latest',
      messages: [
        { role: 'system', content: 'Summarize the following conversation concisely.' },
        ...messages
      ],
    });
    logger.info('[CHAT] Provider API Response Received', {
      provider: 'grok',
      type: 'summarize',
      executionTimeMs: Date.now() - startTime,
    });
    return response.choices[0].message.content;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('grok', status, `Grok summarize failed: ${errorMessage}`, stack);
  }
}
