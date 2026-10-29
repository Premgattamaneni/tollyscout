import { Link } from 'react-router-dom';
import { posterUrl } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ movie }) {
  const { isInWatchlist } = useWatchlist();
  const year = movie.release_date?.slice(0, 4);

  return (
    <Link to={`/movie/${movie.id}`} className="card">
      <div className="card__poster">
        <img src={posterUrl(movie.poster_path)} alt={`${movie.title} poster`} loading="lazy" />
        {movie.vote_average > 0 && (
          <span className="card__rating">★ {movie.vote_average.toFixed(1)}</span>
        )}
        {isInWatchlist(movie.id) && <span className="card__saved">Saved</span>}
      </div>
      <h3 className="card__title">{movie.title}</h3>
      {year && <p className="card__year">{year}</p>}
    </Link>
  );
}