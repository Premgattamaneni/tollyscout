export default function SearchBar({ value, onChange }) {
  return (
    <label className="ticket">
      <span className="ticket__stub">Search</span>
      <input
        type="search"
        placeholder="Try Pushpa, RRR or Baahubali"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search Telugu movies"
      />
    </label>
  );
}