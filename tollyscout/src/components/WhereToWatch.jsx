
import { useEffect, useState } from 'react';
import './WhereToWatch.css';

const API_KEY = import.meta.env.VITE_TMDB_KEY;

// These are platform search pages, not guaranteed direct movie pages.
function getPlatformSearchUrl(providerName, movieTitle) {
  const query = encodeURIComponent(movieTitle);

  const platforms = {
    Netflix: `https://www.netflix.com/search?q=${query}`,
    'Amazon Prime Video': `https://www.primevideo.com/search?phrase=${query}`,
    'Prime Video': `https://www.primevideo.com/search?phrase=${query}`,
    'JioHotstar': `https://www.hotstar.com/in/search?q=${query}`,
    Hotstar: `https://www.hotstar.com/in/search?q=${query}`,
    ZEE5: `https://www.zee5.com/search?q=${query}`,
    Aha: `https://www.aha.video/search?search=${query}`,
    SonyLIV: `https://www.sonyliv.com/search/${query}`,
    YouTube: `https://www.youtube.com/results?search_query=${query}`,
    'Apple TV': `https://tv.apple.com/in/search?term=${query}`,
  };

  return platforms[providerName] || null;
}

export default function WhereToWatch({ movieId, movieTitle }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchProviders() {
      setLoading(true);
      setProviders([]);

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`TMDB request failed: ${response.status}`);
        }

        const data = await response.json();
        const india = data.results?.IN;

        const all = [
          ...(india?.flatrate || []),
          ...(india?.free || []),
          ...(india?.ads || []),
          ...(india?.rent || []),
          ...(india?.buy || []),
        ];

        const unique = [
          ...new Map(
            all.map((provider) => [
              provider.provider_id,
              provider,
            ])
          ).values(),
        ];

        if (!ignore) setProviders(unique);
      } catch (error) {
        console.error('Streaming providers error:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (movieId) fetchProviders();

    return () => {
      ignore = true;
    };
  }, [movieId]);

  return (
    <section className="where-to-watch">
      <h2 className="subhead">Where to Watch</h2>
      <p className="watch-region">Streaming platforms in India</p>

      {loading ? (
        <p className="muted">Checking platforms...</p>
      ) : providers.length === 0 ? (
        <p className="muted">
          No streaming availability information found for India.
        </p>
      ) : (
        <div className="provider-list">
          {providers.map((provider) => {
            const url = getPlatformSearchUrl(
              provider.provider_name,
              movieTitle
            );

            return (
              <a
                key={provider.provider_id}
                className="provider-card"
                href={url || `https://www.google.com/search?q=${encodeURIComponent(
                  `${provider.provider_name} ${movieTitle} watch online India`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Search for ${movieTitle} on ${provider.provider_name}`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                  alt=""
                  loading="lazy"
                />
                <span>{provider.provider_name}</span>
                <span aria-hidden="true">↗</span>
              </a>
            );
          })}
        </div>
      )}

      <p className="watch-credit">
        Availability data provided by JustWatch via TMDB.
        Platform search links may not lead directly to the movie.
      </p>
    </section>
  );
}
