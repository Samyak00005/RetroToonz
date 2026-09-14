import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { buildWatchPath } from "../../utils/watchRoutes.js";
import SectionHeading from "../common/SectionHeading.jsx";
import MediaImage from "../common/MediaImage.jsx";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatTimeLeft(seconds) {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  if (minutes < 60) return `${minutes}m left`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m left` : `${hours}h left`;
}

function ContinueWatchingRow({ shows = [] }) {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({ left: false, right: false });

  const updateScrollState = useCallback(() => {
    const row = scrollRef.current;
    if (!row) return;
    const max = Math.max(0, row.scrollWidth - row.clientWidth);
    setScrollState({
      left: row.scrollLeft > 4,
      right: row.scrollLeft < max - 4,
    });
  }, []);

  useEffect(() => {
    const row = scrollRef.current;
    if (!row) return undefined;
    updateScrollState();
    row.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    const frame = window.requestAnimationFrame(updateScrollState);
    return () => {
      window.cancelAnimationFrame(frame);
      row.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [shows.length, updateScrollState]);

  const scroll = (direction) => {
    const row = scrollRef.current;
    if (!row) return;

    const distance = Math.min(row.clientWidth * 0.86, 900);
    row.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  if (!shows.length) return null;

  return (
    <section className="relative w-full py-5 sm:py-6 lg:py-7">
      <div className="rt-home-section-content">
        <SectionHeading
          title="Continue Watching"
          description="Pick up where you left off."
          className="mb-3 sm:mb-4"
        />

        <div className="group/row relative">
          {scrollState.left && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll Continue Watching left"
              className="rt-rail-arrow absolute left-1 top-[42%] z-30 hidden -translate-y-1/2 md:flex"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>
          )}

          {scrollState.right && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll Continue Watching right"
              className="rt-rail-arrow absolute right-1 top-[42%] z-30 hidden -translate-y-1/2 md:flex"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-proximity gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth sm:gap-4"
          >
            {shows.map((show) => (
              <ContinueCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContinueCard({ show }) {
  const navigate = useNavigate();
  const playback = show.playback || {};
  const duration = Number(playback.duration || 0);
  const currentTime = Number(playback.currentTime || 0);
  const progress =
    duration > 0 ? clamp((currentTime / duration) * 100, 0, 100) : 0;
  const timeLeft =
    duration > currentTime ? formatTimeLeft(duration - currentTime) : "Resume";
  const seasonNumber = playback.seasonNumber ?? 1;
  const episodeNumber = playback.episodeNumber ?? 1;
  const episodeTitle = playback.episodeTitle || "Continue episode";

  const destination = buildWatchPath(show.id, playback.episodeId);

  return (
    <button
      type="button"
      onClick={() => navigate(destination)}
      className="rt-continue-rail-card group snap-start text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
      aria-label={`Resume ${show.title}, season ${seasonNumber}, episode ${episodeNumber}`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-[var(--rt-radius-card)] bg-[var(--rt-surface-soft)] ring-1 ring-white/[0.09] transition-[ring-color,box-shadow] duration-200 group-hover:ring-white/[0.18] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
        <MediaImage
          src={show.backdrop}
          alt=""
          decorative
          wrapperClassName="absolute inset-0"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.012]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/8 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-opacity duration-200 group-hover:opacity-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm">
            <HugeiconsIcon icon={PlayIcon} size={18} />
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
          <div
            className="h-full bg-[var(--rt-brand)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-2.5 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-white">{show.title}</h4>
            <p className="mt-0.5 truncate text-xs text-white/50">
              S{seasonNumber} E{episodeNumber} · {episodeTitle}
            </p>
          </div>
          <span className="shrink-0 text-[11px] text-white/45">{timeLeft}</span>
        </div>
      </div>
    </button>
  );
}

export default ContinueWatchingRow;
