export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search Telugu movies..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        maxWidth: 400,
        padding: '10px 14px',
        marginBottom: 20,
        fontSize: 16,
        borderRadius: 8,
        border: '1px solid #888',
      }}
    />
  );
}