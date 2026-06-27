"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Clock, Layers, CreditCard, Settings, LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface SidebarProps {
  user: User | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: MessageSquare },
    { name: "Chat History", href: "/dashboard/history", icon: Clock },
    { name: "Combinations", href: "/dashboard/combinations", icon: Layers },
    { name: "Manage Subscription", href: "/dashboard/subscription", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-[280px] bg-[#FFFDF9] border-r border-[#ECE8E2] flex flex-col hidden lg:flex">
      {/* Top Logo */}
      <div className="h-[96px] flex items-center px-8 border-b border-[#ECE8E2]/50">
        <Link href="/dashboard" className="font-heading text-3xl text-[#C98766] tracking-tight">
          Belle
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-[#FAF5F0] text-[#1D1D1F] shadow-[0_2px_8px_rgba(201,135,102,0.08)]" 
                  : "text-[#6E6E73] hover:bg-[#F2F2F7]/50 hover:text-[#1D1D1F]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#C98766]" : ""}`} />
              <span className={`text-[15px] ${isActive ? "font-medium" : "font-normal"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-[#ECE8E2]/50">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F2F2F7]/50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#E8DCC4] flex items-center justify-center text-[#C98766] font-heading text-lg shadow-inner shrink-0">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1D1D1F] truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
            </p>
            <p className="text-xs text-[#6E6E73] truncate">Free Plan</p>
          </div>
          <form action="/auth/signout" method="post">
            <button 
              type="submit"
              className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-white rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
