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

  const statusText = (() => {
    if (error) return `Search failed: ${error}`;
    if (isLoading && hasSearched) return `Loading GIFs for "${currentTerm}"`;
    if (hasSearched && gifs.length > 0) {
      return `Found ${gifs.length} ${gifs.length === 1 ? 'GIF' : 'GIFs'} for "${currentTerm}"`;
    }
    if (hasSearched) return `No GIFs found for "${currentTerm}"`;
    return 'Search for GIFs to get started.';
  })();

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

      <main className="app-main">
        <SearchBar
          placeholder="Search for gifs..."
          onQuery={(query: string) => handleSearch(query)}
        />

        <PreviousSearches searches={previousTerms} onLabelClicked={handleTermClicked} />

        <p className="visually-hidden" role="status">
          {statusText}
        </p>

        <div className="results-region" aria-busy={isLoading}>
          {renderResults()}
        </div>
      </main>

      <GifModal gif={selectedGif} onClose={() => setSelectedGif(null)} />
    </>
  );
};
