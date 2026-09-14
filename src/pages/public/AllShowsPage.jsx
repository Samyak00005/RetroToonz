import { useEffect, useMemo, useState } from "react";

import PageHeading from "../../components/common/PageHeading.jsx";
import { AllShowsContentSkeleton } from "../../components/common/PageContentSkeletons.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
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
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setContentReady(true), 180);
    return () => window.clearTimeout(timeout);
  }, []);
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
  } = useDiscoveryState({ defaultSort: "title-asc" });

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

  if (!contentReady) {
    return (
      <div className="rt-page flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">
          <AllShowsContentSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="rt-page flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="rt-standard-content py-7 sm:py-9 lg:py-10">
          <PageHeading
            title="All Shows"
            description="Browse the complete RetroToonz library and narrow it down by genre or era."
          />

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
            resultCount={filteredShows.length}
            totalCount={allShows.length}
          />

          <section className="mt-7 pb-20 sm:mt-8">
            {filteredShows.length ? (
              <ShowGrid shows={filteredShows} />
            ) : (
              <EmptyState
                title="No shows match those filters"
                description="Try a different genre or era, or clear the active filters."
                action={(
                  <button type="button" className="rt-button rt-button-primary" onClick={clearFilters}>
                    Clear filters
                  </button>
                )}
              />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
