import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { PreviousSearches } from './PreviousSearches';

describe('PreviousSearches', () => {
  test('should render nothing when there are no searches', () => {
    const { container } = render(<PreviousSearches searches={[]} onLabelClicked={() => {}} />);

    expect(container.firstChild).toBeNull();
  });

  test('should render a button per term', () => {
    render(<PreviousSearches searches={['goku', 'naruto']} onLabelClicked={() => {}} />);

    expect(screen.getByRole('button', { name: 'goku' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'naruto' })).toBeDefined();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('should notify when a term button is clicked', () => {
    const onLabelClicked = vi.fn();
    render(<PreviousSearches searches={['goku']} onLabelClicked={onLabelClicked} />);

    fireEvent.click(screen.getByRole('button', { name: 'goku' }));

    expect(onLabelClicked).toHaveBeenCalledWith('goku');
  });

  test('should expose terms as native, focusable buttons', () => {
    render(<PreviousSearches searches={['goku']} onLabelClicked={() => {}} />);

    const button = screen.getByRole('button', { name: 'goku' });

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveProperty('tabIndex', 0);
  });
});