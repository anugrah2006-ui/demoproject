import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getUserWithTrace } from "@/lib/supabase/auth-reads";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUserWithTrace(supabase, "dashboard-history-page", {
    pathname: "/dashboard/history",
  });

  const todayConversations: { id: string, title: string, created_at: string }[] = [];
  const earlierConversations: { id: string, title: string, created_at: string }[] = [];

  if (user) {
    const { data } = await supabase
      .from('conversations')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      data.forEach(c => {
        const conversationDate = new Date(c.created_at);
        if (conversationDate >= today) {
          todayConversations.push(c);
        } else {
          earlierConversations.push(c);
        }
      });
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-[900px] mx-auto w-full">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-heading text-3xl font-medium text-[#1D1D1F]">Conversation History</h2>
        <div className="w-[300px]">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full h-10 px-4 rounded-full border border-[#ECE8E2] bg-white text-sm focus:outline-none focus:border-[#C98766] transition-colors"
          />
        </div>
      </div>
      
      <div className="space-y-8">
        {todayConversations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-[#6E6E73] uppercase tracking-wider mb-3 px-2">Today</h3>
            <div className="bg-white rounded-2xl border border-[#ECE8E2] overflow-hidden">
              {todayConversations.map(conversation => (
                <Link href={`/dashboard/chat/${conversation.id}`} key={conversation.id} className="p-4 border-b border-[#ECE8E2]/50 hover:bg-[#FAF8F5] cursor-pointer transition-colors flex justify-between items-center block">
                  <span className="text-[15px] font-medium text-[#1D1D1F]">{conversation.title}</span>
                  <span className="text-xs text-[#6E6E73]">
                    {new Date(conversation.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {earlierConversations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-[#6E6E73] uppercase tracking-wider mb-3 px-2">Earlier</h3>
            <div className="bg-white rounded-2xl border border-[#ECE8E2] overflow-hidden">
              {earlierConversations.map(conversation => (
                <Link href={`/dashboard/chat/${conversation.id}`} key={conversation.id} className="p-4 border-b border-[#ECE8E2]/50 hover:bg-[#FAF8F5] cursor-pointer transition-colors flex justify-between items-center block">
                  <span className="text-[15px] font-medium text-[#1D1D1F]">{conversation.title}</span>
                  <span className="text-xs text-[#6E6E73]">
                    {new Date(conversation.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {todayConversations.length === 0 && earlierConversations.length === 0 && (
          <p className="text-[#6E6E73] text-center mt-10">No conversation history found.</p>
        )}
      </div>
    </div>
  );
}
