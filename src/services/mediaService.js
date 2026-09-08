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
