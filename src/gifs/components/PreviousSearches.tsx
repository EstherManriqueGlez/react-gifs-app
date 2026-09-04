import type { FC } from 'react';

interface Props {
  searches: string[];

  onLabelClicked: (term: string) => void;
}

export const PreviousSearches: FC<Props> = ({ searches, onLabelClicked }) => {
  if (searches.length === 0) return null;

  return (
    <section className="previous-searches" aria-label="Previous searches">
      <h2>Previous Searches</h2>
      <ul className="previous-searches-list">
        {searches.map((term) => (
          <li key={term}>
            <button
              className="previous-search-chip"
              type="button"
              onClick={() => onLabelClicked(term)}
            >
              {term}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};