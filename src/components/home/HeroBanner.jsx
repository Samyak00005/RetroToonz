import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  InformationCircleIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getEpisodesForShow } from "../../services/contentService.js";
import { getPlaybackProgress } from "../../services/libraryService.js";
import { buildWatchPath } from "../../utils/watchRoutes.js";

const DEFAULT_BACKDROP = "/media/defaults/image.jpg";
const MOBILE_BREAKPOINT = "(max-width: 640px)";
const AUTO_PLAY_INTERVAL = 7000;
const MAX_INDICATORS = 5;
const HERO_TRANSITION_MS = 480;

function getHeroImageForShow(show, isMobile) {
  if (!show) return DEFAULT_BACKDROP;
  return (isMobile ? show.poster : show.heroPoster) || DEFAULT_BACKDROP;
}

function HeroBanner({ shows = [] }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [previousShow, setPreviousShow] = useState(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_BREAKPOINT).matches
      : false,
  );

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const transitionTimer = useRef(null);
  const indicatorCount = Math.min(MAX_INDICATORS, shows.length);

  const transitionToIndex = useCallback(
    (nextIndex) => {
      if (!shows.length || nextIndex === index) return;

      setPreviousShow(shows[index] || null);
      setIndex(nextIndex);

      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current);
      }

      transitionTimer.current = window.setTimeout(() => {
        setPreviousShow(null);
        transitionTimer.current = null;
      }, HERO_TRANSITION_MS + 80);
    },
    [index, shows],
  );

  const handlePrev = () => {
    if (!shows.length) return;
    transitionToIndex((index - 1 + shows.length) % shows.length);
  };

  const handleNext = () => {
    if (!shows.length) return;
    transitionToIndex((index + 1) % shows.length);
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

    if (Math.abs(deltaY) > Math.abs(deltaX) || Math.abs(deltaX) < 50) return;
    if (deltaX < 0) handleNext();
    else handlePrev();
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const handleChange = (event) => setIsMobile(event.matches);

    mediaQuery.addEventListener?.("change", handleChange);
    if (!mediaQuery.addEventListener) mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeEventListener?.("change", handleChange);
      if (!mediaQuery.removeEventListener) mediaQuery.removeListener(handleChange);
    };
  }, []);

  useEffect(() => {
    if (!shows.length || paused) return undefined;

    const interval = window.setInterval(() => {
      transitionToIndex((index + 1) % shows.length);
    }, AUTO_PLAY_INTERVAL);

    return () => window.clearInterval(interval);
  }, [index, paused, shows.length, transitionToIndex]);

  useEffect(() => {
    if (index >= shows.length) setIndex(0);
  }, [index, shows.length]);

  useEffect(() => {
    if (shows.length < 2 || typeof window === "undefined") return undefined;

    const neighborIndexes = [
      (index + 1) % shows.length,
      (index - 1 + shows.length) % shows.length,
    ];

    neighborIndexes.forEach((neighborIndex) => {
      const image = new Image();
      image.src = getHeroImageForShow(shows[neighborIndex], isMobile);
    });

    return undefined;
  }, [index, isMobile, shows]);

  useEffect(() => () => {
    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }
  }, []);

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

  const heroImage = getHeroImageForShow(show, isMobile);
  const previousHeroImage = getHeroImageForShow(previousShow, isMobile);

  const descriptionText = show.description || "";
  const metadata = [
    show.year,
    show.language,
    show.rating ? `${show.rating}/10` : null,
  ].filter(Boolean);

  return (
    <section
      className="group relative w-full touch-pan-y select-none overflow-hidden text-white"
      aria-label={`Featured show: ${show.title}`}
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
        {previousShow && (
          <div
            aria-hidden="true"
            className="rt-hero-image rt-hero-image-previous absolute inset-0 h-full w-full"
          >
            <img
              src={previousHeroImage}
              alt=""
              draggable="false"
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = DEFAULT_BACKDROP;
              }}
            />
          </div>
        )}

        <div
          key={`${show.id}-${isMobile ? "mobile" : "wide"}`}
          className="rt-hero-image rt-hero-image-current absolute inset-0 h-full w-full"
        >
          <img
            src={heroImage}
            alt={show.title}
            draggable="false"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = DEFAULT_BACKDROP;
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(4,5,12,0.78)_0%,rgba(4,5,12,0.40)_38%,rgba(4,5,12,0.08)_68%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(0deg,#070812_0%,rgba(7,8,18,0.72)_12%,rgba(7,8,18,0.08)_48%,rgba(7,8,18,0.10)_100%)]" />

        <div className="rt-hero-content">
          <div key={show.id} className="rt-hero-copy rt-hero-copy-transition">
            {metadata.length > 0 && (
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-white/68 sm:text-sm">
                {metadata.map((item, itemIndex) => (
                  <span key={`${item}-${itemIndex}`} className="flex items-center gap-2">
                    {itemIndex > 0 && <span className="text-white/28">•</span>}
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            )}

            <h1 className="rt-hero-title">{show.title}</h1>

            {descriptionText && (
              <p className="rt-hero-description">{descriptionText}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3">
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
                onClick={() => navigate(`/show/${show.id}`)}
                className="rt-button rt-button-secondary rounded-full border-white/12 bg-black/20 px-4 text-white backdrop-blur-sm hover:bg-black/35 sm:px-5"
                aria-label={`More information about ${show.title}`}
              >
                <HugeiconsIcon icon={InformationCircleIcon} size={18} />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>

        {shows.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous featured show"
              className="rt-hero-arrow rt-hero-arrow-left"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={22} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next featured show"
              className="rt-hero-arrow rt-hero-arrow-right"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={22} />
            </button>
          </>
        )}

        {indicatorCount > 1 && (
          <div className="rt-hero-indicators" aria-label="Featured show slides">
            {Array.from({ length: indicatorCount }).map((_, indicatorIndex) => {
              const activeIndex = index % indicatorCount;
              const isActive = indicatorIndex === activeIndex;

              return (
                <button
                  key={indicatorIndex}
                  type="button"
                  onClick={() => transitionToIndex(indicatorIndex)}
                  aria-label={`Show featured item ${indicatorIndex + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`rt-hero-indicator ${
                    isActive ? "rt-hero-indicator-active" : ""
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroBanner;
