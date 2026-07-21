"use client";

import { ArrowRight, MessageSquareDashed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { createClient } from "@/lib/supabase/client";

interface Conversation {
  id: string;
  title: string;
  date: string;
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 bg-[#FAF5F0] rounded-full flex items-center justify-center text-[#C98766] mb-4">
        <MessageSquareDashed className="w-6 h-6" />
      </div>
      <p className="text-[#1D1D1F] font-medium text-lg mb-1">No conversations yet.</p>
      <p className="text-[#6E6E73] text-sm">Start your first conversation with Belle.</p>
    </div>
  );
}

export default function RecentChats({ conversations }: { conversations: Conversation[] }) {
  const router = useRouter();
  const { setConversationId, setMessages, setLoading } = useChatStore();
  const supabase = createClient();

  const handleConversationClick = async (conversationId: string) => {
    setLoading(true);
    setConversationId(conversationId);
    
    // Fetch messages for this chat
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
      
    if (messagesData) {
      setMessages(messagesData.map((m: Record<string, unknown>) => ({
        id: m.id as string,
        role: m.role as "user" | "assistant" | "system",
        content: m.content as string,
        imageUrl: m.image_url as string | undefined,
        createdAt: new Date(m.created_at as string)
      })));
    }
    
    setLoading(false);
    router.push(`/dashboard/chat/${conversationId}`);
  };

  if (!conversations || conversations.length === 0) {
    return (
      <div className="mt-16 max-w-[900px] mx-auto w-full">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-[900px] mx-auto w-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-[#1D1D1F] font-medium">Recent Conversations</h3>
        <button onClick={() => router.push('/dashboard/history')} className="text-sm text-[#C98766] hover:underline underline-offset-4 decoration-1 font-medium">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => handleConversationClick(conversation.id)}
            className="w-full text-left group flex items-center justify-between p-4 bg-transparent hover:bg-white rounded-2xl transition-all duration-200 border border-transparent hover:border-[#ECE8E2] hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="flex flex-col">
              <span className="text-[#1D1D1F] font-medium text-[15px]">{conversation.title}</span>
              <span className="text-[#6E6E73] text-xs mt-1">{conversation.date}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-[#C98766] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
