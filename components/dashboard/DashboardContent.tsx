"use client";

import { User } from "@supabase/supabase-js";

import BelleOrb from "@/components/dashboard/BelleOrb";
import Greeting from "@/components/dashboard/Greeting";
import PromptBox from "@/components/dashboard/PromptBox";
import SuggestionPills from "@/components/dashboard/SuggestionPills";
import RecentChats from "@/components/dashboard/RecentChats";
import { GreetingFadeUp, PromptFadeUp, OrbFloatIn } from "@/components/dashboard/EntranceAnimations";

export default function DashboardContent({ user, recentConversations }: { user: User | null, recentConversations: { id: string, title: string, date: string }[] }) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 flex flex-col pt-10 pb-20 px-6 lg:px-10 overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[1000px] mx-auto min-h-[500px]">
          <div className="w-full mb-8">
            <OrbFloatIn>
              <BelleOrb />
            </OrbFloatIn>
            <GreetingFadeUp>
              <Greeting user={user} />
            </GreetingFadeUp>
          </div>

          <PromptFadeUp className="w-full">
            <PromptBox />
            <SuggestionPills />
          </PromptFadeUp>
        </div>
        <RecentChats conversations={recentConversations} />
      </div>
    </div>
  );
}
