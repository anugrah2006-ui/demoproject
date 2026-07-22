import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getUserWithTrace } from "@/lib/supabase/auth-reads";

export default async function CombinationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUserWithTrace(supabase, "dashboard-combinations-page", {
    pathname: "/dashboard/combinations",
  });

  let combos: { id: string, title: string, created_at: string, image_url: string | null }[] = [];
  if (user) {
    const { data } = await supabase
      .from('combinations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      combos = data;
    }
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-[1200px] mx-auto w-full">
      <div className="mb-10">
        <h2 className="font-heading text-3xl font-medium text-[#1D1D1F]">Saved Combinations</h2>
        <p className="text-[#6E6E73] mt-2">Your personalized AI-generated styles and routines.</p>
      </div>

      {combos.length === 0 ? (
        <p className="text-[#6E6E73] text-center mt-10">No combinations saved yet. Generate some images or outfits to see them here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-white rounded-3xl border border-[#ECE8E2] overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="h-48 bg-[#FAF8F5] flex items-center justify-center border-b border-[#ECE8E2] overflow-hidden relative">
                {combo.image_url ? (
                  <Image src={combo.image_url} alt={combo.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                ) : (
                  <span className="text-[#6E6E73] text-sm">No Preview</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-[#1D1D1F] text-lg">{combo.title}</h3>
                  <div className="flex gap-2">
                    <button className="text-[#6E6E73] hover:text-red-500 transition-colors"><Heart className="w-4 h-4" /></button>
                    <button className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-xs text-[#6E6E73]">Created {new Date(combo.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
