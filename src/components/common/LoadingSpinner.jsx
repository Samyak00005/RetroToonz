export default function LoadingSpinner({ size = 16, className = "", label = "" }) {
  return (
    <span
      className={`rt-loading-spinner ${className}`}
      style={{ width: size, height: size }}
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : "true"}
    />
  );
}
