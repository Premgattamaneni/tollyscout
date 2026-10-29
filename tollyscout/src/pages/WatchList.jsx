import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import MovieGrid from '../components/MovieGrid';

export default function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div>
      <h1>My Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>
          Nothing saved yet. <Link to="/">Browse movies</Link>
        </p>
      ) : (
        <MovieGrid movies={watchlist} />
      )}
    </div>
  );
}