import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { LoadMoreButton } from './LoadMoreButton';

describe('LoadMoreButton Component', () => {
  test('should not render when there is no more content to load', () => {
    const { container } = render(
      <LoadMoreButton onLoadMore={() => {}} isLoading={false} hasMore={false} />,
    );

    expect(container.firstChild).toBeNull();
  });

  test('should render the button when there is more content', () => {
    render(<LoadMoreButton onLoadMore={() => {}} isLoading={false} hasMore />);

    expect(screen.queryByRole('button', { name: 'Load more GIFs' })).not.toBeNull();
  });

  test('should call onLoadMore when clicked', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton onLoadMore={onLoadMore} isLoading={false} hasMore />);

    fireEvent.click(screen.getByRole('button', { name: 'Load more GIFs' }));

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  test('should be disabled while loading and show loading text', () => {
    render(<LoadMoreButton onLoadMore={() => {}} isLoading hasMore />);

    expect(screen.getByRole('button', { name: 'Loading more…' })).toHaveProperty('disabled', true);
    expect(screen.queryByRole('button', { name: 'Load more GIFs' })).toBeNull();
  });
});