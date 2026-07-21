import { NextResponse } from 'next/server';
import { processRequest } from '@/lib/ai/orchestrator';
import { ChatApiError } from '@/lib/ai/types';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const result = await processRequest({
      userId: '00000000-0000-0000-0000-000000000000',
      message: 'Hello',
      history: [],
    });

    return NextResponse.json({
      success: true,
      intent: result.intent,
      executionTimeMs: Date.now() - startTime,
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

    return NextResponse.json({
      success: false,
      error: errorMessage,
      details,
      provider,
      ...(process.env.NODE_ENV !== 'production' && stack ? { stack } : {}),
      executionTimeMs: Date.now() - startTime,
    }, { status });
  }
}
