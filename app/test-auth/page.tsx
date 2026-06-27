import { createClient } from "@/lib/supabase/server";

export default async function TestAuthPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-[#1D1D1F]">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-10 border border-[#ECE8E2] shadow-sm">
        <h1 className="text-3xl font-heading font-medium mb-6 text-[#C98766]">
          Supabase Auth Connection Test
        </h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Connection Status:</h2>
            <div className="px-4 py-3 bg-green-50 text-green-700 rounded-xl border border-green-200">
              ✅ Successfully connected to Supabase SSR architecture.
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-2">Current User Session:</h2>
            <div className="bg-[#FAF8F5] p-6 rounded-xl border border-[rgba(0,0,0,0.05)] overflow-auto">
              <pre className="text-sm font-mono text-[#6E6E73]">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            {error && (
              <div className="mt-4 px-4 py-3 bg-red-50 text-red-700 rounded-xl border border-red-200">
                Auth Error: {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
