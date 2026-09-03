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
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { city, question } = body;
  if (!city || !question) {
    return new Response(JSON.stringify({ error: 'city and question are required' }), { status: 400 });
  }

  try {
    // Fetch weather data (reuse the same logic)
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return new Response(JSON.stringify({ error: `City "${city}" not found` }), { status: 404 });
    }

    const result = geoData.results.find(r => r.country === 'India') || geoData.results[0];
    const { latitude, longitude, timezone, name } = result;

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current_weather=true&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
      `&timezone=${encodeURIComponent(timezone)}&forecast_days=3`
    );
    const weatherData = await weatherRes.json();

    const cw = weatherData.current_weather;
    const temp = cw.temperature;
    const condition = weatherCodeToCondition(cw.weathercode);
    const wind = cw.windspeed;

    const weatherSummary = `In ${name}, current weather is ${condition} with a temperature of ${temp}°C and wind speed of ${wind} km/h.`;

    // Simple rule-based answers (no AI needed)
    let answer = weatherSummary;

    const q = question.toLowerCase();
    if (q.includes('temperature') || q.includes('how hot') || q.includes('how cold')) {
      answer += ` The temperature is ${temp}°C. `;
      if (temp >= 35) answer += "It's quite hot today — stay hydrated!";
      else if (temp >= 25) answer += "Pleasant weather today.";
      else if (temp >= 15) answer += "Cool and comfortable.";
      else answer += "It's chilly — wear a jacket!";
    } else if (q.includes('rain') || q.includes('umbrella') || q.includes('storm')) {
      const todayRain = weatherData.daily.precipitation_probability_max?.[0] ?? 0;
      answer += ` There's a ${todayRain}% chance of rain today. `;
      answer += todayRain >= 50 ? "You might want to carry an umbrella!" : "Rain seems unlikely today.";
    } else if (q.includes('wind')) {
      answer += ` Wind is blowing at ${wind} km/h. `;
      answer += wind >= 30 ? "Strong winds today — be careful outdoors!" : "Wind is light and pleasant.";
    } else if (q.includes('outdoor') || q.includes('go out') || q.includes('activity')) {
      const todayRain = weatherData.daily.precipitation_probability_max?.[0] ?? 0;
      answer += ` With ${condition} skies and only ${todayRain}% rain chance, it looks like a good day for outdoor activities!`;
    } else if (q.includes('wear') || q.includes('dress') || q.includes('clothes')) {
      answer += " " + (temp >= 30 ? "Light, breathable clothing is recommended." : temp >= 20 ? "Light layers would be comfortable." : "Wear warm layers — it's cool outside.");
    } else {
      answer += " " + question.charAt(0).toUpperCase() + question.slice(1);
    }

    return new Response(JSON.stringify({ answer }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
