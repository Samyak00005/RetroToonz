import { AllBookmarkIcon, Login01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    if (genre !== "All" && !genres.some((item) => item.label === genre)) setGenre("All");
  }, [genre, genres]);

  const currentUser = getCurrentUser();

  if (!currentUser) {
    return (
      <div className="rt-page flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="rt-standard-content py-10 sm:py-14 lg:py-16">
            <div className="mx-auto max-w-xl">
              <EmptyState
                icon={<HugeiconsIcon icon={Login01Icon} size={38} />}
                title="Sign in to see your watchlist"
                description="Your saved shows are connected to your RetroToonz account on this device. Sign in to view or manage them."
                action={(
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      className="rt-button rt-button-primary rounded-full px-5"
                      onClick={() => navigate("/login", { state: { from: "/watchlist" } })}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      className="rt-button rt-button-secondary rounded-full px-5"
                      onClick={() => navigate("/signup", { state: { from: "/watchlist" } })}
                    >
                      Create account
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="rt-page flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="rt-standard-content py-7 pb-16 sm:py-9 sm:pb-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">Watchlist</h1>
              <p className="mt-1.5 text-sm text-white/45">
                {savedShows.length
                  ? `${savedShows.length} saved show${savedShows.length === 1 ? "" : "s"}`
                  : "Shows you save will stay here for later."}
              </p>
            </div>

            {savedShows.length > 1 && (
              <label className="flex items-center gap-2 text-sm text-white/45">
                <span>Sort</span>
                <select className="rt-select min-h-11 w-auto py-2" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="title-asc">A → Z</option>
                  <option value="year-desc">Newest</option>
                  <option value="year-asc">Oldest</option>
                  <option value="rating-desc">Top rated</option>
                </select>
              </label>
            )}
          </div>

          {savedShows.length > 0 && genres.length > 1 && (
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Filter watchlist by category">
              <button type="button" className={`rt-chip ${genre === "All" ? "rt-chip-active" : ""}`} onClick={() => setGenre("All")}>All</button>
              {genres.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`rt-chip ${genre === item.label ? "rt-chip-active" : ""}`}
                  onClick={() => setGenre(item.label)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-7 sm:mt-8">
            {savedShows.length === 0 ? (
              <EmptyState
                icon={<HugeiconsIcon icon={AllBookmarkIcon} size={42} />}
                title="Nothing saved yet"
                description="Use the heart on any show to keep it in your watchlist."
                action={<button type="button" className="rt-button rt-button-primary" onClick={() => navigate("/all-shows")}>Browse shows</button>}
              />
            ) : shows.length === 0 ? (
              <EmptyState
                title="No saved shows in this category"
                description="Choose another category to see the rest of your watchlist."
                action={<button type="button" className="rt-button rt-button-secondary" onClick={() => setGenre("All")}>Show everything</button>}
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
