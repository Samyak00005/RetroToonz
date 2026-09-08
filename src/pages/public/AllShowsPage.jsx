import { Cancel01Icon, FilterMailIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";

import EmptyState from "../../components/common/EmptyState.jsx";
import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";
import ShowGrid from "../../components/show/ShowGrid.jsx";
import { getAllShows } from "../../services/contentService.js";
import {
  filterShows,
  getDecades,
  getGenres,
  getLanguages,
  sortShows,
} from "../../utils/showDiscovery.js";

const allShows = getAllShows();
const sortOptions = [
  { value: "title-asc", label: "Title A → Z" },
  { value: "title-desc", label: "Title Z → A" },
  { value: "year-desc", label: "Newest first" },
  { value: "year-asc", label: "Oldest first" },
  { value: "rating-desc", label: "Highest rated" },
  { value: "views-desc", label: "Most watched" },
];

export default function AllShowsPage() {
  const [genre, setGenre] = useState("All");
  const [language, setLanguage] = useState("All");
  const [decade, setDecade] = useState("All");
  const [sortBy, setSortBy] = useState("title-asc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const languages = useMemo(() => getLanguages(allShows), []);
  const genres = useMemo(() => {
    const languageSet = new Set(languages.map((item) => item.toLowerCase()));
    return getGenres(allShows).filter(
      (item) => !languageSet.has(item.label.toLowerCase()),
    );
  }, [languages]);
  const decades = useMemo(() => getDecades(allShows), []);

  const filteredShows = useMemo(
    () => sortShows(filterShows(allShows, { genre, language, decade }), sortBy),
    [genre, language, decade, sortBy],
  );

  const activeFilterCount = [
    genre !== "All",
    language !== "All",
    decade !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setGenre("All");
    setLanguage("All");
    setDecade("All");
  };

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  return (
    <div className="rt-page flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="rt-standard-content py-7 sm:py-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl">
                All Shows
              </h1>
              <p className="mt-1.5 text-sm text-white/48">
                {filteredShows.length === allShows.length
                  ? `${allShows.length} shows`
                  : `${filteredShows.length} of ${allShows.length} shows`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="rt-mobile-filter-button rt-button rt-button-secondary"
              aria-label="Open filters"
            >
              <HugeiconsIcon icon={FilterMailIcon} size={18} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-300/20 px-1 text-[10px] text-cyan-100">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <section className="rt-desktop-filters mt-6 rounded-[var(--rt-radius-card)] border border-white/8 bg-white/[0.025] p-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-[1.35fr_1fr_1fr_1fr_auto]">
              <FilterSelect label="Genre" value={genre} onChange={setGenre} options={["All", ...genres.map((item) => item.label)]} />
              <FilterSelect label="Language" value={language} onChange={setLanguage} options={["All", ...languages]} />
              <FilterSelect label="Decade" value={decade} onChange={setDecade} options={["All", ...decades.map(String)]} formatOption={(value) => (value === "All" ? "All years" : `${value}s`)} />
              <FilterSelect label="Sort by" value={sortBy} onChange={setSortBy} options={sortOptions.map((option) => option.value)} formatOption={(value) => sortOptions.find((option) => option.value === value)?.label || value} />
              <div className="flex items-end">
                <button type="button" onClick={clearFilters} disabled={activeFilterCount === 0} className="rt-button rt-button-ghost w-full xl:w-auto">
                  Clear
                </button>
              </div>
            </div>
          </section>

          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2" aria-live="polite">
              {genre !== "All" && <ActiveFilter label={genre} onClear={() => setGenre("All")} />}
              {language !== "All" && <ActiveFilter label={language} onClear={() => setLanguage("All")} />}
              {decade !== "All" && <ActiveFilter label={`${decade}s`} onClear={() => setDecade("All")} />}
            </div>
          )}

          <section className="mt-7 pb-20">
            {filteredShows.length ? (
              <ShowGrid shows={filteredShows} />
            ) : (
              <EmptyState
                title="No shows match these filters"
                description="Clear one or more filters and try again."
                action={<button type="button" className="rt-button rt-button-primary" onClick={clearFilters}>Clear filters</button>}
              />
            )}
          </section>
        </div>
      </main>

      <Footer />

      {filtersOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end bg-black/65 backdrop-blur-sm" role="presentation" onMouseDown={() => setFiltersOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-shows-filter-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-h-[86vh] overflow-y-auto rounded-t-[24px] border border-white/10 bg-[#0d1020] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="all-shows-filter-title" className="text-xl font-semibold">Filters</h2>
              <button type="button" className="rt-icon-button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <div className="grid gap-4">
              <FilterSelect label="Genre" value={genre} onChange={setGenre} options={["All", ...genres.map((item) => item.label)]} />
              <FilterSelect label="Language" value={language} onChange={setLanguage} options={["All", ...languages]} />
              <FilterSelect label="Decade" value={decade} onChange={setDecade} options={["All", ...decades.map(String)]} formatOption={(value) => (value === "All" ? "All years" : `${value}s`)} />
              <FilterSelect label="Sort by" value={sortBy} onChange={setSortBy} options={sortOptions.map((option) => option.value)} formatOption={(value) => sortOptions.find((option) => option.value === value)?.label || value} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="rt-button rt-button-secondary" onClick={clearFilters} disabled={activeFilterCount === 0}>Clear</button>
              <button type="button" className="rt-button rt-button-primary" onClick={() => setFiltersOpen(false)}>Show {filteredShows.length}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, formatOption = (item) => item }) {
  return (
    <label className="rt-field">
      <span className="rt-field-label">{label}</span>
      <select className="rt-select" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{formatOption(option)}</option>
        ))}
      </select>
    </label>
  );
}

function ActiveFilter({ label, onClear }) {
  return (
    <button type="button" onClick={onClear} className="rt-chip rt-chip-active gap-1.5" aria-label={`Clear ${label} filter`}>
      {label}
      <HugeiconsIcon icon={Cancel01Icon} size={13} />
    </button>
  );
}
