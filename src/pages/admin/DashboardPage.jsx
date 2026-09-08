import {
  UserGroupIcon,
  PlayListAddIcon,
  GridIcon,
  Analytics01Icon,
  ArrowUpRight01Icon,
  DashboardSquare01Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import showsData from "../../services/contentService.js";
import { getAllUsers } from "../../services/authService.js";

export default function DashboardPage() {
  const shows = Array.isArray(showsData) ? showsData : showsData.allShows || [];

  // 🔥 Derived stats
  const totalShows = shows.length;
  const totalUsers = getAllUsers().length;

  const totalEpisodes = shows.reduce((acc, show) => {
    const seasons = show.seasons || [];
    return (
      acc + seasons.reduce((sAcc, s) => sAcc + (s.episodes?.length || 0), 0)
    );
  }, 0);

  const showsWithoutEpisodes = shows.filter(
    (show) =>
      !show.seasons ||
      show.seasons.every((s) => (s.episodes || []).length === 0),
  );

  const showsMissingThumbnail = shows.filter((show) => !show.thumbnail);

  const stats = [
    {
      title: "Users",
      value: totalUsers,
      change: "Local",
      icon: UserGroupIcon,
    },
    {
      title: "Shows",
      value: totalShows,
      change: "+3",
      icon: PlayListAddIcon,
    },
    {
      title: "Episodes",
      value: totalEpisodes,
      change: "+24",
      icon: GridIcon,
    },
    {
      title: "Views",
      value: "89,200",
      change: "+18%",
      icon: Analytics01Icon,
    },
  ];

  return (
    <div className="p-5 md:p-6 space-y-8 text-white">
      {/* 🔥 Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <HugeiconsIcon icon={DashboardSquare01Icon} size={22} />
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Overview of your platform
          </p>
        </div>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-[var(--rt-radius-control)] bg-white/[0.055] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {stat.title}
              </p>
              <HugeiconsIcon icon={stat.icon} size={18} />
            </div>

            <h2 className="text-2xl font-semibold mt-2">{stat.value}</h2>

            <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* 🚨 Content Health */}
      <div className="rounded-[var(--rt-radius-control)] bg-white/[0.055] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 p-5">
        <h3 className="text-lg font-medium text-gray-300 mb-4 flex items-center gap-2">
          <HugeiconsIcon icon={Alert02Icon} size={18} />
          Content Health
        </h3>

        <div className="space-y-3 text-sm">
          {showsWithoutEpisodes.length > 0 && (
            <div className="text-yellow-400">
              ⚠️ {showsWithoutEpisodes.length} shows have no episodes
            </div>
          )}

          {showsMissingThumbnail.length > 0 && (
            <div className="text-red-400">
              ❌ {showsMissingThumbnail.length} shows missing thumbnails
            </div>
          )}

          {showsWithoutEpisodes.length === 0 &&
            showsMissingThumbnail.length === 0 && (
              <div className="text-green-400">✅ Everything looks good</div>
            )}
        </div>
      </div>

      {/* 🕒 Recent Activity */}
      <div className="rounded-[var(--rt-radius-control)] bg-white/[0.055] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 p-5">
        <h3 className="text-lg font-medium text-gray-300 mb-5 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
          Recent Activity
        </h3>

        <div className="space-y-4">
          {/* Item */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--rt-radius-control)] bg-indigo-500/10 flex items-center justify-center">
                <span className="text-indigo-400 text-xs">+</span>
              </div>
              <p className="text-sm text-gray-300 group-hover:text-white transition">
                Added new show <span className="font-medium">Ben 10</span>
              </p>
            </div>
            <span className="text-xs text-gray-500">2 min ago</span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--rt-radius-control)] bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-400 text-xs">▶</span>
              </div>
              <p className="text-sm text-gray-300 group-hover:text-white transition">
                Episode added to <span className="font-medium">Doraemon</span>
              </p>
            </div>
            <span className="text-xs text-gray-500">10 min ago</span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--rt-radius-control)] bg-green-500/10 flex items-center justify-center">
                <span className="text-green-400 text-xs">U</span>
              </div>
              <p className="text-sm text-gray-300 group-hover:text-white transition">
                New user registered
              </p>
            </div>
            <span className="text-xs text-gray-500">30 min ago</span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[var(--rt-radius-control)] bg-yellow-500/10 flex items-center justify-center">
                <span className="text-yellow-400 text-xs">!</span>
              </div>
              <p className="text-sm text-gray-300 group-hover:text-white transition">
                Missing thumbnail in <span className="font-medium">Naruto</span>
              </p>
            </div>
            <span className="text-xs text-gray-500">1 hr ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
