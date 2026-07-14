import { NextRequest } from 'next/server';
import { processRequest } from '@/lib/ai/orchestrator';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { OrchestrationRequest, StreamChunk, ChatApiError } from '@/lib/ai/types';

const REQUIRED_ENV_VARS = [
  'XAI_API_KEY',
  'GOOGLE_API_KEY',
  'HUGGINGFACE_API_KEY',
  'TAVILY_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

export async function POST(req: NextRequest) {
  try {
    const missingVars = REQUIRED_ENV_VARS.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
      const errorMsg = `Missing environment variable(s): ${missingVars.join(', ')}`;
      logger.error(errorMsg, { provider: 'system', status: 500 });
      return new Response(JSON.stringify({
        success: false,
        error: errorMsg,
        details: errorMsg
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized', details: 'User not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { message, history, image } = await req.json();
    
    if (!message) {
      return new Response(JSON.stringify({ success: false, error: 'Message is required', details: 'Message is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    logger.info('[CHAT] Incoming Request', { userId: user.id });

    const request: OrchestrationRequest = {
      userId: user.id,
      message,
      history: history || [],
      image,
    };

    const { stream, generatedImage } = await processRequest(request);

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        // Send initial metadata chunk if image was generated
        if (generatedImage) {
           controller.enqueue(encoder.encode(`[META:IMAGE=${generatedImage}]\n`));
        }
        
        try {
          for await (const chunk of stream) {
            const streamChunk = chunk as StreamChunk;
            const content = streamChunk.choices?.[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          logger.info('[CHAT] Response Returned', { userId: user.id, stream: true });
        } catch (streamError) {
          logger.error('Stream processing error', { error: streamError });
          const errorMsg = streamError instanceof Error ? streamError.message : String(streamError);
          controller.enqueue(encoder.encode(`\n[Stream Error: ${errorMsg}]\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(customStream, {
      headers: { 'Content-Type': 'text/event-stream' }
    });

  } catch (error: unknown) {
    let status = 500;
    let provider = 'system';
    let errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let stack: string | undefined;

    let details = errorMessage;
    if (error instanceof ChatApiError) {
      status = error.status;
      provider = error.provider;
      errorMessage = error.message;
      if (process.env.NODE_ENV !== 'production' && error.stackTrace) {
        stack = error.stackTrace;
      }
    } else if (error instanceof Error) {
      if (process.env.NODE_ENV !== 'production') {
        stack = error.stack;
      }
    } else if (typeof error === 'object' && error !== null) {
      details = JSON.stringify(error);
    }
    
    logger.error(errorMessage, { provider, status, error });
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage, 
      details,
      ...(process.env.NODE_ENV !== 'production' && stack ? { stack } : {})
    }), { status, headers: { 'Content-Type': 'application/json' } });
  }
}
