import { NextResponse } from 'next/server';

export async function GET() {
  const providers = {
    gemini: !!process.env.GOOGLE_API_KEY,
    huggingface: !!process.env.HUGGINGFACE_API_KEY,
    tavily: !!process.env.TAVILY_API_KEY
  };

  return NextResponse.json(providers);
}
