import googleTrends from 'google-trends-api';
import Parser from 'rss-parser';
import { createClient } from '@/lib/supabase/server';
import { logger } from '../../logger';
import { TrendResult } from '../types';

const parser = new Parser();

const RSS_FEEDS = {
  fashion: ['https://www.vogue.com/feed/fashion', 'https://www.gq.com/feed/style'],
  beauty: ['https://www.allure.com/feed/makeup', 'https://www.gq.com/feed/grooming'],
};

export async function getTrendingFashion(): Promise<TrendResult[]> {
  return fetchCachedTrends('fashion');
}

export async function getTrendingSkincare(): Promise<TrendResult[]> {
  return fetchCachedTrends('skincare');
}

export async function getTrendingHairstyles(): Promise<TrendResult[]> {
  return fetchCachedTrends('hairstyles');
}

/**
 * Fetches cached trends from Supabase to avoid aggressive external API rate limits.
 */
async function fetchCachedTrends(category: string): Promise<TrendResult[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('trends_cache')
    .select('data')
    .eq('category', category)
    .single();

  return (data?.data as TrendResult[]) || [];
}

/**
 * Background hook to refresh the trend cache.
 * Should be called via a Cron job or API route.
 */
export async function refreshTrendCache(): Promise<void> {
  const startTime = Date.now();
  try {
    const supabase = await createClient();
    
    // Fetch RSS Fashion
    let fashionData: TrendResult[] = [];
    for (const feed of RSS_FEEDS.fashion) {
      const feedData = await parser.parseURL(feed);
      const parsedItems = feedData.items.slice(0, 5).map(item => ({ title: item.title || '', link: item.link || '' }));
      fashionData = fashionData.concat(parsedItems);
    }
    
    // Fetch Google Trends for Skincare/Hairstyles
    // Just mock fetching the related queries for 'skincare' as an example
    const skincareTrendsStr = await googleTrends.relatedQueries({keyword: 'skincare trends'});
    const skincareTrendsData = JSON.parse(skincareTrendsStr);
    const skincareTrends: TrendResult[] = skincareTrendsData.default?.rankedList?.[0]?.rankedKeyword?.map((k: { query: string }) => ({ query: k.query })) || [];

    const hairstyleTrendsStr = await googleTrends.relatedQueries({keyword: 'hairstyles'});
    const hairstyleTrendsData = JSON.parse(hairstyleTrendsStr);
    const hairstyleTrends: TrendResult[] = hairstyleTrendsData.default?.rankedList?.[0]?.rankedKeyword?.map((k: { query: string }) => ({ query: k.query })) || [];

    // Store in Supabase
    await supabase.from('trends_cache').upsert([
      { category: 'fashion', data: fashionData, updated_at: new Date().toISOString() },
      { category: 'skincare', data: skincareTrends, updated_at: new Date().toISOString() },
      { category: 'hairstyles', data: hairstyleTrends, updated_at: new Date().toISOString() }
    ]);

    logger.info('Trends cache refreshed successfully', {
      provider: 'trends-engine',
      executionTimeMs: Date.now() - startTime,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'object' && error !== null && 'message' in (error as Record<string, unknown>) ? String((error as Record<string, unknown>).message) : String(error));
    logger.error('Trends cache refresh failed', {
      provider: 'trends-engine',
      error: errorMessage,
      executionTimeMs: Date.now() - startTime,
    });
  }
}
