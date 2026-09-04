import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import type { Gif } from '../interfaces/gif.interface';

interface Props {
  gif: Gif | null;
  onClose: () => void;
}

const COPY_SUCCESS_MS = 1800;

export const GifModal: FC<Props> = ({ gif, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!gif) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus the close button on open for keyboard users.
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [gif, onClose]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  if (!gif) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(gif.url);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), COPY_SUCCESS_MS);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context); fail quietly.
      setCopied(false);
    }
  };

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
          ref={closeButtonRef}
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
        <div className="modal-actions">
          <button
            className="modal-action-button modal-action-button--primary"
            type="button"
            onClick={handleCopyUrl}
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy URL</span>
              </>
            )}
          </button>
          {gif.giphyUrl && (
            <a
              className="modal-action-button modal-action-button--secondary"
              href={gif.giphyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Open on Giphy</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};