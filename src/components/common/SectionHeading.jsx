export default function SectionHeading({
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div className={`rt-section-header ${className}`.trim()}>
      <div className="min-w-0">
        <h2 className="rt-section-title">{title}</h2>
        {description && (
          <p className="rt-muted mt-1 max-w-2xl text-sm leading-6">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
