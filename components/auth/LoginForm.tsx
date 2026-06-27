"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Email Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
          <Mail className="h-5 w-5 text-[#6E6E73]" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
          className="h-14 w-full rounded-full border border-[#ECE8E2] bg-[#FFFDF9] pl-12 pr-5 text-[15px] text-[#1D1D1F] transition-all duration-200 placeholder:text-[#6E6E73]/60 focus:border-[#C98766] focus:outline-none focus:ring-4 focus:ring-[#C98766]/10"
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
          <Lock className="h-5 w-5 text-[#6E6E73]" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="h-14 w-full rounded-full border border-[#ECE8E2] bg-[#FFFDF9] pl-12 pr-12 text-[15px] text-[#1D1D1F] transition-all duration-200 placeholder:text-[#6E6E73]/60 focus:border-[#C98766] focus:outline-none focus:ring-4 focus:ring-[#C98766]/10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-5 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end pt-1 pb-4">
        <a href="#" className="text-sm font-medium text-[#C98766] hover:underline decoration-1 underline-offset-4">
          Forgot Password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex h-[58px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#D98C5F] to-[#C87448] text-base font-medium text-white shadow-[0_4px_16px_rgba(201,135,102,0.3)] transition-all duration-250 hover:scale-[1.02] hover:from-[#C87448] hover:to-[#B36845] hover:shadow-[0_6px_24px_rgba(201,135,102,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
      >
        {isLoading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
