import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserWithTrace } from "@/lib/supabase/auth-reads";

export async function POST() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await getUserWithTrace(supabase, "auth-signout-route", {
    pathname: "/auth/signout",
  });

  if (user) {
    await supabase.auth.signOut();
  }

  return redirect("/");
}
