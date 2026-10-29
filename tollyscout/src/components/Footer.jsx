export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: '20px 0',
        borderTop: '1px solid #8884',
        fontSize: 14,
        opacity: 0.8,
      }}
    >
      <p>
        This product uses the TMDB API but is not endorsed or certified by{' '}
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
          TMDB
        </a>
        .
      </p>
      <p>TollyScout, a personal project built with React.</p>
    </footer>
  );
}