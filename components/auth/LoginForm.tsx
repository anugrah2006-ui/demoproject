"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginWithEmail } from "@/actions/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await loginWithEmail(formData);

    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
    } else {
      // Middleware will handle redirect to dashboard automatically
      // But we can trigger a hard reload/navigation to ensure state resets
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {serverError && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <div className="flex flex-col gap-1">
        {/* Email Input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <Mail className="h-5 w-5 text-[#6E6E73]" />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email address"
            className={`h-14 w-full rounded-full border bg-[#FFFDF9] pl-12 pr-5 text-[15px] text-[#1D1D1F] transition-all duration-200 placeholder:text-[#6E6E73]/60 focus:outline-none focus:ring-4 focus:ring-[#C98766]/10 ${
              errors.email ? "border-red-300 focus:border-red-400" : "border-[#ECE8E2] focus:border-[#C98766]"
            }`}
          />
        </div>
        {errors.email && (
          <span className="text-xs text-red-500 pl-4">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {/* Password Input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <Lock className="h-5 w-5 text-[#6E6E73]" />
          </div>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`h-14 w-full rounded-full border bg-[#FFFDF9] pl-12 pr-12 text-[15px] text-[#1D1D1F] transition-all duration-200 placeholder:text-[#6E6E73]/60 focus:outline-none focus:ring-4 focus:ring-[#C98766]/10 ${
              errors.password ? "border-red-300 focus:border-red-400" : "border-[#ECE8E2] focus:border-[#C98766]"
            }`}
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
        {errors.password && (
          <span className="text-xs text-red-500 pl-4">{errors.password.message}</span>
        )}
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end pt-0 pb-2">
        <a href="/forgot-password" className="text-sm font-medium text-[#C98766] hover:underline decoration-1 underline-offset-4">
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
