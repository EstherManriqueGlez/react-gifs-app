import { useCallback, useEffect, useRef, useState } from 'react';

import { getGifsByQuery } from '../actions/get-gifs-by-query.action';
import type { GifsSearchResult } from '../actions/get-gifs-by-query.action';
import type { Gif } from '../interfaces/gif.interface';
import {
  loadPreviousTerms,
  savePreviousTerms,
  MAX_PREVIOUS_TERMS,
} from '../utils/previous-searches';

const PAGE_SIZE = 12;

export const useGifs = () => {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [previousTerms, setPreviousTerms] = useState<string[]>(loadPreviousTerms);
  const [currentTerm, setCurrentTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In-memory cache of GIFs keyed by search term (first page only).
  const gifsCache = useRef<Record<string, Gif[]>>({});
  // Monotonic id used to ignore stale (out-of-order) responses.
  const requestId = useRef(0);

  useEffect(() => {
    savePreviousTerms(previousTerms);
  }, [previousTerms]);

  const applyResult = useCallback((result: GifsSearchResult) => {
    setTotal(result.total);
    setHasMore(result.gifs.length < result.total);
  }, []);

  const search = useCallback(async (term: string) => {
    const query = term.toLowerCase().trim();

    if (query.length === 0) return;

    const id = ++requestId.current;
    setCurrentTerm(query);
    setError(null);
    setTotal(0);
    setHasMore(false);
    setIsLoadingMore(false);

    if (gifsCache.current[query]) {
      setGifs(gifsCache.current[query]);
      setIsLoading(false);
      setIsLoadingMore(false);
      return;
    }

    setIsLoading(true);

    try {
      const result = await getGifsByQuery(query);

      // Discard the response if a newer search was requested meanwhile.
      if (id !== requestId.current) return;

      gifsCache.current[query] = result.gifs;
      setGifs(result.gifs);
      applyResult(result);
    } catch {
      if (id !== requestId.current) return;

      setGifs([]);
      setError('Something went wrong while searching. Please try again.');
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [applyResult]);

  const loadMore = useCallback(async () => {
    if (!currentTerm || isLoading || isLoadingMore || !hasMore) return;

    const offset = gifs.length;
    const id = ++requestId.current;
    setIsLoadingMore(true);

    try {
      const result = await getGifsByQuery(currentTerm, { limit: PAGE_SIZE, offset });

      // Discard the response if a newer search was requested meanwhile.
      if (id !== requestId.current) return;

      setGifs((prev) => {
        const seen = new Set(prev.map((gif) => gif.id));
        const fresh = result.gifs.filter((gif) => !seen.has(gif.id));
        return [...prev, ...fresh];
      });
      setTotal(result.total);
      setHasMore(offset + result.gifs.length < result.total);
    } catch {
      if (id !== requestId.current) return;

      setError('Something went wrong while loading more. Please try again.');
    } finally {
      if (id === requestId.current) setIsLoadingMore(false);
    }
  }, [currentTerm, gifs.length, hasMore, isLoading, isLoadingMore]);

  const handleSearch = useCallback(
    (term: string) => {
      const query = term.toLowerCase().trim();

      if (query.length === 0) return;

      setPreviousTerms((prev) =>
        prev.includes(query) ? prev : [query, ...prev].slice(0, MAX_PREVIOUS_TERMS),
      );

      void search(query);
    },
    [search],
  );

  const handleTermClicked = useCallback(
    (term: string) => {
      void search(term);
    },
    [search],
  );

  return {
    // Values or Properties
    gifs,
    previousTerms,
    currentTerm,
    isLoading,
    isLoadingMore,
    total,
    hasMore,
    error,

    // Methods or Functions
    handleTermClicked,
    handleSearch,
    loadMore,
  };
};