const KEY = "retrotoonz_recent_searches_v1";
const LIMIT = 6;

function storageAvailable() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getRecentSearches() {
  if (!storageAvailable()) return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? value.filter(Boolean).slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query) {
  const value = String(query ?? "").trim();
  if (!value || !storageAvailable()) return getRecentSearches();

  const next = [
    value,
    ...getRecentSearches().filter((item) => item.toLowerCase() !== value.toLowerCase()),
  ].slice(0, LIMIT);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearRecentSearches() {
  if (!storageAvailable()) return;
  window.localStorage.removeItem(KEY);
}
