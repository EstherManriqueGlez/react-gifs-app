import { useState } from 'react';

import { mockGifs } from './mock-data/gifs.mock';
import { CustomHeader } from './shared/components/CustomHeader';
import { SearchBar } from './shared/components/SearchBar';
import { PreviousSearches } from './gifs/components/PreviousSearches';
import { GifList } from './gifs/components/GifList';

export const GifsApp = () => {
  const [previousTerms, setPreviousTerms] = useState(['dragon ball z']);

  const handleTermClicked = (term: string) => {
    console.log({ term });
  };

  const handleSearch = (query: string = '') => {
    query = query.toLowerCase().trim();

    if (query.length === 0 || previousTerms.includes(query)) return;

    // if (previousTerms.includes(query)) return;

    setPreviousTerms([query, ...previousTerms].splice(0, 8));
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
      <GifList gifs={mockGifs} />
    </>
  );
};
