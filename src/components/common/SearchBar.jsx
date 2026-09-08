import {
  Cancel01Icon,
  Clock01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getAllShows } from "../../services/contentService.js";
import {
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearch,
} from "../../services/searchHistoryService.js";
import { searchShows } from "../../utils/showDiscovery.js";

const allShows = getAllShows();

export default function SearchBar({ compact = false, autoFocus = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState(() => getRecentSearches());
  const inputRef = useRef(null);

  useEffect(() => {
    if (location.pathname === "/search") {
      setQuery(new URLSearchParams(location.search).get("q") ?? "");
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!autoFocus) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [autoFocus]);

  const suggestions = useMemo(() => {
    const value = query.trim();
    if (!value) return [];
    return searchShows(allShows, value).slice(0, 5);
  }, [query]);

  const options = query.trim()
    ? suggestions.map((show) => ({ type: "show", value: show }))
    : recent.map((value) => ({ type: "recent", value }));

  const openPanel = focused && (options.length > 0 || Boolean(query.trim()));

  const goToResults = (value) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) return;
    setRecent(saveRecentSearch(normalized));
    setFocused(false);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(normalized)}`);
  };

  const goToShow = (show) => {
    setRecent(saveRecentSearch(show.title));
    setFocused(false);
    setActiveIndex(-1);
    navigate(`/show/${show.id}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    goToResults(query);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (!openPanel || !options.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? options.length - 1 : current - 1,
      );
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const selected = options[activeIndex];
      if (selected.type === "show") goToShow(selected.value);
      else goToResults(selected.value);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className="relative mx-auto w-full max-w-lg"
    >
      <div className="relative flex w-full items-center rounded-3xl border border-white/10 bg-black/10 p-1 backdrop-blur-xl backdrop-saturate-150 transition focus-within:border-cyan-300/35 focus-within:bg-black/20">
        <HugeiconsIcon
          icon={Search01Icon}
          size={17}
          className="pointer-events-none absolute left-4 text-cyan-100/80"
        />

        <input
          ref={inputRef}
          type="search"
          value={query}
          onFocus={() => {
            setFocused(true);
            setRecent(getRecentSearches());
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search cartoons, genres, episodes..."
          aria-label="Search cartoons"
          aria-autocomplete="list"
          aria-controls="retrotoonz-search-suggestions"
          aria-expanded={openPanel}
          autoComplete="off"
          className={`w-full rounded-3xl bg-transparent pl-11 text-sm text-white outline-none placeholder:text-white/50 ${
            compact ? "py-2 pr-20" : "py-2.5 pr-24"
          }`}
        />

        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:from-blue-600 hover:to-cyan-500"
        >
          Search
        </button>
      </div>

      {openPanel && (
        <div
          id="retrotoonz-search-suggestions"
          role="listbox"
          className="rt-surface-strong absolute left-0 right-0 top-[calc(100%+8px)] z-[120] max-h-[min(62vh,420px)] overflow-y-auto p-2"
        >
          {!query.trim() && recent.length > 0 && (
            <div className="flex items-center justify-between px-2 pb-2 pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Recent searches
              </span>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  clearRecentSearches();
                  setRecent([]);
                }}
                className="text-xs font-semibold text-cyan-200/70 hover:text-cyan-100"
              >
                Clear
              </button>
            </div>
          )}

          {options.map((option, index) => {
            const active = index === activeIndex;
            if (option.type === "recent") {
              return (
                <button
                  key={`recent-${option.value}`}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToResults(option.value)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    active ? "bg-white/10 text-white" : "text-white/72 hover:bg-white/7"
                  }`}
                >
                  <HugeiconsIcon icon={Clock01Icon} size={16} className="text-white/40" />
                  <span className="min-w-0 flex-1 truncate">{option.value}</span>
                </button>
              );
            }

            const show = option.value;
            return (
              <button
                key={show.id}
                type="button"
                role="option"
                aria-selected={active}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goToShow(show)}
                className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${
                  active ? "bg-white/10" : "hover:bg-white/7"
                }`}
              >
                <img
                  src={show.poster || "/media/defaults/image.jpg"}
                  alt=""
                  className="h-12 w-8 shrink-0 rounded-md object-cover ring-1 ring-white/10"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/media/defaults/image.jpg";
                  }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">
                    {show.title}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">
                    {[show.year, show.language, show.tags?.slice(0, 2).join(" • ")]
                      .filter(Boolean)
                      .join(" • ")}
                  </span>
                </span>
              </button>
            );
          })}

          {query.trim() && suggestions.length === 0 && (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => goToResults(query)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/65 hover:bg-white/7"
            >
              <HugeiconsIcon icon={Search01Icon} size={16} />
              Search for “{query.trim()}”
            </button>
          )}
        </div>
      )}
    </form>
  );
}
