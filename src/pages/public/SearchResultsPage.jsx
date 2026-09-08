import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmptyState from "../../components/common/EmptyState.jsx";
import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";
import ShowGrid from "../../components/show/ShowGrid.jsx";
import { getAllShows } from "../../services/contentService.js";
import { parseCompactNumber, searchShows, sortShows } from "../../utils/showDiscovery.js";

const allShows = getAllShows();
const getSectionShows = (section) => {
  switch (section) {
    case "trending": return sortShows(allShows, "views-desc");
    case "newly-added": return sortShows(allShows, "year-desc");
    case "retro-classics": return allShows.filter((show) => (Number(show.year) || 0) < 2000).sort((a, b) => parseCompactNumber(b.views) - parseCompactNumber(a.views));
    case "cartoon-comedy": return allShows.filter((show) => show.tags?.includes("Comedy")).sort((a, b) => parseCompactNumber(b.views) - parseCompactNumber(a.views));
    default: return [];
  }
};
const formatTitle = (value) => String(value || "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (character) => character.toUpperCase());

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q")?.trim() || "";
  const section = params.get("section")?.trim() || "";

  const searchResults = useMemo(() => {
    if (query) return searchShows(allShows, query);
    if (section) return getSectionShows(section);
    return [];
  }, [query, section]);

  const recommended = useMemo(() => {
    const excluded = new Set(searchResults.map((show) => show.id));
    return sortShows(allShows.filter((show) => !excluded.has(show.id)), "views-desc").slice(0, 8);
  }, [searchResults]);

  const title = query ? `Results for “${query}”` : section ? formatTitle(section) : "Search RetroToonz";

  return (
    <div className="rt-page flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="rt-standard-content py-7 sm:py-9">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl">{title}</h1>
            {(query || section) && <p className="mt-1.5 text-sm text-white/48">{searchResults.length} show{searchResults.length === 1 ? "" : "s"}</p>}
          </div>

          <section className="mt-7">
            {query || section ? (
              searchResults.length ? <ShowGrid shows={searchResults} /> : (
                <EmptyState title="No shows found" description="Try another title, category, language, year, or episode name." action={<div className="flex flex-wrap justify-center gap-3"><button type="button" className="rt-button rt-button-primary" onClick={() => navigate("/all-shows")}>Browse all shows</button><button type="button" className="rt-button rt-button-secondary" onClick={() => navigate("/")}>Go home</button></div>} />
              )
            ) : (
              <EmptyState title="Search everything RetroToonz" description="Use Search in the header to find a show, genre, language, year, or episode." action={<button type="button" className="rt-button rt-button-primary" onClick={() => navigate("/all-shows")}>Browse all shows</button>} />
            )}
          </section>

          {recommended.length > 0 && (
            <section className="mt-12 border-t border-white/8 pt-9 sm:mt-14 sm:pt-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <h2 className="rt-section-title">Popular on RetroToonz</h2>
                <button type="button" onClick={() => navigate("/all-shows")} className="text-sm font-semibold text-white/60 transition hover:text-cyan-100">All shows →</button>
              </div>
              <ShowGrid shows={recommended} />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
