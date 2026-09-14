import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { getPlaybackProgress } from "../../services/libraryService.js";
import { getMediaUrl } from "../../services/mediaService.js";

const DEFAULT_THUMBNAIL = "/media/defaults/image.jpg";

const normalizePath = (path) => getMediaUrl(path) || null;

function getEpisodeThumbnail(episode, showBackdrop) {
  return (
    normalizePath(episode?.thumbnail) ||
    normalizePath(episode?.backdrop) ||
    normalizePath(showBackdrop) ||
    DEFAULT_THUMBNAIL
  );
}

function handleThumbnailError(event, showBackdrop) {
  const image = event.currentTarget;
  const fallbackBackdrop = normalizePath(showBackdrop);

  if (image.dataset.fallbackStage !== "backdrop" && fallbackBackdrop) {
    image.dataset.fallbackStage = "backdrop";
    image.src = fallbackBackdrop;
    return;
  }

  image.onerror = null;
  image.src = DEFAULT_THUMBNAIL;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function VideoPlayerEpisodes({
  showId,
  seasons,
  showBackdrop,
  activeEpisodeId,
  onSelectEpisode,
}) {
  const railRef = useRef(null);
  const [playbackRevision, setPlaybackRevision] = useState(0);

  const normalizedSeasons = useMemo(() => {
    if (Array.isArray(seasons) && seasons.length) return seasons;
    return [{ seasonNumber: 1, episodes: [] }];
  }, [seasons]);

  const [activeSeason, setActiveSeason] = useState(0);

  useEffect(() => {
    if (!activeEpisodeId) return;
    const seasonIndex = normalizedSeasons.findIndex((seasonItem) =>
      (seasonItem.episodes || []).some((episode) => {
        const episodeId = episode.episodeId ?? episode.id ?? episode.episodeNumber;
        return String(episodeId) === String(activeEpisodeId);
      }),
    );
    if (seasonIndex >= 0) setActiveSeason(seasonIndex);
  }, [activeEpisodeId, normalizedSeasons]);

  useEffect(() => {
    const sync = () => setPlaybackRevision((value) => value + 1);
    window.addEventListener("retrotoonz:playback-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("retrotoonz:playback-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const playback = useMemo(
    () => (showId ? getPlaybackProgress(showId) : null),
    [showId, playbackRevision],
  );

  const season = normalizedSeasons[activeSeason] || { episodes: [] };
  const episodes = Array.isArray(season.episodes) ? season.episodes : [];

  const scrollRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction === "left" ? -rail.clientWidth * 0.82 : rail.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  const chooseSeason = (index) => {
    setActiveSeason(index);
    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <section className="mb-8 w-full">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="rt-section-title">Episodes</h2>
          <p className="mt-1 text-sm text-white/42">{episodes.length} in this season</p>
        </div>

        {normalizedSeasons.length > 1 && (
          <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto pb-1 sm:justify-end">
            {normalizedSeasons.map((seasonItem, index) => {
              const isActive = index === activeSeason;
              return (
                <button
                  key={seasonItem.seasonNumber ?? index}
                  type="button"
                  onClick={() => chooseSeason(index)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-white/25 bg-white/14 text-white"
                      : "border-white/10 bg-transparent text-white/55 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  Season {seasonItem.seasonNumber ?? index + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {episodes.length === 0 ? (
        <div className="rt-surface p-8 text-center text-sm text-white/55">
          No episodes have been added for this season yet.
        </div>
      ) : (
        <div className="group/episode-rail relative">
          <button
            type="button"
            aria-label="Previous episodes"
            onClick={() => scrollRail("left")}
            className="absolute left-1 top-[40%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white/75 opacity-0 transition-colors hover:bg-black/85 hover:text-white group-hover/episode-rail:opacity-100 md:flex"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={19} />
          </button>

          <button
            type="button"
            aria-label="Next episodes"
            onClick={() => scrollRail("right")}
            className="absolute right-1 top-[40%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white/75 opacity-0 transition-colors hover:bg-black/85 hover:text-white group-hover/episode-rail:opacity-100 md:flex"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={19} />
          </button>

          <div
            ref={railRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth sm:gap-4"
          >
            {episodes.map((episode, index) => {
              const parsedNumber = Number.parseInt(String(episode.id ?? "").replace(/\D/g, ""), 10);
              const episodeNumber = episode.episodeNumber ?? (Number.isNaN(parsedNumber) ? index + 1 : parsedNumber);
              const episodeId = episode.episodeId ?? episode.id ?? episodeNumber;
              const isActive = String(activeEpisodeId) === String(episodeId);
              const isPlaybackEpisode = String(playback?.episodeId ?? "") === String(episodeId);
              const duration = Number(playback?.duration || 0);
              const currentTime = Number(playback?.currentTime || 0);
              const progress = isPlaybackEpisode && duration > 0 ? clamp((currentTime / duration) * 100, 0, 100) : 0;
              const thumbnail = getEpisodeThumbnail(episode, showBackdrop);

              return (
                <button
                  key={episodeId}
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => onSelectEpisode?.(episodeId)}
                  className="rt-episode-rail-card group/card snap-start text-left"
                >
                  <div
                    className={`relative aspect-video overflow-hidden rounded-[var(--rt-radius-card)] border bg-black/30 transition-colors duration-200 ${
                      isActive ? "border-cyan-300/70" : "border-white/10 group-hover/card:border-white/22"
                    }`}
                  >
                    <img
                      src={thumbnail}
                      alt={episode.title || `Episode ${episodeNumber}`}
                      loading="lazy"
                      data-fallback-stage="primary"
                      onError={(event) => handleThumbnailError(event, showBackdrop)}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/8 to-transparent" />

                    <span className="absolute left-2.5 top-2.5 rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold text-white/90">
                      E{String(episodeNumber).padStart(2, "0")}
                    </span>

                    {isActive && (
                      <span className="absolute right-2.5 top-2.5 rounded-full border border-cyan-200/30 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-cyan-200">
                        Current
                      </span>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 sm:flex">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
                        <HugeiconsIcon icon={PlayIcon} size={20} />
                      </span>
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-3 pt-12">
                      <h3 className="line-clamp-1 text-sm font-semibold text-white sm:text-[0.95rem]">
                        {episode.title || `Episode ${episodeNumber}`}
                      </h3>
                    </div>

                    {(isPlaybackEpisode || isActive) && (
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
                        <div
                          className="h-full bg-cyan-300 transition-[width] duration-300"
                          style={{ width: `${isPlaybackEpisode ? Math.max(progress, 2) : 2}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {episode.synopsis && (
                    <p className="mt-2 line-clamp-2 px-0.5 text-xs leading-5 text-white/48">
                      {episode.synopsis}
                    </p>
                  )}

                  {isPlaybackEpisode && duration > 0 && (
                    <div className="mt-2 flex items-center justify-between gap-3 px-0.5 text-[10px] font-medium text-white/40">
                      <span>{playback?.completed ? "Watched" : "Continue watching"}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
