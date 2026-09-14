import {
  ArrowLeft01Icon,
  CompassIcon,
  FlashIcon,
  LaughingIcon,
  PawPrintIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useRef } from "react";

import ShowCard from "../show/ShowCard.jsx";

const PRIMARY_GENRES = [
  "Animation",
  "Family",
  "Comedy",
  "Adventure",
  "Action",
  "Animal Adventure",
  "Anime",
  "Sci Fi",
  "Sitcom",
];

const genreIconMap = {
  animation: SparklesIcon,
  family: UserGroupIcon,
  comedy: LaughingIcon,
  adventure: CompassIcon,
  action: FlashIcon,
  "animal adventure": PawPrintIcon,
};

const genreAccentMap = {
  animation: {
    icon: "text-cyan-300/20",
    glow: "bg-cyan-300/[0.045]",
  },
  family: {
    icon: "text-violet-300/20",
    glow: "bg-violet-300/[0.045]",
  },
  comedy: {
    icon: "text-amber-300/20",
    glow: "bg-amber-300/[0.045]",
  },
  adventure: {
    icon: "text-emerald-300/20",
    glow: "bg-emerald-300/[0.045]",
  },
  action: {
    icon: "text-rose-300/20",
    glow: "bg-rose-300/[0.045]",
  },
  "animal adventure": {
    icon: "text-lime-300/20",
    glow: "bg-lime-300/[0.045]",
  },
  anime: {
    icon: "text-fuchsia-300/20",
    glow: "bg-fuchsia-300/[0.045]",
  },
  "sci fi": {
    icon: "text-sky-300/20",
    glow: "bg-sky-300/[0.045]",
  },
  sitcom: {
    icon: "text-orange-300/20",
    glow: "bg-orange-300/[0.045]",
  },
};

const formatGenre = (tag = "") => {
  return tag
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getGenreIcon = (genre) => {
  return genreIconMap[genre.toLowerCase()] || SparklesIcon;
};

const getGenreAccent = (genre) => {
  return (
    genreAccentMap[genre.toLowerCase()] || {
      icon: "text-cyan-300/20",
      glow: "bg-cyan-300/[0.045]",
    }
  );
};

function CategorySection({
  genres = [],
  shows = [],
  onSelectGenre,
  selectedGenre,
}) {
  const resultsScrollRef = useRef(null);

  const categories = useMemo(() => {
    return PRIMARY_GENRES.map((primaryGenre) => {
      const actualGenre = genres.find(
        (genre) => genre.toLowerCase() === primaryGenre.toLowerCase(),
      );

      if (!actualGenre) return null;

      const matchingShows = shows.filter((show) =>
        show.tags?.some(
          (tag) => tag.toLowerCase() === actualGenre.toLowerCase(),
        ),
      );

      return {
        genre: actualGenre,
        title: formatGenre(actualGenre),
        count: matchingShows.length,
      };
    }).filter(Boolean);
  }, [genres, shows]);

  const selectedShows = useMemo(() => {
    if (!selectedGenre) return [];

    return shows
      .filter((show) =>
        show.tags?.some(
          (tag) => tag.toLowerCase() === selectedGenre.toLowerCase(),
        ),
      )
      .sort((a, b) => {
        const featuredDifference =
          Number(Boolean(b.featured)) - Number(Boolean(a.featured));

        if (featuredDifference) return featuredDifference;

        return (b.viewsNum ?? 0) - (a.viewsNum ?? 0);
      });
  }, [selectedGenre, shows]);

  const scrollResults = (direction) => {
    const element = resultsScrollRef.current;

    if (!element) return;

    const amount = Math.min(element.clientWidth * 0.82, 1050);

    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!categories.length) return null;

  const activeCategory = categories.find(
    (category) => category.genre === selectedGenre,
  );

  return (
    <section
      id="genre-section"
      className="rt-home-section-content relative py-5 sm:py-6"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="rt-section-title">
            {activeCategory
              ? `${activeCategory.title} Collection`
              : "Browse by Category"}
          </h3>

          <p className="mt-1 text-xs text-white/40 sm:text-sm">
            {activeCategory
              ? `${selectedShows.length} ${
                  selectedShows.length === 1 ? "show" : "shows"
                } to explore.`
              : "Pick a mood and jump straight into a collection."}
          </p>
        </div>

        {selectedGenre && (
          <button
            type="button"
            onClick={() => onSelectGenre(null)}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-white/65 transition-all duration-200 hover:border-cyan-300/25 hover:bg-cyan-300/[0.06] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            <span>Back to categories</span>
          </button>
        )}
      </div>

      {/* =====================================================
          CATEGORY GRID
      ====================================================== */}

      {!selectedGenre && (
        <div
          className="
            grid
            grid-cols-2
            gap-2.5
            sm:grid-cols-3
            sm:gap-3
            lg:grid-cols-4
            lg:gap-3.5
            xl:grid-cols-5
            xl:gap-4
          "
        >
          {categories.map((category) => {
            const Icon = getGenreIcon(category.genre);
            const accent = getGenreAccent(category.genre);

            return (
              <button
                type="button"
                key={category.genre}
                onClick={() => onSelectGenre(category.genre)}
                aria-label={`Browse ${category.title}, ${category.count} shows`}
                className={`
                  group/category
                  relative
                  min-w-0
                  overflow-hidden
                  rounded-[var(--rt-radius-card)]
                  border
                  border-white/10
                  bg-white/[0.035]
                  px-3
                  py-3
                  text-left
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-white/20
                  hover:bg-white/[0.055]
                  hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-cyan-300/70
                  sm:px-3.5
                  sm:py-3.5
                  xl:px-4
                  ${accent.glow}
                `}
              >
                {/* ----- FUSED BACKGROUND ICON ----- */}

                <HugeiconsIcon
                  icon={Icon}
                  size={72}
                  strokeWidth={1.25}
                  className={`
                    pointer-events-none
                    absolute
                    -bottom-4
                    -right-3
                    transition-all
                    duration-300
                    group-hover/category:scale-105
                    group-hover/category:rotate-[-4deg]
                    sm:-bottom-5
                    sm:right-0
                    sm:size-[78px]
                    xl:size-[84px]
                    ${accent.icon}
                  `}
                  aria-hidden="true"
                />

                {/* ----- SUBTLE BACKGROUND ACCENT ----- */}

                <span
                  className={`
                    pointer-events-none
                    absolute
                    -right-8
                    -top-10
                    h-20
                    w-20
                    rounded-full
                    blur-3xl
                    opacity-70
                    transition-opacity
                    duration-300
                    group-hover/category:opacity-100
                    ${accent.glow}
                  `}
                  aria-hidden="true"
                />

                {/* ----- CONTENT ----- */}

                <div className="relative z-10 flex min-h-[72px] flex-col justify-between sm:min-h-[78px]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white sm:text-md">
                      {category.title}
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-white/40 sm:text-[12px]">
                      {category.count} {category.count === 1 ? "show" : "shows"}
                    </p>
                  </div>

                  <span
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-white/25
                      transition-colors
                      duration-200
                      group-hover/category:text-white/45
                      sm:text-[10px]
                    "
                  >
                    Explore
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ----- SELECTED CATEGORY RESULTS ----- */}

      {selectedGenre && (
        <div className="group/category-results relative">
          {/* LEFT ARROW */}

          <button
            type="button"
            onClick={() => scrollResults("left")}
            aria-label={`Scroll ${
              activeCategory?.title || "category"
            } shows left`}
            className="
              absolute
              left-0
              top-[42%]
              z-30
              hidden
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-black/55
              text-white/80
              opacity-0
              backdrop-blur-md
              transition-all
              duration-200
              group-hover/category-results:opacity-100
              hover:scale-105
              hover:bg-black/75
              hover:text-white
              focus-visible:opacity-100
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-300/70
              sm:flex
            "
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </button>

          {/* RIGHT ARROW */}

          <button
            type="button"
            onClick={() => scrollResults("right")}
            aria-label={`Scroll ${
              activeCategory?.title || "category"
            } shows right`}
            className="
              absolute
              right-0
              top-[42%]
              z-30
              hidden
              h-11
              w-11
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-black/55
              text-white/80
              opacity-0
              backdrop-blur-md
              transition-all
              duration-200
              group-hover/category-results:opacity-100
              hover:scale-105
              hover:bg-black/75
              hover:text-white
              focus-visible:opacity-100
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cyan-300/70
              sm:flex
            "
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
          </button>

          <div
            ref={resultsScrollRef}
            className="scrollbar-hide flex snap-x snap-proximity gap-3 overflow-x-auto pb-3 pt-1 pr-4 scroll-smooth sm:gap-4 sm:pr-6"
          >
            {selectedShows.map((show) => (
              <div
                key={show.id}
                className="
                  w-[38vw]
                  min-w-[38vw]
                  shrink-0
                  snap-start
                  sm:w-[180px]
                  sm:min-w-[180px]
                  md:w-[190px]
                  md:min-w-[190px]
                  lg:w-[200px]
                  lg:min-w-[200px]
                  xl:w-[210px]
                  xl:min-w-[210px]
                "
              >
                <ShowCard {...show} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default CategorySection;
