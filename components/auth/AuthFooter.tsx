import { ShieldCheck } from "lucide-react";

export default function AuthFooter() {
  return (
    <div className="mt-8">
      <div className="text-center mb-8">
        <p className="text-center text-xs text-[#86868B]">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[#C98766] hover:underline">
            Create Account
          </a>
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[#6E6E73]/70">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Your data is secure with Belle.</span>
      </div>
    </div>
  );
}
