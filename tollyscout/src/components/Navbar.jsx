import { Link, NavLink } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

export default function Navbar() {
  const { watchlist } = useWatchlist();

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="brand">TollyScout</Link>
        <nav className="nav__links">
          <NavLink to="/" end>Discover</NavLink>
          <NavLink to="/watchlist">
            Watchlist <span className="count">{watchlist.length}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}