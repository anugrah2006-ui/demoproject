import { createClient } from "@/lib/supabase/server";
import BelleOrb from "@/components/dashboard/BelleOrb";
import Greeting from "@/components/dashboard/Greeting";
import PromptBox from "@/components/dashboard/PromptBox";
import SuggestionPills from "@/components/dashboard/SuggestionPills";
import RecentChats from "@/components/dashboard/RecentChats";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // In a real implementation, we would fetch actual chats from the database
  const mockChats: { id: string; title: string; date: string }[] = []; // Leaving empty to show the elegant EmptyState as requested

  return (
    <div className="flex-1 flex flex-col pt-10 pb-20 px-6 lg:px-10 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[1000px] mx-auto min-h-[500px]">
        <div className="w-full mb-8">
          <BelleOrb />
          <Greeting user={user} />
        </div>
        
        <div className="w-full">
          <PromptBox />
          <SuggestionPills />
        </div>
      </div>

      <RecentChats chats={mockChats} />
    </div>
  );
}
