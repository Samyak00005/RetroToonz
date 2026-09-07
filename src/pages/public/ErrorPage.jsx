import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";
import ShowSection from "../../components/home/ShowSection.jsx";
import { getAllShows } from "../../services/contentService.js";
import { sortShows } from "../../utils/showDiscovery.js";

export default function ErrorPage() {
  const navigate = useNavigate();
  const recommended = useMemo(
    () => sortShows(getAllShows(), "views-desc").slice(0, 8),
    [],
  );

  return (
    <div className="rt-page flex min-h-screen flex-col">
      <Header />

      <main className="relative flex flex-1 flex-col justify-center overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[110px]" />
        <div className="rt-standard-content relative z-10 text-center">
          <p className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
            404
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Lost in nostalgia?</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
            The page you were looking for does not exist, or its address has changed.
          </p>
          <div className="mt-7 flex justify-center">
            <button type="button" onClick={() => navigate("/")} className="rt-button rt-button-primary">
              <HugeiconsIcon icon={Home01Icon} size={19} />
              Go home
            </button>
          </div>
        </div>
      </main>

      <ShowSection
        sectionTitle="Popular shows"
        shows={recommended}
        sectionKey="trending"
      />

      <Footer />
    </div>
  );
}
