import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { GifModal } from './GifModal';
import type { Gif } from '../interfaces/gif.interface';

const mockGif: Gif = {
  id: 'abc123',
  title: 'Dancing Cat',
  url: 'https://media.example.com/abc123.gif',
  previewUrl: 'https://media.example.com/abc123-200w.gif',
  giphyUrl: 'https://giphy.com/gifs/abc123',
  width: 480,
  height: 270,
};

describe('GifModal', () => {
  test('should render nothing when gif is null', () => {
    const { container } = render(<GifModal gif={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  test('should render title, dimensions and actions when gif is present', () => {
    render(<GifModal gif={mockGif} onClose={() => {}} />);

    expect(screen.getByText('Dancing Cat')).toBeDefined();
    expect(screen.getByText('480 × 270')).toBeDefined();
    expect(screen.getByText('Copy URL')).toBeDefined();
    expect(screen.getByText('Open on Giphy')).toBeDefined();
    expect(screen.getByRole('img').getAttribute('src')).toBe(mockGif.url);
  });

  test('should close when clicking the overlay backdrop', () => {
    const onClose = vi.fn();
    render(<GifModal gif={mockGif} onClose={onClose} />);

    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should call onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<GifModal gif={mockGif} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should copy the url to the clipboard and show feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<GifModal gif={mockGif} onClose={() => {}} />);

    fireEvent.click(screen.getByText('Copy URL'));

    expect(writeText).toHaveBeenCalledWith(mockGif.url);
    expect(await screen.findByText('Copied!')).toBeDefined();
  });

  test('should trap focus within the dialog', () => {
    render(<GifModal gif={mockGif} onClose={() => {}} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    const copyButton = screen.getByRole('button', { name: 'Copy URL' });
    const giphyLink = screen.getByRole('link', { name: 'Open on Giphy' });

    // The close button receives focus when the modal opens.
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(copyButton);

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(giphyLink);

    // Tab past the last element wraps to the first.
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(closeButton);

    // Shift+Tab from the first element wraps to the last.
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(giphyLink);
  });

  test('should link out to Giphy with safety attributes', () => {
    render(<GifModal gif={mockGif} onClose={() => {}} />);
const link = screen.getByRole('link', { name: 'Open on Giphy' });

    expect(link.getAttribute('href')).toBe(mockGif.giphyUrl);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });
});