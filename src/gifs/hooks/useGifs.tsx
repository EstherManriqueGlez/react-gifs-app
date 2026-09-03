import { useCallback, useEffect, useRef, useState } from 'react';

import { getGifsByQuery } from '../actions/get-gifs-by-query.action';
import type { Gif } from '../interfaces/gif.interface';
import {
  loadPreviousTerms,
  savePreviousTerms,
  MAX_PREVIOUS_TERMS,
} from '../utils/previous-searches';

export const useGifs = () => {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [previousTerms, setPreviousTerms] = useState<string[]>(loadPreviousTerms);
  const [currentTerm, setCurrentTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In-memory cache of GIFs keyed by search term.
  const gifsCache = useRef<Record<string, Gif[]>>({});
  // Monotonic id used to ignore stale (out-of-order) responses.
  const requestId = useRef(0);

  useEffect(() => {
    savePreviousTerms(previousTerms);
  }, [previousTerms]);

  const search = useCallback(async (term: string) => {
    const query = term.toLowerCase().trim();

    if (query.length === 0) return;

    const id = ++requestId.current;
    setCurrentTerm(query);
    setError(null);

    if (gifsCache.current[query]) {
      setGifs(gifsCache.current[query]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const result = await getGifsByQuery(query);

      // Discard the response if a newer search was requested meanwhile.
      if (id !== requestId.current) return;

      gifsCache.current[query] = result;
      setGifs(result);
    } catch {
      if (id !== requestId.current) return;

      setGifs([]);
      setError('Something went wrong while searching. Please try again.');
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, []);

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
    error,

    // Methods or Functions
    handleTermClicked,
    handleSearch,
  };
};
