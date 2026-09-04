import { useEffect } from 'react';
import type { FC } from 'react';
import type { Gif } from '../interfaces/gif.interface';

interface Props {
  gif: Gif | null;
  onClose: () => void;
}

export const GifModal: FC<Props> = ({ gif, onClose }) => {
  useEffect(() => {
    if (!gif) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [gif, onClose]);

  if (!gif) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={gif.title || 'GIF preview'}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <button
          className="modal-close"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <img src={gif.url} alt={gif.title || 'GIF'} />
        <h3>{gif.title || 'Untitled'}</h3>
        <p>
          {gif.width} × {gif.height}
        </p>
      </div>
    </div>
  );
};
