import type { AuthError, Session, User } from "@supabase/supabase-js";

type AuthLogLevel = "info" | "warn" | "error";

function maskValue(value: string | null | undefined) {
  if (!value) return value ?? null;
  if (value.length <= 10) return `${value.slice(0, 2)}...${value.slice(-2)}`;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function sanitizeValue(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
    };
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => {
      if (
        /(token|secret|password|code_verifier|access_token|refresh_token)/i.test(
          key
        ) &&
        typeof entryValue === "string"
      ) {
        return [key, maskValue(entryValue)];
      }

      return [key, sanitizeValue(entryValue)];
    })
  );
}

function log(level: AuthLogLevel, scope: string, message: string, details?: unknown) {
  const prefix = `[auth][${scope}] ${message}`;
  const payload = details === undefined ? undefined : sanitizeValue(details);

  if (level === "error") {
    console.error(prefix, payload);
    return;
  }

  if (level === "warn") {
    console.warn(prefix, payload);
    return;
  }

  console.info(prefix, payload);
}

export function logAuthInfo(scope: string, message: string, details?: unknown) {
  log("info", scope, message, details);
}

export function logAuthWarn(scope: string, message: string, details?: unknown) {
  log("warn", scope, message, details);
}

export function logAuthError(scope: string, message: string, details?: unknown) {
  log("error", scope, message, details);
}

export function summarizeUser(user: User | null | undefined) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    provider: user.app_metadata?.provider ?? null,
    providers: Array.isArray(user.app_metadata?.providers)
      ? user.app_metadata.providers
      : null,
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

export function summarizeSession(session: Session | null | undefined) {
  if (!session) return null;

  return {
    accessToken: maskValue(session.access_token),
    refreshToken: maskValue(session.refresh_token),
    expiresAt: session.expires_at ?? null,
    expiresIn: session.expires_in ?? null,
    tokenType: session.token_type ?? null,
    user: summarizeUser(session.user),
  };
}

export function summarizeAuthError(error: AuthError | Error | unknown) {
  if (!error) return null;

  if (typeof error === "object") {
    const candidate = error as Record<string, unknown>;
    const name =
      typeof candidate.name === "string"
        ? candidate.name
        : error instanceof Error
          ? error.name
          : "UnknownAuthError";
    const message =
      typeof candidate.message === "string"
        ? candidate.message
        : error instanceof Error
          ? error.message
          : String(error);
    const status =
      typeof candidate.status === "number"
        ? candidate.status
        : typeof candidate.status === "string"
          ? candidate.status
          : null;
    const code =
      typeof candidate.code === "string"
        ? candidate.code
        : typeof candidate.error_code === "string"
          ? candidate.error_code
          : null;
    const stack =
      typeof candidate.stack === "string"
        ? candidate.stack
        : error instanceof Error
          ? (error.stack ?? null)
          : null;

    return {
      name,
      message,
      status,
      code,
      stack,
      cause: "cause" in candidate ? sanitizeValue(candidate.cause) : null,
      raw: sanitizeValue(candidate),
    };
  }

  return { message: String(error) };
}
