import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  test('should initialize the counter with default value of 10', () => {
    const initialValue = 10;
    const { result } = renderHook(() => useCounter(initialValue));

    expect(result.current.counter).toBe(initialValue);
  });

  test('should increment the counter by 1 when handleAdd is called', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.handleAdd();
    });

    expect(result.current.counter).toBe(11);
  });

  test('should decrement the counter by 1 when handleSubtract is called', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.handleSubtract();
    });

    expect(result.current.counter).toBe(9);
  });

  test('should reset the counter to initial value when handleReset is called', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.handleAdd();
    });

    act(() => {
      result.current.handleAdd();
    });

    act(() => {
      result.current.handleAdd();
    });

    expect(result.current.counter).toBe(13);
    
    act(() => {
      result.current.handleReset();
    });

    expect(result.current.counter).toBe(10);
  });
});
