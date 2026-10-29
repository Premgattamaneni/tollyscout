
import { useEffect, useState } from 'react';
import './WhereToWatch.css';

export default function WhereToWatch({ movieId }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadOptions() {
      setLoading(true);
      setError('');
      setOptions([]);

      try {
        const response = await fetch(`/api/streaming?id=${movieId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load streaming options');
        }

        if (!ignore) {
          setOptions(data.streamingOptions || []);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (movieId) loadOptions();

    return () => {
      ignore = true;
    };
  }, [movieId]);

  return (
    <section className="where-to-watch">
      <h2 className="subhead">Where to Watch</h2>
      <p className="watch-region">Streaming options in India</p>

      {loading && <p className="muted">Loading platforms...</p>}

      {!loading && error && (
        <p className="status status--error">{error}</p>
      )}

      {!loading && !error && options.length === 0 && (
        <p className="muted">
          No streaming links found for this movie in India.
        </p>
      )}

      <div className="provider-list">
        {options.map((option, index) => (
          <a
            key={`${option.provider}-${option.type}-${index}`}
            className="provider-card"
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {option.logo && (
              <img src={option.logo} alt="" loading="lazy" />
            )}

            <span>{option.provider}</span>

            <small>
              {option.type === 'subscription'
                ? 'Stream'
                : option.type === 'rent'
                  ? 'Rent'
                  : option.type === 'buy'
                    ? 'Buy'
                    : option.type}
            </small>

            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>

      <p className="watch-credit">
        Streaming availability provided by Movie of the Night.
      </p>
    </section>
  );
}
