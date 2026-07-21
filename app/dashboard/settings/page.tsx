export default function SettingsPage() {
  const sections = [
    { title: "Profile", description: "Manage your personal information." },
    { title: "Appearance", description: "Customize the look of Belle." },
    { title: "Notifications", description: "Choose what we email you about." },
    { title: "Privacy", description: "Manage your data and security." },
    { title: "Connected Accounts", description: "Link Google or Apple accounts." },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-[800px] mx-auto w-full pb-20">
      <div className="mb-10">
        <h2 className="font-heading text-3xl font-medium text-[#1D1D1F]">Settings</h2>
        <p className="text-[#6E6E73] mt-2">Manage your account preferences and settings.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-3xl border border-[#ECE8E2] p-6 lg:p-8 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-shadow">
            <div className="flex justify-between items-center cursor-pointer">
              <div>
                <h3 className="text-lg font-medium text-[#1D1D1F]">{section.title}</h3>
                <p className="text-[#6E6E73] text-sm mt-1">{section.description}</p>
              </div>
              <div className="text-[#C98766] font-medium text-sm border border-[#ECE8E2] px-4 py-2 rounded-full hover:bg-[#FAF8F5] transition-colors">
                Edit
              </div>
            </div>
          </div>
        ))}

        <div className="bg-[#FFFDF9] rounded-3xl border border-red-100 p-6 lg:p-8 mt-12">
          <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
          <p className="text-[#6E6E73] text-sm mt-1 mb-6">Permanently delete your account and all associated data.</p>
          <button className="bg-white text-red-600 border border-red-200 px-6 py-2.5 rounded-full font-medium hover:bg-red-50 hover:border-red-300 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
