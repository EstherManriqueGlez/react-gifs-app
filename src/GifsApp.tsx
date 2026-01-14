import { mockGifs } from './mock-data/gifs.mock';

import { CustomHeader } from './shared/components/CustomHeader';
import { SearchBar } from './shared/components/SearchBar';
import { PreviousSearches } from './gifs/components/PreviousSearches';
import { GifList } from './gifs/components/GifList';

export const GifsApp = () => {
  return (
    <>
      {/* Header */}

      <CustomHeader
        title="Gifs Search"
        description="Discover and share the perfect Gifs"
      />

      {/* Search */}
      <SearchBar placeholder="Search for gifs..." />

      {/* Previous searches */}
      <PreviousSearches searches={['Goku', 'Dragon Ball Z']}/>

      {/* Gifs Grid */}
      <GifList gifs={mockGifs} />
    </>
  );
};
