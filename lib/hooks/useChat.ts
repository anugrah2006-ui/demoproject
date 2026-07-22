import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '@/store/chatStore';
import { createClient } from '@/lib/supabase/client';
import { getUserWithTrace } from '@/lib/supabase/auth-reads';

export function useChat() {
  const {
    messages,
    conversationId,
    setConversationId,
    addMessage,
    updateLastMessage,
    setLoading,
    setError,
  } = useChatStore();
  const supabase = createClient();

  const sendMessage = useCallback(
    async (content: string, imageBase64?: string, mimeType?: string) => {
      if (!content.trim() && !imageBase64) return null;

      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await getUserWithTrace(supabase, 'use-chat', {
          stage: 'send-message',
          conversationId,
        });
        if (!user) throw new Error('Unauthorized');

        let currentConversationId = conversationId;

        // 1. Create a new chat session if none exists
        if (!currentConversationId) {
          const { data: newConv, error: chatError } = await supabase.from('conversations').insert({
            user_id: user.id,
            title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          }).select('id').single();

          if (chatError) throw new Error(chatError.message || JSON.stringify(chatError));
          
          currentConversationId = newConv.id.toString();
          setConversationId(currentConversationId);
        }

        // 2. Add user message locally and to Supabase
        const userImage = imageBase64 ? `data:${mimeType || 'image/jpeg'};base64,${imageBase64}` : null;
        const { data: newUserMsg, error: userMsgError } = await supabase.from('messages').insert({
          conversation_id: currentConversationId,
          role: 'user',
          content,
          image_url: userImage,
        }).select('id').single();
        
        if (userMsgError) throw new Error(userMsgError.message || JSON.stringify(userMsgError));
        
        const userMessageId = newUserMsg.id.toString();

        addMessage({
          id: userMessageId,
          role: 'user',
          content,
          imageUrl: userImage,
          createdAt: new Date(),
        });

        // 3. Add temporary assistant message locally
        const assistantMessageId = uuidv4();
        addMessage({
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          createdAt: new Date(),
        });

        // 4. Format history for API
        const historyForApi = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // 5. Call API and handle stream
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            history: historyForApi,
            image: imageBase64 ? { base64: imageBase64, mimeType } : undefined,
          }),
        });

        if (!response.ok) {
          let errorData = null;
          try {
            errorData = await response.json();
          } catch {
            // Ignore parse error
          }
          const errorMessage = errorData?.message || errorData?.error || `Failed to fetch response: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';
        let generatedImageUrl = '';
        let buffer = '';
        let metaProcessed = false;

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            
            if (!metaProcessed) {
              buffer += chunk;
              
              if (buffer.startsWith('[META:IMAGE=')) {
                const closingIndex = buffer.indexOf(']\n');
                if (closingIndex !== -1) {
                  // Found the complete meta tag!
                  const metaTag = buffer.substring(0, closingIndex + 2); // includes ]\n
                  const imageMatch = metaTag.match(/\[META:IMAGE=(.*?)\]\n/);
                  if (imageMatch) {
                    generatedImageUrl = imageMatch[1];
                    
                    // Save to combinations
                    await supabase.from('combinations').insert({
                      user_id: user.id,
                      title: content.substring(0, 30) || 'AI Generated Image',
                      image_url: generatedImageUrl,
                      type: 'image_generation',
                    });
                  }
                  
                  // The rest of the buffer is normal display content
                  const displayChunk = buffer.substring(closingIndex + 2);
                  buffer = '';
                  metaProcessed = true;
                  
                  if (displayChunk) {
                    assistantContent += displayChunk;
                    updateLastMessage(displayChunk, true, generatedImageUrl || undefined);
                  }
                } else {
                  // Incomplete meta tag, wait for more chunks
                  continue;
                }
              } else {
                // No meta tag at the beginning
                metaProcessed = true;
                const displayChunk = buffer;
                buffer = '';
                if (displayChunk) {
                  assistantContent += displayChunk;
                  updateLastMessage(displayChunk, true);
                }
              }
            } else {
              // Meta tag already processed, proceed normally
              if (chunk) {
                assistantContent += chunk;
                updateLastMessage(chunk, true, generatedImageUrl || undefined);
              }
            }
          }
        }

        // 6. Save assistant message to Supabase
        const { error: asstMsgError } = await supabase.from('messages').insert({
          conversation_id: currentConversationId,
          role: 'assistant',
          content: assistantContent,
          image_url: generatedImageUrl || null,
        });
        if (asstMsgError) throw new Error(asstMsgError.message || JSON.stringify(asstMsgError));
        
        return currentConversationId;

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : (typeof err === 'object' && err !== null && 'message' in err ? String((err as Record<string, unknown>).message) : (typeof err === 'string' ? err : 'Unknown error occurred.'));
        console.error('Chat error:', errorMessage, err);
        setError(errorMessage);
        // Remove the temporary assistant message on failure
        updateLastMessage('Sorry, I encountered an error. Please try again.', false);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [conversationId, messages, addMessage, updateLastMessage, setLoading, setError, setConversationId, supabase]
  );

  return { sendMessage };
}
