import { giphyApi } from '../api/giphy.api';

import type { GiphyResponse } from '../interfaces/giphy.response';
import type { Gif } from '../interfaces/gif.interface';

export const getGifsByQuery = async (query: string): Promise<Gif[]> => {
  if (query.trim().length === 0) return [];

  const response = await giphyApi<GiphyResponse>('/search', {
    params: {
      q: query.trim(),
      limit: 10,
    },
  });

  return response.data.data.map((gif) => ({
    id: gif.id,
    title: gif.title,
    url: gif.images.original.url,
    previewUrl: gif.images.fixed_width?.url ?? gif.images.original.url,
    giphyUrl: gif.url ?? `https://giphy.com/gifs/${gif.id}`,
    width: Number(gif.images.original.width),
    height: Number(gif.images.original.height),
  }));
};
