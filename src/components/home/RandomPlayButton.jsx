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

  // 🔥 MAGIC PART
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      const btn = btnRef.current;

      if (!footer || !btn) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (footerRect.top < windowHeight) {
        // Push button up when footer enters view
        const overlap = windowHeight - footerRect.top;
        btn.style.bottom = `${20 + overlap}px`;
      } else {
        btn.style.bottom = "20px";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={handlePlay}
      className="fixed right-10 sm:right-15 z-50 group
        bg-gradient-to-r from-cyan-500 to-blue-600
        hover:from-blue-600 hover:to-cyan-500
        text-white shadow-xl
        px-6 py-4 rounded-full flex items-center gap-2
        animate-bounce hover:animate-none transition-all duration-300"
      style={{ bottom: "20px" }}
      title="Play a random cartoon"
    >
      <span className="absolute inline-flex h-14 w-14 rounded-full bg-cyan-400 opacity-30 group-hover:animate-ping -z-10" />
      <HugeiconsIcon icon={ShuffleIcon} className="text-xl animate-spin-slow" />
      <span className="font-semibold hidden sm:block">Surprise Me!</span>
    </button>
  );
}

export default RandomPlayButton;
