function SkeletonBlock({ className = "" }) {
  return <span className={`rt-skeleton-block ${className}`} aria-hidden="true" />;
}

function PosterSkeletonRow({ count = 8 }) {
  return (
    <div className="rt-route-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-2">
          <SkeletonBlock className="aspect-[2/3] w-full rounded-[var(--rt-radius-card)]" />
          <SkeletonBlock className="h-4 w-4/5" />
          <SkeletonBlock className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

export function HomeContentSkeleton() {
  return (
    <div className="rt-home-loading" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading homepage…</span>
      <SkeletonBlock className="block aspect-[3/4] w-full rounded-none sm:aspect-[4/3] lg:aspect-[21/9]" />
      <div className="rt-standard-content space-y-10 py-8 sm:space-y-12 sm:py-10">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <section key={sectionIndex} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <SkeletonBlock className="h-7 w-36 sm:w-44" />
              <SkeletonBlock className="h-5 w-20 rounded-full" />
            </div>
            <PosterSkeletonRow />
          </section>
        ))}
      </div>
    </div>
  );
}

export function AllShowsContentSkeleton() {
  return (
    <div className="rt-standard-content py-7 sm:py-9 lg:py-10" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading shows…</span>
      <div className="space-y-3">
        <SkeletonBlock className="h-9 w-40 sm:h-10 sm:w-52" />
        <SkeletonBlock className="h-4 w-full max-w-lg" />
      </div>
      <div className="mt-8 flex gap-2 overflow-hidden border-y border-white/[0.06] py-5">
        {Array.from({ length: 7 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-10 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="mt-7 flex items-center justify-between gap-4">
        <SkeletonBlock className="h-4 w-20" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-11 w-28 rounded-full" />
          <SkeletonBlock className="h-11 w-32 rounded-full" />
        </div>
      </div>
      <div className="mt-7">
        <PosterSkeletonRow />
      </div>
    </div>
  );
}
