import rawCatalogData from "../data/Shows.json";
import { getMediaUrl } from "./mediaService.js";

/**
 * Temporary static catalog boundary.
 *
 * The UI consumes catalog data through this module instead of importing the
 * JSON directly. Media paths are resolved here as well, so the current
 * /public/media deployment can later move to a CDN/object store by setting
 * VITE_MEDIA_BASE_URL without rewriting page components.
 */
function resolveQualities(qualities) {
  if (!Array.isArray(qualities)) return qualities;
  return qualities.map((quality) => ({
    ...quality,
    url: getMediaUrl(quality?.url),
  }));
}

function resolveEpisode(episode) {
  return {
    ...episode,
    thumbnail: getMediaUrl(episode.thumbnail),
    videoUrl: getMediaUrl(episode.videoUrl),
    qualities: resolveQualities(episode.qualities),
  };
}

function resolveSeason(season) {
  return {
    ...season,
    episodes: (season.episodes ?? []).map(resolveEpisode),
  };
}

function resolveShow(show) {
  return {
    ...show,
    poster: getMediaUrl(show.poster),
    backdrop: getMediaUrl(show.backdrop),
    videoUrl: getMediaUrl(show.videoUrl),
    qualities: resolveQualities(show.qualities),
    seasons: (show.seasons ?? []).map(resolveSeason),
  };
}

const catalogData = {
  ...rawCatalogData,
  allShows: (rawCatalogData.allShows ?? []).map(resolveShow),
};

export const getAllShows = () => catalogData.allShows;

export const getShowById = (showId) =>
  getAllShows().find((show) => String(show.id) === String(showId)) ?? null;

export const getAllEpisodes = () =>
  getAllShows().flatMap((show) =>
    (show.seasons ?? []).flatMap((season) =>
      (season.episodes ?? []).map((episode) => ({
        ...episode,
        showId: show.id,
        showTitle: show.title,
        seasonNumber: season.seasonNumber,
      })),
    ),
  );


export const getEpisodesForShow = (showId) => {
  const show = getShowById(showId);
  if (!show) return [];

  return (show.seasons ?? []).flatMap((season, seasonIndex) =>
    (season.episodes ?? []).map((episode, episodeIndex) => ({
      ...episode,
      showId: show.id,
      showTitle: show.title,
      seasonNumber: season.seasonNumber ?? seasonIndex + 1,
      seasonTitle: season.title || `Season ${season.seasonNumber ?? seasonIndex + 1}`,
      episodeNumber: episode.episodeNumber ?? episodeIndex + 1,
    })),
  );
};

export const getEpisodeForShow = (showId, episodeId) =>
  getEpisodesForShow(showId).find(
    (episode) => String(episode.episodeId) === String(episodeId),
  ) ?? null;

export const getPlayableEpisodes = () =>
  getAllEpisodes().filter((episode) => episode.isPlayable && episode.videoUrl);

export const getEpisodeById = (episodeId) =>
  getAllEpisodes().find(
    (episode) => String(episode.episodeId) === String(episodeId),
  ) ?? null;

export default catalogData;
