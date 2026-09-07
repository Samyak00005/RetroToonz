export default function LoadingSpinner({ size = 16, className = "" }) {
  return (
    <span
      className={`rt-loading-spinner ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
