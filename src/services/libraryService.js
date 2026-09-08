import { getCurrentUser } from "./authService.js";

const WATCHLIST_KEY = "retrotoonz_watchlist_v1";
const PLAYBACK_KEY = "retrotoonz_playback_v1";

function storageAvailable() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function scopeKey() {
  const user = getCurrentUser();
  return user?.id ? `user:${user.id}` : "guest";
}

function readJson(key, fallback) {
  if (!storageAvailable()) return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value, eventName) {
  if (!storageAvailable()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  if (eventName) window.dispatchEvent(new CustomEvent(eventName));
}

function readWatchlistStore() {
  const parsed = readJson(WATCHLIST_KEY, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? parsed
    : {};
}

function readPlaybackStore() {
  const parsed = readJson(PLAYBACK_KEY, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? parsed
    : {};
}

export function getWatchlistIds() {
  const store = readWatchlistStore();
  const ids = store[scopeKey()];
  return Array.isArray(ids) ? [...new Set(ids.map(String))] : [];
}

export function isInWatchlist(showId) {
  return getWatchlistIds().includes(String(showId));
}

export function addToWatchlist(showId) {
  const id = String(showId || "");
  if (!id) return getWatchlistIds();

  const store = readWatchlistStore();
  const scope = scopeKey();
  const current = Array.isArray(store[scope]) ? store[scope] : [];
  const next = [...new Set([...current.map(String), id])];
  store[scope] = next;
  writeJson(WATCHLIST_KEY, store, "retrotoonz:watchlist-changed");
  return next;
}

export function removeFromWatchlist(showId) {
  const id = String(showId || "");
  const store = readWatchlistStore();
  const scope = scopeKey();
  const current = Array.isArray(store[scope]) ? store[scope] : [];
  const next = current.filter((item) => String(item) !== id);
  store[scope] = next;
  writeJson(WATCHLIST_KEY, store, "retrotoonz:watchlist-changed");
  return next;
}

export function toggleWatchlist(showId) {
  if (isInWatchlist(showId)) {
    removeFromWatchlist(showId);
    return false;
  }

  addToWatchlist(showId);
  return true;
}

export function getPlaybackEntries() {
  const store = readPlaybackStore();
  const scoped = store[scopeKey()];
  if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) return [];

  return Object.values(scoped)
    .filter((entry) => entry && entry.showId)
    .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
}

export function getPlaybackProgress(showId) {
  const id = String(showId || "");
  if (!id) return null;
  return getPlaybackEntries().find((entry) => String(entry.showId) === id) ?? null;
}

export function getContinueWatchingEntries(limit = 12) {
  return getPlaybackEntries()
    .filter((entry) => {
      const currentTime = Number(entry.currentTime || 0);
      const duration = Number(entry.duration || 0);
      return !entry.completed && currentTime >= 5 && (!duration || currentTime < duration - 8);
    })
    .slice(0, limit);
}

export function getWatchHistoryEntries(limit = 30) {
  return getPlaybackEntries()
    .filter((entry) => Number(entry.currentTime || 0) > 0)
    .slice(0, limit);
}

export function savePlaybackProgress({
  showId,
  episodeId,
  currentTime = 0,
  duration = 0,
  seasonNumber = null,
  episodeNumber = null,
  episodeTitle = "",
}) {
  const normalizedShowId = String(showId || "");
  const normalizedEpisodeId = String(episodeId || "");
  if (!normalizedShowId || !normalizedEpisodeId) return null;

  const safeCurrentTime = Math.max(0, Number(currentTime) || 0);
  const safeDuration = Math.max(0, Number(duration) || 0);
  const completionRatio = safeDuration > 0 ? safeCurrentTime / safeDuration : 0;
  const completed = safeDuration > 0 && completionRatio >= 0.95;

  const store = readPlaybackStore();
  const scope = scopeKey();
  const scoped =
    store[scope] && typeof store[scope] === "object" && !Array.isArray(store[scope])
      ? store[scope]
      : {};

  const entry = {
    showId: normalizedShowId,
    episodeId: normalizedEpisodeId,
    currentTime: completed ? safeDuration : safeCurrentTime,
    duration: safeDuration,
    seasonNumber,
    episodeNumber,
    episodeTitle: String(episodeTitle || ""),
    completed,
    updatedAt: Date.now(),
  };

  scoped[normalizedShowId] = entry;
  store[scope] = scoped;
  writeJson(PLAYBACK_KEY, store, "retrotoonz:playback-changed");
  return entry;
}

export function markPlaybackCompleted({
  showId,
  episodeId,
  duration = 0,
  seasonNumber = null,
  episodeNumber = null,
  episodeTitle = "",
}) {
  return savePlaybackProgress({
    showId,
    episodeId,
    currentTime: Number(duration) || 0,
    duration,
    seasonNumber,
    episodeNumber,
    episodeTitle,
  });
}

export function clearPlaybackProgress(showId) {
  const id = String(showId || "");
  if (!id) return;

  const store = readPlaybackStore();
  const scope = scopeKey();
  if (!store[scope] || typeof store[scope] !== "object") return;

  delete store[scope][id];
  writeJson(PLAYBACK_KEY, store, "retrotoonz:playback-changed");
}
