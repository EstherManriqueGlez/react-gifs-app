import { mockGifs } from './mock-data/gifs.mock';

export const GifsApp = () => {
  return (
    <>
      {/* Header */}
      <div className="content-center">
        <h1>Gifs Search</h1>
        <p>Discover and share the perfect Gifs</p>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for gifs..."
          className="search-input"
        />
        <button className="search-button">Search</button>
      </div>

      {/* Previous searches */}
      <div className="previous-searches">
        <h2>Previous Searches</h2>
        <ul className="previous-searches-list">
          <li>funny</li>
          <li>cats</li>
          <li>dogs</li>
        </ul>
      </div>

      {/* Gifs Grid */}
      <div className="gifs-container">
        {mockGifs.map((gif) => (
          <div className="gif-card" key={gif.id}>
            <img src={gif.url} alt={gif.title} />
            <h3>{gif.title}</h3>
            <p>
              {gif.width} x {gif.height} (1.5mb)
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
