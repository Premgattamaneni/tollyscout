import MovieCard from './MovieCard';

export default function MovieGrid({ movies }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 16,
      }}
    >
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}