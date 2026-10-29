import { useEffect, useState } from 'react';
import { getTeluguMovies, searchTeluguMovies } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    const request = debouncedQuery.trim()
      ? searchTeluguMovies(debouncedQuery)
      : getTeluguMovies().then((data) => data.results);

    request
      .then((results) => {
        if (!ignore) setMovies(results);
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
  }, [debouncedQuery]);

  return (
    <div>
      <h1>TollyScout</h1>
      <SearchBar value={query} onChange={setQuery} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>No Telugu movies found for {query}</p>
      )}
      {!loading && !error && movies.length > 0 && <MovieGrid movies={movies} />}
    </div>
  );
}