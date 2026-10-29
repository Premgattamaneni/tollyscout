import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, posterUrl, backdropUrl } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addMovie, removeMovie, isInWatchlist } = useWatchlist();

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

  if (loading) return <p className="status">Loading movie…</p>;
  if (error) return <p className="status status--error">Couldn’t load this movie. Go back and try again.</p>;
  if (!movie) return null;

  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const trailer = movie.videos?.results.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  );
  const cast = movie.credits?.cast.slice(0, 8) ?? [];
  const saved = isInWatchlist(movie.id);
  const backdrop = backdropUrl(movie.backdrop_path);

  return (
    <article>
      <Link to="/" className="back">Back to movies</Link>

      <section
        className="detail"
        style={backdrop ? { '--backdrop': `url(${backdrop})` } : undefined}
      >
        <div className="detail__scrim">
          <img className="detail__poster" src={posterUrl(movie.poster_path)} alt={`${movie.title} poster`} />

          <div className="detail__info">
            <h1 className="detail__title">{movie.title}</h1>
            {movie.tagline && <p className="detail__tagline">{movie.tagline}</p>}

            <ul className="facts">
              {year && <li>{year}</li>}
              {runtime && <li>{runtime}</li>}
              {movie.vote_average > 0 && (
                <li className="facts__rating">★ {movie.vote_average.toFixed(1)}</li>
              )}
            </ul>

            <ul className="chips">
              {movie.genres.map((g) => (
                <li key={g.id}>{g.name}</li>
              ))}
            </ul>

            <p className="detail__overview">
              {movie.overview || 'No overview is available for this movie yet.'}
            </p>

            <button
              className={saved ? 'btn btn--ghost' : 'btn'}
              aria-pressed={saved}
              onClick={() => (saved ? removeMovie(movie.id) : addMovie(movie))}
            >
              {saved ? 'Remove from watchlist' : 'Add to watchlist'}
            </button>
          </div>
        </div>
      </section>

      {cast.length > 0 && (
        <>
          <h2 className="subhead">Cast</h2>
          <ul className="cast">
            {cast.map((c) => (
              <li key={c.id}>
                {c.name}
                {c.character && <span>{c.character}</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      {trailer && (
        <>
          <h2 className="subhead">Trailer</h2>
          <iframe
            className="trailer"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={`${movie.title} trailer`}
            allowFullScreen
          />
        </>
      )}
    </article>
  );
}