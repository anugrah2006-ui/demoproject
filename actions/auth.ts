"use server";

import { createClient } from "@/lib/supabase/server";
import {
  logAuthError,
  logAuthInfo,
  summarizeAuthError,
  summarizeSession,
  summarizeUser,
} from "@/lib/auth/debug";
import { getSiteUrl, buildAbsoluteUrl } from "@/lib/auth/urls";
import { ensureUserProfile } from "@/lib/auth/profile";

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  logAuthInfo("email-login", "Starting email/password sign-in", { email });

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    logAuthError("email-login", "Email/password sign-in failed", {
      email,
      error: summarizeAuthError(error),
    });
    return { error: error.message };
  }

  if (data.user) {
    logAuthInfo("email-login", "Email/password sign-in succeeded", {
      user: summarizeUser(data.user),
      session: summarizeSession(data.session ?? null),
    });
    await ensureUserProfile(supabase, data.user, "email-login");
  }

  return { success: true };
}

export async function signupWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  logAuthInfo("email-signup", "Starting email signup", { email });

  const supabase = await createClient();
  
  // Supabase Auth handles email verification implicitly if enabled in project settings.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    }
  });

  if (error) {
    logAuthError("email-signup", "Email signup failed", {
      email,
      error: summarizeAuthError(error),
    });
    return { error: error.message };
  }

  logAuthInfo("email-signup", "Email signup completed", {
    email,
    fullName,
  });
  return { success: true };
}

export async function resetPasswordRequest(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  const redirectTo = buildAbsoluteUrl("/reset-password", getSiteUrl());

  logAuthInfo("reset-password", "Starting password reset request", {
    email,
    redirectTo,
  });

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    logAuthError("reset-password", "Password reset request failed", {
      email,
      error: summarizeAuthError(error),
    });
    return { error: error.message };
  }

  logAuthInfo("reset-password", "Password reset email requested successfully", {
    email,
    redirectTo,
  });
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const supabase = await createClient();

  logAuthInfo("update-password", "Starting password update", {
    passwordLength: password?.length ?? 0,
  });

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    logAuthError("update-password", "Password update failed", {
      error: summarizeAuthError(error),
    });
    return { error: error.message };
  }

  logAuthInfo("update-password", "Password updated successfully");
  return { success: true };
}
