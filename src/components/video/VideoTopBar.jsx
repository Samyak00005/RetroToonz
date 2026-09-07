import {
  ArrowLeft02Icon,
  VolumeHighIcon,
  VolumeMuteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function VideoTopBar({
  currentShow,
  currentEpisode,
  navigate,
  isMuted,
  volume,
  toggleMute,
  setVolume,
  resetControlsTimer,
  isFullscreen,
}) {
  const showTitle = currentShow?.title || "Show";
  const seasonNumber = currentEpisode?.seasonNumber;
  const episodeNumber = currentEpisode?.episodeNumber;
  const episodeTitle = currentEpisode?.title || "";

  const episodeCode = [
    seasonNumber != null ? `S${String(seasonNumber).padStart(2, "0")}` : "",
    episodeNumber != null ? `E${String(episodeNumber).padStart(2, "0")}` : "",
  ]
    .filter(Boolean)
    .join("");

  const handleBack = (event) => {
    event.stopPropagation();
    if (isFullscreen && document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    if (currentShow?.id) navigate(`/show/${currentShow.id}`);
    else navigate(-1);
  };

  return (
    <div
      data-controls
      className="absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4 lg:px-7"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition hover:bg-white/15"
          aria-label={isFullscreen ? "Exit fullscreen" : "Back to show"}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white sm:text-base">
            {showTitle}
          </p>
          {(episodeCode || episodeTitle) && (
            <p className="truncate text-[11px] text-white/65 sm:text-xs">
              {episodeCode}
              {episodeCode && episodeTitle ? " · " : ""}
              {episodeTitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-white/12 bg-black/30 px-2 py-1.5 backdrop-blur-md sm:flex">
          <button
            type="button"
            onClick={(event) => {
              toggleMute(event);
              resetControlsTimer();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            <HugeiconsIcon
              icon={isMuted || volume === 0 ? VolumeMuteIcon : VolumeHighIcon}
              size={18}
            />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(event) => setVolume(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            className="rt-volume-range w-20 lg:w-24"
            aria-label="Volume"
          />
        </div>

        <button
          type="button"
          onClick={(event) => {
            toggleMute(event);
            resetControlsTimer();
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition hover:bg-white/15 sm:hidden"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <HugeiconsIcon
            icon={isMuted || volume === 0 ? VolumeMuteIcon : VolumeHighIcon}
            size={19}
          />
        </button>
      </div>
    </div>
  );
}
