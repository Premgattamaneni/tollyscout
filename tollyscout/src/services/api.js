
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_KEY;

async function tmdbFetch(path) {
  if (!API_KEY) {
    throw new Error('TMDB API key is missing');
  }

  const separator = path.includes('?') ? '&' : '?';

  const response = await fetch(
    `${BASE_URL}${path}${separator}api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

export async function getTeluguMovies(page = 1) {
  return tmdbFetch(
    `/discover/movie?with_original_language=te&sort_by=popularity.desc&page=${page}`
  );
}

export async function searchTeluguMovies(query) {
  const params = new URLSearchParams({
    query,
    with_original_language: 'te',
  });

  const data = await tmdbFetch(`/search/movie?${params}`);
  return data.results || [];
}

export async function getMovieDetails(id) {
  return tmdbFetch(
    `/movie/${id}?append_to_response=videos,credits`
  );
}

export function posterUrl(path) {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : 'https://placehold.co/500x750?text=No+Poster';
}

export function backdropUrl(path) {
  return path
    ? `https://image.tmdb.org/t/p/original${path}`
    : '';
}
