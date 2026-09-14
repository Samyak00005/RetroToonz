export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="rt-empty-state">
      {icon && <div className="mb-4 text-white/25">{icon}</div>}
      <h2 className="rt-section-title">{title}</h2>
      {description && (
        <p className="rt-muted mt-2 max-w-md text-sm leading-6">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
