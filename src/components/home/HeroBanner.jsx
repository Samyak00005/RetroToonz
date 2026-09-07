import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  InformationCircleIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getEpisodesForShow } from "../../services/contentService.js";
import { getPlaybackProgress } from "../../services/libraryService.js";
import { buildWatchPath } from "../../utils/watchRoutes.js";

const DEFAULT_BACKDROP = "/media/defaults/image.jpg";
const MOBILE_BREAKPOINT = "(max-width: 640px)";
const AUTO_PLAY_INTERVAL = 5000;
const SLIDE_DURATION = 400;
const MAX_INDICATORS = 5;

function HeroBanner({ shows = [] }) {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [slideIn, setSlideIn] = useState(true);
  const [paused, setPaused] = useState(false);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_BREAKPOINT).matches
      : false,
  );

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const slideTimeoutRef = useRef(null);

  const indicatorCount = Math.min(MAX_INDICATORS, shows.length);

  const handlePrev = () => {
    if (!shows.length) return;

    setSlideIn(true);
    setIndex((current) => (current - 1 + shows.length) % shows.length);
  };

  const handleNext = () => {
    if (!shows.length) return;

    setSlideIn(true);
    setIndex((current) => (current + 1) % shows.length);
  };

  const handleTouchStart = (event) => {
    if (!isMobile) return;

    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event) => {
    if (!isMobile) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;

    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < 50) return;

    if (deltaX < 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);

    const handleChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener?.("change", handleChange);

    if (!mediaQuery.addEventListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);

      if (!mediaQuery.removeEventListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!shows.length || paused) return undefined;

    const interval = setInterval(() => {
      setSlideIn(false);

      slideTimeoutRef.current = setTimeout(() => {
        setIndex((current) => (current + 1) % shows.length);
        setSlideIn(true);
      }, SLIDE_DURATION);
    }, AUTO_PLAY_INTERVAL);

    return () => {
      clearInterval(interval);

      if (slideTimeoutRef.current) {
        clearTimeout(slideTimeoutRef.current);
      }
    };
  }, [paused, shows.length]);

  useEffect(() => {
    if (index >= shows.length) {
      setIndex(0);
    }
  }, [index, shows.length]);

  if (!shows.length) return null;

  const show = shows[index];

  const handleStartWatching = () => {
    const episodes = getEpisodesForShow(show.id);
    const savedPlayback = getPlaybackProgress(show.id);
    const savedEpisodeStillExists =
      savedPlayback &&
      !savedPlayback.completed &&
      episodes.some(
        (episode) => String(episode.episodeId) === String(savedPlayback.episodeId),
      );
    const episodeId = savedEpisodeStillExists
      ? savedPlayback.episodeId
      : episodes[0]?.episodeId;

    navigate(buildWatchPath(show.id, episodeId));
  };

  const handleMoreInfo = () => {
    navigate(`/show/${show.id}`);
  };

  const heroImage = isMobile
    ? show.poster || DEFAULT_BACKDROP
    : show.heroPoster || DEFAULT_BACKDROP;

  const descriptionText = show.description || "";

  return (
    <div
      className="relative w-full touch-pan-y select-none overflow-hidden text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="relative aspect-[3/4] w-full sm:aspect-[4/3] lg:aspect-[21/9]">
        <div
          key={show.id}
          className={`absolute inset-0 h-full w-full transition-all duration-700 ease-in-out will-change-transform ${
            slideIn
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
        >
          <img
            src={heroImage}
            alt={show.title}
            draggable="false"
            className="h-full w-full object-cover animate-[slowZoom_12s_linear_infinite]"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = DEFAULT_BACKDROP;
            }}
          />
        </div>

        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-black/35 to-transparent" />

        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="h-full w-full bg-gradient-to-t from-[#080914] via-[#080914]/40 to-transparent" />
        </div>

        <div className="absolute inset-0 z-30 mx-auto flex w-full max-w-[1800px] flex-col items-start justify-end px-4 pb-10 sm:px-6 sm:pb-8 md:pb-10 lg:px-10 lg:pb-12">
          <div className="mb-3 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-label text-white/80 lg:text-base">
                Watch
              </span>

              <h1 className="max-w-[900px] text-2xl font-bold tracking-[-0.035em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-4xl lg:text-5xl xl:text-6xl">
                {show.title}
              </h1>
            </div>
          </div>

          {descriptionText && (
            <div className="mb-3 text-white/80">
              <p className="m-0 line-clamp-2 max-w-full text-xs leading-relaxed sm:text-sm lg:line-clamp-3 lg:max-w-[50vw] lg:text-base">
                {descriptionText}
              </p>
            </div>
          )}

          {show.tags?.length > 0 && (
            <div className="mb-3 flex items-center gap-2 text-[10px] text-white/65 sm:text-xs">
              {show.tags.slice(0, 3).map((tag, tagIndex) => (
                <span key={tag} className="flex items-center gap-2">
                  {tagIndex > 0 && <span className="text-white/30">•</span>}

                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 lg:gap-4">
            <button
              type="button"
              onClick={handleStartWatching}
              className="
                group relative inline-flex items-center gap-2
                rounded-full
                bg-gradient-to-r from-cyan-500 to-blue-600
                px-4 py-2.5
                text-sm font-medium text-white
                shadow-md
                transition-all duration-300
                hover:scale-105
                hover:from-blue-600 hover:to-cyan-500
                active:scale-95
                lg:px-5 lg:py-3
              "
            >
              <span className="absolute -z-10 inline-flex h-9 w-9 rounded-full bg-cyan-400 opacity-20 group-hover:animate-ping" />

              <HugeiconsIcon icon={PlayIcon} size={20} />

              <span>Start Watching</span>
            </button>

            <button
              type="button"
              onClick={handleMoreInfo}
              title="More Info"
              aria-label={`More information about ${show.title}`}
              className="
                flex h-11 w-11 items-center justify-center
                rounded-full
                border border-white/20
                bg-white/20
                backdrop-blur-md
                transition-all duration-300
                hover:scale-105
                hover:bg-white/30
              "
            >
              <HugeiconsIcon icon={InformationCircleIcon} size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="
              absolute left-5 top-[40%] z-40
              hidden h-14 w-14
              -translate-y-1/2
              items-center justify-center
              rounded-full
              bg-black/20
              backdrop-blur-sm
              transition-all duration-300
              hover:scale-110
              hover:bg-black/50
              lg:flex
            "
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={28} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="
              absolute right-5 top-[40%] z-40
              hidden h-14 w-14
              -translate-y-1/2
              items-center justify-center
              rounded-full
              bg-black/20
              backdrop-blur-sm
              transition-all duration-300
              hover:scale-110
              hover:bg-black/50
              hover:scale-110
              lg:flex
            "
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={28} />
          </button>

          <div className="absolute bottom-2 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 lg:bottom-3">
            {Array.from({ length: indicatorCount }).map((_, indicatorIndex) => {
              const activeIndex = index % indicatorCount;
              const isActive = indicatorIndex === activeIndex;

              return (
                <button
                  key={indicatorIndex}
                  type="button"
                  onClick={() => {
                    setIndex(indicatorIndex);
                    setSlideIn(true);
                  }}
                  aria-label={`Go to slide ${indicatorIndex + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    isActive ? "h-2 w-5 bg-white" : "h-1.5 w-1.5 bg-white/40"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slowZoom {
            from {
              transform: scale(1.05);
            }

            to {
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default HeroBanner;
