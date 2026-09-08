const TOAST_EVENT = "retrotoonz:toast";

export function showToast(message, options = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        message,
        tone: options.tone ?? "success",
        duration: options.duration ?? 3200,
      },
    }),
  );
}

export { TOAST_EVENT };
