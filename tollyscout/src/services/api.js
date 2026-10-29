const BASE = 'https://api.themoviedb.org/3';
const KEY = import.meta.env.VITE_TMDB_KEY;

async function get(path, params = {}) {
  const query = new URLSearchParams({ api_key: KEY, ...params });
  const res = await fetch(`${BASE}${path}?${query}`);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

export const getTeluguMovies = (page = 1) =>
  get('/discover/movie', {
    with_original_language: 'te',
    sort_by: 'popularity.desc',
    page,
  });

export const searchTeluguMovies = async (text) => {
  const data = await get('/search/movie', { query: text });
  return data.results.filter((m) => m.original_language === 'te');
};

export const getMovieDetails = (id) => get(`/movie/${id}`,{ append_to_response: 'videos,credits' });

const NO_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750"><rect width="100%" height="100%" fill="#888"/><text x="50%" y="50%" fill="#fff" font-size="40" text-anchor="middle">No poster</text></svg>'
  );

export const posterUrl = (path) =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : NO_POSTER;