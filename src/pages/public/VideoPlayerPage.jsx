import { AnimatePresence, motion } from "framer-motion";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import ShowSection from "../../components/home/ShowSection.jsx";
import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";
import VideoPlayer from "../../components/video/VideoPlayer.jsx";
import Episodes from "../../components/video/VideoPlayerEpisodes.jsx";
import ShowInfo from "../../components/video/VideoPlayerShowInfo.jsx";
import {
  getAllShows,
  getEpisodesForShow,
  getShowById,
} from "../../services/contentService.js";
import { buildWatchPath } from "../../utils/watchRoutes.js";

function VideoPlayerPage() {
  const { id, episodeId: routeEpisodeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const allShows = getAllShows();
  const currentShow = getShowById(id);

  if (!currentShow) {
    return (
      <div className="rt-page flex min-h-screen flex-col">
        <Header />
        <main className="rt-content rt-page-pad flex flex-1 items-center justify-center">
          <div className="rt-surface max-w-lg p-8 text-center">
            <h1 className="rt-page-title">Video not found</h1>
            <p className="mt-3 text-white/60">
              This show is missing or the video link is no longer valid.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" className="rt-button rt-button-primary" onClick={() => navigate("/all-shows")}>
                Browse all shows
              </button>
              <button type="button" className="rt-button rt-button-secondary" onClick={() => navigate("/")}>
                Go home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const allEpisodes = getEpisodesForShow(currentShow.id);
  const legacyEpisodeId = new URLSearchParams(location.search).get("ep");
  const stateEpisodeId = location.state?.startEpisode?.episodeId ?? null;
  const requestedEpisodeId =
    routeEpisodeId || legacyEpisodeId || stateEpisodeId || allEpisodes[0]?.episodeId;

  let currentEpisodeIndex = allEpisodes.findIndex(
    (episode) => String(episode.episodeId) === String(requestedEpisodeId),
  );

  if (currentEpisodeIndex < 0 && allEpisodes.length) currentEpisodeIndex = 0;

  const currentEpisode =
    currentEpisodeIndex >= 0 ? allEpisodes[currentEpisodeIndex] : null;

  const canonicalPath = currentEpisode
    ? buildWatchPath(currentShow.id, currentEpisode.episodeId)
    : buildWatchPath(currentShow.id);

  // Old /watch/:show and ?ep= links remain compatible, but immediately
  // normalize to one canonical episode URL.
  if (
    currentEpisode &&
    (location.pathname !== canonicalPath || location.search)
  ) {
    return <Navigate to={canonicalPath} replace />;
  }

  const canGoPrevious = currentEpisodeIndex > 0;
  const canGoNext =
    currentEpisodeIndex >= 0 && currentEpisodeIndex < allEpisodes.length - 1;

  const selectEpisode = (nextEpisodeId, { replace = false } = {}) => {
    if (!nextEpisodeId) return;
    navigate(buildWatchPath(currentShow.id, nextEpisodeId), { replace });
  };

  const goToNextEpisode = () => {
    if (!canGoNext) return false;
    selectEpisode(allEpisodes[currentEpisodeIndex + 1].episodeId);
    return true;
  };

  const goToPreviousEpisode = () => {
    if (!canGoPrevious) return false;
    selectEpisode(allEpisodes[currentEpisodeIndex - 1].episodeId);
    return true;
  };

  const currentShowIndex = allShows.findIndex((show) => show.id === id);
  const upcomingShows = [];

  if (allShows.length > 1 && currentShowIndex >= 0) {
    for (let i = 1; i <= Math.min(8, allShows.length - 1); i += 1) {
      upcomingShows.push(allShows[(currentShowIndex + i) % allShows.length]);
    }
  }

  return (
    <div className="rt-page flex min-h-screen flex-col text-white">
      <Header />

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(67,181,255,0.16),transparent_62%)]" />
        <div className="pointer-events-none absolute -left-36 top-52 h-80 w-80 rounded-full bg-cyan-400/7 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 top-72 h-96 w-96 rounded-full bg-blue-500/8 blur-3xl" />

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEpisode?.episodeId ?? `${currentShow.id}-no-episode`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="rt-watch-player-content">
                <VideoPlayer
                  currentShow={currentShow}
                  startEpisode={currentEpisode}
                  goToNextEpisode={goToNextEpisode}
                  goToPreviousEpisode={goToPreviousEpisode}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                />
              </div>

              <ShowInfo
                currentShow={currentShow}
                currentEpisode={currentEpisode}
              />

              <section className="rt-watch-body-content mb-5 sm:mb-7">
                <Episodes
                  showId={currentShow.id}
                  seasons={currentShow.seasons}
                  showBackdrop={currentShow.backdrop}
                  activeEpisodeId={currentEpisode?.episodeId}
                  onSelectEpisode={selectEpisode}
                />
              </section>

              {upcomingShows.length > 0 && (
                <div className="pb-4 sm:pb-8">
                  <ShowSection
                    sectionTitle="You may also like"
                    shows={upcomingShows}
                    sectionKey="up-next"
                    showMoreTo="/all-shows"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default VideoPlayerPage;
