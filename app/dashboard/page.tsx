import { createClient } from "@/lib/supabase/server";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { PageFadeIn } from "@/components/dashboard/EntranceAnimations";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let recentConversations: { id: string, title: string, date: string }[] = [];
  if (user) {
    const { data } = await supabase
      .from('conversations')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (data) {
      recentConversations = data.map(c => ({
        id: c.id,
        title: c.title,
        date: new Date(c.created_at).toLocaleDateString(),
      }));
    }
  }

  return (
    <PageFadeIn className="flex-1 flex flex-col h-full">
      <DashboardContent user={user} recentConversations={recentConversations} />
    </PageFadeIn>
  );
}
