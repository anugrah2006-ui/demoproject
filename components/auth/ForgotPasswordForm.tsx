"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { resetPasswordRequest } from "@/actions/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("email", data.email);

    const result = await resetPasswordRequest(formData);

    if (result.error) {
      setServerError(result.error);
    } else {
      setIsSuccess(true);
    }
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="text-center bg-[#FAF8F5] p-6 rounded-2xl border border-[rgba(0,0,0,0.05)]">
        <h3 className="text-lg font-medium text-[#1D1D1F] mb-2">Check your email</h3>
        <p className="text-sm text-[#6E6E73] leading-relaxed">
          We&apos;ve sent a password reset link to <span className="font-semibold">{getValues("email")}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {serverError && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <div className="flex flex-col gap-1">
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
        {errors.email && <span className="text-xs text-red-500 pl-4">{errors.email.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 flex h-[58px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#D98C5F] to-[#C87448] text-base font-medium text-white shadow-[0_4px_16px_rgba(201,135,102,0.3)] transition-all duration-250 hover:scale-[1.02] hover:from-[#C87448] hover:to-[#B36845] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
      >
        {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : "Send Reset Link"}
      </button>
    </form>
  );
}
