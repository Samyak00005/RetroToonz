import {
  ArrowDown01Icon,
  Cancel01Icon,
  DashboardSquare01Icon,
  FavouriteIcon,
  Login01Icon,
  Menu01Icon,
  Search01Icon,
  StarIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

import { getCurrentUser, signOut } from "../../services/authService.js";
import SearchBar from "../common/SearchBar.jsx";

const PORTAL_ROOT_ID = "retrotoonz-profile-portal-root";

if (typeof window !== "undefined") {
  try {
    if (!document.getElementById(PORTAL_ROOT_ID)) {
      const root = document.createElement("div");
      root.id = PORTAL_ROOT_ID;
      document.body.appendChild(root);
    }
  } catch {
    // Browser-only enhancement; no action is required during static rendering.
  }
}

export default function Header() {
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const profileBtnRef = useRef(null);
  const searchToggleRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const firstItemRef = useRef(null);
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0, caretLeft: 0 });

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const profileLabel =
    currentUser?.fullName?.split(/\s+/)[0] || currentUser?.username || "Guest";
  const showHeaderSurface =
    isScrolled || !isHome || showSearchMobile || searchOpen || profileOpen;

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  useEffect(() => {
    const syncAuth = () => setCurrentUser(getCurrentUser());
    window.addEventListener("retrotoonz:auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("retrotoonz:auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 8);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    setIsScrolled(window.scrollY > 8);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onDocClick(event) {
      const target = event.target;
      const profileButton = profileBtnRef.current;
      const portalRoot = document.getElementById(PORTAL_ROOT_ID);
      const searchToggle = searchToggleRef.current;
      const desktopSearch = desktopSearchRef.current;
      const mobileSearch = mobileSearchRef.current;

      if (profileButton?.contains(target) || portalRoot?.contains(target)) {
        if (!desktopSearch?.contains(target) && !mobileSearch?.contains(target)) {
          setSearchOpen(false);
          setShowSearchMobile(false);
        }
        return;
      }

      setProfileOpen(false);

      if (
        !searchToggle?.contains(target) &&
        !desktopSearch?.contains(target) &&
        !mobileSearch?.contains(target)
      ) {
        setSearchOpen(false);
        setShowSearchMobile(false);
      }
    }

    function onKey(event) {
      if (event.key !== "Escape") return;
      setProfileOpen(false);
      setSearchOpen(false);
      setShowSearchMobile(false);
      setShowEasterEgg(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const positionPortal = () => {
    const button = profileBtnRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = 224;
    const caretWidth = 12;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;

    let left = rect.right - menuWidth;
    const minLeft = 8;
    const maxLeft = Math.max(minLeft, viewportWidth - menuWidth - 8);
    left = Math.min(Math.max(left, minLeft), maxLeft);

    const top = rect.bottom + 8;
    const buttonCenter = rect.left + rect.width / 2;
    let caretLeft = buttonCenter - left - caretWidth / 2;
    caretLeft = Math.max(12, Math.min(menuWidth - 12 - caretWidth, caretLeft));

    setPortalPos({ top, left, caretLeft });
  };

  useEffect(() => {
    if (!profileOpen) return undefined;
    positionPortal();
    const timeout = window.setTimeout(
      () => firstItemRef.current?.focus(),
      120,
    );
    return () => window.clearTimeout(timeout);
  }, [profileOpen]);

  useEffect(() => {
    function recalculate() {
      if (profileOpen) positionPortal();
    }

    window.addEventListener("resize", recalculate);
    window.addEventListener("scroll", recalculate, { passive: true });
    return () => {
      window.removeEventListener("resize", recalculate);
      window.removeEventListener("scroll", recalculate);
    };
  }, [profileOpen]);

  useEffect(() => {
    setProfileOpen(false);
    setSearchOpen(false);
    setShowSearchMobile(false);
  }, [location.pathname, location.search]);

  const navigateAndClose = (path) => {
    setProfileOpen(false);
    setSearchOpen(false);
    setShowSearchMobile(false);
    navigate(path);
  };

  const toggleSearch = () => {
    setProfileOpen(false);
    if (window.innerWidth >= 640) {
      setShowSearchMobile(false);
      setSearchOpen((current) => !current);
    } else {
      setSearchOpen(false);
      setShowSearchMobile((current) => !current);
    }
  };

  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById(PORTAL_ROOT_ID)
      : null;

  useEffect(() => {
    if (clickCount !== 13) return;
    window.dispatchEvent(new CustomEvent("retrotoonz:easteregg"));
    setClickCount(0);
  }, [clickCount]);

  useEffect(() => {
    const onEasterEgg = () => setShowEasterEgg(true);
    window.addEventListener("retrotoonz:easteregg", onEasterEgg);
    return () => window.removeEventListener("retrotoonz:easteregg", onEasterEgg);
  }, []);

  return (
    <>
      <header
        className="fixed left-0 top-0 z-100 h-16 w-full"
        aria-label="Main header"
      >
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            showHeaderSurface ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <div className="rt-site-header h-full w-full" />
        </div>

        <div
          className="rt-header-inner relative z-20 flex w-full items-center text-white"
          style={{
            height: "calc(64px + env(safe-area-inset-top, 0px))",
            paddingTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          <div className="flex min-w-0 items-center gap-7">
            <button
              type="button"
              aria-label="RetroToonz home"
              onClick={() => {
                setClickCount((current) => current + 1);
                navigateAndClose("/");
              }}
              className="rt-brand-logo shrink-0 select-none text-white transition-colors duration-150 hover:text-cyan-100"
            >
              RetroToonz
            </button>

            {!searchOpen && (
              <nav
                className="hidden items-center gap-1 lg:flex"
                aria-label="Primary navigation"
              >
                <HeaderNavItem
                  active={isActive("/all-shows")}
                  onClick={() => navigateAndClose("/all-shows")}
                >
                  All Shows
                </HeaderNavItem>
                <HeaderNavItem
                  active={isActive("/watchlist")}
                  onClick={() => navigateAndClose("/watchlist")}
                >
                  Watchlist
                </HeaderNavItem>
              </nav>
            )}
          </div>

          <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <div
              ref={desktopSearchRef}
              className={`hidden transition-[width,opacity] duration-200 ease-out sm:block ${
                searchOpen
                  ? "w-[min(46vw,30rem)] overflow-visible opacity-100"
                  : "pointer-events-none w-0 overflow-hidden opacity-0"
              }`}
            >
              <SearchBar autoFocus={searchOpen} compact />
            </div>

            <button
              ref={searchToggleRef}
              type="button"
              onClick={toggleSearch}
              title={searchOpen || showSearchMobile ? "Close search" : "Search"}
              aria-label={searchOpen || showSearchMobile ? "Close search" : "Search"}
              aria-expanded={searchOpen || showSearchMobile}
              className={`rt-icon-button rt-header-control ${
                !showHeaderSurface ? "rt-header-control-overlay" : ""
              }`}
            >
              <HugeiconsIcon
                icon={searchOpen || showSearchMobile ? Cancel01Icon : Search01Icon}
                size={19}
              />
            </button>

            <button
              ref={profileBtnRef}
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setShowSearchMobile(false);
                setProfileOpen((current) => !current);
              }}
              className={`rt-button rt-button-secondary rt-header-control rounded-full px-3 ${
                !showHeaderSurface ? "rt-header-control-overlay" : ""
              }`}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <HugeiconsIcon icon={UserCircleIcon} size={20} />
              <span className="hidden text-label text-white/88 xl:block">
                {profileLabel}
              </span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                className={`transition-transform duration-150 ${
                  profileOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div
          ref={mobileSearchRef}
          className={`rt-site-header relative z-20 border-t px-3 transition-[max-height,opacity,padding] duration-200 sm:hidden ${
            showSearchMobile
              ? "max-h-24 overflow-visible border-white/8 pb-3 pt-2 opacity-100"
              : "pointer-events-none max-h-0 overflow-hidden border-transparent py-0 opacity-0"
          }`}
        >
          <SearchBar autoFocus={showSearchMobile} compact />
        </div>
      </header>

      {!isHome && <div className="h-16" aria-hidden="true" />}

      {profileOpen &&
        portalRoot &&
        createPortal(
          <div
            id="retrotoonz-profile-portal"
            style={{
              position: "fixed",
              top: `${portalPos.top}px`,
              left: `${portalPos.left}px`,
              zIndex: 9999,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -7,
                left: portalPos.caretLeft,
                width: 14,
                height: 14,
                transform: "rotate(45deg)",
                background: "rgba(13,16,32,.98)",
                borderLeft: "1px solid rgba(255,255,255,0.09)",
                borderTop: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 2,
              }}
            />
            <div
              role="menu"
              className="rt-surface-strong w-56 origin-top-right overflow-hidden"
              style={{ animation: "rtHeaderMenuIn 160ms ease-out forwards" }}
            >
              <MenuItems
                firstItemRef={firstItemRef}
                onNavigate={navigateAndClose}
                currentUser={currentUser}
              />
            </div>
          </div>,
          portalRoot,
        )}

      {showEasterEgg && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setShowEasterEgg(false)}
        >
          <button
            type="button"
            onClick={() => setShowEasterEgg(false)}
            className="rt-icon-button absolute right-6 top-6 bg-white/10 text-white hover:bg-red-500/70"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={26} />
          </button>
          <img
            src="/media/branding/easter-egg.gif"
            alt="Easter Egg"
            className="max-h-[75vh] max-w-[85vw] object-contain"
          />
        </div>
      )}
    </>
  );
}

function HeaderNavItem({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rt-header-nav-link ${active ? "rt-header-nav-link-active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}

function MenuItems({ firstItemRef, onNavigate, currentUser }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const itemBase =
    "flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-left text-label text-white/82 transition-colors hover:bg-white/[0.055] hover:text-white";

  return (
    <div className="py-2">
      {currentUser?.role === "admin" && (
        <button
          type="button"
          onClick={() => onNavigate("/admin")}
          className={`${itemBase} ${
            location.pathname.startsWith("/admin") ? "bg-white/[0.06]" : ""
          }`}
        >
          <HugeiconsIcon
            icon={DashboardSquare01Icon}
            className="text-yellow-300"
            size={18}
          />
          <span>Admin Dashboard</span>
        </button>
      )}

      <button
        ref={firstItemRef}
        type="button"
        onClick={() => onNavigate("/profile")}
        className={`${itemBase} ${isActive("/profile") ? "bg-white/[0.06]" : ""}`}
      >
        <HugeiconsIcon icon={UserCircleIcon} className="text-cyan-300" size={18} />
        <span>My Profile</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate("/all-shows")}
        className={`${itemBase} lg:hidden ${
          isActive("/all-shows") ? "bg-white/[0.06]" : ""
        }`}
      >
        <HugeiconsIcon icon={Menu01Icon} className="text-cyan-300" size={18} />
        <span>All Shows</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate("/watchlist")}
        className={`${itemBase} lg:hidden ${
          isActive("/watchlist") ? "bg-white/[0.06]" : ""
        }`}
      >
        <HugeiconsIcon icon={FavouriteIcon} className="text-cyan-300" size={18} />
        <span>Watchlist</span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate("/about-us")}
        className={`${itemBase} ${isActive("/about-us") ? "bg-white/[0.06]" : ""}`}
      >
        <HugeiconsIcon icon={StarIcon} className="text-cyan-300" size={18} />
        <span>About Us</span>
      </button>

      <div className="my-2 h-px bg-white/[0.07]" />

      {currentUser ? (
        <button
          type="button"
          onClick={() => {
            signOut();
            onNavigate("/");
          }}
          className={itemBase}
        >
          <HugeiconsIcon icon={Login01Icon} className="text-white/55" size={18} />
          <span>Sign out</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onNavigate("/login")}
          className={itemBase}
        >
          <HugeiconsIcon icon={Login01Icon} className="text-cyan-300" size={18} />
          <span>Sign in</span>
        </button>
      )}
    </div>
  );
}
