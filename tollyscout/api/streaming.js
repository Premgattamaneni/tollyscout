
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const { id } = req.query;
  const apiKey = process.env.STREAMING_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Streaming API key is not configured',
    });
  }

  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'A valid TMDB movie ID is required',
    });
  }

  try {
    const response = await fetch(
      `https://api.movieofthenight.com/v4/shows/movie/${encodeURIComponent(id)}?country=in`,
      {
        headers: {
          'X-API-Key': apiKey,
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || 'Streaming API request failed',
      });
    }

    const options = data.streamingOptions?.in || [];

    return res.status(200).json({
      title: data.title,
      streamingOptions: options.map((option) => ({
        provider: option.service?.name || 'Streaming service',
        logo: option.service?.imageSet?.darkThemeImage || '',
        type: option.type,
        link: option.videoLink || option.link,
        quality: option.quality || '',
        price: option.price?.formatted || '',
      })).filter((option) => option.link),
    });
  } catch (error) {
    console.error('Streaming API error:', error);

    return res.status(500).json({
      error: 'Could not retrieve streaming options',
    });
  }
}
