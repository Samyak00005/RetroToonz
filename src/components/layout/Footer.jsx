import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCurrentUser } from "../../services/authService.js";

const linkClass =
  "text-sm text-white/50 transition-colors duration-150 hover:text-white focus-visible:text-white";

export default function Footer() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const syncAuth = () => setCurrentUser(getCurrentUser());
    window.addEventListener("retrotoonz:auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("retrotoonz:auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return (
    <footer className="rt-footer mt-auto">
      <div className="rt-standard-content py-7 sm:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              to="/"
              className="text-xl font-bold tracking-[-0.035em] text-white transition-colors duration-150 hover:text-cyan-100"
            >
              RetroToonz
            </Link>
            <p className="mt-1.5 text-sm text-white/38">Classic cartoons. Modern playback.</p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:justify-end">
            <Link className={linkClass} to="/all-shows">All Shows</Link>
            <Link className={linkClass} to="/watchlist">Watchlist</Link>
            <Link className={linkClass} to="/about-us">About</Link>
            <Link className={linkClass} to={currentUser ? "/profile" : "/login"}>
              {currentUser ? "My Profile" : "Sign in"}
            </Link>
            {currentUser?.role === "admin" && <Link className={linkClass} to="/admin">Admin</Link>}
            <a
              className="text-sm font-medium text-white/58 transition-colors duration-150 hover:text-cyan-100"
              href="https://buymeachai.ezee.li/Samyak005"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help with chai ☕
            </a>
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-1.5 border-t border-white/[0.065] pt-4 text-xs text-white/28 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} RetroToonz. All rights reserved.</span>
          <span>Made for nostalgia.</span>
        </div>
      </div>
    </footer>
  );
}
