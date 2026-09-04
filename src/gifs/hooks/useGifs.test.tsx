import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useGifs } from './useGifs';
import * as gifActions from '../actions/get-gifs-by-query.action';
import type { GifsSearchResult } from '../actions/get-gifs-by-query.action';
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

const makeGifsFrom = (start: number, n: number): Gif[] =>
  Array.from({ length: n }, (_, i) => makeGif(`gif-${start + i}`));

const resolve = (gifs: Gif[], total: number): GifsSearchResult => ({ gifs, total });

describe('useGifs Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockedGetGifsByQuery.mockResolvedValue(resolve(makeGifList(10), 10));
  });

  test('should return default values and methods', () => {
    const { result } = renderHook(() => useGifs());

    expect(result.current.gifs.length).toBe(0);
    expect(result.current.previousTerms.length).toBe(0);
    expect(result.current.currentTerm).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoadingMore).toBe(false);
    expect(result.current.total).toBe(0);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.error).toBeNull();

    expect(result.current.handleSearch).toBeDefined();
    expect(result.current.handleTermClicked).toBeDefined();
    expect(result.current.loadMore).toBeDefined();
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
    let resolveSlow!: (result: GifsSearchResult) => void;
    let resolveFast!: (result: GifsSearchResult) => void;
    mockedGetGifsByQuery
      .mockImplementationOnce(
        () => new Promise((resolve) => (resolveSlow = resolve)),
      )
      .mockImplementationOnce(
        () => new Promise((resolve) => (resolveFast = resolve)),
      );

    const { result } = renderHook(() => useGifs());

    await act(async () => {
      void result.current.handleSearch('slow');
      void result.current.handleSearch('fast');
      await Promise.resolve();
    });

    // 'fast' resolves first -> becomes the current result.
    await act(async () => {
      resolveFast(resolve(makeGifList(5), 5));
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(5);

    // 'slow' resolves after -> must be ignored as stale.
    await act(async () => {
      resolveSlow(resolve(makeGifList(3), 3));
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(5);
    expect(result.current.currentTerm).toBe('fast');
  });

  test('should toggle isLoading while a request is pending', async () => {
    let resolveRequest!: (result: GifsSearchResult) => void;
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
      resolveRequest(resolve(makeGifList(4), 4));
      await pending;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.gifs.length).toBe(4);
  });

  test('should append gifs and track pagination with loadMore', async () => {
    mockedGetGifsByQuery.mockResolvedValue(resolve(makeGifList(10), 20));
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(10);
    expect(result.current.total).toBe(20);
    expect(result.current.hasMore).toBe(true);

    mockedGetGifsByQuery.mockResolvedValueOnce(resolve(makeGifsFrom(11, 10), 20));

    await act(async () => {
      void result.current.loadMore();
      await Promise.resolve();
    });

    expect(mockedGetGifsByQuery).toHaveBeenLastCalledWith('goku', { limit: 12, offset: 10 });
    expect(result.current.gifs.length).toBe(20);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoadingMore).toBe(false);
  });

  test('should deduplicate gifs when loadMore returns repeat items', async () => {
    mockedGetGifsByQuery.mockResolvedValue(resolve(makeGifList(10), 14));
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    mockedGetGifsByQuery.mockResolvedValueOnce(
      resolve([...makeGifList(6), ...makeGifsFrom(11, 4)], 14),
    );

    await act(async () => {
      void result.current.loadMore();
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(14);
    expect(result.current.hasMore).toBe(false);
  });

  test('should not load more when there is no more content', async () => {
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    expect(result.current.hasMore).toBe(false);

    await act(async () => {
      void result.current.loadMore();
      await Promise.resolve();
    });

    expect(mockedGetGifsByQuery).toHaveBeenCalledTimes(1);
  });

  test('should toggle isLoadingMore while loading more is pending', async () => {
    mockedGetGifsByQuery.mockResolvedValue(resolve(makeGifList(10), 21));
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    let resolveMore!: (result: GifsSearchResult) => void;
    mockedGetGifsByQuery.mockImplementationOnce(
      () => new Promise((resolve) => (resolveMore = resolve)),
    );

    let pending: Promise<void>;
    await act(async () => {
      pending = Promise.resolve(result.current.loadMore());
      await Promise.resolve();
    });

    expect(result.current.isLoadingMore).toBe(true);

    await act(async () => {
      resolveMore(resolve(makeGifsFrom(11, 11), 21));
      await pending;
    });

    expect(result.current.isLoadingMore).toBe(false);
    expect(result.current.gifs.length).toBe(21);
    expect(result.current.hasMore).toBe(false);
  });

  test('should ignore a stale loadMore response after a newer search', async () => {
    mockedGetGifsByQuery.mockResolvedValue(resolve(makeGifList(10), 50));
    const { result } = renderHook(() => useGifs());

    await act(async () => {
      result.current.handleSearch('goku');
      await Promise.resolve();
    });

    let resolveMore!: (result: GifsSearchResult) => void;
    mockedGetGifsByQuery.mockImplementationOnce(
      () => new Promise((resolve) => (resolveMore = resolve)),
    );

    await act(async () => {
      void result.current.loadMore();
      await Promise.resolve();
    });

    mockedGetGifsByQuery.mockResolvedValueOnce(resolve(makeGifList(6), 6));

    await act(async () => {
      result.current.handleSearch('vega');
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(6);
    expect(result.current.currentTerm).toBe('vega');
    expect(result.current.isLoadingMore).toBe(false);

    // Resolve the stale loadMore after the new search -> it must be ignored.
    await act(async () => {
      resolveMore(resolve(makeGifsFrom(11, 10), 50));
      await Promise.resolve();
    });

    expect(result.current.gifs.length).toBe(6);
    expect(result.current.isLoadingMore).toBe(false);
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