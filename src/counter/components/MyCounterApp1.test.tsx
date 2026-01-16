import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MyCounterApp } from './MyCounterApp';
// import { useCounter } from '../hooks/useCounter';

const handleAddMock = vi.fn();
const handleSubtractMock = vi.fn();
const handleResetMock = vi.fn();

vi.mock('../hooks/useCounter', () => ({
  useCounter: () => ({
    counter: 50,
    handleAdd: handleAddMock,
    handleSubtract: handleSubtractMock,
    handleReset: handleResetMock,
  }),
}));

describe('MyCounterApp', () => {
  test('should render the component correctly', () => {
    render(<MyCounterApp />);
    screen.debug();

    expect(screen.getByRole('heading', { level: 1 }).innerHTML).toContain(
      `Counter: 50`
    );

    expect(screen.getByRole('button', { name: '+1' })).toBeDefined();
    expect(screen.getByRole('button', { name: '-1' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDefined();
  });

  test('should call handleAdd when +1 button is clicked', () => {
    render(<MyCounterApp />);

    const btnAdd = screen.getByRole('button', { name: '+1' });
    fireEvent.click(btnAdd);

    expect(handleAddMock).toHaveBeenCalled();
    expect(handleAddMock).toHaveBeenCalledTimes(1);
    expect(handleSubtractMock).not.toHaveBeenCalled();
    expect(handleResetMock).not.toHaveBeenCalled();
  });

  test('should call handleSubtract when -1 button is clicked', () => {
    render(<MyCounterApp />);

    const btnSubtract = screen.getByRole('button', { name: '-1' });
    fireEvent.click(btnSubtract);

    expect(handleSubtractMock).toHaveBeenCalled();
  });

  test('should call handleReset when Reset button is clicked', () => {
    render(<MyCounterApp />);

    const btnReset = screen.getByRole('button', { name: 'Reset' });
    fireEvent.click(btnReset);

    expect(handleResetMock).toHaveBeenCalled();
  });
});
