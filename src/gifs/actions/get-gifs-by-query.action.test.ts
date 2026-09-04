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

  test('should return a list of gifs', async () => {
    mock.onGet('/search').reply(200, giphySearchResponseMock);

    const gifs = await getGifsByQuery('goku');

    expect(gifs.length).toBe(10);

    gifs.forEach((gif) => {
      expect(typeof gif.id).toBe('string');
      expect(typeof gif.title).toBe('string');
      expect(typeof gif.url).toBe('string');
      expect(typeof gif.width).toBe('number');
      expect(typeof gif.height).toBe('number');
    });
  });

  test('should return an empty list of gifs if query is empty', async () => {
    mock.restore();
    const gifs = await getGifsByQuery('');

    expect(gifs.length).toBe(0);
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
