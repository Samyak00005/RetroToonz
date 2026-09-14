import { HomeContentSkeleton, AllShowsContentSkeleton } from "./PageContentSkeletons.jsx";
import { useLocation } from "react-router-dom";

function SkeletonBlock({ className = "" }) {
  return <span className={`rt-skeleton-block ${className}`} aria-hidden="true" />;
}

function HeaderSkeleton() {
  return (
    <div className="rt-route-skeleton-header" aria-hidden="true">
      <SkeletonBlock className="h-8 w-36 sm:w-44" />
      <div className="ml-auto flex items-center gap-2">
        <SkeletonBlock className="h-11 w-11 rounded-full" />
        <SkeletonBlock className="h-11 w-24 rounded-full sm:w-28" />
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="rt-route-skeleton-main">
      <div className="max-w-xl space-y-3">
        <SkeletonBlock className="h-8 w-48 sm:h-10 sm:w-64" />
        <SkeletonBlock className="h-4 w-full max-w-md" />
      </div>
      <div className="mt-8 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-10 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="rt-route-skeleton-grid mt-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <SkeletonBlock className="aspect-[2/3] w-full rounded-[var(--rt-radius-card)]" />
            <SkeletonBlock className="h-4 w-4/5" />
            <SkeletonBlock className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaSkeleton() {
  return (
    <div className="rt-route-skeleton-main rt-route-skeleton-media">
      <SkeletonBlock className="aspect-video w-full lg:aspect-[23/9]" />
      <div className="mt-6 max-w-3xl space-y-3">
        <SkeletonBlock className="h-8 w-56 sm:w-72" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-4/5" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <SkeletonBlock className="aspect-video w-full rounded-[var(--rt-radius-card)]" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="rt-route-skeleton-main">
      <SkeletonBlock className="h-9 w-44" />
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
        <div className="rt-skeleton-panel flex items-center gap-4 p-5 sm:p-6">
          <SkeletonBlock className="h-20 w-20 rounded-full sm:h-24 sm:w-24" />
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBlock className="h-6 w-36" />
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-52 max-w-full" />
          </div>
        </div>
        <div className="rt-skeleton-panel space-y-3 p-5 sm:p-6">
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="h-11 w-full" />
          <SkeletonBlock className="h-11 w-full" />
        </div>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-24 w-full rounded-[var(--rt-radius-panel)]" />
        ))}
      </div>
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="rt-route-skeleton-auth">
      <div className="hidden max-w-md space-y-4 md:block">
        <SkeletonBlock className="h-12 w-64" />
        <SkeletonBlock className="h-5 w-80 max-w-full" />
      </div>
      <div className="rt-skeleton-panel w-full max-w-md space-y-4 p-6 sm:p-8">
        <SkeletonBlock className="mx-auto h-8 w-44" />
        <SkeletonBlock className="mx-auto h-4 w-64 max-w-full" />
        <div className="pt-4 space-y-3">
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="rt-route-skeleton-admin">
      <aside className="rt-route-skeleton-sidebar hidden lg:block" aria-hidden="true">
        <SkeletonBlock className="h-8 w-36" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full" />
          ))}
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <SkeletonBlock className="h-9 w-52" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-28 w-full rounded-[var(--rt-radius-panel)]" />
          ))}
        </div>
        <SkeletonBlock className="mt-6 h-72 w-full rounded-[var(--rt-radius-panel)]" />
      </main>
    </div>
  );
}

export default function RouteLoadingFallback() {
  const { pathname } = useLocation();

  const content = pathname.startsWith("/admin") ? (
    <AdminSkeleton />
  ) : pathname === "/" ? (
    <>
      <HeaderSkeleton />
      <HomeContentSkeleton />
    </>
  ) : pathname === "/all-shows" ? (
    <>
      <HeaderSkeleton />
      <AllShowsContentSkeleton />
    </>
  ) : pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password" ? (
    <AuthSkeleton />
  ) : pathname.startsWith("/watch/") || pathname.startsWith("/show/") ? (
    <>
      <HeaderSkeleton />
      <MediaSkeleton />
    </>
  ) : pathname === "/profile" ? (
    <>
      <HeaderSkeleton />
      <ProfileSkeleton />
    </>
  ) : (
    <>
      <HeaderSkeleton />
      <GridSkeleton />
    </>
  );

  return (
    <div className="rt-route-skeleton" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      {content}
    </div>
  );
}
