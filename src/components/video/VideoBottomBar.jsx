import {
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  ArrowShrinkIcon,
  FullScreenIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const rates = [0.75, 1, 1.25, 1.5, 2];

export default function VideoBottomBar({
  currentTime,
  duration,
  dragSeekTime,
  setDragSeekTime,
  onSeek,
  formatTime,
  progressBackground,
  goToNextEpisode,
  goToPreviousEpisode,
  canGoNext,
  canGoPrevious,
  toggleFullscreen,
  isFullscreen,
  qualities = [],
  selectedQuality,
  onQualityChange,
  playbackRate,
  onPlaybackRateChange,
}) {
  const value = dragSeekTime ?? currentTime ?? 0;
  const percentage = duration > 0 ? Math.min(100, (value / duration) * 100) : 0;
  const trackBackground =
    progressBackground ||
    `linear-gradient(90deg, #45d8eb ${percentage}%, rgba(255,255,255,.12) ${percentage}%)`;

  const finishSeek = (rawValue) => {
    const next = Number.parseFloat(rawValue) || 0;
    onSeek?.(next);
    setDragSeekTime(null);
  };

  return (
    <div
      data-controls
      className="absolute inset-x-0 bottom-0 z-40 px-3 pb-3 pt-5 sm:px-5 sm:pb-4 lg:px-7 lg:pb-5"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="w-11 shrink-0 select-none text-left text-[10px] tabular-nums text-white/75 sm:w-12 sm:text-xs">
          {formatTime(value)}
        </span>

        <input
          aria-label="Seek video"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={value}
          onChange={(event) =>
            setDragSeekTime(Number.parseFloat(event.target.value))
          }
          onMouseUp={(event) => finishSeek(event.currentTarget.value)}
          onTouchEnd={(event) => finishSeek(event.currentTarget.value)}
          className="rt-video-range flex-1"
          style={{ background: trackBackground }}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        />

        <span className="w-11 shrink-0 select-none text-right text-[10px] tabular-nums text-white/75 sm:w-12 sm:text-xs">
          {formatTime(duration)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
        <div className="flex items-center overflow-hidden rounded-[var(--rt-radius-control)] border border-white/12 bg-black/30 backdrop-blur-md">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (canGoPrevious) goToPreviousEpisode?.();
            }}
            disabled={!canGoPrevious}
            aria-label="Previous episode"
            className="flex min-h-9 items-center gap-1.5 px-2.5 text-xs font-medium text-white/85 transition hover:bg-white/12 disabled:text-white/25 sm:px-3"
          >
            <HugeiconsIcon icon={ArrowLeftDoubleIcon} size={18} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="h-6 w-px bg-white/12" />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (canGoNext) goToNextEpisode?.();
            }}
            disabled={!canGoNext}
            aria-label="Next episode"
            className="flex min-h-9 items-center gap-1.5 px-2.5 text-xs font-medium text-white/85 transition hover:bg-white/12 disabled:text-white/25 sm:px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <HugeiconsIcon icon={ArrowRightDoubleIcon} size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Playback speed"
            value={playbackRate}
            onChange={(event) => onPlaybackRateChange?.(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            className="hidden h-9 rounded-[var(--rt-radius-control)] border border-white/12 bg-black/35 px-2 text-xs text-white outline-none backdrop-blur-md sm:block"
          >
            {rates.map((rate) => (
              <option key={rate} value={rate} className="bg-slate-900">
                {rate}×
              </option>
            ))}
          </select>

          {qualities.length > 1 && (
            <select
              aria-label="Video quality"
              value={selectedQuality}
              onChange={(event) => onQualityChange?.(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              className="hidden h-9 rounded-[var(--rt-radius-control)] border border-white/12 bg-black/35 px-2 text-xs text-white outline-none backdrop-blur-md md:block"
            >
              {qualities.map((quality) => (
                <option
                  key={quality.label || quality.url}
                  value={quality.label}
                  className="bg-slate-900"
                >
                  {quality.label || "Auto"}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={(event) => toggleFullscreen?.(event)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title="Fullscreen (F)"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/30 text-white/85 backdrop-blur-md transition hover:bg-white/12 hover:text-white"
          >
            <HugeiconsIcon
              icon={isFullscreen ? ArrowShrinkIcon : FullScreenIcon}
              size={19}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
