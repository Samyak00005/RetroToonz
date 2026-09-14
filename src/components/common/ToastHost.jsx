import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TOAST_EVENT } from "../../services/toastService.js";

export default function ToastHost() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleToast = (event) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);

      const nextToast = event.detail;
      setToast(nextToast);
      timerRef.current = window.setTimeout(
        () => setToast(null),
        nextToast.duration ?? 3200,
      );
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const isError = toast?.tone === "error";

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-5 z-[120000] flex justify-center px-4 sm:top-6"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <div
            role={isError ? "alert" : "status"}
            aria-live={isError ? "assertive" : "polite"}
            aria-atomic="true"
            className={`pointer-events-auto flex min-w-0 max-w-md items-center gap-3 border px-4 py-3 ${
              isError
                ? "border-red-300/20 bg-[#2c111c]"
                : "border-cyan-200/20 bg-[#09151f]"
            }`}
            style={{ borderRadius: "var(--rt-radius-control)" }}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                isError
                  ? "bg-red-400/15 text-red-200"
                  : "bg-cyan-300/15 text-cyan-100"
              }`}
            >
              {isError ? "!" : "✓"}
            </span>
            <p className="min-w-0 text-sm font-medium text-white/90">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg leading-none text-white/45 transition-colors duration-150 hover:bg-white/[0.06] hover:text-white focus-visible:text-white"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
