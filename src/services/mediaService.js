const configuredBaseUrl = (import.meta.env.VITE_MEDIA_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

/**
 * Resolve a public media path.
 *
 * Current frontend-only deployment:
 *   /media/shows/ben-10/seasons/s01/episodes/... -> same public path
 *
 * Future CDN/object storage deployment:
 *   VITE_MEDIA_BASE_URL=https://media.example.com
 *   /media/shows/... -> https://media.example.com/media/shows/...
 */
export function getMediaUrl(path) {
  if (!path) return "";

  if (/^(https?:)?\/\//i.test(path) || path.startsWith("blob:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${configuredBaseUrl}${normalizedPath}`;
}

export function getFallbackImageUrl() {
  return getMediaUrl("/media/defaults/image.jpg");
}


/**
 * Lightweight diagnostic used only after HTMLMediaElement reports an error.
 * It distinguishes a missing/unreachable file from a file that exists but the
 * browser cannot decode. This does not participate in normal playback.
 */
export async function probeMediaUrl(path) {
  const url = getMediaUrl(path);
  if (!url) return { url: "", ok: false, status: 0, contentType: "", reachable: false };

  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
    return {
      url,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      reachable: true,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      contentType: "",
      reachable: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
