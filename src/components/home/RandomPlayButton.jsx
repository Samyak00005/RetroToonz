import { ShuffleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import showsData from "../../services/contentService.js";
import { buildWatchPath } from "../../utils/watchRoutes.js";

function RandomPlayButton() {
  const navigate = useNavigate();
  const btnRef = useRef();

  function pickRandomEpisode(allShows) {
    const pool = [];

    allShows.forEach((show) => {
      (show.seasons || []).forEach((season) => {
        (season.episodes || []).forEach((ep) => {
          if (ep.isPlayable !== false) {
            pool.push({
              ...ep,
              showId: show.id,
              showTitle: show.title,
              seasonNumber: season.seasonNumber,
            });
          }
        });
      });
    });

    if (pool.length === 0) return null;

    return pool[Math.floor(Math.random() * pool.length)];
  }

  const handlePlay = () => {
    const allShows = showsData.allShows || showsData;
    const episode = pickRandomEpisode(allShows);

    if (!episode) {
      alert("No playable episode found.");
      return;
    }

    navigate(buildWatchPath(episode.showId, episode.episodeId));
  };

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      const btn = btnRef.current;

      if (!footer || !btn) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (footerRect.top < windowHeight) {
        const overlap = windowHeight - footerRect.top;
        btn.style.bottom = `${20 + overlap}px`;
      } else {
        btn.style.bottom = "20px";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handlePlay}
      className="
        group fixed right-4 sm:right-6 z-50
        inline-flex min-h-11 items-center justify-center
        gap-2
        rounded-full
        border border-cyan-300/25
        bg-gradient-to-r from-cyan-500 to-blue-600
        px-4 py-2.5 sm:px-5 sm:py-3
        text-white
        shadow-[0_12px_32px_rgba(37,99,235,0.28)]
        backdrop-blur-sm
        transition-all duration-200 ease-out
        hover:-translate-y-0.5
        hover:from-blue-600 hover:to-cyan-500
        hover:shadow-[0_16px_38px_rgba(37,99,235,0.38)]
        active:translate-y-0
        active:scale-[0.98]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-200/80
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#070812]
      "
      style={{ bottom: "20px" }}
      title="Play a random cartoon"
      aria-label="Surprise me with a random cartoon"
    >
      <HugeiconsIcon
        icon={ShuffleIcon}
        size={19}
        className="
          transition-transform duration-200 ease-out
          group-hover:rotate-12
        "
      />

      <span className="text-sm font-semibold tracking-[-0.01em]">
        Surprise Me!
      </span>
    </button>
  );
}

export default RandomPlayButton;
