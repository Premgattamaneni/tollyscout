import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import MovieGrid from '../components/MovieGrid';

export default function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <section>
      <h1 className="page-title">My watchlist</h1>

      {watchlist.length === 0 ? (
        <div className="empty">
          <p>Your watchlist is empty.</p>
          <p>Open any movie and choose Add to watchlist to save it here.</p>
          <Link to="/" className="btn">Discover movies</Link>
        </div>
      ) : (
        <>
          <p className="muted">
            {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
          </p>
          <MovieGrid movies={watchlist} />
        </>
      )}
    </section>
  );
}