import { useState } from 'react';

import { CustomHeader } from './shared/components/CustomHeader';
import { SearchBar } from './shared/components/SearchBar';
import { PreviousSearches } from './gifs/components/PreviousSearches';
import { GifList } from './gifs/components/GifList';
import { GifGridSkeleton } from './gifs/components/GifGridSkeleton';
import { GifEmptyState } from './gifs/components/GifEmptyState';
import { GifErrorState } from './gifs/components/GifErrorState';
import { GifModal } from './gifs/components/GifModal';
import { useGifs } from './gifs/hooks/useGifs';
import type { Gif } from './gifs/interfaces/gif.interface';

export const GifsApp = () => {
  const {
    gifs,
    previousTerms,
    currentTerm,
    isLoading,
    error,
    handleTermClicked,
    handleSearch,
  } = useGifs();

  const [selectedGif, setSelectedGif] = useState<Gif | null>(null);

  const hasSearched = currentTerm.length > 0;

  const renderResults = () => {
    if (isLoading) {
      return <GifGridSkeleton />;
    }

    if (error) {
      return <GifErrorState message={error} onRetry={() => handleSearch(currentTerm)} />;
    }

    if (gifs.length === 0) {
      return <GifEmptyState hasSearched={hasSearched} term={currentTerm} />;
    }

    return <GifList gifs={gifs} onGifClick={setSelectedGif} />;
  };

  return (
    <>
      <CustomHeader
        title="Gifs Search"
        description="Discover and share the perfect Gifs"
      />

      <SearchBar
        placeholder="Search for gifs..."
        onQuery={(query: string) => handleSearch(query)}
      />

      <PreviousSearches searches={previousTerms} onLabelClicked={handleTermClicked} />

      {renderResults()}

      <GifModal gif={selectedGif} onClose={() => setSelectedGif(null)} />
    </>
  );
};
