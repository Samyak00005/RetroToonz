import { ArrowRight01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VideoPlayerShowInfo({ currentShow, currentEpisode }) {
  const navigate = useNavigate();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    setDescriptionExpanded(false);
  }, [currentShow?.id, currentEpisode?.episodeId]);

  if (!currentShow) return null;

  const seasonNumber = currentEpisode?.seasonNumber;
  const episodeNumber = currentEpisode?.episodeNumber;
  const episodeCode = [
    seasonNumber != null ? `S${String(seasonNumber).padStart(2, "0")}` : "",
    episodeNumber != null ? `E${String(episodeNumber).padStart(2, "0")}` : "",
  ]
    .filter(Boolean)
    .join("");

  const synopsis =
    currentEpisode?.synopsis ||
    currentEpisode?.description ||
    currentShow.description ||
    "";

  const tags = Array.isArray(currentShow.tags)
    ? currentShow.tags.filter(Boolean).slice(0, 5)
    : [];

  return (
    <section className="rt-watch-body-content py-5 sm:py-6 lg:py-7">
      <div className="border-b border-white/10 pb-6 sm:pb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/45 sm:text-sm">
              {currentShow.year && <span>{currentShow.year}</span>}
              {currentShow.language && <span>• {currentShow.language}</span>}
              {currentShow.rating && (
                <span className="inline-flex items-center gap-1 text-yellow-300">
                  <span>•</span>
                  <HugeiconsIcon icon={StarIcon} size={14} />
                  {currentShow.rating}
                </span>
              )}
              {currentShow.views && <span>• {currentShow.views} views</span>}
            </div>

            <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-white sm:text-2xl">
              {currentShow.title}
            </h1>

            {tags.length > 0 && (
              <div className="scrollbar-hide mt-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                {tags.map((tag) => (
                  <span key={tag} className="rt-chip shrink-0 border-white/10 bg-transparent text-white/55">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate(`/show/${currentShow.id}`)}
            className="rt-button rt-button-secondary shrink-0 rounded-full"
          >
            View show
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </button>
        </div>

        <div className="mt-5 pt-5 sm:mt-6 sm:pt-6 border-t border-white/8">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {episodeCode && (
              <span className="text-xs font-semibold tracking-[0.06em] text-cyan-300">
                {episodeCode}
              </span>
            )}
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {currentEpisode?.title || "Episode"}
            </h2>
          </div>

          {synopsis && (
            <div className="mt-2 max-w-4xl">
              <p
                className={`text-sm leading-6 text-white/55 sm:text-[0.95rem] ${
                  descriptionExpanded ? "" : "rt-mobile-description-clamp"
                }`}
              >
                {synopsis}
              </p>
              {synopsis.length > 105 && (
                <button
                  type="button"
                  onClick={() => setDescriptionExpanded((value) => !value)}
                  className="mt-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:text-cyan-200 sm:hidden"
                >
                  {descriptionExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
