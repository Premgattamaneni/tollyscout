import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

export default function Navbar() {
  const { watchlist } = useWatchlist();

  return (
    <nav
      style={{
        display: 'flex',
        gap: 20,
        padding: '12px 0',
        marginBottom: 16,
        borderBottom: '1px solid #8884',
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/watchlist">Watchlist ({watchlist.length})</Link>
    </nav>
  );
}