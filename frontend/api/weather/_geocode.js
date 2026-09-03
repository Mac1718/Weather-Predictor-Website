// Vercel serverless function - Geocode city to get coordinates
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const count = searchParams.get('count') || '5';
  const language = searchParams.get('language') || 'en';

  if (!name) {
    return new Response(JSON.stringify({ error: 'name parameter required' }), { status: 400 });
  }

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=${count}&language=${language}&format=json`
    );
    const data = await geoRes.json();

    if (!data.results || data.results.length === 0) {
      return new Response(JSON.stringify({ error: 'City not found' }), { status: 404 });
    }

    // Prefer Indian cities
    const indian = data.results.find(r => r.country === 'India');
    const result = indian || data.results[0];

    return new Response(JSON.stringify({
      results: [{
        id: result.id,
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        elevation: result.elevation,
        feature_code: result.feature_code,
        country_code: result.country_code,
        country: result.country,
        admin1: result.admin1?.name,
        admin2: result.admin2?.name,
        admin3: result.admin3?.name,
        timezone: result.timezone,
        population: result.population,
        country_id: result.country_id,
      }]
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
