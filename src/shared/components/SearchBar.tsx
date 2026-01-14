interface Props {
  placeholder?: string;
}


export const SearchBar = ({ placeholder = 'Search...' }: Props) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
      />
      <button className="search-button">Search</button>
    </div>
  );
};
