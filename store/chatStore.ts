import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string | null;
  createdAt: Date;
}

interface ConversationState {
  conversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  setConversationId: (id: string | null) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (contentUpdate: string, isAppend?: boolean, generatedImage?: string) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ConversationState>((set) => ({
  conversationId: null,
  messages: [],
  isLoading: false,
  error: null,

  setConversationId: (id) => set({ conversationId: id }),
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  updateLastMessage: (contentUpdate, isAppend = true, generatedImage?: string) => set((state) => {
    if (state.messages.length === 0) return state;
    
    const lastIdx = state.messages.length - 1;
    const lastMsg = state.messages[lastIdx];
    
    if (lastMsg.role !== 'assistant') return state;
    
    const updatedMessages = [...state.messages];
    updatedMessages[lastIdx] = {
      ...lastMsg,
      content: isAppend ? lastMsg.content + contentUpdate : contentUpdate,
      ...(generatedImage ? { imageUrl: generatedImage } : {})
    };
    
    return { messages: updatedMessages };
  }),
  
  setMessages: (messages) => set({ messages }),
  
  clearMessages: () => set({ messages: [], conversationId: null, error: null }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));
