import { tavily } from '@tavily/core';
import { logger } from '../../logger';
import { SearchResult, ChatApiError } from '../types';

const apiKey = process.env.TAVILY_API_KEY || '';
const tvly = tavily({ apiKey });

export async function searchWeb(query: string): Promise<SearchResult[]> {
  const startTime = Date.now();
  if (!process.env.TAVILY_API_KEY) {
    throw new ChatApiError('tavily', 500, 'Missing TAVILY_API_KEY environment variable');
  }
  logger.info('[CHAT] Provider API Request Started', { provider: 'tavily' });
  try {
    const response = await tvly.search(query, {
      searchDepth: 'basic',
      includeImages: false,
      maxResults: 5,
    });
    
    logger.info('[CHAT] Provider API Response Received', {
      provider: 'tavily',
      executionTimeMs: Date.now() - startTime,
    });
    
    return response.results.map(r => ({
      title: r.title,
      url: r.url,
      content: r.content
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    const status = error && typeof error === 'object' && 'status' in error && typeof error.status === 'number' ? error.status : 500;
    const stack = error instanceof Error ? error.stack : undefined;
    throw new ChatApiError('tavily', status, `Search failed: ${errorMessage}`, stack);
  }
}
