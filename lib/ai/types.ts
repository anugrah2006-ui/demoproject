export type IntentType =
  | 'general_chat'
  | 'grooming'
  | 'skincare'
  | 'hairstyle'
  | 'fashion'
  | 'outfit_generation'
  | 'image_analysis'
  | 'image_generation'
  | 'product_recommendation'
  | 'realtime_search'
  | 'trend_search'
  | 'follow_up';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface IntentResult {
  intent: IntentType;
  confidence: number;
  tools: string[];
}

export type RouterResponse = IntentResult;

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export interface TrendResult {
  title?: string;
  link?: string;
  query?: string;
  [key: string]: unknown;
}

export interface VisionResult {
  analysis: string;
}

export interface ImageGenerationResult {
  imageUrl: string;
}

export interface MemoryEntry {
  role: string;
  content: string;
}

export interface MemoryContext {
  history: MemoryEntry[];
  preferences: Record<string, unknown>;
}

export interface AIProviderResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

export class ChatApiError extends Error {
  public stackTrace?: string;

  constructor(
    public provider: string,
    public status: number,
    message: string,
    stackTrace?: string
  ) {
    super(message);
    this.name = 'ChatApiError';
    this.stackTrace = stackTrace || this.stack;
  }
}

export interface OrchestrationRequest {
  userId: string;
  message: string;
  history: ChatMessage[];
  image?: {
    base64: string;
    mimeType: string;
  };
}

export interface OrchestrationResponse {
  stream: AsyncIterable<unknown>;
  generatedImage: string | null;
  intent: IntentType;
}

export interface StreamChunk {
  choices?: Array<{
    delta?: {
      content?: string | null;
    };
  }>;
}
