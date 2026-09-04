import type { FC } from 'react';

interface Props {
  count?: number;
}

export const GifGridSkeleton: FC<Props> = ({ count = 12 }) => {
  return (
    <div className="gifs-container" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div className="gif-card gif-card--skeleton" key={i}>
          <div className="gif-media skeleton-block" />
          <div className="skeleton-block skeleton-line skeleton-line--title" />
          <div className="skeleton-block skeleton-line skeleton-line--meta" />
        </div>
      ))}
    </div>
  );
};