import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CustomHeader } from './CustomHeader';

describe('CustomHeader', () => {
  const title = 'Test Title';
  const description = 'Test Description';

  test('should render the title correctly', () => {
    render(<CustomHeader title={title} />);

    expect(screen.getAllByText(title)).toBeDefined();
  });

  test('should render the description when provided', () => {
    render(<CustomHeader title={title} description={description} />);

    expect(screen.getByText(description)).toBeDefined();
    expect(screen.getByRole('paragraph')).toBeDefined();
    expect(screen.getByRole('paragraph').innerHTML).toBe(description);
  });

  test('should not render the description when not provided', () => {
    const { container } = render(<CustomHeader title={title} />);

    const divElement = container.querySelector('div.content-center');

    const h1Element = divElement?.querySelector('h1');
    expect(h1Element).toBeDefined();
    expect(h1Element?.innerHTML).toBe(title);
    expect(divElement?.querySelector('p')).toBeNull();
  });
});
