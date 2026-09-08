export function getEpisodeId(episode) {
  return episode?.episodeId ?? episode?.id ?? episode?.episodeNumber ?? null;
}

export function buildWatchPath(showId, episodeId) {
  if (!showId) return "/";

  const showSegment = encodeURIComponent(String(showId));
  if (!episodeId) return `/watch/${showSegment}`;

  return `/watch/${showSegment}/${encodeURIComponent(String(episodeId))}`;
}
