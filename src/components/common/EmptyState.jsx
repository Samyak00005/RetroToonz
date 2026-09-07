export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="rt-empty-state">
      {icon && <div className="mb-5 text-white/22">{icon}</div>}
      <h2 className="text-lg font-semibold tracking-[-0.02em] text-white/86">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-white/42">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
