import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmptyState from "../../components/common/EmptyState.jsx";
import PageHeading from "../../components/common/PageHeading.jsx";
import SectionHeading from "../../components/common/SectionHeading.jsx";
import DiscoveryToolbar from "../../components/discovery/DiscoveryToolbar.jsx";
import useDiscoveryState from "../../components/discovery/useDiscoveryState.js";
import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";
import ShowGrid from "../../components/show/ShowGrid.jsx";
import { getAllShows } from "../../services/contentService.js";
import {
  filterShows,
  getDecades,
  getGenres,
  getLanguages,
  parseCompactNumber,
  searchShows,
  sortShows,
} from "../../utils/showDiscovery.js";

const allShows = getAllShows();

const searchSortOptions = [
  { value: "relevance", label: "Most relevant" },
  { value: "views-desc", label: "Most watched" },
  { value: "rating-desc", label: "Highest rated" },
  { value: "year-desc", label: "Newest first" },
  { value: "year-asc", label: "Oldest first" },
  { value: "title-asc", label: "Title A → Z" },
];

const sectionSortOptions = [
  { value: "views-desc", label: "Most watched" },
  { value: "rating-desc", label: "Highest rated" },
  { value: "year-desc", label: "Newest first" },
  { value: "year-asc", label: "Oldest first" },
  { value: "title-asc", label: "Title A → Z" },
];

const getSectionShows = (section) => {
  switch (section) {
    case "trending":
      return sortShows(allShows, "views-desc");
    case "newly-added":
      return sortShows(allShows, "year-desc");
    case "retro-classics":
      return allShows
        .filter((show) => (Number(show.year) || 0) < 2000)
        .sort((a, b) => parseCompactNumber(b.views) - parseCompactNumber(a.views));
    case "cartoon-comedy":
      return allShows
        .filter((show) => show.tags?.includes("Comedy"))
        .sort((a, b) => parseCompactNumber(b.views) - parseCompactNumber(a.views));
    default:
      return [];
  }
};

const formatTitle = (value) => String(value || "")
  .replace(/[-_]+/g, " ")
  .replace(/\s+/g, " ")
  .trim()
  .replace(/\b\w/g, (character) => character.toUpperCase());

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q")?.trim() || "";
  const section = params.get("section")?.trim() || "";
  const defaultSort = query ? "relevance" : "views-desc";

  const {
    genre,
    language,
    decade,
    sortBy,
    setGenre,
    setLanguage,
    setDecade,
    setSortBy,
    clearFilters,
  } = useDiscoveryState({ defaultSort });

  const baseResults = useMemo(() => {
    if (query) return searchShows(allShows, query);
    if (section) return getSectionShows(section);
    return [];
  }, [query, section]);

  const languages = useMemo(() => getLanguages(baseResults), [baseResults]);
  const genres = useMemo(() => {
    const languageSet = new Set(languages.map((item) => item.toLowerCase()));
    return getGenres(baseResults).filter(
      (item) => !languageSet.has(item.label.toLowerCase()),
    );
  }, [baseResults, languages]);
  const decades = useMemo(() => getDecades(baseResults), [baseResults]);

  const filteredResults = useMemo(() => {
    const filtered = filterShows(baseResults, { genre, language, decade });
    return sortBy === "relevance" ? filtered : sortShows(filtered, sortBy);
  }, [baseResults, genre, language, decade, sortBy]);

  const recommended = useMemo(() => {
    const excluded = new Set(baseResults.map((show) => show.id));
    return sortShows(
      allShows.filter((show) => !excluded.has(show.id)),
      "views-desc",
    ).slice(0, 8);
  }, [baseResults]);

  const title = query
    ? `Results for “${query}”`
    : section
      ? formatTitle(section)
      : "Search RetroToonz";

  const description = query
    ? "Matches can come from show titles, genres, languages, descriptions and episode information."
    : section
      ? "Explore this RetroToonz collection and refine it if you want something more specific."
      : "Search across shows, genres, languages and episode information.";

  const hasDiscoverySource = Boolean(query || section);
  const sortOptions = query ? searchSortOptions : sectionSortOptions;

  return (
    <div className="rt-page flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="rt-standard-content py-7 sm:py-9 lg:py-10">
          <PageHeading title={title} description={description} />

          {hasDiscoverySource && baseResults.length > 0 && (
            <DiscoveryToolbar
              genres={genres}
              genre={genre}
              onGenreChange={setGenre}
              languages={languages}
              language={language}
              onLanguageChange={setLanguage}
              decades={decades}
              decade={decade}
              onDecadeChange={setDecade}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOptions={sortOptions}
              onClear={clearFilters}
              resultCount={filteredResults.length}
              totalCount={baseResults.length}
            />
          )}

          <section className="mt-7 sm:mt-8">
            {hasDiscoverySource ? (
              baseResults.length ? (
                filteredResults.length ? (
                  <ShowGrid shows={filteredResults} />
                ) : (
                  <EmptyState
                    title="Nothing matches those filters"
                    description="The search has results, but none match the active genre or era filters."
                    action={(
                      <button type="button" className="rt-button rt-button-primary" onClick={clearFilters}>
                        Clear filters
                      </button>
                    )}
                  />
                )
              ) : (
                <EmptyState
                  title="No shows found"
                  description="Try another title, category, language, year, or episode name."
                  action={(
                    <div className="flex flex-wrap justify-center gap-3">
                      <button type="button" className="rt-button rt-button-primary" onClick={() => navigate("/all-shows")}>Browse all shows</button>
                      <button type="button" className="rt-button rt-button-secondary" onClick={() => navigate("/")}>Go home</button>
                    </div>
                  )}
                />
              )
            ) : (
              <EmptyState
                title="Search everything RetroToonz"
                description="Use Search in the header to find a show, genre, language, year, or episode."
                action={<button type="button" className="rt-button rt-button-primary" onClick={() => navigate("/all-shows")}>Browse all shows</button>}
              />
            )}
          </section>

          {recommended.length > 0 && (
            <section className="mt-12 border-t border-white/8 pt-9 sm:mt-14 sm:pt-10">
              <SectionHeading
                title="Popular on RetroToonz"
                action={(
                  <button
                    type="button"
                    onClick={() => navigate("/all-shows")}
                    className="text-sm font-semibold text-white/58 transition-colors hover:text-cyan-100"
                  >
                    All shows →
                  </button>
                )}
              />
              <ShowGrid shows={recommended} className="mt-5" />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
