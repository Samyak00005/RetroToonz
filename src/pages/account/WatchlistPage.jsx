import { AllBookmarkIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import EmptyState from "../../components/common/EmptyState.jsx";
import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";
import ShowGrid from "../../components/show/ShowGrid.jsx";
import { getCurrentUser } from "../../services/authService.js";
import { getAllShows } from "../../services/contentService.js";
import { getWatchlistIds } from "../../services/libraryService.js";
import { getGenres, sortShows } from "../../utils/showDiscovery.js";

const allShows = getAllShows();

export default function WatchlistPage() {
  const navigate = useNavigate();
  const [watchlistIds, setWatchlistIds] = useState(() => getWatchlistIds());
  const [genre, setGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title-asc");

  useEffect(() => {
    const sync = () => setWatchlistIds(getWatchlistIds());
    window.addEventListener("retrotoonz:watchlist-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("retrotoonz:watchlist-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const savedShows = useMemo(() => {
    const ids = new Set(watchlistIds.map(String));
    return allShows.filter((show) => ids.has(String(show.id)));
  }, [watchlistIds]);

  const genres = useMemo(() => getGenres(savedShows), [savedShows]);

  const shows = useMemo(() => {
    const filtered = genre === "All"
      ? savedShows
      : savedShows.filter((show) => show.tags?.includes(genre));
    return sortShows(filtered, sortBy);
  }, [savedShows, genre, sortBy]);

  useEffect(() => {
    if (genre !== "All" && !genres.some((item) => item.label === genre)) {
      setGenre("All");
    }
  }, [genre, genres]);

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return (
      <Navigate
        to="/login?reason=watchlist"
        replace
        state={{ from: "/watchlist" }}
      />
    );
  }

  return (
    <div className="rt-page flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="rt-standard-content py-6 sm:py-9">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl">Your Watchlist</h1>
            <p className="mt-1.5 text-sm text-white/48">
              {savedShows.length
                ? `${savedShows.length} saved show${savedShows.length === 1 ? "" : "s"}`
                : "Save shows with the heart button and they will appear here."}
            </p>
          </div>

          {savedShows.length > 0 && (
            <div className="mt-7 flex flex-col gap-3 rounded-[var(--rt-radius-card)] border border-white/8 bg-white/[0.025] p-3 sm:flex-row sm:items-end sm:justify-between sm:p-4">
              <label className="rt-field min-w-0 sm:w-52">
                <span className="rt-field-label">Category</span>
                <select className="rt-select" value={genre} onChange={(event) => setGenre(event.target.value)}>
                  <option value="All">All categories</option>
                  {genres.map((item) => (
                    <option key={item.label} value={item.label}>{item.label}</option>
                  ))}
                </select>
              </label>

              <label className="rt-field min-w-0 sm:w-52">
                <span className="rt-field-label">Sort by</span>
                <select className="rt-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="title-asc">Title A → Z</option>
                  <option value="year-desc">Newest first</option>
                  <option value="year-asc">Oldest first</option>
                  <option value="rating-desc">Highest rated</option>
                </select>
              </label>
            </div>
          )}

          <div className="mt-8">
            {savedShows.length === 0 ? (
              <EmptyState
                icon={<HugeiconsIcon icon={AllBookmarkIcon} size={58} />}
                title="Your watchlist is empty"
                description="Tap the heart on any show card or Show Details page to keep it here for later."
                action={
                  <button
                    type="button"
                    className="rt-button rt-button-primary"
                    onClick={() => navigate("/all-shows")}
                  >
                    Browse shows
                  </button>
                }
              />
            ) : shows.length === 0 ? (
              <EmptyState
                title="Nothing in this category"
                description="Choose another category to see the rest of your saved shows."
                action={
                  <button type="button" className="rt-button rt-button-secondary" onClick={() => setGenre("All")}>
                    Show all saved shows
                  </button>
                }
              />
            ) : (
              <ShowGrid shows={shows} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
