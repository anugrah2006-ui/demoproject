export default function HistoryPage() {
  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-[900px] mx-auto w-full">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-heading text-3xl font-medium text-[#1D1D1F]">Chat History</h2>
        <div className="w-[300px]">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full h-10 px-4 rounded-full border border-[#ECE8E2] bg-white text-sm focus:outline-none focus:border-[#C98766] transition-colors"
          />
        </div>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-medium text-[#6E6E73] uppercase tracking-wider mb-3 px-2">Today</h3>
          <div className="bg-white rounded-2xl border border-[#ECE8E2] overflow-hidden">
            <div className="p-4 border-b border-[#ECE8E2]/50 hover:bg-[#FAF8F5] cursor-pointer transition-colors flex justify-between items-center">
              <span className="text-[15px] font-medium text-[#1D1D1F]">Winter Skincare Routine</span>
              <span className="text-xs text-[#6E6E73]">2 hours ago</span>
            </div>
            <div className="p-4 hover:bg-[#FAF8F5] cursor-pointer transition-colors flex justify-between items-center">
              <span className="text-[15px] font-medium text-[#1D1D1F]">Outfit for tech conference</span>
              <span className="text-xs text-[#6E6E73]">5 hours ago</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#6E6E73] uppercase tracking-wider mb-3 px-2">Yesterday</h3>
          <div className="bg-white rounded-2xl border border-[#ECE8E2] overflow-hidden">
            <div className="p-4 hover:bg-[#FAF8F5] cursor-pointer transition-colors flex justify-between items-center">
              <span className="text-[15px] font-medium text-[#1D1D1F]">Haircut advice for oval face</span>
              <span className="text-xs text-[#6E6E73]">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
