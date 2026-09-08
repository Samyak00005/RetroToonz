import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getPlaybackProgress,
  markPlaybackCompleted,
  savePlaybackProgress,
} from "../../services/libraryService.js";
import { getFallbackImageUrl, getMediaUrl } from "../../services/mediaService.js";
import VideoBottomBar from "./VideoBottomBar.jsx";
import VideoCenterControls from "./VideoCenterControls.jsx";
import VideoTopBar from "./VideoTopBar.jsx";

const CONTROL_HIDE_MS = 3600;
const PROGRESS_SAVE_INTERVAL_MS = 4000;

export default function VideoPlayer({
  currentShow,
  startEpisode,
  goToNextEpisode,
  goToPreviousEpisode,
  canGoNext = false,
  canGoPrevious = false,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const lastSavedRef = useRef(0);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const isPlayingRef = useRef(false);
  const pendingSeekRef = useRef(null);
  const resumeAfterSourceChangeRef = useRef(false);
  const resumeAppliedRef = useRef(false);
  const volumeRef = useRef(1);
  const mutedRef = useRef(false);
  const playbackRateRef = useRef(1);

  const tapTimeoutRef = useRef(null);
  const lastTapRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qualities, setQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState("Auto");
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [progressBackground, setProgressBackground] = useState("");
  const [seekFeedback, setSeekFeedback] = useState(null);
  const [dragSeekTime, setDragSeekTime] = useState(null);
  const [mediaError, setMediaError] = useState("");

  const showId = currentShow?.id || "";
  const episodeId = startEpisode?.episodeId || "";
  const seasonNumber = startEpisode?.seasonNumber ?? null;
  const episodeNumber = startEpisode?.episodeNumber ?? null;
  const episodeTitle = startEpisode?.title || "";

  const clearControlsTimeout = useCallback(() => {
    if (!controlsTimeoutRef.current) return;
    window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = null;
  }, []);

  const resetControlsTimer = useCallback(
    (ms = CONTROL_HIDE_MS) => {
      setShowControls(true);
      clearControlsTimeout();

      if (!isPlayingRef.current) return;
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
        controlsTimeoutRef.current = null;
      }, ms);
    },
    [clearControlsTimeout],
  );

  const persistProgress = useCallback(
    (force = false) => {
      if (!showId || !episodeId) return;

      const now = Date.now();
      if (!force && now - lastSavedRef.current < PROGRESS_SAVE_INTERVAL_MS) return;

      const safeTime = currentTimeRef.current;
      if (!Number.isFinite(safeTime) || safeTime < 1) return;

      savePlaybackProgress({
        showId,
        episodeId,
        currentTime: safeTime,
        duration: durationRef.current,
        seasonNumber,
        episodeNumber,
        episodeTitle,
      });
      lastSavedRef.current = now;
    },
    [episodeId, episodeNumber, episodeTitle, seasonNumber, showId],
  );

  const setPlayingState = useCallback((value) => {
    isPlayingRef.current = value;
    setIsPlaying(value);
  }, []);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setMediaError("");
      setIsBuffering(true);
      video
        .play()
        .then(() => setPlayingState(true))
        .catch(() => {
          setIsBuffering(false);
          setPlayingState(false);
          setShowControls(true);
        });
    } else {
      video.pause();
      setPlayingState(false);
      persistProgress(true);
    }

    resetControlsTimer();
  }, [persistProgress, resetControlsTimer, setPlayingState]);

  const seekTo = useCallback(
    (newTime) => {
      const video = videoRef.current;
      if (!video) return;

      const maxTime = durationRef.current || video.duration || 0;
      const nextTime = Math.min(maxTime || Number.MAX_SAFE_INTEGER, Math.max(0, Number(newTime) || 0));
      video.currentTime = nextTime;
      currentTimeRef.current = nextTime;
      setCurrentTime(nextTime);
      persistProgress(true);
      resetControlsTimer();
    },
    [persistProgress, resetControlsTimer],
  );

  const seekBy = useCallback(
    (seconds) => {
      const video = videoRef.current;
      if (!video) return;
      seekTo((video.currentTime || 0) + seconds);
      setSeekFeedback(seconds < 0 ? `${seconds}s` : `+${seconds}s`);
      window.setTimeout(() => setSeekFeedback(null), 650);
    },
    [seekTo],
  );

  const toggleMute = useCallback(
    (event) => {
      event?.stopPropagation?.();
      const video = videoRef.current;
      if (!video) return;

      video.muted = !video.muted;
      mutedRef.current = video.muted;
      setIsMuted(video.muted);
      if (!video.muted && video.volume === 0) {
        video.volume = 1;
        volumeRef.current = 1;
        setVolume(1);
      }
      resetControlsTimer();
    },
    [resetControlsTimer],
  );

  const setVolumeLevel = useCallback(
    (value) => {
      const video = videoRef.current;
      const next = Math.min(1, Math.max(0, Number(value) || 0));
      if (video) {
        video.volume = next;
        video.muted = next === 0;
      }
      volumeRef.current = next;
      mutedRef.current = next === 0;
      setVolume(next);
      setIsMuted(next === 0);
      resetControlsTimer();
    },
    [resetControlsTimer],
  );

  const toggleFullscreen = useCallback(
    async (event) => {
      event?.stopPropagation?.();
      const container = containerRef.current;
      if (!container) return;

      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await container.requestFullscreen();
          if (window.screen?.orientation?.lock) {
            window.screen.orientation.lock("landscape").catch(() => {});
          }
        }
      } catch {
        // Fullscreen can be blocked by the browser/device; the player remains usable.
      }
      resetControlsTimer();
    },
    [resetControlsTimer],
  );

  const updateProgressBackground = useCallback(() => {
    const video = videoRef.current;
    const total = durationRef.current;
    if (!video || !total) {
      setProgressBackground("");
      return;
    }

    const playedPct = Math.min(100, ((video.currentTime || 0) / total) * 100);
    let bufferedEnd = 0;

    try {
      for (let index = 0; index < video.buffered.length; index += 1) {
        bufferedEnd = Math.max(bufferedEnd, video.buffered.end(index));
      }
    } catch {
      bufferedEnd = 0;
    }

    const bufferedPct = Math.min(100, (bufferedEnd / total) * 100);
    const played = Math.min(playedPct, bufferedPct || playedPct);
    const buffered = Math.max(playedPct, bufferedPct);

    setProgressBackground(
      `linear-gradient(90deg, #45d8eb 0% ${played}%, rgba(255,255,255,.26) ${played}% ${buffered}%, rgba(255,255,255,.10) ${buffered}% 100%)`,
    );
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const loadedDuration = Number(video.duration || 0);
    durationRef.current = loadedDuration;
    setDuration(loadedDuration);

    if (pendingSeekRef.current != null) {
      const seekValue = Math.min(
        Math.max(0, Number(pendingSeekRef.current) || 0),
        Math.max(0, loadedDuration - 1),
      );
      video.currentTime = seekValue;
      currentTimeRef.current = seekValue;
      setCurrentTime(seekValue);
      pendingSeekRef.current = null;

      if (resumeAfterSourceChangeRef.current) {
        resumeAfterSourceChangeRef.current = false;
        video.play().catch(() => setPlayingState(false));
      }
      updateProgressBackground();
      return;
    }

    if (!resumeAppliedRef.current && showId && episodeId) {
      const saved = getPlaybackProgress(showId);
      if (
        saved &&
        saved.episodeId === episodeId &&
        !saved.completed &&
        Number(saved.currentTime || 0) >= 5 &&
        (!loadedDuration || Number(saved.currentTime) < loadedDuration - 8)
      ) {
        const resumeTime = Math.min(
          Number(saved.currentTime || 0),
          Math.max(0, loadedDuration - 2),
        );
        video.currentTime = resumeTime;
        currentTimeRef.current = resumeTime;
        setCurrentTime(resumeTime);
      }
      resumeAppliedRef.current = true;
    }

    updateProgressBackground();
  }, [episodeId, setPlayingState, showId, updateProgressBackground]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const nextTime = Number(video.currentTime || 0);
    currentTimeRef.current = nextTime;
    setCurrentTime(nextTime);
    updateProgressBackground();
    persistProgress(false);
  }, [persistProgress, updateProgressBackground]);

  const handleVideoEnd = useCallback(() => {
    setPlayingState(false);
    setIsBuffering(false);

    if (showId && episodeId) {
      markPlaybackCompleted({
        showId,
        episodeId,
        duration: durationRef.current,
        seasonNumber,
        episodeNumber,
        episodeTitle,
      });
    }

    if (canGoNext && typeof goToNextEpisode === "function") {
      goToNextEpisode();
    } else {
      setShowControls(true);
    }
  }, [
    canGoNext,
    episodeId,
    episodeNumber,
    episodeTitle,
    goToNextEpisode,
    seasonNumber,
    setPlayingState,
    showId,
  ]);

  const changeQuality = useCallback(
    (label) => {
      const quality = qualities.find((item) => item.label === label);
      const video = videoRef.current;
      if (!quality?.url || !video) {
        setSelectedQuality(label);
        return;
      }

      const wasPlaying = !video.paused;
      pendingSeekRef.current = video.currentTime || 0;
      resumeAfterSourceChangeRef.current = wasPlaying;
      setSelectedQuality(quality.label || label);
      setIsBuffering(true);
      setMediaError("");
      video.src = quality.url;
      video.load();
      resetControlsTimer();
    },
    [qualities, resetControlsTimer],
  );

  const changePlaybackRate = useCallback(
    (rate) => {
      const nextRate = Number(rate) || 1;
      const video = videoRef.current;
      if (video) video.playbackRate = nextRate;
      playbackRateRef.current = nextRate;
      setPlaybackRateState(nextRate);
      resetControlsTimer();
    },
    [resetControlsTimer],
  );

  useEffect(() => {
    const episodeQualities = Array.isArray(startEpisode?.qualities)
      ? startEpisode.qualities.filter((item) => item?.url)
      : [];
    const showQualities = Array.isArray(currentShow?.qualities)
      ? currentShow.qualities.filter((item) => item?.url)
      : [];

    let nextQualities = episodeQualities.length ? episodeQualities : showQualities;
    if (!nextQualities.length) {
      const sourceUrl = startEpisode?.videoUrl || currentShow?.videoUrl;
      nextQualities = sourceUrl ? [{ label: "Auto", url: sourceUrl }] : [];
    }

    nextQualities = nextQualities.map((quality, index) => ({
      ...quality,
      label: quality.label || (index === 0 ? "Auto" : `Quality ${index + 1}`),
    }));

    setQualities(nextQualities);
    setSelectedQuality(nextQualities[0]?.label || "Auto");
    setMediaError("");
    setIsBuffering(Boolean(nextQualities[0]?.url));
    setPlayingState(false);
    setCurrentTime(0);
    setDuration(0);
    currentTimeRef.current = 0;
    durationRef.current = 0;
    lastSavedRef.current = 0;
    resumeAppliedRef.current = false;
    pendingSeekRef.current = null;
    resumeAfterSourceChangeRef.current = false;
    setShowControls(true);
    clearControlsTimeout();

    const video = videoRef.current;
    const sourceUrl = nextQualities[0]?.url;

    if (!video || !sourceUrl) {
      setIsBuffering(false);
      setMediaError("Media file not included in this project copy.");
      return undefined;
    }

    video.src = sourceUrl;
    video.playbackRate = playbackRateRef.current;
    video.volume = volumeRef.current;
    video.muted = mutedRef.current;
    video.load();
    video
      .play()
      .then(() => {
        setPlayingState(true);
        resetControlsTimer();
      })
      .catch(() => {
        setIsBuffering(false);
        setPlayingState(false);
        setShowControls(true);
      });

    return () => {
      persistProgress(true);
      clearControlsTimeout();
    };
  }, [
    clearControlsTimeout,
    currentShow,
    persistProgress,
    resetControlsTimer,
    setPlayingState,
    startEpisode,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      resetControlsTimer();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [resetControlsTimer]);

  useEffect(() => {
    const handlePageHide = () => persistProgress(true);
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [persistProgress]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeTag = document.activeElement?.tagName;
      if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(activeTag)) return;

      if (event.code === "Space") {
        event.preventDefault();
        togglePlayPause();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        seekBy(-10);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        seekBy(10);
      } else if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      } else if (event.key.toLowerCase() === "m") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [seekBy, toggleFullscreen, toggleMute, togglePlayPause]);

  const handleTouchStart = (event) => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = video.currentTime || 0;

    const now = Date.now();
    const delta = now - lastTapRef.current;
    lastTapRef.current = now;

    if (tapTimeoutRef.current) window.clearTimeout(tapTimeoutRef.current);

    if (delta < 300) {
      const rect = container.getBoundingClientRect();
      const zone = (touch.clientX - rect.left) / rect.width;
      if (zone < 0.33) seekBy(-10);
      else if (zone > 0.66) seekBy(10);
      else togglePlayPause();
      return;
    }

    tapTimeoutRef.current = window.setTimeout(() => {
      setShowControls((visible) => {
        const next = !visible;
        if (next) resetControlsTimer();
        else clearControlsTimeout();
        return next;
      });
      tapTimeoutRef.current = null;
    }, 300);
  };

  const handleTouchMove = (event) => {
    const container = containerRef.current;
    if (!container || !durationRef.current) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

    const rect = container.getBoundingClientRect();
    const seekDelta = (deltaX / rect.width) * durationRef.current;
    const preview = Math.min(
      durationRef.current,
      Math.max(0, touchStartTime.current + seekDelta),
    );
    setDragSeekTime(preview);
    setSeekFeedback(formatTime(preview));
    resetControlsTimer(2200);
  };

  const handleTouchEnd = () => {
    if (dragSeekTime != null) seekTo(dragSeekTime);
    setDragSeekTime(null);
    window.setTimeout(() => setSeekFeedback(null), 450);
  };

  const handlePlayerClick = (event) => {
    if (event.target.closest?.("[data-controls]")) return;
    if (!showControls) resetControlsTimer();
    else if (isPlayingRef.current) {
      clearControlsTimeout();
      setShowControls(false);
    }
  };

  const formatTime = (time = 0) => {
    if (!Number.isFinite(time) || time <= 0) return "00:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  };

  const fallbackVisual = getMediaUrl(
    startEpisode?.thumbnail ||
      startEpisode?.backdrop ||
      currentShow?.backdrop ||
      currentShow?.poster ||
      getFallbackImageUrl(),
  );

  return (
    <div
      ref={containerRef}
      className={`rt-player-shell relative w-full overflow-hidden text-white ${
        isFullscreen
          ? "h-screen rounded-none"
          : "aspect-video rounded-none lg:aspect-[23/9]"
      }`}
      onClick={handlePlayerClick}
      onMouseMove={() => isPlayingRef.current && resetControlsTimer()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full bg-black object-contain"
        controls={false}
        autoPlay
        playsInline
        preload="metadata"
        onLoadStart={() => setIsBuffering(true)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPlaying={() => {
          setIsBuffering(false);
          setPlayingState(true);
          resetControlsTimer();
        }}
        onPause={() => {
          setPlayingState(false);
          setShowControls(true);
          persistProgress(true);
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={updateProgressBackground}
        onEnded={handleVideoEnd}
        onError={() => {
          setIsBuffering(false);
          setPlayingState(false);
          setShowControls(true);
          setMediaError("Media file not included in this project copy.");
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-black/5" />

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-black/80 via-black/35 to-transparent transition-opacity duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className={`transition-opacity duration-200 ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <VideoTopBar
          currentShow={currentShow}
          currentEpisode={startEpisode}
          isFullscreen={isFullscreen}
          navigate={navigate}
          isMuted={isMuted}
          volume={volume}
          toggleMute={toggleMute}
          setVolume={setVolumeLevel}
          resetControlsTimer={resetControlsTimer}
        />
      </div>

      <VideoCenterControls
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        rewind={() => seekBy(-10)}
        forward={() => seekBy(10)}
        isBuffering={isBuffering}
        showControls={showControls || !isPlaying}
      />

      {seekFeedback && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
          <div className="rounded-[var(--rt-radius-control)] border border-white/15 bg-[#081526]/80 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-lg">
            {seekFeedback}
          </div>
        </div>
      )}

      {mediaError && (
        <div
          className="absolute inset-0 z-[55] overflow-hidden bg-[#030713]"
          onClick={(event) => event.stopPropagation()}
        >
          <img
            src={fallbackVisual}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-45 blur-[1px]"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getFallbackImageUrl();
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35" />

          <div className="relative flex h-full items-end p-5 sm:p-7 lg:p-9">
            <div className="max-w-xl rounded-2xl border border-white/10 bg-black/45 p-5 text-left shadow-2xl backdrop-blur-xl sm:p-6">
              <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                Development media
              </span>
              <h2 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
                {startEpisode?.title || "Episode media not included"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/65">
                The video files were intentionally removed from this lightweight project package.
                Restore the configured file inside <span className="text-white/85">public/media</span> and the player will use it automatically.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  className="rt-button rt-button-secondary"
                  onClick={() => navigate(`/show/${currentShow.id}`)}
                >
                  Back to show
                </button>
                {canGoNext && (
                  <button
                    type="button"
                    className="rt-button rt-button-ghost"
                    onClick={() => goToNextEpisode?.()}
                  >
                    Next episode
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`transition-opacity duration-200 ${showControls ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <VideoBottomBar
          currentTime={currentTime}
          duration={duration}
          dragSeekTime={dragSeekTime}
          setDragSeekTime={setDragSeekTime}
          onSeek={seekTo}
          formatTime={formatTime}
          progressBackground={progressBackground}
          goToNextEpisode={goToNextEpisode}
          goToPreviousEpisode={goToPreviousEpisode}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          qualities={qualities}
          selectedQuality={selectedQuality}
          onQualityChange={changeQuality}
          playbackRate={playbackRate}
          onPlaybackRateChange={changePlaybackRate}
        />
      </div>
    </div>
  );
}
