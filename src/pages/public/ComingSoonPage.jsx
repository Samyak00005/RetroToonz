import { Link } from "react-router-dom";

import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";

export default function ComingSoonPage() {
  return (
    <div className="rt-page flex flex-col">
      <Header />
      <main className="rt-content-reading flex min-h-[65vh] flex-1 items-center justify-center py-16 text-center">
        <div className="max-w-xl">
          <p className="rt-eyebrow">In progress</p>
          <h1 className="rt-page-title mt-3">Coming Soon</h1>
          <p className="mt-4 text-base leading-7 text-white/48">
            This part of RetroToonz is still being prepared. You can keep
            exploring the current library in the meantime.
          </p>
          <Link to="/" className="rt-button rt-button-primary mt-7">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
