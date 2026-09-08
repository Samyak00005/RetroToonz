import {
  ArrowRight01Icon,
  Cancel01Icon,
  DashboardSquare01Icon,
  Edit02Icon,
  FavouriteIcon,
  PlayIcon,
  PlayListAddIcon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MediaImage from "../../components/common/MediaImage.jsx";
import Footer from "../../components/layout/Footer.jsx";
import Header from "../../components/layout/Header.jsx";
import ShowGrid from "../../components/show/ShowGrid.jsx";
import {
  getAllUsers,
  getCurrentUser,
  updateUser,
} from "../../services/authService.js";
import { getAllEpisodes, getAllShows } from "../../services/contentService.js";
import {
  clearPlaybackProgress,
  getContinueWatchingEntries,
  getWatchHistoryEntries,
  getWatchlistIds,
} from "../../services/libraryService.js";
import { showToast } from "../../services/toastService.js";
import { getRelatedShows } from "../../utils/showDiscovery.js";
import { buildWatchPath } from "../../utils/watchRoutes.js";

function getInitials(value) {
  const words = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "R";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function formatRelativeTime(timestamp) {
  const value = Number(timestamp || 0);
  if (!value) return "Recently watched";

  const difference = Date.now() - value;
  const minutes = Math.max(0, Math.floor(difference / 60000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function getEpisodeLabel(playback) {
  const season = playback?.seasonNumber ?? 1;
  const episode = playback?.episodeNumber ?? 1;
  return `S${season} · E${episode}`;
}

export default function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [editOpen, setEditOpen] = useState(false);
  const [libraryRevision, setLibraryRevision] = useState(0);

  const allShows = useMemo(() => getAllShows(), []);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const syncAuth = () => setUser(getCurrentUser());
    window.addEventListener("retrotoonz:auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("retrotoonz:auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    const syncLibrary = () => setLibraryRevision((value) => value + 1);
    window.addEventListener("retrotoonz:playback-changed", syncLibrary);
    window.addEventListener("retrotoonz:watchlist-changed", syncLibrary);
    window.addEventListener("storage", syncLibrary);
    return () => {
      window.removeEventListener("retrotoonz:playback-changed", syncLibrary);
      window.removeEventListener("retrotoonz:watchlist-changed", syncLibrary);
      window.removeEventListener("storage", syncLibrary);
    };
  }, []);

  const continueEntries = useMemo(
    () => getContinueWatchingEntries(30),
    [libraryRevision],
  );

  const historyEntries = useMemo(
    () => getWatchHistoryEntries(60),
    [libraryRevision],
  );

  const continueWatching = useMemo(
    () =>
      continueEntries
        .slice(0, 4)
        .map((entry) => {
          const show = allShows.find((candidate) => candidate.id === entry.showId);
          return show ? { ...show, playback: entry } : null;
        })
        .filter(Boolean),
    [allShows, continueEntries],
  );

  const watchHistory = useMemo(
    () =>
      historyEntries
        .slice(0, 8)
        .map((entry) => {
          const show = allShows.find((candidate) => candidate.id === entry.showId);
          return show ? { ...show, playback: entry } : null;
        })
        .filter(Boolean),
    [allShows, historyEntries],
  );

  const recommended = useMemo(() => {
    const references = watchHistory.slice(0, 4);
    return getRelatedShows(allShows, references, 8);
  }, [allShows, watchHistory]);

  if (!user) {
    return (
      <div className="rt-page flex min-h-screen flex-col">
        <Header />
        <main className="rt-standard-content flex flex-1 items-center justify-center py-12">
          <section className="rt-surface w-full max-w-xl p-7 text-center sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/25 to-blue-500/25">
              <HugeiconsIcon icon={UserIcon} size={34} />
            </div>
            <h1 className="mt-5 text-2xl font-semibold">Sign in to view your profile</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              Your account details, watchlist and viewing activity will appear here.
            </p>
            <button type="button" onClick={() => navigate("/login")} className="rt-button rt-button-primary mt-6">
              Sign in
            </button>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const watchlistCount = getWatchlistIds().length;
  const displayName = user.fullName || user.username || "RetroToonz User";

  return (
    <div className="rt-page flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="rt-standard-content py-7 pb-16 sm:py-9 sm:pb-20">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl">My Profile</h1>
            <p className="mt-1.5 text-sm text-white/42">Manage your account and pick up where you left off.</p>
          </div>

          <section className="rt-surface overflow-hidden">
            <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-2xl font-bold tracking-[-0.06em] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] sm:h-24 sm:w-24 sm:text-3xl">
                  {getInitials(displayName)}
                  <span className={`absolute -bottom-1 right-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${isAdmin ? "border-yellow-300/30 bg-[#2a2410] text-yellow-200" : "border-cyan-300/25 bg-[#10242a] text-cyan-100"}`}>
                    {isAdmin ? "Admin" : "Viewer"}
                  </span>
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{displayName}</h2>
                  <p className="mt-1 truncate text-sm font-medium text-cyan-300">@{user.username}</p>
                  <p className="mt-1 break-all text-sm text-white/45">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button type="button" onClick={() => setEditOpen(true)} className="rt-button rt-button-secondary">
                  <HugeiconsIcon icon={Edit02Icon} size={16} />
                  Edit Profile
                </button>
                {isAdmin && (
                  <button type="button" onClick={() => navigate("/admin")} className="rt-button border-yellow-300/20 bg-yellow-300/10 text-yellow-100 hover:bg-yellow-300/15">
                    <HugeiconsIcon icon={DashboardSquare01Icon} size={16} />
                    Admin Dashboard
                  </button>
                )}
              </div>
            </div>

            <div className="grid border-t border-white/8 sm:grid-cols-3">
              <ProfileMetric label="Watchlist" value={watchlistCount} onClick={() => navigate("/watchlist")} />
              <ProfileMetric label="Continue Watching" value={continueEntries.length} />
              <ProfileMetric label="Watch History" value={historyEntries.length} />
            </div>
          </section>

          <div className={`mt-6 grid gap-5 ${isAdmin ? "lg:grid-cols-[1.15fr_0.85fr]" : "lg:grid-cols-[1.15fr_0.85fr]"}`}>
            <section className="rt-surface p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/32">Account</p>
                <h2 className="mt-1 text-lg font-semibold">Account settings</h2>
              </div>

              <div className="mt-5 divide-y divide-white/[0.07]">
                <SettingsRow
                  title="Personal information"
                  description={`${displayName} · @${user.username}`}
                  onClick={() => setEditOpen(true)}
                />
                <SettingsRow
                  title="Email"
                  description={user.email}
                  onClick={() => setEditOpen(true)}
                />
                <SettingsRow
                  title="Change password"
                  description="Reset your local prototype password."
                  onClick={() => navigate(`/forgot-password?email=${encodeURIComponent(user.email)}`)}
                />
                <SettingsRow
                  title="Watchlist"
                  description={`${watchlistCount} saved ${watchlistCount === 1 ? "show" : "shows"}`}
                  onClick={() => navigate("/watchlist")}
                  icon={FavouriteIcon}
                />
              </div>
            </section>

            {isAdmin ? (
              <section className="rt-surface p-5 sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.13em] text-yellow-200/50">Admin</p>
                  <h2 className="mt-1 text-lg font-semibold">Admin tools</h2>
                  <p className="mt-1 text-sm text-white/40">Platform controls stay separate from your personal account.</p>
                </div>

                <div className="mt-5 divide-y divide-white/[0.07]">
                  <SettingsRow
                    title="Admin Dashboard"
                    description="Platform overview and health."
                    onClick={() => navigate("/admin")}
                    icon={DashboardSquare01Icon}
                  />
                  <SettingsRow
                    title="Manage users"
                    description={`${getAllUsers().length} accounts in the local prototype.`}
                    onClick={() => navigate("/admin/users")}
                    icon={UserGroupIcon}
                  />
                  <SettingsRow
                    title="Content management"
                    description={`${allShows.length} shows · ${getAllEpisodes().length} episodes`}
                    onClick={() => navigate("/admin/shows")}
                    icon={PlayListAddIcon}
                  />
                </div>
              </section>
            ) : (
              <section className="rt-surface p-5 sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/32">Library</p>
                  <h2 className="mt-1 text-lg font-semibold">Your viewing</h2>
                  <p className="mt-1 text-sm leading-6 text-white/40">
                    Resume episodes, revisit recent shows and keep favourites together.
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  <MiniMetric label="Saved" value={watchlistCount} />
                  <MiniMetric label="In progress" value={continueEntries.length} />
                  <MiniMetric label="Watched" value={historyEntries.length} />
                </div>
              </section>
            )}
          </div>

          <ProfileActivitySection
            title="Continue Watching"
            description="Resume from your latest saved episode."
            shows={continueWatching}
            emptyTitle="Nothing in progress"
            emptyText="Start watching an episode and your resume point will appear here."
            emptyAction="Browse shows"
            onEmptyAction={() => navigate("/all-shows")}
            mode="progress"
            onOpen={(show) => navigate(buildWatchPath(show.id, show.playback?.episodeId))}
            onRemove={(show) => {
              clearPlaybackProgress(show.id);
              setLibraryRevision((value) => value + 1);
            }}
          />

          <ProfileActivitySection
            title="Watch History"
            description="Your most recently watched shows."
            shows={watchHistory.slice(0, 4)}
            emptyTitle="No watch history yet"
            emptyText="Shows you watch will be listed here with the latest episode you opened."
            emptyAction="Explore RetroToonz"
            onEmptyAction={() => navigate("/all-shows")}
            mode="history"
            onOpen={(show) => navigate(buildWatchPath(show.id, show.playback?.episodeId))}
            onRemove={(show) => {
              clearPlaybackProgress(show.id);
              setLibraryRevision((value) => value + 1);
            }}
          />

          <section className="mt-10 sm:mt-12">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="rt-section-title">Recommended for You</h2>
                <p className="mt-1 text-sm text-white/42">Based on your recent activity.</p>
              </div>
              <button type="button" onClick={() => navigate("/all-shows")} className="hidden items-center gap-1 text-sm font-medium text-white/55 transition hover:text-white sm:flex">
                All shows <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </button>
            </div>
            {recommended.length ? (
              <ShowGrid shows={recommended} />
            ) : (
              <CompactEmpty
                title="Recommendations will appear here"
                text="Watch a few shows and RetroToonz will use those genres to suggest more."
                actionLabel="Browse all shows"
                onAction={() => navigate("/all-shows")}
              />
            )}
          </section>
        </div>
      </main>

      <Footer />

      {editOpen && (
        <EditProfileDialog
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={(nextUser) => {
            setUser(nextUser);
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ProfileMetric({ label, value, onClick }) {
  const content = (
    <>
      <strong className="text-xl text-white sm:text-2xl">{value}</strong>
      <span className="mt-1 text-xs text-white/42">{label}</span>
    </>
  );

  const classes = "flex min-h-[84px] flex-col justify-center border-b border-white/8 px-5 py-3 text-left last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0";
  return onClick ? (
    <button type="button" onClick={onClick} className={`${classes} transition hover:bg-white/[0.035]`}>{content}</button>
  ) : (
    <div className={classes}>{content}</div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-[var(--rt-radius-control)] border border-white/[0.07] bg-white/[0.025] px-3 py-4 text-center">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] text-white/35">{label}</p>
    </div>
  );
}

function SettingsRow({ title, description, onClick, icon = null }) {
  return (
    <button type="button" onClick={onClick} className="group flex w-full items-center gap-3 py-4 text-left first:pt-0 last:pb-0">
      {icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] text-white/55 transition group-hover:border-cyan-300/20 group-hover:text-cyan-200">
          <HugeiconsIcon icon={icon} size={17} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-white/85 transition group-hover:text-white">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-white/38 sm:text-sm">{description}</span>
      </span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={17} className="shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
    </button>
  );
}

function ProfileActivitySection({
  title,
  description,
  shows,
  emptyTitle,
  emptyText,
  emptyAction,
  onEmptyAction,
  mode,
  onOpen,
  onRemove,
}) {
  return (
    <section className="mt-10 sm:mt-12">
      <div className="mb-4">
        <h2 className="rt-section-title">{title}</h2>
        <p className="mt-1 text-sm text-white/42">{description}</p>
      </div>

      {shows.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shows.map((show) => (
            <ActivityCard
              key={`${mode}-${show.id}`}
              show={show}
              mode={mode}
              onOpen={() => onOpen(show)}
              onRemove={() => onRemove(show)}
            />
          ))}
        </div>
      ) : (
        <CompactEmpty title={emptyTitle} text={emptyText} actionLabel={emptyAction} onAction={onEmptyAction} />
      )}
    </section>
  );
}

function ActivityCard({ show, mode, onOpen, onRemove }) {
  const duration = Number(show.playback?.duration || 0);
  const currentTime = Number(show.playback?.currentTime || 0);
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const episodeTitle = show.playback?.episodeTitle || "Episode";
  const label = getEpisodeLabel(show.playback);
  const historyMode = mode === "history";

  return (
    <article className="group relative overflow-hidden rounded-[var(--rt-radius-card)] border border-white/[0.09] bg-white/[0.028] transition hover:border-white/[0.14] hover:bg-white/[0.04]">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-video overflow-hidden">
          <MediaImage
            src={show.backdrop || show.poster}
            alt={`${show.title} artwork`}
            wrapperClassName="absolute inset-0"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/55 backdrop-blur-md">
              <HugeiconsIcon icon={PlayIcon} size={19} />
            </span>
          </span>

          <div className="absolute bottom-3 left-3 right-3">
            <p className="truncate text-sm font-semibold text-white">{show.title}</p>
          </div>

          {!historyMode && duration > 0 && (
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white/12">
              <span className="block h-full bg-cyan-400" style={{ width: `${progress}%` }} />
            </span>
          )}
        </div>

        <div className="p-3.5 pr-11">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-cyan-300">{label}</p>
              <p className="mt-1 truncate text-sm font-medium text-white/80">{episodeTitle}</p>
            </div>
            {historyMode && (
              <span className="shrink-0 text-[10px] text-white/35">{formatRelativeTime(show.playback?.updatedAt)}</span>
            )}
          </div>

          {!historyMode && (
            <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-white/38">
              <span>{Math.round(progress)}% watched</span>
              <span>{formatRelativeTime(show.playback?.updatedAt)}</span>
            </div>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${show.title} from ${historyMode ? "watch history" : "continue watching"}`}
        className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/50 transition hover:bg-black/70 hover:text-white"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={14} />
      </button>
    </article>
  );
}

function CompactEmpty({ title, text, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--rt-radius-card)] border border-dashed border-white/10 bg-white/[0.018] px-5 py-9 text-center sm:py-10">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/35">
        <HugeiconsIcon icon={PlayIcon} size={18} />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-white/75">{title}</h3>
      <p className="mt-1 max-w-lg text-sm leading-6 text-white/38">{text}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="rt-button rt-button-secondary mt-4">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EditProfileDialog({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (event) => {
    event.preventDefault();
    setError("");

    const fullName = form.fullName.trim();
    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName || !username || !email) {
      setError("Name, username and email are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    const result = updateUser(user.id, { fullName, username, email });
    if (!result.ok) {
      setError(result.reason === "exists" ? "That email or username is already in use." : "Profile could not be updated.");
      return;
    }

    showToast("Profile updated.");
    onSaved(result.user);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" onMouseDown={(event) => event.stopPropagation()} className="rt-surface-strong w-full rounded-b-none p-5 sm:max-w-lg sm:rounded-[var(--rt-radius-card)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/32">Account</p>
            <h2 id="edit-profile-title" className="mt-1 text-xl font-semibold">Edit profile</h2>
          </div>
          <button type="button" onClick={onClose} className="rt-icon-button" aria-label="Close edit profile">
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="rt-field">
            <span className="rt-field-label">Display name</span>
            <input className="rt-input" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
          </label>
          <label className="rt-field">
            <span className="rt-field-label">Username</span>
            <input className="rt-input" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} />
          </label>
          <label className="rt-field">
            <span className="rt-field-label">Email</span>
            <input type="email" className="rt-input" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </label>

          {error && <p className="text-sm text-rose-300" role="alert">{error}</p>}

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" className="rt-button rt-button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="rt-button rt-button-primary">Save changes</button>
          </div>
        </form>
      </section>
    </div>
  );
}
