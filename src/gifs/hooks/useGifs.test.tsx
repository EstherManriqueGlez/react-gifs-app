import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useGifs } from './useGifs';
import * as gifActions from '../actions/get-gifs-by-query.action';
import { MAX_PREVIOUS_TERMS } from '../utils/previous-searches';
import type { Gif } from '../interfaces/gif.interface';

vi.mock('../actions/get-gifs-by-query.action', () => ({
  getGifsByQuery: vi.fn(),
}));

const mockedGetGifsByQuery = vi.mocked(gifActions.getGifsByQuery);

const makeGif = (id: string): Gif => ({
  id,
  title: `Gif ${id}`,
  url: `https://example.com/${id}.gif`,
  width: 200,
  height: 200,
});

const makeGifList = (n: number): Gif[] =>
  Array.from({ length: n }, (_, i) => makeGif(`gif-${i + 1}`));

describe('useGifs Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockedGetGifsByQuery.mockResolvedValue(makeGifList(10));
  });

  test('should return default values and methods', () => {
    const { result } = renderHook(() => useGifs());

    expect(result.current.gifs.length).toBe(0);
    expect(result.current.previousTerms.length).toBe(0);
    expect(result.current.currentTerm).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(result.current.handleSearch).toBeDefined();
    expect(result.current.handleTermClicked).toBeDefined();
  });

  test('should return a list of gifs and track the current term', async () => {
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('Goku');
      await Promise.resolve();
    });

    expect(mockedGetGifsByQuery).toHaveBeenCalledWith('goku');
    expect(result.current.gifs.length).toBe(10);
    expect(result.current.currentTerm).toBe('goku');
    expect(result.current.error).toBeNull();
  });

  test('should add a term to the previous terms list', async () => {
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    expect(result.current.previousTerms).toStrictEqual(['goku']);
  });

  test('should not duplicate an existing previous term', async () => {
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });
    await act(async () => {
      result.current.handleSearch('GOKU');
      await Promise.resolve();
    });

    expect(result.current.previousTerms).toStrictEqual(['goku']);
  });

  test('should not search when the query is empty or whitespace', async () => {
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('');
      await Promise.resolve();
    });
    await act(async () => {
      result.current.handleSearch('   ');
      await Promise.resolve();
    });

    expect(mockedGetGifsByQuery).not.toHaveBeenCalled();
    expect(result.current.previousTerms.length).toBe(0);
  });

  test('should return a list of gifs when handleTermClicked is called', async () => {
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    mockedGetGifsByQuery.mockClear();

    await act(async () => {
      result.current.handleTermClicked('goku');
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(10);
    expect(result.current.previousTerms).toStrictEqual(['goku']);
  });

  test('should serve results from cache without re-fetching', async () => {
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    const firstCalls = mockedGetGifsByQuery.mock.calls.length;

    mockedGetGifsByQuery.mockRejectedValueOnce(new Error('should not be called'));

    await act(async () => {
      result.current.handleTermClicked('goku');
      await Promise.resolve();
    });

    expect(mockedGetGifsByQuery.mock.calls.length).toBe(firstCalls);
    expect(result.current.gifs.length).toBe(10);
  });

  test('should return no more than 8 previous terms', async () => {
    const { result } = renderHook(() => useGifs());

    for (let i = 1; i <= 9; i++) {
      await act(async () => {
        result.current.handleSearch(`goku${i}`);
        await Promise.resolve();
      });
    }

    expect(result.current.previousTerms.length).toBe(MAX_PREVIOUS_TERMS);
    expect(result.current.previousTerms).toStrictEqual([
      'goku9',
      'goku8',
      'goku7',
      'goku6',
      'goku5',
      'goku4',
      'goku3',
      'goku2',
    ]);
  });

  test('should set an error state when the request fails', async () => {
    mockedGetGifsByQuery.mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    expect(result.current.error).toBe('Something went wrong while searching. Please try again.');
    expect(result.current.gifs.length).toBe(0);
    expect(result.current.isLoading).toBe(false);
  });

  test('should ignore stale responses so the latest search wins', async () => {
    let resolveSlow!: (gifs: Gif[]) => void;
    let resolveFast!: (gifs: Gif[]) => void;
    mockedGetGifsByQuery
      .mockImplementationOnce(() => new Promise((resolve) => (resolveSlow = resolve)))
      .mockImplementationOnce(() => new Promise((resolve) => (resolveFast = resolve)));

    const { result } = renderHook(() => useGifs());

    await act(async () => {
      void result.current.handleSearch('slow');
      void result.current.handleSearch('fast');
      await Promise.resolve();
    });

    // 'fast' resolves first -> becomes the current result.
    await act(async () => {
      resolveFast(makeGifList(5));
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(5);

    // 'slow' resolves after -> must be ignored as stale.
    await act(async () => {
      resolveSlow(makeGifList(3));
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(5);
    expect(result.current.currentTerm).toBe('fast');
  });

  test('should toggle isLoading while a request is pending', async () => {
    let resolveRequest!: (gifs: Gif[]) => void;
    mockedGetGifsByQuery.mockImplementationOnce(
      () => new Promise((resolve) => (resolveRequest = resolve)),
    );

    const { result } = renderHook(() => useGifs());

    let pending: Promise<void>;
    await act(async () => {
      pending = Promise.resolve(result.current.handleSearch('goku'));
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveRequest(makeGifList(4));
      await pending;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.gifs.length).toBe(4);
  });

  test('should persist previous terms in localStorage', async () => {
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    const saved = JSON.parse(
      localStorage.getItem('gifs-app:previous-terms') ?? '[]',
    ) as string[];

    expect(saved).toStrictEqual(['goku']);
  });
});
