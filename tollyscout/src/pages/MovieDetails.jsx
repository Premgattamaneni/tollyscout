import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, posterUrl } from '../services/api';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    getMovieDetails(id)
      .then((data) => {
        if (!ignore) setMovie(data);
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
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return null;

  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const trailer = movie.videos?.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );
  const cast = movie.credits?.cast.slice(0, 6) ?? [];

  return (
    <div>
      <Link to="/">← Back to movies</Link>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
        <img
          src={posterUrl(movie.poster_path)}
          alt={movie.title}
          style={{ width: 280, maxWidth: '100%', borderRadius: 12 }}
        />

        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ marginTop: 0 }}>
            {movie.title} {year && `(${year})`}
          </h1>
          {movie.tagline && <p><em>{movie.tagline}</em></p>}

          <p>
            ⭐ {movie.vote_average.toFixed(1)}
            {runtime && ` · ${runtime}`}
          </p>
          <p>{movie.genres.map((g) => g.name).join(', ')}</p>

          <h3>Overview</h3>
          <p>{movie.overview || 'No overview available.'}</p>

          {cast.length > 0 && (
            <>
              <h3>Cast</h3>
              <p>{cast.map((c) => c.name).join(', ')}</p>
            </>
          )}
        </div>
      </div>

      {trailer && (
        <div style={{ marginTop: 24 }}>
          <h3>Trailer</h3>
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title="Trailer"
            allowFullScreen
            style={{ width: '100%', maxWidth: 640, aspectRatio: '16 / 9', border: 0 }}
          />
        </div>
      )}
    </div>
  );
}