/**
 * Rewrites Medusa backend image URLs so the Next.js server can fetch them.
 * In Docker, the API may return http://localhost:9000/static/... but the
 * storefront container cannot reach localhost:9000. Use MEDUSA_BACKEND_URL
 * (e.g. http://medusa:9000) so image optimization works.
 */
export function getMedusaImageUrl(
  url: string | null | undefined
): string | null | undefined {
  if (url == null || url === "") return url
  const backend =
    process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const base = backend.replace(/\/$/, "")

  // Relative path: prepend backend origin
  if (url.startsWith("/")) {
    return `${base}${url}`
  }

  // Replace localhost or 127.0.0.1 (any port) with backend so Docker can reach medusa:9000
  try {
    const parsed = new URL(url)
    if (
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
      (parsed.port === "9000" || parsed.port === "" || parsed.port === "80")
    ) {
      return url.replace(parsed.origin, base)
    }
  } catch {
    // not a valid URL, return as-is
  }
  return url
}
