import {
  Menu01Icon,
  Notification03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation, useNavigate } from "react-router-dom";

import { getCurrentUser } from "../../services/authService.js";

const PAGE_TITLES = [
  ["/admin/content-health", "Content Health"],
  ["/admin/homepage-section", "Homepage Sections"],
  ["/admin/episodes", "Episodes"],
  ["/admin/analytics", "Analytics"],
  ["/admin/settings", "Settings"],
  ["/admin/shows", "Shows"],
  ["/admin/users", "Users"],
  ["/admin", "Dashboard"],
];

export default function AdminHeader({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const displayName = user?.fullName?.split(/\s+/)[0] || user?.username || "Admin";
  const initial = displayName.charAt(0).toUpperCase() || "A";
  const pageTitle =
    PAGE_TITLES.find(([path]) =>
      path === "/admin" ? location.pathname === path : location.pathname.startsWith(path),
    )?.[1] || "Admin";

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[rgba(8,10,18,0.78)] px-4 py-3 backdrop-blur-xl sm:px-5 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3">
        <button
          type="button"
          className="rt-icon-button md:hidden"
          onClick={onMenuClick}
          aria-label="Open admin navigation"
        >
          <HugeiconsIcon icon={Menu01Icon} size={19} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="rt-eyebrow hidden sm:block">Admin</p>
          <h1 className="truncate text-lg font-semibold tracking-[-0.025em] text-white sm:mt-0.5 sm:text-xl">
            {pageTitle}
          </h1>
        </div>

        <div className="hidden w-full max-w-xs items-center md:flex">
          <div className="relative w-full">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              type="search"
              placeholder="Search admin..."
              className="rt-input min-h-[40px] rounded-full py-2 pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          className="rt-icon-button relative"
          aria-label="Notifications"
          title="Notifications are not connected yet"
        >
          <HugeiconsIcon icon={Notification03Icon} size={18} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="rt-button rt-button-secondary min-h-[42px] rounded-full px-2.5 sm:px-3.5"
          title="My profile"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/50 to-blue-500/50 text-xs font-semibold">
            {initial}
          </span>
          <span className="hidden max-w-24 truncate text-sm sm:block">{displayName}</span>
        </button>
      </div>
    </header>
  );
}
