import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FavouriteIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { getEpisodesForShow } from "../../services/contentService.js";
import {
  isInWatchlist,
  toggleWatchlist,
} from "../../services/libraryService.js";
import {
  getFallbackImageUrl,
  getMediaUrl,
} from "../../services/mediaService.js";
import { buildWatchPath } from "../../utils/watchRoutes.js";

function ShowCard({ id, title, year, poster, linkToWatch = false }) {
  const [isShortlisted, setIsShortlisted] = useState(() => isInWatchlist(id));
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setIsShortlisted(isInWatchlist(id));
    window.addEventListener("retrotoonz:watchlist-changed", sync);
    sync();
    return () =>
      window.removeEventListener("retrotoonz:watchlist-changed", sync);
  }, [id]);

  const firstEpisodeId = linkToWatch
    ? getEpisodesForShow(id)[0]?.episodeId
    : null;
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
        className="block w-full rounded-[var(--rt-radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rt-bg)]"
      >
        <div className="relative overflow-hidden rounded-[var(--rt-radius-card)] bg-[var(--rt-surface-soft)] ring-1 ring-white/[0.09] transition-[ring-color,box-shadow] duration-200 ease-out sm:group-hover:ring-white/[0.18] sm:group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
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
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out sm:group-hover:scale-[1.015]"
            />

            <span
              className={`rt-poster-loading pointer-events-none absolute inset-0 z-[1] transition-opacity duration-200 ${
                imageLoaded ? "opacity-0" : "opacity-100"
              }`}
              aria-hidden="true"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/12 to-transparent" />

            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 sm:flex sm:group-hover:opacity-100">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-sm transition-transform duration-200 sm:group-hover:scale-[1.03]">
                <HugeiconsIcon icon={PlayIcon} size={19} />
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/95 via-black/52 to-transparent px-3 pb-3 pt-12">
              <h3 className="line-clamp-2 text-xs font-semibold leading-[1.25] text-white sm:text-sm">
                {title}
              </h3>
              {year && (
                <p className="mt-0.5 text-[10px] text-white/58 sm:text-xs">{year}</p>
              )}
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
        className="absolute right-2 top-2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-[background-color,border-color,transform] duration-200 hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 sm:h-10 sm:w-10 sm:hover:scale-[1.04]"
      >
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={18}
          className={isShortlisted ? "text-red-400" : "text-white/82"}
        />
      </button>
    </article>
  );
}

export default ShowCard;
