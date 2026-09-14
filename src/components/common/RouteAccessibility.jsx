import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const getRouteLabel = () => {
  const heading = document.querySelector("main h1, [data-route-heading], h1");
  const text = heading?.textContent?.replace(/\s+/g, " ").trim();
  return text || "RetroToonz";
};

export default function RouteAccessibility() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const mounted = useRef(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      previousPath.current = location.pathname;
      return undefined;
    }

    const previous = previousPath.current;
    previousPath.current = location.pathname;

    const switchingEpisodes =
      previous.startsWith("/watch/") && location.pathname.startsWith("/watch/");

    const frame = window.requestAnimationFrame(() => {
      const label = getRouteLabel();
      setAnnouncement(`${label} page loaded`);

      if (switchingEpisodes) return;

      const heading = document.querySelector("main h1, [data-route-heading], h1");
      const target = heading || document.getElementById("main-content");
      if (!target) return;

      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
        target.dataset.rtTemporaryTabindex = "true";
      }

      target.classList.add("rt-route-focus-target");
      target.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <div className="rt-sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );
}
