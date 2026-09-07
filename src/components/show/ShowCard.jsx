import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FavouriteIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { getEpisodesForShow } from "../../services/contentService.js";
import { isInWatchlist, toggleWatchlist } from "../../services/libraryService.js";
import { getFallbackImageUrl, getMediaUrl } from "../../services/mediaService.js";
import { buildWatchPath } from "../../utils/watchRoutes.js";

function ShowCard({ id, title, year, poster, linkToWatch = false }) {
  const [isShortlisted, setIsShortlisted] = useState(() => isInWatchlist(id));
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setIsShortlisted(isInWatchlist(id));
    window.addEventListener("retrotoonz:watchlist-changed", sync);
    sync();
    return () => window.removeEventListener("retrotoonz:watchlist-changed", sync);
  }, [id]);

  const firstEpisodeId = linkToWatch ? getEpisodesForShow(id)[0]?.episodeId : null;
  const destination = linkToWatch
    ? buildWatchPath(id, firstEpisodeId)
    : `/show/${id}`;

  const posterSrc = getMediaUrl(poster) || getFallbackImageUrl();

  useEffect(() => {
    setImageLoaded(false);
  }, [posterSrc]);

  return (
    <article className="group relative w-full">
      <Link
        to={destination}
        aria-label={`${linkToWatch ? "Watch" : "Open"} ${title}`}
        className="block w-full rounded-[var(--rt-radius-control)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070812]"
      >
        <div className="relative overflow-hidden rounded-[var(--rt-radius-control)] bg-[#0d1020] ring-1 ring-white/10 transition-[box-shadow,ring-color] duration-200 ease-out sm:group-hover:ring-cyan-300/45 sm:group-hover:shadow-[0_16px_45px_rgba(0,0,0,0.42)]">
          <div
            className="relative aspect-[2/3] w-full overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url("${posterSrc}")` }}
          >
            <img
              src={posterSrc}
              alt={`${title} poster`}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={(event) => {
                const fallback = getFallbackImageUrl();
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallback;
                setImageLoaded(true);
              }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 sm:group-hover:scale-[1.025]"
            />

            <span
              className={`rt-poster-loading pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 ${
                imageLoaded ? "opacity-0" : "opacity-100"
              }`}
              aria-hidden="true"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 sm:flex sm:group-hover:opacity-100">
              <span className="rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-lg">
                <HugeiconsIcon icon={PlayIcon} size={20} />
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-3 pb-2.5 pt-10">
              <h3 className="truncate text-xs font-semibold text-white sm:text-sm">{title}</h3>
              {year && <p className="text-[10px] text-gray-300 sm:text-xs">{year}</p>}
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setIsShortlisted(toggleWatchlist(id))}
        aria-label={
          isShortlisted
            ? `Remove ${title} from watchlist`
            : `Add ${title} to watchlist`
        }
        aria-pressed={isShortlisted}
        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-cyan-300/80"
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={17}
          className={isShortlisted ? "text-red-400" : "text-white/80"}
        />
      </button>
    </article>
  );
}

export default ShowCard;
