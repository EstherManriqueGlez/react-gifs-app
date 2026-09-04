import type { FC } from 'react';

interface Props {
  hasSearched: boolean;
  term?: string;
}

export const GifEmptyState: FC<Props> = ({ hasSearched, term }) => (
  <div className="state-card" role="status">
    <div className="state-icon" aria-hidden="true">
      {hasSearched ? (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      ) : (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )}
    </div>
    <h3>{hasSearched ? 'No results found' : 'Start exploring'}</h3>
    <p>
      {hasSearched
        ? `We couldn't find any GIFs for “${term}”. Try a different keyword.`
        : 'Type a keyword and press Enter to discover the perfect GIFs.'}
    </p>
  </div>
);
