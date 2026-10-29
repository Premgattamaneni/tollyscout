
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getMovieDetails,
  posterUrl,
  backdropUrl,
} from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import WhereToWatch from '../components/WhereToWatch';

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addMovie, removeMovie, isInWatchlist } = useWatchlist();

  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      setLoading(true);
      setError('');
      setMovie(null);

      try {
        const data = await getMovieDetails(id);

        if (!ignore) {
          setMovie(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load movie details');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return <p className="status">Loading movie details...</p>;
  }

  if (error) {
    return (
      <div className="status status--error">
        <p>Could not load this movie.</p>
        <p>{error}</p>
        <Link to="/" className="btn">
          Back to movies
        </Link>
      </div>
    );
  }

  if (!movie) {
    return <p className="status">Movie not found.</p>;
  }

  const year = movie.release_date?.slice(0, 4);

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  // Prefer official YouTube trailers, then other trailers or teasers.
  const videos = movie.videos?.results ?? [];

  const trailer =
    videos.find(
      (video) =>
        video.site === 'YouTube' &&
        video.type === 'Trailer' &&
        video.official
    ) ||
    videos.find(
      (video) =>
        video.site === 'YouTube' &&
        video.type === 'Trailer'
    ) ||
    videos.find(
      (video) =>
        video.site === 'YouTube' &&
        video.type === 'Teaser'
    );

  const cast = movie.credits?.cast?.slice(0, 8) ?? [];
  const saved = isInWatchlist(movie.id);
  const backdrop = backdropUrl(movie.backdrop_path);

  return (
    <article className="movie-details">
      <Link to="/" className="back">
        ← Back to movies
      </Link>

      <section
        className="detail"
        style={
          backdrop
            ? { '--backdrop': `url("${backdrop}")` }
            : undefined
        }
      >
        <div className="detail__scrim">
          <img
            className="detail__poster"
            src={posterUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
          />

          <div className="detail__info">
            <h1 className="detail__title">{movie.title}</h1>

            {movie.tagline && (
              <p className="detail__tagline">
                {movie.tagline}
              </p>
            )}

            <ul className="facts">
              {year && <li>{year}</li>}

              {runtime && <li>{runtime}</li>}

              {movie.vote_average > 0 && (
                <li className="facts__rating">
                  ★ {movie.vote_average.toFixed(1)}
                </li>
              )}
            </ul>

            <ul className="chips">
              {(movie.genres ?? []).map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>

            <p className="detail__overview">
              {movie.overview ||
                'No overview is available for this movie yet.'}
            </p>

            <button
              className={saved ? 'btn btn--ghost' : 'btn'}
              aria-pressed={saved}
              onClick={() =>
                saved
                  ? removeMovie(movie.id)
                  : addMovie(movie)
              }
            >
              {saved
                ? 'Remove from watchlist'
                : 'Add to watchlist'}
            </button>
          </div>
        </div>
      </section>

      {/* Streaming platforms */}
      <WhereToWatch
  movieId={movie.id}
  movieTitle={movie.title}
/>

      {/* Cast */}
      {cast.length > 0 && (
        <section className="cast-section">
          <h2 className="subhead">Cast</h2>

          <ul className="cast">
            {cast.map((person) => (
              <li key={person.id}>
                {person.name}
                {person.character && (
                  <span>{person.character}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Movie trailer */}
      <section className="trailer-section">
        <h2 className="subhead">Official Trailer</h2>

        {trailer ? (
          <div className="trailer-wrapper">
            <iframe
              className="trailer"
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
              title={`${movie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="muted">
            No YouTube trailer is available for this movie.
          </p>
        )}
      </section>
    </article>
  );
}
