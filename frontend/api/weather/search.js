// Weather condition mapping (WMO codes)
const WMO_CODES = {
  0: 'Clear', 1: 'Sunny', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog',
  51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  56: 'Freezing Drizzle', 57: 'Freezing Drizzle',
  61: 'Rain', 63: 'Rain', 65: 'Heavy Rain',
  66: 'Freezing Rain', 67: 'Freezing Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
  77: 'Snow Grains', 80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Rain Showers',
  85: 'Snow Showers', 86: 'Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Hail',
};

export function weatherCodeToCondition(code) {
  return WMO_CODES[code] || 'Unknown';
}

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q) {
    return new Response(JSON.stringify({ error: 'q parameter required' }), { status: 400 });
  }

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return new Response(JSON.stringify({ error: `No results for "${q}"` }), { status: 404 });
    }

    // Prefer Indian cities
    const indian = geoData.results.find(r => r.country === 'India');
    const result = indian || geoData.results[0];

    const location = {
      city: result.name,
      state: result.admin1?.name || '',
      country: result.country || '',
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
      display_name: [result.name, result.admin1?.name, result.country].filter(Boolean).join(', '),
    };

    return new Response(JSON.stringify(location), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
