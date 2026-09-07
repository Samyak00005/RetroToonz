#!/usr/bin/env node

import { mkdir, readdir, rename, rm, stat } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "media-source", "shows");
const OUTPUT_ROOT = path.join(ROOT, "public", "media", "shows");
const SUPPORTED_EXTENSIONS = new Set([".mkv", ".mp4", ".mov", ".m4v", ".webm", ".avi"]);

const args = new Set(process.argv.slice(2));
const FORCE = args.has("--force");
const DRY_RUN = args.has("--dry-run");
const VERBOSE = args.has("--verbose");
const showArgIndex = process.argv.indexOf("--show");
const ONLY_SHOW = showArgIndex >= 0 ? process.argv[showArgIndex + 1] : null;

function printHelp() {
  console.log(`RetroToonz media preparation\n\nUsage:\n  npm run media:prepare\n  npm run media:prepare -- --dry-run\n  npm run media:prepare -- --force\n  npm run media:prepare -- --show doraemon\n  npm run media:prepare -- --verbose\n\nSource files must use this structure:\n  media-source/shows/<show-id>/seasons/sNN/episodes/<show-id>-sNN-eNN.<ext>\n\nOutput is always browser-ready MP4:\n  public/media/shows/<show-id>/seasons/sNN/episodes/<show-id>-sNN-eNN.mp4\n`);
}

if (args.has("--help") || args.has("-h")) {
  printHelp();
  process.exit(0);
}

function commandExists(command) {
  const probe = spawnSync(command, ["-version"], { stdio: "ignore" });
  return probe.status === 0;
}

function run(command, commandArgs, { capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
      windowsHide: false,
    });

    let stdout = "";
    let stderr = "";
    if (capture) {
      child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
      child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    }

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} exited with code ${code}${capture && stderr ? `\n${stderr}` : ""}`));
    });
  });
}

async function walk(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function normalizeSlashes(value) {
  return value.split(path.sep).join("/");
}

function parseEpisodeSource(filePath) {
  const relative = normalizeSlashes(path.relative(SOURCE_ROOT, filePath));
  const match = relative.match(/^([^/]+)\/seasons\/(s\d{2})\/episodes\/([^/]+)-(s\d{2})-(e\d{2})\.[^.]+$/i);
  if (!match) {
    return {
      valid: false,
      relative,
      reason: "Expected <show-id>/seasons/sNN/episodes/<show-id>-sNN-eNN.<ext>",
    };
  }

  const [, folderShowId, folderSeason, filenameShowId, filenameSeason, episode] = match;
  if (folderShowId.toLowerCase() !== filenameShowId.toLowerCase()) {
    return { valid: false, relative, reason: "Show ID in filename does not match the show folder." };
  }
  if (folderSeason.toLowerCase() !== filenameSeason.toLowerCase()) {
    return { valid: false, relative, reason: "Season in filename does not match the season folder." };
  }

  return {
    valid: true,
    relative,
    showId: folderShowId.toLowerCase(),
    season: folderSeason.toLowerCase(),
    episode: episode.toLowerCase(),
    basename: `${folderShowId.toLowerCase()}-${folderSeason.toLowerCase()}-${episode.toLowerCase()}`,
  };
}

async function probeMedia(filePath) {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=codec_type,codec_name,pix_fmt,channels",
    "-of", "json",
    filePath,
  ], { capture: true });

  const data = JSON.parse(stdout || "{}");
  const streams = Array.isArray(data.streams) ? data.streams : [];
  return {
    video: streams.find((stream) => stream.codec_type === "video") || null,
    audio: streams.find((stream) => stream.codec_type === "audio") || null,
  };
}

function chooseMode(probe) {
  if (!probe.video) return { mode: "invalid", reason: "No video stream found." };

  const videoCompatible = probe.video.codec_name === "h264" && probe.video.pix_fmt === "yuv420p";
  const audioCompatible = !probe.audio || (probe.audio.codec_name === "aac" && Number(probe.audio.channels || 2) <= 2);

  if (videoCompatible && audioCompatible) {
    return { mode: "remux", reason: "H.264/yuv420p + AAC already browser compatible." };
  }
  if (videoCompatible && !audioCompatible) {
    return { mode: "audio-only", reason: `Video is compatible; audio ${probe.audio?.codec_name || "unknown"} will be converted to AAC.` };
  }
  if (!videoCompatible && audioCompatible) {
    return { mode: "video-only", reason: `Video ${probe.video.codec_name}/${probe.video.pix_fmt || "unknown"} will be converted to H.264/yuv420p.` };
  }
  return {
    mode: "full",
    reason: `Video ${probe.video.codec_name}/${probe.video.pix_fmt || "unknown"} and audio ${probe.audio?.codec_name || "none"} need normalization.`,
  };
}

function buildFfmpegArgs(inputPath, outputPath, mode, hasAudio) {
  const args = ["-hide_banner", "-loglevel", "warning", "-stats", "-y", "-i", inputPath, "-map", "0:v:0"];
  if (hasAudio) args.push("-map", "0:a:0?");
  args.push("-sn", "-dn", "-map_metadata", "-1");

  if (mode === "remux") {
    args.push("-c:v", "copy");
    if (hasAudio) args.push("-c:a", "copy");
  } else if (mode === "audio-only") {
    args.push("-c:v", "copy");
    if (hasAudio) args.push("-c:a", "aac", "-b:a", "192k", "-ac", "2");
  } else {
    args.push(
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "20",
      "-pix_fmt", "yuv420p",
      "-profile:v", "high",
    );
    if (hasAudio) {
      if (mode === "video-only") args.push("-c:a", "copy");
      else args.push("-c:a", "aac", "-b:a", "192k", "-ac", "2");
    }
  }

  args.push("-movflags", "+faststart", outputPath);
  return args;
}

async function shouldSkip(inputPath, outputPath) {
  if (FORCE) return false;
  try {
    const [inputStat, outputStat] = await Promise.all([stat(inputPath), stat(outputPath)]);
    return outputStat.size > 0 && outputStat.mtimeMs >= inputStat.mtimeMs;
  } catch {
    return false;
  }
}

async function processFile(filePath, parsed) {
  const outputDirectory = path.join(OUTPUT_ROOT, parsed.showId, "seasons", parsed.season, "episodes");
  const outputPath = path.join(outputDirectory, `${parsed.basename}.mp4`);
  const temporaryPath = path.join(outputDirectory, `.${parsed.basename}.retrotoonz-preparing.mp4`);

  if (await shouldSkip(filePath, outputPath)) {
    console.log(`SKIP  ${parsed.relative} (output is up to date)`);
    return "skipped";
  }

  const probe = await probeMedia(filePath);
  const decision = chooseMode(probe);
  if (decision.mode === "invalid") throw new Error(decision.reason);

  const label = decision.mode === "remux"
    ? "REMUX"
    : decision.mode === "audio-only"
      ? "AUDIO"
      : decision.mode === "video-only"
        ? "VIDEO"
        : "ENCODE";

  console.log(`${label.padEnd(6)} ${parsed.relative}`);
  if (VERBOSE) console.log(`       ${decision.reason}`);
  console.log(`       -> ${normalizeSlashes(path.relative(ROOT, outputPath))}`);

  if (DRY_RUN) return "planned";

  await mkdir(outputDirectory, { recursive: true });
  await rm(temporaryPath, { force: true });

  const ffmpegArgs = buildFfmpegArgs(filePath, temporaryPath, decision.mode, Boolean(probe.audio));
  await run("ffmpeg", ffmpegArgs);

  await rm(outputPath, { force: true });
  await rename(temporaryPath, outputPath);
  return "prepared";
}

async function main() {
  console.log("RetroToonz local media pipeline");
  console.log("Source : media-source/shows/");
  console.log("Output : public/media/shows/");
  if (ONLY_SHOW) console.log(`Filter : ${ONLY_SHOW}`);
  if (DRY_RUN) console.log("Mode   : dry run (no files will be written)");
  console.log("");

  if (!commandExists("ffmpeg") || !commandExists("ffprobe")) {
    console.error("ERROR: FFmpeg and FFprobe must be installed and available in PATH.");
    console.error("See docs/LOCAL_MEDIA_PIPELINE.md for Windows installation/setup guidance.");
    process.exit(1);
  }

  const files = (await walk(SOURCE_ROOT))
    .filter((filePath) => SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  if (!files.length) {
    console.log("No source videos found.");
    console.log("Put MKV/MP4 source episodes under media-source/shows/<show-id>/seasons/sNN/episodes/ and run again.");
    return;
  }

  const summary = { prepared: 0, skipped: 0, planned: 0, failed: 0, invalidName: 0 };

  for (const filePath of files) {
    const parsed = parseEpisodeSource(filePath);
    if (!parsed.valid) {
      console.error(`NAME   ${parsed.relative}`);
      console.error(`       ${parsed.reason}`);
      summary.invalidName += 1;
      continue;
    }
    if (ONLY_SHOW && parsed.showId !== ONLY_SHOW.toLowerCase()) continue;

    try {
      const result = await processFile(filePath, parsed);
      summary[result] += 1;
    } catch (error) {
      summary.failed += 1;
      console.error(`FAIL   ${parsed.relative}`);
      console.error(`       ${error.message}`);
    }
  }

  console.log("\nSummary");
  console.log(`  Prepared : ${summary.prepared}`);
  console.log(`  Skipped  : ${summary.skipped}`);
  if (DRY_RUN) console.log(`  Planned  : ${summary.planned}`);
  console.log(`  Bad names: ${summary.invalidName}`);
  console.log(`  Failed   : ${summary.failed}`);

  if (summary.failed || summary.invalidName) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
