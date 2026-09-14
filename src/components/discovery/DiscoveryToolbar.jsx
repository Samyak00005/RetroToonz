import { Cancel01Icon, FilterMailIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_SORT_OPTIONS = [
  { value: "title-asc", label: "Title A → Z" },
  { value: "title-desc", label: "Title Z → A" },
  { value: "year-desc", label: "Newest first" },
  { value: "year-asc", label: "Oldest first" },
  { value: "rating-desc", label: "Highest rated" },
  { value: "views-desc", label: "Most watched" },
];

export default function DiscoveryToolbar({
  genres = [],
  genre = "All",
  onGenreChange,
  languages = [],
  language = "All",
  onLanguageChange,
  decades = [],
  decade = "All",
  onDecadeChange,
  sortBy = "title-asc",
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  onClear,
  resultCount = 0,
  totalCount = 0,
  quickGenreLimit = 6,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const showLanguage = languages.length > 1;
  const activeFilterCount = [
    genre !== "All",
    showLanguage && language !== "All",
    decade !== "All",
  ].filter(Boolean).length;

  const quickGenres = useMemo(
    () => genres.slice(0, quickGenreLimit).map((item) => item.label ?? item),
    [genres, quickGenreLimit],
  );

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

  const clearAll = () => {
    onClear?.();
  };

  return (
    <div className="rt-discovery-toolbar">
      <div className="rt-discovery-primary-row">
        <div className="rt-discovery-genre-rail" aria-label="Filter by genre">
          <GenreChip label="All" active={genre === "All"} onClick={() => onGenreChange?.("All")} />
          {quickGenres.map((label) => (
            <GenreChip
              key={label}
              label={label}
              active={genre === label}
              onClick={() => onGenreChange?.(label)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="rt-discovery-filter-button rt-button rt-button-secondary"
          aria-label="Open discovery filters"
        >
          <HugeiconsIcon icon={FilterMailIcon} size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="rt-discovery-filter-count">{activeFilterCount}</span>
          )}
        </button>
      </div>

      <div className="rt-discovery-secondary-row">
        <p className="rt-discovery-result-count" aria-live="polite">
          {resultCount === totalCount
            ? `${resultCount} ${resultCount === 1 ? "show" : "shows"}`
            : `${resultCount} of ${totalCount} shows`}
        </p>

        <div className="rt-discovery-desktop-controls">
          {showLanguage && (
            <CompactSelect
              label="Language"
              value={language}
              onChange={onLanguageChange}
              options={["All", ...languages]}
              formatOption={(value) => (value === "All" ? "All languages" : value)}
            />
          )}
          <CompactSelect
            label="Era"
            value={decade}
            onChange={onDecadeChange}
            options={["All", ...decades.map(String)]}
            formatOption={(value) => (value === "All" ? "All years" : `${value}s`)}
          />
          <CompactSelect
            label="Sort"
            value={sortBy}
            onChange={onSortChange}
            options={sortOptions.map((option) => option.value)}
            formatOption={(value) => sortOptions.find((option) => option.value === value)?.label || value}
          />
          {activeFilterCount > 0 && (
            <button type="button" onClick={clearAll} className="rt-discovery-clear-button">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="rt-discovery-active-filters" aria-label="Active filters">
          {genre !== "All" && <ActiveFilter label={genre} onClear={() => onGenreChange?.("All")} />}
          {showLanguage && language !== "All" && <ActiveFilter label={language} onClear={() => onLanguageChange?.("All")} />}
          {decade !== "All" && <ActiveFilter label={`${decade}s`} onClear={() => onDecadeChange?.("All")} />}
        </div>
      )}

      {filtersOpen && (
        <div
          className="rt-discovery-sheet-backdrop"
          role="presentation"
          onMouseDown={() => setFiltersOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="discovery-filter-title"
            className="rt-discovery-sheet"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="rt-discovery-sheet-header">
              <div>
                <h2 id="discovery-filter-title" className="text-lg font-semibold text-white">Filters</h2>
                <p className="mt-1 text-sm text-white/50">Refine what you want to browse.</p>
              </div>
              <button type="button" className="rt-icon-button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <div className="grid gap-4">
              <FilterSelect
                label="Genre"
                value={genre}
                onChange={onGenreChange}
                options={["All", ...genres.map((item) => item.label ?? item)]}
                formatOption={(value) => (value === "All" ? "All genres" : value)}
              />
              {showLanguage && (
                <FilterSelect
                  label="Language"
                  value={language}
                  onChange={onLanguageChange}
                  options={["All", ...languages]}
                  formatOption={(value) => (value === "All" ? "All languages" : value)}
                />
              )}
              <FilterSelect
                label="Era"
                value={decade}
                onChange={onDecadeChange}
                options={["All", ...decades.map(String)]}
                formatOption={(value) => (value === "All" ? "All years" : `${value}s`)}
              />
              <FilterSelect
                label="Sort by"
                value={sortBy}
                onChange={onSortChange}
                options={sortOptions.map((option) => option.value)}
                formatOption={(value) => sortOptions.find((option) => option.value === value)?.label || value}
              />
            </div>

            <div className="rt-discovery-sheet-actions">
              <button type="button" className="rt-button rt-button-secondary" onClick={clearAll} disabled={activeFilterCount === 0}>
                Clear
              </button>
              <button type="button" className="rt-button rt-button-primary" onClick={() => setFiltersOpen(false)}>
                Show {resultCount}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function GenreChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rt-discovery-genre-chip${active ? " is-active" : ""}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function CompactSelect({ label, value, onChange, options, formatOption = (item) => item }) {
  return (
    <label className="rt-discovery-compact-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange?.(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{formatOption(option)}</option>
        ))}
      </select>
    </label>
  );
}

function FilterSelect({ label, value, onChange, options, formatOption = (item) => item }) {
  return (
    <label className="rt-field">
      <span className="rt-field-label">{label}</span>
      <select className="rt-select" value={value} onChange={(event) => onChange?.(event.target.value)}>
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
