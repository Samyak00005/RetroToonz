import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useRef } from "react";

import MediaImage from "../common/MediaImage.jsx";

function formatGenre(tag = "") {
  return tag.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function CategorySection({ genres = [], shows = [], onSelectGenre, selectedGenre }) {
  const scrollRef = useRef(null);

  const categories = useMemo(() => {
    const usedShowIds = new Set();

    return genres.map((genre) => {
      const matchingShows = shows
        .filter((show) =>
          show.tags?.some((tag) => tag.toLowerCase() === genre.toLowerCase()),
        )
        .sort((a, b) => {
          const featuredDifference = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
          if (featuredDifference) return featuredDifference;
          return (b.viewsNum ?? 0) - (a.viewsNum ?? 0);
        });

      const representative =
        matchingShows.find((show) => !usedShowIds.has(show.id)) ?? matchingShows[0];

      if (representative) usedShowIds.add(representative.id);

      return {
        genre,
        title: formatGenre(genre),
        count: matchingShows.length,
        image:
          representative?.heroPoster ||
          representative?.backdrop ||
          representative?.poster ||
          "/media/defaults/image.jpg",
      };
    });
  }, [genres, shows]);

  const scroll = (direction) => {
    const element = scrollRef.current;
    if (!element) return;

    const amount = Math.min(element.clientWidth * 0.82, 1050);
    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!categories.length) return null;

  return (
    <section id="genre-section" className="rt-home-section-content relative py-5 sm:py-6">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h3 className="rt-section-title">Browse by Category</h3>
          <p className="mt-1 text-xs text-white/40 sm:text-sm">
            Pick a mood and jump straight into a collection.
          </p>
        </div>

        {selectedGenre && (
          <button
            type="button"
            onClick={() => onSelectGenre(null)}
            className="shrink-0 text-sm font-semibold text-cyan-200/80 transition hover:text-cyan-100"
          >
            Clear
          </button>
        )}
      </div>

      <div className="group/categories relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll categories left"
          className="absolute left-0 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 opacity-0 backdrop-blur-md transition-all duration-200 group-hover/categories:opacity-100 hover:scale-105 hover:bg-black/75 hover:text-white sm:flex"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll categories right"
          className="absolute right-0 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 opacity-0 backdrop-blur-md transition-all duration-200 group-hover/categories:opacity-100 hover:scale-105 hover:bg-black/75 hover:text-white sm:flex"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </button>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scroll-smooth sm:gap-4"
        >
          {categories.map((category) => {
            const isActive = selectedGenre === category.genre;

            return (
              <button
                type="button"
                key={category.genre}
                onClick={() => onSelectGenre(isActive ? null : category.genre)}
                aria-pressed={isActive}
                className={`group/category relative aspect-[16/9] w-[44vw] min-w-[160px] max-w-[220px] flex-none snap-start overflow-hidden rounded-[var(--rt-radius-card)] border text-left transition-all duration-300 sm:w-[210px] sm:min-w-[210px] md:w-[230px] md:min-w-[230px] lg:w-[250px] lg:min-w-[250px] ${
                  isActive
                    ? "border-cyan-300/70 shadow-[0_0_0_1px_rgba(103,232,249,0.22),0_14px_40px_rgba(8,145,178,0.18)]"
                    : "border-white/10 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_14px_34px_rgba(0,0,0,0.28)]"
                }`}
              >
                <MediaImage
                  src={category.image}
                  alt=""
                  decorative
                  wrapperClassName="absolute inset-0"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/category:scale-[1.045]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#050713] via-[#050713]/45 to-black/5" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/[0.05] to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white sm:text-[15px]">
                        {category.title}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-white/50 sm:text-xs">
                        {category.count} {category.count === 1 ? "show" : "shows"}
                      </p>
                    </div>

                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition ${
                        isActive
                          ? "border-cyan-200/50 bg-cyan-300/20 text-cyan-100"
                          : "border-white/15 bg-black/25 text-white/65 group-hover/category:bg-white/10 group-hover/category:text-white"
                      }`}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
