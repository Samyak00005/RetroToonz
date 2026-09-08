// src/pages/HomePage.jsx

import { useEffect, useMemo, useState } from "react";

import ContinueWatchingRow from "../../components/home/ContinueWatchingRow.jsx";
import CategorySection from "../../components/home/CategorySection.jsx";
import HeroBanner from "../../components/home/HeroBanner.jsx";
import RandomPlayButton from "../../components/home/RandomPlayButton.jsx";
import ShowSection from "../../components/home/ShowSection.jsx";

import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";

import showsData from "../../services/contentService.js";
import { getContinueWatchingEntries } from "../../services/libraryService.js";

const getGenres = (shows) => {
  const count = {};

  shows.forEach((show) => {
    show.tags?.forEach((tag) => {
      count[tag] = (count[tag] || 0) + 1;
    });
  });

  return Object.entries(count)
    .filter(([, value]) => value >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
};

const normalizeShow = (show) => {
  const parseViews = (value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;

    if (typeof value === "string" && value.toLowerCase().includes("k")) {
      return parseFloat(value) * 1000;
    }

    return parseInt(value, 10) || 0;
  };

  return {
    ...show,

    // Normal portrait poster used by ShowCard
    poster: show.poster || "/media/defaults/image.jpg",

    // Wide image used by Hero and other large layouts
    heroPoster: show.backdrop || "/media/defaults/image.jpg",

    viewsNum: parseViews(show.views),
    ratingNum: Number(show.rating) || 0,
    yearNum: Number(show.year) || 0,

    addedAt: show.year
      ? new Date(`${show.year}-01-01`)
      : new Date(0),
  };
};

const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

const allShows = showsData.allShows.map(normalizeShow);


const featuredPool = allShows.filter((show) => show.featured);
const heroSource = featuredPool.length ? featuredPool : allShows;
const heroShows = shuffle(heroSource).slice(0, 5);



const allTrendingShows = [...allShows].sort((a, b) => b.viewsNum - a.viewsNum);

const allNewlyAdded = [...allShows].sort(
  (a, b) => new Date(b.addedAt) - new Date(a.addedAt),
);

const allRetroClassics = allShows
  .filter((show) => show.yearNum < 2000)
  .sort((a, b) => b.viewsNum - a.viewsNum);

const allCartoonComedy = allShows
  .filter((show) => show.tags?.includes("Comedy"))
  .sort((a, b) => b.viewsNum - a.viewsNum);

const trendingShows = allTrendingShows.slice(0, 8);
const newlyAdded = allNewlyAdded.slice(0, 8);
const retroClassics = allRetroClassics.slice(0, 8);
const cartoonComedy = allCartoonComedy.slice(0, 8);

function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [playbackRevision, setPlaybackRevision] = useState(0);

  useEffect(() => {
    const syncPlayback = () => setPlaybackRevision((value) => value + 1);
    window.addEventListener("retrotoonz:playback-changed", syncPlayback);
    window.addEventListener("storage", syncPlayback);
    return () => {
      window.removeEventListener("retrotoonz:playback-changed", syncPlayback);
      window.removeEventListener("storage", syncPlayback);
    };
  }, []);

  const continueWatching = useMemo(() => {
    const entries = getContinueWatchingEntries(8);
    return entries
      .map((entry) => {
        const show = allShows.find((candidate) => candidate.id === entry.showId);
        return show ? { ...show, playback: entry } : null;
      })
      .filter(Boolean);
  }, [playbackRevision]);

  const genres = getGenres(allShows);

  const filteredShows = selectedGenre
    ? allShows.filter((show) =>
        show.tags?.some(
          (tag) => tag.toLowerCase() === selectedGenre.toLowerCase(),
        ),
      )
    : null;

  return (
    <div className="rt-page flex flex-col">
      <Header />

      <main className="relative flex-grow">
        <HeroBanner shows={heroShows} />

        <div className="pb-6 pt-2 sm:pt-3">
          <ShowSection
            sectionTitle="Trending Now"
            sectionKey="trending"
            shows={trendingShows}
          />

          <ContinueWatchingRow shows={continueWatching} />

          <ShowSection
            sectionTitle="Newly Added"
            sectionKey="newly-added"
            shows={newlyAdded}
          />

          <CategorySection
            genres={genres}
            shows={allShows}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />

          {selectedGenre && (
            <ShowSection
              sectionTitle={`${selectedGenre} Picks`}
              shows={filteredShows}
              showMore={false}
            />
          )}

          <ShowSection
            sectionTitle="Retro Classics"
            sectionKey="retro-classics"
            shows={retroClassics}
          />

          <ShowSection
            sectionTitle="Cartoon Comedy"
            sectionKey="cartoon-comedy"
            shows={cartoonComedy}
          />
        </div>

        <RandomPlayButton />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
