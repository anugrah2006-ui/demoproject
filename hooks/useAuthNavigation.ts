"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useAuthNavigation() {
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const navigateWithAuthCheck = async () => {
    // Only set to true if not already checking, avoids double clicks
    if (isChecking) return;
    
    setIsChecking(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // If authenticated, go straight to dashboard
        router.push("/dashboard");
      } else {
        // If not authenticated, go to login
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Fallback to login on error
      router.push("/login");
    } finally {
      // Small delay before removing the overlay to allow the Next.js page transition to start rendering
      setTimeout(() => {
        setIsChecking(false);
      }, 600);
    }
  };

  return { navigateWithAuthCheck, isChecking };
}
