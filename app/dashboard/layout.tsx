import { createClient } from "@/lib/supabase/server";
import { getUserWithTrace } from "@/lib/supabase/auth-reads";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUserWithTrace(supabase, "dashboard-layout", {
    pathname: "/dashboard",
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#FFFDF9]">
      <Sidebar user={user} />
      
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
        <Topbar user={user} />
        <main className="flex-1 flex flex-col relative">
          {children}
        </main>
      </div>
    </div>
  );
}
