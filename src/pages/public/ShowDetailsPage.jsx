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
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [playbackRevision, setPlaybackRevision] = useState(0);

  const seasons = useMemo(() => {
    if (Array.isArray(show?.seasons) && show.seasons.length) return show.seasons;
    return [{ seasonNumber: 1, title: "Season 1", episodes: [] }];
  }, [show]);

  useEffect(() => {
    setActiveSeason(0);
    setShowAll(false);
    setSaved(isInWatchlist(id));
    setDescriptionExpanded(false);
  }, [id]);

  useEffect(() => setShowAll(false), [activeSeason]);

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
              <button type="button" className="rt-button rt-button-primary" onClick={() => navigate("/all-shows")}>Browse all shows</button>
              <button type="button" className="rt-button rt-button-secondary" onClick={() => navigate("/")}>Go home</button>
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
          <section className="relative mb-5 aspect-square w-full overflow-hidden rounded-[var(--rt-radius-card)] border border-white/10 sm:aspect-auto sm:h-60 md:h-72 lg:h-[400px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-black/55 text-white/90 transition-colors hover:bg-black/75 sm:left-4 sm:top-4 lg:left-6 lg:top-5"
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#080914] via-black/20 to-transparent" />
          </section>

          <section className="pb-10">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-title">{show.title}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/55">
                  {show.rating && (
                    <span className="inline-flex items-center gap-1 font-semibold text-yellow-300">
                      <HugeiconsIcon icon={StarIcon} size={17} />
                      {show.rating}
                    </span>
                  )}
                  {show.views && <span>• {show.views} views</span>}
                  {show.duration && <span>• {show.duration}</span>}
                  {show.language && <span>• {show.language}</span>}
                  {show.year && <span>• {show.year}</span>}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleWatchlist}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
                  aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                  title={saved ? "Remove from watchlist" : "Add to watchlist"}
                >
                  <HugeiconsIcon
                    icon={FavouriteIcon}
                    size={28}
                    className={saved ? "text-red-500" : ""}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => startWatching()}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-500 sm:h-13 sm:w-13"
                  title={resumablePlayback ? "Resume watching" : "Start watching"}
                  aria-label={resumablePlayback ? "Resume watching" : "Start watching"}
                >
                  <HugeiconsIcon icon={PlayIcon} size={25} />
                </button>
              </div>
            </div>

            {show.tags?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {show.tags.map((tag) => (
                  <span key={tag} className="rt-chip border-white/10 bg-white/[0.04] text-white/65">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mb-8 max-w-5xl">
              <p
                className={`text-body leading-7 text-white/60 ${
                  descriptionExpanded ? "" : "rt-show-description-clamp"
                }`}
              >
                {show.description || "Add something meaningful here about characters, story or nostalgia!"}
              </p>
              {(show.description || "").length > 150 && (
                <button
                  type="button"
                  onClick={() => setDescriptionExpanded((value) => !value)}
                  className="mt-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200 lg:hidden"
                >
                  {descriptionExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">Episodes</h2>
                <p className="mt-1 text-sm text-white/42">{episodes.length} in this season</p>
              </div>

              {seasons.length > 1 && (
                <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto pb-1 sm:justify-end">
                  {seasons.map((seasonItem, index) => {
                    const isActiveSeason = index === activeSeason;
                    return (
                      <button
                        key={seasonItem.seasonNumber ?? index}
                        type="button"
                        onClick={() => setActiveSeason(index)}
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          isActiveSeason
                            ? "border-white/25 bg-white/14 text-white"
                            : "border-white/10 bg-transparent text-white/55 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        {seasonItem.title || `Season ${seasonItem.seasonNumber ?? index + 1}`}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {episodes.length === 0 ? (
              <div className="rt-surface p-8 text-center text-white/55">No episodes have been added for this season yet.</div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5">
                {visibleEpisodes.map((episode, index) => {
                  const parsedNumber = Number.parseInt(String(episode.id ?? "").replace(/\D/g, ""), 10);
                  const episodeNumber = episode.episodeNumber ?? (Number.isNaN(parsedNumber) ? index + 1 : parsedNumber);
                  const episodeLabel = String(episodeNumber).padStart(2, "0");
                  const episodeId = episode.episodeId ?? episode.id ?? episodeNumber;
                  const thumbnail = getEpisodeThumbnail(episode, showBackdrop);
                  const isCurrentEpisode = playback?.episodeId === episodeId;
                  const hasProgress = isCurrentEpisode && Number(playback?.duration || 0) > 0;
                  const progress = hasProgress
                    ? Math.min(100, (Number(playback.currentTime || 0) / Number(playback.duration || 1)) * 100)
                    : 0;

                  return (
                    <button
                      key={episodeId}
                      type="button"
                      onClick={() => startWatching(episodeId)}
                      className="group text-left"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-[var(--rt-radius-card)] border border-white/10 bg-black/30 transition-colors duration-200 group-hover:border-white/22">
                        <img
                          src={thumbnail}
                          alt={episode.title || `Episode ${episodeLabel}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = getMediaUrl(showBackdrop) || FALLBACK_IMAGE;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                        <span className="absolute left-2.5 top-2.5 rounded-md bg-black/65 px-2 py-1 text-[10px] font-semibold text-white/90">E{episodeLabel}</span>
                        <span className="absolute left-3 right-3 bottom-3 line-clamp-1 text-sm font-semibold text-white">{episode.title || `Episode ${episodeLabel}`}</span>
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white">
                            <HugeiconsIcon icon={PlayIcon} size={20} />
                          </span>
                        </span>
                        {hasProgress && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
                            <div className="h-full bg-cyan-300" style={{ width: `${progress}%` }} />
                          </div>
                        )}
                      </div>

                      {episode.synopsis && (
                        <p className="mt-2 px-0.5 text-xs leading-5 text-white/48" style={clampStyle(2)}>{episode.synopsis}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {episodes.length > visibleCount && (
              <div className="mt-6 flex justify-center">
                <button type="button" onClick={() => setShowAll((previous) => !previous)} className="rt-button rt-button-secondary">
                  {showAll ? "Show less" : `Show ${episodes.length - visibleCount} more`}
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
