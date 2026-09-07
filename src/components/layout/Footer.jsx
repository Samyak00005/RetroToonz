import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCurrentUser } from "../../services/authService.js";

const linkClass =
  "text-sm text-white/55 transition-colors duration-200 hover:text-white focus-visible:text-white";

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
      <div className="rt-standard-content py-8 sm:py-10">
        <div className="flex flex-col gap-7 border-b border-white/8 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-[-0.045em] text-white transition hover:text-cyan-200"
            >
              RetroToonz
            </Link>
            <p className="mt-2 text-sm leading-6 text-white/48">
              Classic cartoons, collected in one simple place.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-end"
          >
            <Link className={linkClass} to="/">
              Home
            </Link>
            <Link className={linkClass} to="/all-shows">
              All Shows
            </Link>
            <Link className={linkClass} to="/watchlist">
              Watchlist
            </Link>
            <Link className={linkClass} to="/about-us">
              About
            </Link>
            {currentUser ? (
              <Link className={linkClass} to="/profile">
                My Profile
              </Link>
            ) : (
              <Link className={linkClass} to="/login">
                Sign in
              </Link>
            )}
            {currentUser?.role === "admin" && (
              <Link className={linkClass} to="/admin">
                Admin
              </Link>
            )}
            <a
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-100"
              href="https://buymeachai.ezee.li/Samyak005"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help with chai ☕
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-2 pt-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} RetroToonz. All rights reserved.</span>
          <span>Made for nostalgia.</span>
        </div>
      </div>
    </footer>
  );
}
