import { ArrowRight, MessageSquareDashed } from "lucide-react";
import Link from "next/link";

interface Chat {
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

export default function RecentChats({ chats }: { chats: Chat[] }) {
  if (!chats || chats.length === 0) {
    return (
      <div className="mt-16 max-w-[900px] mx-auto w-full">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-[900px] mx-auto w-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-[#1D1D1F] font-medium">Recent Chats</h3>
        <Link href="/dashboard/history" className="text-sm text-[#C98766] hover:underline underline-offset-4 decoration-1 font-medium">
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/dashboard/history/${chat.id}`}
            className="group flex items-center justify-between p-4 bg-transparent hover:bg-white rounded-2xl transition-all duration-200 border border-transparent hover:border-[#ECE8E2] hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="flex flex-col">
              <span className="text-[#1D1D1F] font-medium text-[15px]">{chat.title}</span>
              <span className="text-[#6E6E73] text-xs mt-1">{chat.date}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-[#C98766] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
