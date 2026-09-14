import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import SectionHeading from "../common/SectionHeading.jsx";
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

    const amount = Math.min(element.clientWidth * 0.88, 1100);
    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!shows.length) return null;

  const action = showMore && sectionKey ? (
    <Link
      to={showMoreTo || `/search?section=${sectionKey}`}
      className="rt-subtle-link inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
    >
      <span>Show more</span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
    </Link>
  ) : null;

  return (
    <section className="relative w-full py-5 sm:py-6 lg:py-7">
      <div className="rt-home-section-content">
        <SectionHeading title={sectionTitle} action={action} className="mb-3 sm:mb-4" />

        <div className="group/row relative overflow-visible">
          {scrollState.left && (
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label={`Scroll ${sectionTitle} left`}
              className="rt-rail-arrow absolute left-1 top-1/2 z-40 hidden -translate-y-1/2 sm:flex"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </button>
          )}

          {scrollState.right && (
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label={`Scroll ${sectionTitle} right`}
              className="rt-rail-arrow absolute right-1 top-1/2 z-40 hidden -translate-y-1/2 sm:flex"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-proximity gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth sm:gap-4"
          >
            {shows.map((show) => (
              <div
                key={show.id}
                className="rt-show-rail-card min-w-0 flex-shrink-0 snap-start"
              >
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
