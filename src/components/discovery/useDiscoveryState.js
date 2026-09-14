import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export default function useDiscoveryState({ defaultSort = "title-asc" } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const genre = searchParams.get("genre") || "All";
  const language = searchParams.get("language") || "All";
  const decade = searchParams.get("decade") || "All";
  const sortBy = searchParams.get("sort") || defaultSort;

  const updateParam = useCallback((key, value, defaultValue = "All") => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (!value || value === defaultValue) next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setGenre = useCallback((value) => updateParam("genre", value), [updateParam]);
  const setLanguage = useCallback((value) => updateParam("language", value), [updateParam]);
  const setDecade = useCallback((value) => updateParam("decade", value), [updateParam]);
  const setSortBy = useCallback((value) => updateParam("sort", value, defaultSort), [defaultSort, updateParam]);

  const clearFilters = useCallback(() => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete("genre");
      next.delete("language");
      next.delete("decade");
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  return {
    genre,
    language,
    decade,
    sortBy,
    setGenre,
    setLanguage,
    setDecade,
    setSortBy,
    clearFilters,
  };
}
