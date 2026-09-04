import type { FC } from 'react';

interface Props {
  message: string;
  onRetry: () => void;
}

export const GifErrorState: FC<Props> = ({ message, onRetry }) => (
  <div className="state-card state-card--error" role="alert">
    <div className="state-icon" aria-hidden="true">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <h3>Something went wrong</h3>
    <p>{message}</p>
    <button className="state-button" onClick={onRetry} type="button">
      Try again
    </button>
  </div>
);
