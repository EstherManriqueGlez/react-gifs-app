import { beforeEach, describe, expect, test } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';

import { getGifsByQuery } from './get-gifs-by-query.action';
import { giphyApi } from '../api/giphy.api';

import { giphySearchResponseMock } from '../../../tests/mocks/giphy.response.data';

describe('getGifsByQuery Action', () => {
  let mock = new AxiosMockAdapter(giphyApi);

  beforeEach(() => {
    mock = new AxiosMockAdapter(giphyApi);
  });

  test('should return a list of gifs and the total count', async () => {
    mock.onGet('/search').reply(200, giphySearchResponseMock);

    const result = await getGifsByQuery('goku');

    expect(result.gifs.length).toBe(12);
    expect(result.total).toBe(giphySearchResponseMock.pagination.total_count);

    result.gifs.forEach((gif) => {
      expect(typeof gif.id).toBe('string');
      expect(typeof gif.title).toBe('string');
      expect(typeof gif.url).toBe('string');
      expect(typeof gif.width).toBe('number');
      expect(typeof gif.height).toBe('number');
    });
  });

  test('should send limit and offset in the request', async () => {
    mock.onGet('/search').reply(200, giphySearchResponseMock);

    await getGifsByQuery('goku', { limit: 12, offset: 12 });

    const request = mock.history.get[0] as {
      params: { q: string; limit: number; offset: number };
    };
    expect(request.params.q).toBe('goku');
    expect(request.params.limit).toBe(12);
    expect(request.params.offset).toBe(12);
  });

  test('should use default limit and offset when not provided', async () => {
    mock.onGet('/search').reply(200, giphySearchResponseMock);

    await getGifsByQuery('goku');

    const request = mock.history.get[0] as {
      params: { limit: number; offset: number };
    };
    expect(request.params.limit).toBe(12);
    expect(request.params.offset).toBe(0);
  });

  test('should return an empty list of gifs if query is empty', async () => {
    mock.restore();
    const result = await getGifsByQuery('');

    expect(result.gifs.length).toBe(0);
    expect(result.total).toBe(0);
  });

  test('should reject when the API returns an error', async () => {
    mock.onGet('/search').reply(400, {
      data: {
        message: 'Bad Request',
      },
    });

    await expect(getGifsByQuery('goku')).rejects.toBeDefined();
  });
});