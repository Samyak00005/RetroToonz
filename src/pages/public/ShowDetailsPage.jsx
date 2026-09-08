import {
  ArrowLeft01Icon,
  FavouriteIcon,
  PlayIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";
import showsData from "../../services/contentService.js";
import {
  getPlaybackProgress,
  isInWatchlist,
  toggleWatchlist,
} from "../../services/libraryService.js";
import { getFallbackImageUrl, getMediaUrl } from "../../services/mediaService.js";
import { showToast } from "../../services/toastService.js";
import { buildWatchPath } from "../../utils/watchRoutes.js";

const FALLBACK_IMAGE = getFallbackImageUrl();

const clampStyle = (lines) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

function getEpisodeThumbnail(episode, showBackdrop) {
  return getMediaUrl(
    episode?.thumbnail ||
      episode?.backdrop ||
      showBackdrop ||
      "/media/defaults/image.jpg",
  );
}

export default function ShowDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const show = (showsData.allShows || []).find((item) => item.id === id);

  const [activeSeason, setActiveSeason] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [saved, setSaved] = useState(() => isInWatchlist(id));
  const [playbackRevision, setPlaybackRevision] = useState(0);

  const seasons = useMemo(() => {
    if (Array.isArray(show?.seasons) && show.seasons.length) return show.seasons;
    return [{ seasonNumber: 1, title: "Season 1", episodes: [] }];
  }, [show]);

  useEffect(() => {
    setActiveSeason(0);
    setShowAll(false);
    setSaved(isInWatchlist(id));
  }, [id]);

  useEffect(() => {
    setShowAll(false);
  }, [activeSeason]);

  useEffect(() => {
    const syncPlayback = () => setPlaybackRevision((value) => value + 1);
    window.addEventListener("retrotoonz:playback-changed", syncPlayback);
    return () =>
      window.removeEventListener("retrotoonz:playback-changed", syncPlayback);
  }, []);

  if (!show) {
    return (
      <div className="rt-page flex min-h-screen flex-col">
        <Header />
        <main className="rt-content rt-page-pad flex flex-1 items-center justify-center">
          <div className="rt-surface max-w-lg p-8 text-center">
            <h1 className="rt-page-title">Show not found</h1>
            <p className="mt-3 text-white/55">
              This show is missing or the link is no longer valid.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" className="rt-button rt-button-primary" onClick={() => navigate("/all-shows")}>
                Browse all shows
              </button>
              <button type="button" className="rt-button rt-button-secondary" onClick={() => navigate("/")}>
                Go home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const posterMobile = getMediaUrl(show.poster || show.backdrop);
  const posterDesktop = getMediaUrl(show.backdrop || show.poster);
  const firstEpisodeId = seasons[0]?.episodes?.[0]?.episodeId;
  const showBackdrop = show.backdrop;
  const season = seasons[activeSeason] || { episodes: [] };
  const episodes = Array.isArray(season.episodes) ? season.episodes : [];
  const visibleCount = 10;
  const visibleEpisodes = showAll ? episodes : episodes.slice(0, visibleCount);

  const playback = getPlaybackProgress(show.id);
  const resumablePlayback =
    playback && !playback.completed && Number(playback.currentTime || 0) >= 5
      ? playback
      : null;
  void playbackRevision;

  const startWatching = (episodeId = resumablePlayback?.episodeId || firstEpisodeId) => {
    navigate(buildWatchPath(show.id, episodeId));
  };

  const handleWatchlist = () => {
    const next = toggleWatchlist(show.id);
    setSaved(next);
    showToast(next ? "Added to your watchlist." : "Removed from your watchlist.");
  };

  return (
    <div className="rt-page flex min-h-screen flex-col text-white">
      <Header />

      <main className="flex-grow">
        <div className="rt-standard-content py-4 sm:py-5 lg:py-6">
          {/* Original Show Details artwork block restored. */}
          <section className="relative mb-5 aspect-square w-full overflow-hidden rounded-[var(--rt-radius-card)] border border-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:aspect-auto sm:h-60 md:h-72 lg:h-[400px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-3 top-3 z-20 rounded-full border border-white/10 bg-black/40 p-2.5 backdrop-blur-md transition hover:bg-black/60 sm:left-4 sm:top-4 lg:left-6 lg:top-5"
              aria-label="Go back"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </button>

            <picture>
              <source srcSet={posterMobile} media="(max-width:600px)" />
              <img
                src={posterDesktop}
                alt={`${show.title} poster`}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </picture>

            <div className="absolute inset-0 bg-gradient-to-t from-[#080914] via-black/30 to-transparent" />
          </section>

          {/* Original information hierarchy restored, with current watchlist/resume logic underneath. */}
          <section className="pb-10">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-title">{show.title}</h1>

                <div className="mt-1 flex items-center gap-2 text-yellow-400 text-label">
                  <HugeiconsIcon icon={StarIcon} size={18} />
                  <span>{show.rating || "9.1"}</span>
                  <span className="text-meta text-gray-400">
                    ({show.views || "35k"} views)
                  </span>
                </div>

                <p className="mt-1 text-meta text-gray-400">
                  {show.duration || "2 hr"} | {show.language || "Hindi"} | {show.year}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4 sm:gap-5">
                <button
                  type="button"
                  onClick={handleWatchlist}
                  aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                  title={saved ? "Remove from watchlist" : "Add to watchlist"}
                >
                  <HugeiconsIcon
                    icon={FavouriteIcon}
                    size={34}
                    className={`transition-all duration-200 sm:h-9 sm:w-9 ${
                      saved
                        ? "scale-110 text-red-500"
                        : "text-white/80 hover:text-white"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => startWatching()}
                  className="rounded-full bg-purple-600 p-3 shadow-md transition hover:bg-purple-700 sm:p-4"
                  title={resumablePlayback ? "Resume watching" : "Start watching"}
                  aria-label={resumablePlayback ? "Resume watching" : "Start watching"}
                >
                  <HugeiconsIcon icon={PlayIcon} size={26} />
                </button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {show.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rt-chip border-white/10 bg-white/[0.055] text-white/75"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mb-7 max-w-5xl text-body leading-7 text-white/58">
              {show.description ||
                "Add something meaningful here about characters, story or nostalgia!"}
            </p>

            <div className="mb-4">
              <h2 className="mb-3 text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">
                Episodes
              </h2>

              {seasons.length > 1 && (
                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                  {seasons.map((seasonItem, index) => {
                    const isActiveSeason = index === activeSeason;
                    return (
                      <button
                        key={seasonItem.seasonNumber ?? index}
                        type="button"
                        onClick={() => setActiveSeason(index)}
                        className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                          isActiveSeason
                            ? "border-white/20 bg-white/20 text-white shadow-sm"
                            : "border-transparent bg-white/10 text-white/70 backdrop-blur-md hover:border-white/10 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        {seasonItem.title ||
                          `Season ${seasonItem.seasonNumber ?? index + 1}`}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {episodes.length === 0 ? (
              <div className="rt-surface p-8 text-center text-white/55">
                No episodes have been added for this season yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                {visibleEpisodes.map((episode, index) => {
                  const parsedNumber = Number.parseInt(
                    String(episode.id ?? "").replace(/\D/g, ""),
                    10,
                  );
                  const episodeNumber =
                    episode.episodeNumber ??
                    (Number.isNaN(parsedNumber) ? index + 1 : parsedNumber);
                  const episodeLabel = String(episodeNumber).padStart(2, "0");
                  const episodeId = episode.episodeId ?? episode.id ?? episodeNumber;
                  const thumbnail = getEpisodeThumbnail(episode, showBackdrop);
                  const isCurrentEpisode = playback?.episodeId === episodeId;
                  const hasProgress =
                    isCurrentEpisode && Number(playback?.duration || 0) > 0;
                  const progress = hasProgress
                    ? Math.min(
                        100,
                        (Number(playback.currentTime || 0) /
                          Number(playback.duration || 1)) *
                          100,
                      )
                    : 0;

                  return (
                    <button
                      key={episodeId}
                      type="button"
                      onClick={() => startWatching(episodeId)}
                      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 text-left transition-all duration-200 hover:border-sky-400/60 hover:ring-1 hover:ring-sky-300/60 hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] sm:rounded-2xl"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/30 sm:rounded-xl">
                        <img
                          src={thumbnail}
                          alt={episode.title || `Episode ${episodeLabel}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src =
                              getMediaUrl(showBackdrop) || FALLBACK_IMAGE;
                          }}
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="rounded-full border border-white/10 bg-black/50 p-3 text-white/80 backdrop-blur-lg transition-all duration-200 hover:scale-110 hover:bg-black/60 hover:text-white">
                            <HugeiconsIcon icon={PlayIcon} size={20} />
                          </span>
                        </div>

                        <span className="absolute left-2 top-2 rounded-md border border-white/15 bg-black/60 px-2 py-0.5 text-[10px] font-semibold leading-4 text-white backdrop-blur-md">
                          E{episodeLabel}
                        </span>

                        <div className="absolute bottom-2 left-3 right-3">
                          <h3 className="truncate text-sm font-semibold">
                            {episode.title || `Episode ${episodeLabel}`}
                          </h3>
                        </div>

                        {hasProgress && (
                          <div className="absolute inset-x-2 bottom-0 h-1 overflow-hidden rounded-full bg-white/15">
                            <div
                              className="h-full rounded-full bg-cyan-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {episode.synopsis && (
                        <p
                          className="mt-1.5 px-0.5 text-xs text-gray-400"
                          style={clampStyle(2)}
                        >
                          {episode.synopsis}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {episodes.length > visibleCount && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll((previous) => !previous)}
                  className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/15 hover:text-white"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
