import type { FC } from 'react';
import type { Gif } from '../interfaces/gif.interface';
import { GifCard } from './GifCard';

interface Props {
  gifs: Gif[];
  onGifClick: (gif: Gif) => void;
}

export const GifList: FC<Props> = ({ gifs, onGifClick }) => {
  return (
    <div className="gifs-container">
      {gifs.map((gif) => (
        <GifCard key={gif.id} gif={gif} onClick={onGifClick} />
      ))}
    </div>
  );
};
