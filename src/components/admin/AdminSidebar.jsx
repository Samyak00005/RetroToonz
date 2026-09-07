import {
  Alert02Icon,
  Analytics01Icon,
  ArrowLeft01Icon,
  DashboardSquare01Icon,
  GridIcon,
  Home02Icon,
  PlayListAddIcon,
  Settings01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation, useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Main",
    items: [{ name: "Dashboard", path: "/admin", icon: DashboardSquare01Icon }],
  },
  {
    title: "Content",
    items: [
      { name: "Shows", path: "/admin/shows", icon: PlayListAddIcon },
      { name: "Episodes", path: "/admin/episodes", icon: GridIcon },
      { name: "Homepage", path: "/admin/homepage-section", icon: Home02Icon },
    ],
  },
  {
    title: "Audience",
    items: [{ name: "Users", path: "/admin/users", icon: UserGroupIcon }],
  },
  {
    title: "Insights",
    items: [{ name: "Analytics", path: "/admin/analytics", icon: Analytics01Icon }],
  },
  {
    title: "Control",
    items: [
      { name: "Content Health", path: "/admin/content-health", icon: Alert02Icon },
      { name: "Settings", path: "/admin/settings", icon: Settings01Icon },
    ],
  },
  {
    title: "Account",
    items: [{ name: "My Profile", path: "/profile", icon: UserIcon }],
  },
];

export default function AdminSidebar({ closeSidebar, mobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    navigate(path);
    closeSidebar?.();
  };

  return (
    <aside
      className={`rt-surface-strong flex w-64 flex-col overflow-hidden ${
        mobile ? "h-[calc(100vh-16px)]" : "sticky top-2 m-2 h-[calc(100vh-16px)]"
      }`}
    >
      <div className="flex min-h-16 items-center gap-3 border-b border-white/[0.07] px-3.5">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rt-icon-button h-9 w-9"
          aria-label="Back to RetroToonz"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={17} />
        </button>

        <button
          type="button"
          onClick={() => goTo("/admin")}
          className="min-w-0 text-left"
        >
          <span className="block truncate text-base font-semibold tracking-[-0.03em] text-white">
            RetroToonz
          </span>
          <span className="block text-[10px] uppercase tracking-[0.15em] text-white/30">
            Admin console
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.title}>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/28">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    item.path === "/admin"
                      ? location.pathname === "/admin"
                      : item.path === "/profile"
                        ? location.pathname === "/profile"
                        : location.pathname.startsWith(item.path);

                  return (
                    <button
                      type="button"
                      key={item.path}
                      onClick={() => goTo(item.path)}
                      className={`relative flex w-full items-center gap-3 rounded-[var(--rt-radius-control)] px-3 py-2.5 text-left text-sm font-medium transition ${
                        isActive
                          ? "bg-cyan-300/10 text-cyan-100"
                          : "text-white/55 hover:bg-white/[0.055] hover:text-white/90"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-cyan-300" />
                      )}
                      <HugeiconsIcon
                        icon={item.icon}
                        size={18}
                        className={isActive ? "text-cyan-300" : "text-white/45"}
                      />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/[0.07] px-4 py-3 text-center text-[10px] text-white/25">
        RetroToonz frontend prototype
      </div>
    </aside>
  );
}
