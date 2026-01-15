import { useRef, useState } from 'react';

import { getGifsByQuery } from '../actions/get-gifs-by-query.action';
import type { Gif } from '../interfaces/gif.interface';


// This is one way to cache gifs in memory during the app's lifecycle
// const gifsCache: Record<string, Gif[]> = {};

export const useGifs = () => {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);

  // This is another way to cache gifs in memory during the app's lifecycle
  const gifsCache = useRef<Record<string, Gif[]>>({});

  const handleTermClicked = async (term: string) => {
    if (gifsCache.current[term]) {
      setGifs(gifsCache.current[term]);
      return;
    }

    const gifs = await getGifsByQuery(term);

    setGifs(gifs);
  };

  const handleSearch = async (query: string = '') => {
    query = query.toLowerCase().trim();

    if (query.length === 0 || previousTerms.includes(query)) return;

    // if (previousTerms.includes(query)) return;

    setPreviousTerms([query, ...previousTerms].splice(0, 8));

    const gifs = await getGifsByQuery(query);

    setGifs(gifs);

    gifsCache.current[query] = gifs;
    console.log(gifsCache);
  };
  return {
    // Values or Properties
    gifs,
    previousTerms,
    // Methods or Functions
    handleTermClicked,
    handleSearch,
  };
};
