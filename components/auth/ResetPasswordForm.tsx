"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updatePassword } from "@/actions/auth";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("password", data.password);

    const result = await updatePassword(formData);

    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
    } else {
      router.push("/login?reset=success");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {serverError && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      {/* Password */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <Lock className="h-5 w-5 text-[#6E6E73]" />
          </div>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="New Password (min 8 characters)"
            className={`h-14 w-full rounded-full border bg-[#FFFDF9] pl-12 pr-12 text-[15px] text-[#1D1D1F] transition-all duration-200 placeholder:text-[#6E6E73]/60 focus:outline-none focus:ring-4 focus:ring-[#C98766]/10 ${
              errors.password ? "border-red-300 focus:border-red-400" : "border-[#ECE8E2] focus:border-[#C98766]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-5 text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <span className="text-xs text-red-500 pl-4">{errors.password.message}</span>}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <Lock className="h-5 w-5 text-[#6E6E73]" />
          </div>
          <input
            {...register("confirmPassword")}
            type={showPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            className={`h-14 w-full rounded-full border bg-[#FFFDF9] pl-12 pr-12 text-[15px] text-[#1D1D1F] transition-all duration-200 placeholder:text-[#6E6E73]/60 focus:outline-none focus:ring-4 focus:ring-[#C98766]/10 ${
              errors.confirmPassword ? "border-red-300 focus:border-red-400" : "border-[#ECE8E2] focus:border-[#C98766]"
            }`}
          />
        </div>
        {errors.confirmPassword && <span className="text-xs text-red-500 pl-4">{errors.confirmPassword.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 flex h-[58px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#D98C5F] to-[#C87448] text-base font-medium text-white shadow-[0_4px_16px_rgba(201,135,102,0.3)] transition-all duration-250 hover:scale-[1.02] hover:from-[#C87448] hover:to-[#B36845] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
      >
        {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : "Update Password"}
      </button>
    </form>
  );
}
