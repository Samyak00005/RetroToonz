import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import ShowCard from "../show/ShowCard.jsx";

function ShowSection({
  sectionTitle,
  sectionKey,
  shows = [],
  linkToWatch = false,
  showMore = true,
  showMoreTo = "",
}) {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({ left: false, right: false });

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const max = Math.max(0, element.scrollWidth - element.clientWidth);
    setScrollState({
      left: element.scrollLeft > 4,
      right: element.scrollLeft < max - 4,
    });
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    const frame = window.requestAnimationFrame(updateScrollState);

    return () => {
      window.cancelAnimationFrame(frame);
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [shows.length, updateScrollState]);

  const scroll = (direction) => {
    const element = scrollRef.current;
    if (!element) return;

    const amount = Math.min(element.clientWidth * 0.86, 1100);
    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!shows.length) return null;

  return (
    <section className="relative w-full overflow-visible py-5 sm:py-6">
      <div className="rt-home-section-content">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="rt-section-title">{sectionTitle}</h3>

          {showMore && sectionKey && (
            <Link
              to={showMoreTo || `/search?section=${sectionKey}`}
              className="group flex items-center gap-1.5 text-sm font-medium text-white/55 transition-all hover:text-cyan-200 sm:text-base"
            >
              <span className="underline-offset-4 group-hover:underline">Show more</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>

        <div className="group/row relative overflow-visible">
          {scrollState.left && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label={`Scroll ${sectionTitle} left`}
              className="absolute left-0 top-1/2 z-50 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 opacity-0 backdrop-blur-md transition-all duration-200 group-hover/row:opacity-100 hover:scale-105 hover:bg-black/75 hover:text-white sm:flex"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>
          )}

          {scrollState.right && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label={`Scroll ${sectionTitle} right`}
              className="absolute right-0 top-1/2 z-50 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/80 opacity-0 backdrop-blur-md transition-all duration-200 group-hover/row:opacity-100 hover:scale-105 hover:bg-black/75 hover:text-white sm:flex"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-proximity gap-3 overflow-x-auto pb-3 pt-2 scroll-smooth sm:gap-4"
          >
            {shows.map((show) => (
              <div key={show.id} className="rt-show-rail-card min-w-0 flex-shrink-0 snap-start">
                <ShowCard {...show} linkToWatch={linkToWatch} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowSection;
