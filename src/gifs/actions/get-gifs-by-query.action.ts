import { giphyApi } from '../api/giphy.api';

import type { GiphyResponse } from '../interfaces/giphy.response';
import type { Gif } from '../interfaces/gif.interface';

export interface SearchOptions {
  limit?: number;
  offset?: number;
}

export interface GifsSearchResult {
  gifs: Gif[];
  total: number;
}

export const getGifsByQuery = async (
  query: string,
  { limit = 12, offset = 0 }: SearchOptions = {},
): Promise<GifsSearchResult> => {
  if (query.trim().length === 0) return { gifs: [], total: 0 };

  const response = await giphyApi<GiphyResponse>('/search', {
    params: {
      q: query.trim(),
      limit,
      offset,
    },
  });

  const gifs = response.data.data.map((gif) => ({
    id: gif.id,
    title: gif.title,
    url: gif.images.original.url,
    previewUrl: gif.images.downsized?.url ?? gif.images.fixed_width?.url ?? gif.images.original.url,
    giphyUrl: gif.url ?? `https://giphy.com/gifs/${gif.id}`,
    width: Number(gif.images.original.width),
    height: Number(gif.images.original.height),
  }));

  return { gifs, total: response.data.pagination.total_count };
};