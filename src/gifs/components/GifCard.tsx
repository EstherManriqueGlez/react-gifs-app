import { useState } from 'react';
import type { FC } from 'react';
import type { Gif } from '../interfaces/gif.interface';

interface Props {
  gif: Gif;
  onClick: (gif: Gif) => void;
}

export const GifCard: FC<Props> = ({ gif, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <article
      className="gif-card"
      onClick={() => onClick(gif)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(gif);
        }
      }}
    >
      <div className="gif-media">
        <img
          src={gif.previewUrl ?? gif.url}
          alt={gif.title || 'GIF'}
          loading="lazy"
          decoding="async"
          className={loaded ? 'loaded' : ''}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <h3>{gif.title || 'Untitled'}</h3>
      <p>
        {gif.width} × {gif.height}
      </p>
    </article>
  );
};