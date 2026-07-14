import { createClient } from '@/lib/supabase/server';
import { logger } from '../logger';
import { MemoryContext, MemoryEntry } from './types';

export async function getMemoryContext(userId: string): Promise<MemoryContext> {
  const startTime = Date.now();
  try {
    const supabase = await createClient();
    
    // Fetch recent chat history (limit 10 for context window)
    const { data: historyData } = await supabase
      .from('chat_history')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    // Fetch user preferences (e.g. style preferences, skin type)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single();

    logger.info('Memory fetched', {
      provider: 'supabase-memory',
      executionTimeMs: Date.now() - startTime,
    });

    const history: MemoryEntry[] = historyData ? historyData.reverse() as MemoryEntry[] : [];
    
    // Ensure preferences is a Record<string, unknown>
    let preferences: Record<string, unknown> = {};
    if (profileData && profileData.preferences && typeof profileData.preferences === 'object') {
       preferences = profileData.preferences as Record<string, unknown>;
    }

    return {
      history,
      preferences,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    logger.error('Memory fetch failed', {
      provider: 'supabase-memory',
      error: errorMessage,
      executionTimeMs: Date.now() - startTime,
    });
    // Return empty context on failure instead of crashing the orchestrator
    return { history: [], preferences: {} };
  }
}
