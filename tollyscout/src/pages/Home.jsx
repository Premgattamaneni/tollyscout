import { useEffect, useState } from 'react';
import { getTeluguMovies, posterUrl } from '../services/api';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTeluguMovies()
      .then((data) => setMovies(data.results))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>TollyScout</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
        }}
      >
        {movies.map((m) => (
          <div key={m.id}>
            <img src={posterUrl(m.poster_path)} alt={m.title} style={{ width: '100%' }} />
            <p>{m.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}