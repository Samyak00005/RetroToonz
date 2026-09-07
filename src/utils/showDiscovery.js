export function parseCompactNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return 0;

  const numeric = Number.parseFloat(normalized);
  if (!Number.isFinite(numeric)) return 0;

  if (normalized.endsWith("m")) return numeric * 1_000_000;
  if (normalized.endsWith("k")) return numeric * 1_000;
  return numeric;
}

export function normalizeSearchText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function episodeSearchText(show) {
  return (show.seasons ?? [])
    .flatMap((season) => season.episodes ?? [])
    .map((episode) => `${episode.title ?? ""} ${episode.synopsis ?? ""}`)
    .join(" ");
}

export function getShowSearchText(show) {
  return normalizeSearchText(
    [
      show.title,
      show.description,
      show.language,
      show.year,
      ...(show.tags ?? []),
      ...(show.seasons ?? []).map((season) => season.title),
      episodeSearchText(show),
    ].join(" "),
  );
}

export function scoreShowForQuery(show, query) {
  const needle = normalizeSearchText(query);
  if (!needle) return 0;

  const words = needle.split(/\s+/).filter(Boolean);
  if (!words.length) return 0;

  const title = normalizeSearchText(show.title);
  const tags = normalizeSearchText((show.tags ?? []).join(" "));
  const language = normalizeSearchText(show.language);
  const description = normalizeSearchText(show.description);
  const episodes = normalizeSearchText(episodeSearchText(show));
  const full = getShowSearchText(show);

  if (!words.every((word) => full.includes(word))) return 0;

  let score = 1;
  if (title === needle) score += 120;
  else if (title.startsWith(needle)) score += 90;
  else if (title.includes(needle)) score += 70;

  words.forEach((word) => {
    if (title.split(" ").includes(word)) score += 18;
    else if (title.includes(word)) score += 12;
    if (tags.includes(word)) score += 8;
    if (language.includes(word)) score += 5;
    if (description.includes(word)) score += 2;
    if (episodes.includes(word)) score += 3;
  });

  score += Math.min(10, Number(show.rating) || 0);
  score += Math.min(8, parseCompactNumber(show.views) / 20_000);
  return score;
}

export function searchShows(shows, query) {
  const needle = normalizeSearchText(query);
  if (!needle) return [];

  return (shows ?? [])
    .map((show) => ({ show, score: scoreShowForQuery(show, needle) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || String(a.show.title).localeCompare(String(b.show.title)))
    .map((entry) => entry.show);
}

export function getGenres(shows) {
  const counts = new Map();
  (shows ?? []).forEach((show) => {
    (show.tags ?? []).forEach((tag) => {
      const label = String(tag).trim();
      if (!label) return;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

export function getLanguages(shows) {
  return [...new Set((shows ?? []).map((show) => String(show.language ?? "").trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

export function getDecades(shows) {
  const decades = new Set();
  (shows ?? []).forEach((show) => {
    const year = Number(show.year);
    if (!Number.isFinite(year) || year <= 0) return;
    decades.add(Math.floor(year / 10) * 10);
  });
  return [...decades].sort((a, b) => b - a);
}

export function filterShows(shows, { genre = "All", language = "All", decade = "All" } = {}) {
  const wantedGenre = normalizeSearchText(genre);
  const wantedLanguage = normalizeSearchText(language);

  return (shows ?? []).filter((show) => {
    if (genre !== "All") {
      const tags = (show.tags ?? []).map(normalizeSearchText);
      if (!tags.includes(wantedGenre)) return false;
    }

    if (language !== "All") {
      if (normalizeSearchText(show.language) !== wantedLanguage) return false;
    }

    if (decade !== "All") {
      const year = Number(show.year) || 0;
      const start = Number(decade);
      if (!Number.isFinite(start) || year < start || year > start + 9) return false;
    }

    return true;
  });
}

export function sortShows(shows, sortBy = "title-asc") {
  return [...(shows ?? [])].sort((a, b) => {
    switch (sortBy) {
      case "title-desc":
        return String(b.title ?? "").localeCompare(String(a.title ?? ""));
      case "year-desc":
        return (Number(b.year) || 0) - (Number(a.year) || 0) || String(a.title).localeCompare(String(b.title));
      case "year-asc":
        return (Number(a.year) || 0) - (Number(b.year) || 0) || String(a.title).localeCompare(String(b.title));
      case "rating-desc":
        return (Number(b.rating) || 0) - (Number(a.rating) || 0) || parseCompactNumber(b.views) - parseCompactNumber(a.views);
      case "views-desc":
        return parseCompactNumber(b.views) - parseCompactNumber(a.views) || (Number(b.rating) || 0) - (Number(a.rating) || 0);
      case "title-asc":
      default:
        return String(a.title ?? "").localeCompare(String(b.title ?? ""));
    }
  });
}

export function getRelatedShows(allShows, referenceShows, limit = 8) {
  const source = (referenceShows ?? []).filter(Boolean);
  if (!source.length) return sortShows(allShows, "views-desc").slice(0, limit);

  const sourceIds = new Set(source.map((show) => String(show.id)));
  const tagWeights = new Map();
  source.forEach((show) => {
    (show.tags ?? []).forEach((tag) => tagWeights.set(tag, (tagWeights.get(tag) ?? 0) + 1));
  });

  return (allShows ?? [])
    .filter((show) => !sourceIds.has(String(show.id)))
    .map((show) => {
      const affinity = (show.tags ?? []).reduce((sum, tag) => sum + (tagWeights.get(tag) ?? 0), 0);
      return {
        show,
        score:
          affinity * 20 +
          (Number(show.rating) || 0) +
          Math.min(8, parseCompactNumber(show.views) / 20_000),
      };
    })
    .sort((a, b) => b.score - a.score || String(a.show.title).localeCompare(String(b.show.title)))
    .slice(0, limit)
    .map((entry) => entry.show);
}
