import { Heart, Trash2 } from "lucide-react";

export default function CombinationsPage() {
  const combos = [
    { title: "Summer Casual", date: "Jun 12, 2026" },
    { title: "Office Professional", date: "May 28, 2026" },
    { title: "Winter Minimalist", date: "Jan 15, 2026" },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-[1200px] mx-auto w-full">
      <div className="mb-10">
        <h2 className="font-heading text-3xl font-medium text-[#1D1D1F]">Saved Combinations</h2>
        <p className="text-[#6E6E73] mt-2">Your personalized AI-generated styles and routines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo) => (
          <div key={combo.title} className="bg-white rounded-3xl border border-[#ECE8E2] overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
            <div className="h-48 bg-[#FAF8F5] flex items-center justify-center border-b border-[#ECE8E2]">
              <span className="text-[#6E6E73] text-sm">Image Preview</span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-[#1D1D1F] text-lg">{combo.title}</h3>
                <div className="flex gap-2">
                  <button className="text-[#6E6E73] hover:text-red-500 transition-colors"><Heart className="w-4 h-4" /></button>
                  <button className="text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-xs text-[#6E6E73]">Created {combo.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
