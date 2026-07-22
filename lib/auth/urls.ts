const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? LOCAL_SITE_URL;

  return normalizeBaseUrl(configuredUrl);
}

export function getRequestOrigin(request: Request) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto ?? "https"}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export function sanitizeNextPath(
  nextPath: string | null | undefined,
  fallback = "/dashboard"
) {
  if (!nextPath) return fallback;
  if (!nextPath.startsWith("/")) return fallback;
  if (nextPath.startsWith("//")) return fallback;
  return nextPath;
}

export function buildAbsoluteUrl(pathname: string, baseUrl: string) {
  return new URL(pathname, normalizeBaseUrl(baseUrl)).toString();
}
