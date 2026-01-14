import type { FC } from 'react';

interface Props {
  searches: string[];
}

export const PreviousSearches: FC<Props> = ({ searches }) => {
  return (
    <div className="previous-searches">
      <h2>Previous Searches</h2>
      <ul className="previous-searches-list">
        {searches.map((search) => (
          <li key={search}>{search}</li>
        ))}
      </ul>
    </div>
  );
};
