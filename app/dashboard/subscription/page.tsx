export default function SubscriptionPage() {
  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-[800px] mx-auto w-full">
      <div className="mb-10">
        <h2 className="font-heading text-3xl font-medium text-[#1D1D1F]">Subscription</h2>
        <p className="text-[#6E6E73] mt-2">Manage your Belle plan and billing.</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#ECE8E2] p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#ECE8E2]/60">
          <div>
            <h3 className="text-xl font-medium text-[#1D1D1F] mb-1">Free Plan</h3>
            <p className="text-[#6E6E73] text-sm">You are currently on the free tier.</p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-3xl font-heading text-[#C98766]">$0</span>
            <span className="text-[#6E6E73] text-sm"> / month</span>
          </div>
        </div>

        <div className="py-8 space-y-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6E6E73]">Next billing date</span>
            <span className="text-[#1D1D1F] font-medium">—</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#6E6E73]">AI Interactions Usage</span>
            <span className="text-[#1D1D1F] font-medium">12 / 50</span>
          </div>
          <div className="w-full bg-[#FAF5F0] rounded-full h-2">
            <div className="bg-[#C98766] h-2 rounded-full w-[24%]"></div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 h-12 bg-gradient-to-r from-[#D98C5F] to-[#C87448] text-white rounded-full font-medium hover:scale-[1.02] transition-transform shadow-sm">
            Upgrade to Premium
          </button>
          <button className="flex-1 h-12 bg-white border border-[#ECE8E2] text-[#1D1D1F] rounded-full font-medium hover:bg-[#FAF8F5] transition-colors">
            Manage Billing
          </button>
        </div>
      </div>
    </div>
  );
}
