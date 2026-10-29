import MovieCard from './MovieCard';

export default function MovieGrid({ movies }) {
  return (
    <div className="grid">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}