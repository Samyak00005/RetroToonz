import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function NavigationProgress() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timersRef = useRef([]);

  useEffect(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    setVisible(true);
    setProgress(16);

    const frame = window.requestAnimationFrame(() => setProgress(68));
    const finishTimer = window.setTimeout(() => setProgress(100), 140);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 280);

    timersRef.current.push(finishTimer, hideTimer);

    return () => {
      window.cancelAnimationFrame(frame);
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [location.pathname, location.search]);

  return (
    <div
      className={`rt-navigation-progress ${visible ? "is-visible" : ""}`}
      aria-hidden="true"
    >
      <span style={{ width: `${progress}%` }} />
    </div>
  );
}
