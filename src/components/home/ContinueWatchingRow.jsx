import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { buildWatchPath } from "../../utils/watchRoutes.js";
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

    const distance = Math.min(row.clientWidth * 0.82, 820);
    row.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  if (!shows.length) return null;

  return (
    <section className="relative w-full py-5 sm:py-6">
      <div className="rt-home-section-content">
        <h3 className="rt-section-title">Continue Watching</h3>
        <p className="mb-3 mt-1 text-xs text-white/55 sm:mb-4 sm:text-sm">
          Resume from your saved playback position.
        </p>
      </div>

      <div className="rt-home-section-content">
        <div className="group/row relative">
        {scrollState.left && (
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll Continue Watching left"
            className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#10213b]/85 text-white/80 opacity-0 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-[#173054] hover:text-white group-hover/row:opacity-100 md:flex lg:left-4"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </button>
        )}

        {scrollState.right && (
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll Continue Watching right"
            className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#10213b]/85 text-white/80 opacity-0 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-[#173054] hover:text-white group-hover/row:opacity-100 md:flex lg:right-4"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-proximity gap-3 overflow-x-auto pb-2 scroll-smooth sm:gap-4"
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
  const progress = duration > 0 ? clamp((currentTime / duration) * 100, 0, 100) : 0;
  const timeLeft = duration > currentTime ? formatTimeLeft(duration - currentTime) : "Resume";
  const seasonNumber = playback.seasonNumber ?? 1;
  const episodeNumber = playback.episodeNumber ?? 1;

  const destination = buildWatchPath(show.id, playback.episodeId);

  return (
    <button
      type="button"
      onClick={() => navigate(destination)}
      className={`group relative my-1 min-w-[230px] snap-start overflow-hidden rounded-[var(--rt-radius-card)] border border-white/12 bg-white/[0.06] p-2.5 text-left shadow-[0_12px_34px_rgba(2,8,23,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/[0.085] sm:min-w-[300px] `}
      aria-label={`Resume ${show.title}, season ${seasonNumber}, episode ${episodeNumber}`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-[var(--rt-radius-control)]">
        <MediaImage
          src={show.backdrop}
          alt=""
          decorative
          wrapperClassName="absolute inset-0"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/90 via-black/15 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <span className="rounded-full border border-white/20 bg-[#0d1c33]/75 p-3 text-white backdrop-blur-lg transition group-hover:scale-105">
            <HugeiconsIcon icon={PlayIcon} size={17} />
          </span>
        </div>

        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-3">
          <h4 className="min-w-0 truncate text-sm font-semibold text-white">{show.title}</h4>
          <span className="shrink-0 text-[10px] text-white/70">S{seasonNumber} • E{episodeNumber}</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/12" aria-label={`${Math.round(progress)} percent watched`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-[10px] text-white/55">{timeLeft}</span>
      </div>
    </button>
  );
}

export default ContinueWatchingRow;
