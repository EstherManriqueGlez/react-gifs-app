import { useState } from 'react';

import type { Gif } from '../interfaces/gif.interface';
import { getGifsByQuery } from '../actions/get-gifs-by-query.action';

export const useGifs = () => {
  const [gifs, setGifs] = useState<Gif[]>([]);

  const [previousTerms, setPreviousTerms] = useState<string[]>([]);

  const handleTermClicked = async (term: string) => {
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
