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
    <>
      <section className="hero">
        <h1 className="hero__title">ఏ బొమ్మ చూద్దాం?</h1>
        <p className="hero__sub">
          Which Telugu film tonight? Search by title, then save what you want to watch.
        </p>
        <SearchBar value={query} onChange={setQuery} />
      </section>

      <h2 className="section-title">
        {isSearch ? `Results for “${debouncedQuery}”` : 'Popular Telugu movies'}
      </h2>

      {loading && <p className="status">Loading movies…</p>}
      {error && (
        <p className="status status--error">
          Couldn’t load movies. Check your connection and API key, then refresh.
        </p>
      )}
      {!loading && !error && movies.length === 0 && (
        <p className="status">No Telugu movies match “{debouncedQuery}”. Try a different title.</p>
      )}
      {!loading && movies.length > 0 && <MovieGrid movies={movies} />}

      {!loading && !isSearch && page < totalPages && (
        <div className="more">
          <button className="btn btn--ghost" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </>
  );
}