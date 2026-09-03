import { useCallback, useState } from 'react';

interface Props {
  placeholder?: string;
  onQuery: (query: string) => void;
}

export const SearchBar = ({ placeholder = 'Search...', onQuery }: Props) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();

    if (trimmed.length === 0) return;

    onQuery(trimmed);
    setQuery('');
  }, [query, onQuery]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button className="search-button" onClick={handleSubmit}>
        Search
      </button>
    </div>
  );
};
