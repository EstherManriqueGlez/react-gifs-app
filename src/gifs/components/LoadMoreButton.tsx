import type { FC } from 'react';

interface Props {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const LoadMoreButton: FC<Props> = ({ onLoadMore, isLoading, hasMore }) => {
  if (!hasMore) return null;

  return (
    <div className="load-more">
      <button type="button" className="load-more-button" onClick={onLoadMore} disabled={isLoading}>
        {isLoading && <span className="load-more-spinner" aria-hidden="true" />}
        {isLoading ? 'Loading more…' : 'Load more GIFs'}
      </button>
    </div>
  );
};