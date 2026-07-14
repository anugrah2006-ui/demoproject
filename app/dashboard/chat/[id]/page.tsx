"use client";

interface DatabaseMessage {
  id: string;
  role: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { createClient } from "@/lib/supabase/client";
import ChatThread from "@/components/dashboard/ChatThread";
import PromptBox from "@/components/dashboard/PromptBox";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params?.id as string;
  const { conversationId: storeConversationId, setConversationId, setMessages, setLoading } = useChatStore();
  const supabase = createClient();

  useEffect(() => {
    if (conversationId && storeConversationId !== conversationId) {
      const loadConversation = async () => {
        setLoading(true);
        setConversationId(conversationId);
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
          
        if (data) {
          setMessages(data.map((m: DatabaseMessage) => ({
            id: m.id,
            role: m.role as "user" | "assistant" | "system",
            content: m.content,
            imageUrl: m.image_url,
            createdAt: new Date(m.created_at)
          })));
        }
        setLoading(false);
      };
      
      loadConversation();
    }
  }, [conversationId, storeConversationId, setConversationId, setMessages, setLoading, supabase]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full pb-32">
        <ChatThread />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FFFDF9] via-[#FFFDF9] to-transparent pt-10 pb-6 px-6 lg:px-10">
          <PromptBox />
        </div>
      </div>
    </div>
  );
}
