import { GoBackward10SecIcon, GoForward10SecIcon, PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

export default function VideoCenterControls({ isPlaying, togglePlayPause, rewind, forward, isBuffering, showControls }) {
  const controlClass = "flex items-center justify-center rounded-full border border-white/15 bg-black/55 text-white transition-[background-color,transform] duration-150 hover:bg-black/75 active:scale-[0.98]";
  return (
    <div data-controls className={`pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0"}`}>
      {isBuffering ? (
        <div className="pointer-events-none flex h-14 w-14 items-center justify-center rounded-full bg-black/55"><LoadingSpinner size={30} /></div>
      ) : (
        <div className="pointer-events-auto flex items-center gap-7 sm:gap-12">
          <button type="button" onClick={(event) => { event.stopPropagation(); rewind?.(); }} className={`${controlClass} h-11 w-11 sm:h-12 sm:w-12`} aria-label="Rewind 10 seconds" title="Rewind 10 seconds"><HugeiconsIcon icon={GoBackward10SecIcon} size={21} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); togglePlayPause?.(); }} className={`${controlClass} h-14 w-14 bg-black/65 sm:h-16 sm:w-16`} aria-label={isPlaying ? "Pause" : "Play"}><HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} size={26} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); forward?.(); }} className={`${controlClass} h-11 w-11 sm:h-12 sm:w-12`} aria-label="Forward 10 seconds" title="Forward 10 seconds"><HugeiconsIcon icon={GoForward10SecIcon} size={21} /></button>
        </div>
      )}
    </div>
  );
}
