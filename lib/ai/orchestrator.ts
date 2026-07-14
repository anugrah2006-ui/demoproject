import { determineIntent } from './router/router';
import { stream } from './providers/grok';
import { analyzeImage } from './providers/vision';
import { generateImage } from './providers/image';
import { searchWeb } from './providers/search';
import { getTrendingFashion, getTrendingHairstyles, getTrendingSkincare } from './trends';
import { getMemoryContext } from './memory';
import { logger } from '../logger';
import { OrchestrationRequest, OrchestrationResponse, ChatMessage } from './types';

export async function processRequest(request: OrchestrationRequest): Promise<OrchestrationResponse> {
  const startTime = Date.now();
  // 1. Memory Fetch
    const memory = await getMemoryContext(request.userId);
    
    // 2. Intent Routing
    const routerContext = request.image ? `[User uploaded an image] ${request.message}` : request.message;
    logger.info('[CHAT] Intent Router processing...', { userId: request.userId });
    const routing = await determineIntent(routerContext);
    logger.info('[CHAT] Provider Selected', { intent: routing.intent, tools: routing.tools });
    
    // 3. Tool Execution & Context Gathering
    let enrichedContext = '';
    let generatedImageUrl = '';

    if (request.image && (routing.tools.includes('vision') || routing.intent === 'image_analysis')) {
      const visionAnalysis = await analyzeImage(request.image.base64, request.image.mimeType, request.message);
      enrichedContext += `\n\n[Vision Analysis Result]: ${visionAnalysis}`;
    }

    if (routing.intent === 'trend_search' || routing.tools.includes('trends')) {
      const [fashion, hair, skin] = await Promise.all([
        getTrendingFashion(),
        getTrendingHairstyles(),
        getTrendingSkincare()
      ]);
      enrichedContext += `\n\n[Trending Fashion]: ${JSON.stringify(fashion)}\n[Trending Hairstyles]: ${JSON.stringify(hair)}\n[Trending Skincare]: ${JSON.stringify(skin)}`;
    }

    if (routing.intent === 'realtime_search' || routing.tools.includes('search')) {
      const searchResults = await searchWeb(request.message);
      enrichedContext += `\n\n[Realtime Search Results]: ${JSON.stringify(searchResults)}`;
    }

    if (routing.intent === 'outfit_generation' || routing.intent === 'image_generation' || routing.tools.includes('image')) {
      const img = await generateImage(request.message);
      if (img) {
        generatedImageUrl = img;
        enrichedContext += `\n\n[System Note]: You have successfully generated an image for the user. Acknowledge and describe it elegantly.`;
      }
    }

    // 4. Formulate Final Response with Grok
    let finalUserMessage = `User Message: ${request.message}`;
    
    if (Object.keys(memory.preferences).length > 0) {
       finalUserMessage = `User Preferences: ${JSON.stringify(memory.preferences)}\n\n` + finalUserMessage;
    }
    
    if (enrichedContext) {
       finalUserMessage += `\n\nSystem Context for you to use in response: ${enrichedContext}`;
    }

    const messages: ChatMessage[] = [
      ...request.history,
      { role: 'user', content: finalUserMessage }
    ];

    logger.info('[CHAT] Provider Response started (Streaming)', { intent: routing.intent });
    const responseStream = await stream(messages);

    logger.info('Orchestration completed', {
      intent: routing.intent,
      executionTimeMs: Date.now() - startTime,
    });

  return {
    stream: responseStream,
    generatedImage: generatedImageUrl || null,
    intent: routing.intent
  };
}
