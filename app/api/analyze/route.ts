import { NextRequest } from 'next/server';
import { processRequest } from '@/lib/ai/orchestrator';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { OrchestrationRequest, StreamChunk } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized', details: 'User not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const { message, history, image } = await req.json();
    
    if (!message || !image) {
      return new Response(JSON.stringify({ success: false, error: 'Message and image are required for analysis', details: 'Message and image are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const request: OrchestrationRequest = {
      userId: user.id,
      message,
      history: history || [],
      image,
    };

    // The orchestrator will automatically route this to Vision
    const { stream, generatedImage } = await processRequest(request);

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
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
        } catch (streamError) {
          logger.error('Stream processing error in /analyze', { error: streamError });
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let details = errorMessage;
    let stack: string | undefined;
    if (error instanceof Error) {
      if (process.env.NODE_ENV !== 'production') stack = error.stack;
    } else if (typeof error === 'object' && error !== null) {
      details = JSON.stringify(error);
    }
    logger.error('API /analyze error', { error: errorMessage });
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      details,
      ...(process.env.NODE_ENV !== 'production' && stack ? { stack } : {})
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
