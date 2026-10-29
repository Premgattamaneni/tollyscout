import { useEffect, useState } from 'react';
import { getTeluguMovies, searchTeluguMovies } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedQuery = useDebounce(query, 500);
  const isSearch = debouncedQuery.trim() !== '';

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    const request = isSearch
      ? searchTeluguMovies(debouncedQuery).then((results) => ({
          results,
          total_pages: 1,
        }))
      : getTeluguMovies(1);

    request
      .then((data) => {
        if (ignore) return;
        setMovies(data.results);
        setPage(1);
        setTotalPages(data.total_pages);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [debouncedQuery, isSearch]);

  const loadMore = () => {
    const next = page + 1;
    setLoadingMore(true);
    getTeluguMovies(next)
      .then((data) => {
        setMovies((prev) => {
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...data.results.filter((m) => !seen.has(m.id))];
        });
        setPage(next);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingMore(false));
  };

  return (
    <div>
      <h1>TollyScout</h1>
      <SearchBar value={query} onChange={setQuery} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>No Telugu movies found for {query}</p>
      )}
      {!loading && movies.length > 0 && <MovieGrid movies={movies} />}

      {!loading && !isSearch && page < totalPages && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          style={{
            display: 'block',
            margin: '24px auto',
            padding: '10px 24px',
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #888',
            cursor: 'pointer',
          }}
        >
          {loadingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}