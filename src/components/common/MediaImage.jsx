import { useEffect, useMemo, useState } from "react";

import { getFallbackImageUrl, getMediaUrl } from "../../services/mediaService.js";

export default function MediaImage({
  src,
  alt = "",
  fallback = getFallbackImageUrl(),
  className = "",
  wrapperClassName = "",
  loading = "lazy",
  decorative = false,
  ...props
}) {
  const resolvedSrc = useMemo(() => getMediaUrl(src) || getFallbackImageUrl(), [src]);
  const resolvedFallback = useMemo(
    () => getMediaUrl(fallback) || getFallbackImageUrl(),
    [fallback],
  );

  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  useEffect(() => {
    setLoaded(false);
    setCurrentSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <span className={`rt-media-frame ${wrapperClassName}`}>
      {!loaded && <span className="rt-media-skeleton" aria-hidden="true" />}
      <img
        {...props}
        src={currentSrc}
        alt={decorative ? "" : alt}
        aria-hidden={decorative ? "true" : undefined}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== resolvedFallback) {
            setCurrentSrc(resolvedFallback);
          } else {
            setLoaded(true);
          }
        }}
        className={`${className}`}
      />
    </span>
  );
}
