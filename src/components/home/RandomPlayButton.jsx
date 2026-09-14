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
    <div
      ref={btnRef}
      className="fixed right-4 z-50 sm:right-6"
      style={{ bottom: "20px" }}
    >
      <button
        type="button"
        onClick={handlePlay}
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
        title="Play a random cartoon"
        aria-label="Surprise me with a random cartoon"
      >
        <span className="absolute -z-10 inline-flex h-9 w-9 rounded-full bg-cyan-400 opacity-20 group-hover:animate-ping" />
        <HugeiconsIcon icon={ShuffleIcon} size={20} />
        <span>Surprise Me!</span>
      </button>
    </div>
  );
}

export default RandomPlayButton;
