import { CustomHeader } from './shared/components/CustomHeader';
import { SearchBar } from './shared/components/SearchBar';
import { PreviousSearches } from './gifs/components/PreviousSearches';
import { GifList } from './gifs/components/GifList';
import { useGifs } from './gifs/hooks/useGifs';

export const GifsApp = () => {
  const { gifs, previousTerms, handleTermClicked, handleSearch } = useGifs();

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
