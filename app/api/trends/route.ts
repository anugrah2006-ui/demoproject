import { NextResponse } from 'next/server';
import { getTrendingFashion, getTrendingHairstyles, getTrendingSkincare, refreshTrendCache } from '@/lib/ai/trends';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized', details: 'User not authenticated' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const [fashion, hair, skin] = await Promise.all([
      getTrendingFashion(),
      getTrendingHairstyles(),
      getTrendingSkincare()
    ]);

    return NextResponse.json({
      fashion,
      hair,
      skin
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
    logger.error('API /trends GET error', { error: errorMessage });
    return new NextResponse(JSON.stringify({
      success: false,
      error: errorMessage,
      details,
      ...(process.env.NODE_ENV !== 'production' && stack ? { stack } : {})
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// Allow an admin or cron job to trigger a cache refresh
export async function POST() {
  try {
    // In production, add a CRON secret check here
    await refreshTrendCache();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let details = errorMessage;
    let stack: string | undefined;
    if (error instanceof Error) {
      if (process.env.NODE_ENV !== 'production') stack = error.stack;
    } else if (typeof error === 'object' && error !== null) {
      details = JSON.stringify(error);
    }
    logger.error('API /trends POST error', { error: errorMessage });
    return new NextResponse(JSON.stringify({
      success: false,
      error: errorMessage,
      details,
      ...(process.env.NODE_ENV !== 'production' && stack ? { stack } : {})
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
