import { logAuthInfo } from "@/lib/auth/debug";

type SupabaseConfig = {
  url: string;
  anonKey: string;
  projectRef: string;
  anonKeyRole: string | null;
  storageKey: string;
};

const loggedScopes = new Set<string>();

function extractProjectRef(url: string) {
  try {
    return new URL(url).hostname.split(".")[0] ?? "unknown-project";
  } catch {
    return "unknown-project";
  }
}

function decodeJwtPayload(token: string) {
  const [, payload] = token.split(".");

  if (!payload) return null;

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(paddedPayload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const projectRef = extractProjectRef(url);
  const anonPayload = decodeJwtPayload(anonKey);
  const anonKeyRef =
    typeof anonPayload?.ref === "string" ? anonPayload.ref : null;
  const anonKeyRole =
    typeof anonPayload?.role === "string" ? anonPayload.role : null;

  if (anonKeyRef && anonKeyRef !== projectRef) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_ANON_KEY belongs to project "${anonKeyRef}", but NEXT_PUBLIC_SUPABASE_URL points to "${projectRef}".`
    );
  }

  if (anonKeyRole && anonKeyRole !== "anon") {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_ANON_KEY has role "${anonKeyRole}", expected "anon".`
    );
  }

  return {
    url,
    anonKey,
    projectRef,
    anonKeyRole,
    storageKey: `sb-${projectRef}-auth-token`,
  };
}

export function logSupabaseConfig(scope: string) {
  const config = getSupabaseConfig();

  if (!loggedScopes.has(scope)) {
    logAuthInfo(scope, "Loaded Supabase configuration", {
      hasSupabaseUrl: Boolean(config.url),
      hasAnonKey: Boolean(config.anonKey),
      projectRef: config.projectRef,
      anonKeyRole: config.anonKeyRole,
      storageKey: config.storageKey,
    });

    loggedScopes.add(scope);
  }

  return config;
}
