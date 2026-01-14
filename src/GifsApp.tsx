import { useState } from 'react';

import { CustomHeader } from './shared/components/CustomHeader';
import { SearchBar } from './shared/components/SearchBar';
import { PreviousSearches } from './gifs/components/PreviousSearches';
import { GifList } from './gifs/components/GifList';

import { getGifsByQuery } from './gifs/actions/get-gifs-by-query.action';
import type { Gif } from './gifs/interfaces/gif.interface';

export const GifsApp = () => {
  const [gifs, setGifs] = useState<Gif[]>([]);

  const [previousTerms, setPreviousTerms] = useState<string[]>([]);

  const handleTermClicked = (term: string) => {
    console.log({ term });
  };

  const handleSearch = async (query: string = '') => {
    query = query.toLowerCase().trim();

    if (query.length === 0 || previousTerms.includes(query)) return;

    // if (previousTerms.includes(query)) return;

    setPreviousTerms([query, ...previousTerms].splice(0, 8));

   const gifs = await getGifsByQuery(query);

   setGifs(gifs);
  };
  
  return (
    <>
      {/* Header */}

      <CustomHeader
        title="Gifs Search"
        description="Discover and share the perfect Gifs"
      />

      {/* Search */}
      <SearchBar
        placeholder="Search for gifs..."
        onQuery={(query: string) => handleSearch(query)}
      />

      {/* Previous searches */}
      <PreviousSearches
        searches={previousTerms}
        onLabelClicked={handleTermClicked}
      />

      {/* Gifs Grid */}
      <GifList gifs={gifs} />
    </>
  );
};
