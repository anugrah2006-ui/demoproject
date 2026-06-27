import { ShieldCheck } from "lucide-react";

export default function AuthFooter() {
  return (
    <div className="mt-8">
      <div className="text-center mb-8">
        <span className="text-sm text-[#6E6E73] mr-1">Don't have an account?</span>
        <a href="#" className="text-sm font-medium text-[#C98766] hover:underline decoration-1 underline-offset-4">
          Create Account
        </a>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[#6E6E73]/70">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Your data is secure with Belle.</span>
      </div>
    </div>
  );
}
