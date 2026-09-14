export default function PageHeading({
  title,
  description,
  eyebrow,
  actions,
  className = "",
}) {
  return (
    <header className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`.trim()}>
      <div className="min-w-0 max-w-3xl">
        {eyebrow && <p className="rt-eyebrow mb-2">{eyebrow}</p>}
        <h1 className="rt-page-title">{title}</h1>
        {description && (
          <p className="rt-muted mt-2 max-w-2xl text-sm leading-6 sm:text-[0.9375rem]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
