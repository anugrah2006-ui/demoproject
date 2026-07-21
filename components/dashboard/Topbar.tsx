"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface TopbarProps {
  user: User | null;
}

export default function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  
  // Create a clean title based on the route
  const getTitle = () => {
    if (pathname === "/dashboard") return "";
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace("-", " ");
  };

  const title = getTitle();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-[96px] px-6 lg:px-10 bg-[#FFFDF9]/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - Would wire to a drawer in a fuller implementation */}
        <button className="lg:hidden p-2 -ml-2 text-[#6E6E73] hover:text-[#1D1D1F]">
          <Menu className="w-6 h-6" />
        </button>
        
        {title && (
          <h1 className="text-xl font-medium text-[#1D1D1F]">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-[#F2F2F7]/50 hover:text-[#1D1D1F] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="w-9 h-9 rounded-full bg-[#E8DCC4] flex items-center justify-center text-[#C98766] font-heading text-base shadow-inner">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
