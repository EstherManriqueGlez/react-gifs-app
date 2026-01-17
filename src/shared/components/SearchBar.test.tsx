import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  test('should render SearchBar correctly', () => {
    const { container } = render(<SearchBar onQuery={() => {}} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByRole('textbox')).toBeDefined();
    expect(screen.getByRole('button')).toBeDefined();
  });

  test('should call onQuery with the correct value after 700ms', async () => {
    const onQuery = vi.fn();
    render(<SearchBar onQuery={onQuery} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    // This is one way to do it and wait for the debounce timeout
    // await new Promise((r) => setTimeout(r, 700));

    // This is another way using fake timers
    await waitFor(() => {
      expect(onQuery).toHaveBeenCalled();
      expect(onQuery).toHaveBeenCalledWith('test');
    });
  });

  test('should call only once with the last value (debounce)', async () => {
    const onQuery = vi.fn();
    render(<SearchBar onQuery={onQuery} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 't' } });
    fireEvent.change(input, { target: { value: 'te' } });
    fireEvent.change(input, { target: { value: 'tes' } });
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(onQuery).toHaveBeenCalledTimes(1);
      expect(onQuery).toHaveBeenCalledWith('test');
    });
  });

  test('should call onQuery when button clicked with the input value', () => {
    const onQuery = vi.fn();
    render(<SearchBar onQuery={onQuery} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onQuery).toHaveBeenCalledTimes(1);
    expect(onQuery).toHaveBeenCalledWith('test');
  });

  test('should the input has the correct placeholder value', () => {
    const placeholder = 'Custom Placeholder';
    render(<SearchBar onQuery={() => {}} placeholder={placeholder} />);


    screen.debug();
    expect(screen.getByPlaceholderText(placeholder)).toBeDefined();
  });
});
