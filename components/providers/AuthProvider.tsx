"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  logAuthError,
  logAuthInfo,
  summarizeAuthError,
  summarizeSession,
  summarizeUser,
} from "@/lib/auth/debug";
import {
  isRecoverableAuthStateError,
  recoverFromInvalidBrowserSession,
} from "@/lib/auth/client-recovery";
import {
  getSessionWithTrace,
  getUserWithTrace,
} from "@/lib/supabase/auth-reads";

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function bootstrapAuthState() {
      try {
        logAuthInfo("auth-provider", "Bootstrapping client auth state", {
          pathname: window.location.pathname,
          search: window.location.search,
        });

        const [
          { data: sessionData, error: sessionError },
          { data: userData, error: userError },
        ] = await Promise.all([
          getSessionWithTrace(supabase, "auth-provider", {
            pathname: window.location.pathname,
            stage: "initial-bootstrap",
          }),
          getUserWithTrace(supabase, "auth-provider", {
            pathname: window.location.pathname,
            stage: "initial-bootstrap",
          }),
        ]);

        if (
          (sessionError && isRecoverableAuthStateError(sessionError)) ||
          (userError && isRecoverableAuthStateError(userError))
        ) {
          const recoveryDetails = await recoverFromInvalidBrowserSession(
            supabase,
            userError ?? sessionError,
            "auth-provider"
          );

          if (!isMounted) return;

          setSession(null);
          setUser(null);
          setLoading(false);

          logAuthInfo("auth-provider", "Recovered from invalid client auth state", {
            pathname: window.location.pathname,
            ...recoveryDetails,
          });

          router.refresh();
          return;
        }

        const resolvedSession =
          sessionError || userError ? null : sessionData.session;
        const resolvedUser =
          sessionError || userError
            ? null
            : userData.user ?? sessionData.session?.user ?? null;

        if (sessionError || userError) {
          logAuthInfo(
            "auth-provider",
            "Falling back to unauthenticated client state after auth bootstrap error",
            {
              pathname: window.location.pathname,
              sessionError: summarizeAuthError(sessionError),
              userError: summarizeAuthError(userError),
            }
          );
        }

        logAuthInfo("auth-provider", "Initial client auth state resolved", {
          session: summarizeSession(resolvedSession),
          user: summarizeUser(resolvedUser),
        });

        if (!isMounted) return;

        setSession(resolvedSession);
        setUser(resolvedUser);
        setLoading(false);
      } catch (error) {
        logAuthError("auth-provider", "Unhandled error during auth bootstrap", {
          pathname: window.location.pathname,
          error: summarizeAuthError(error),
        });

        if (!isMounted) return;

        setSession(null);
        setUser(null);
        setLoading(false);
      }
    }

    void bootstrapAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      logAuthInfo("auth-provider", "onAuthStateChange fired", {
        event,
        session: summarizeSession(nextSession),
        user: summarizeUser(nextSession?.user ?? null),
      });

      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);

      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const value = useMemo(
    () => ({
      loading,
      session,
      user,
    }),
    [loading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
