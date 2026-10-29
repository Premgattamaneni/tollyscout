import { Link } from 'react-router-dom';
import { posterUrl } from '../services/api';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <img
        src={posterUrl(movie.poster_path)}
        alt={movie.title}
        style={{ width: '100%', borderRadius: 8 }}
      />
      <p style={{ margin: '8px 0 0' }}>{movie.title}</p>
      <small>⭐ {movie.vote_average.toFixed(1)}</small>
    </Link>
  );
}