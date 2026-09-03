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
  const city = searchParams.get('city');

  if (!city) {
    return new Response(JSON.stringify({ error: 'city parameter required' }), { status: 400 });
  }

  try {
    // Step 1: Geocode the city
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return new Response(JSON.stringify({ error: `City "${city}" not found` }), { status: 404 });
    }

    // Prefer Indian cities
    const result = geoData.results.find(r => r.country === 'India') || geoData.results[0];
    const { latitude, longitude, timezone, name, admin1, country } = result;

    const location = {
      city: name,
      state: admin1 || '',
      country: country || 'Unknown',
      latitude,
      longitude,
      timezone,
      display_name: `${name}, ${admin1 || ''}, ${country || ''}`.replace(/, ,/g, ',').replace(/^, |, $/, ''),
    };

    // Step 2: Fetch weather data
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
      `&current_weather=true` +
      `&timezone=${encodeURIComponent(timezone)}` +
      `&forecast_days=7`
    );
    const weatherData = await weatherRes.json();

    // Build current weather
    const cw = weatherData.current_weather;
    const current = {
      temperature: cw.temperature,
      condition: weatherCodeToCondition(cw.weathercode),
      weatherCode: cw.weathercode,
      windSpeed: cw.windspeed,
      windDirection: cw.winddirection,
      precipitationProbability: 0,
      precipitation: 0,
      humidity: 0,
    };

    // Build hourly forecast (3-hour intervals)
    const hourly = [];
    if (weatherData.hourly) {
      const { time, temperature_2m, precipitation_probability, precipitation, weather_code, wind_speed_10m } = weatherData.hourly;
      const now = new Date();
      const cutoff = new Date(now.getTime() - 3600000); // 1 hour ago

      for (let i = 0; i < time.length; i += 3) {
        if (i >= time.length) break;
        const entryTime = new Date(time[i] + 'Z');
        if (entryTime < cutoff) continue;

        hourly.push({
          time: entryTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
          temperature: Math.round(temperature_2m[i] ?? 0),
          precipitationProbability: precipitation_probability?.[i] ?? 0,
          precipitation: precipitation?.[i] ?? 0,
          windSpeed: Math.round(wind_speed_10m?.[i] ?? 0),
          weatherCode: weather_code?.[i] ?? 0,
          condition: weatherCodeToCondition(weather_code?.[i] ?? 0),
        });

        if (hourly.length >= 24) break;
      }
    }

    // Build daily forecast
    const daily = [];
    if (weatherData.daily) {
      const { time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max, wind_speed_10m_max, sunrise, sunset } = weatherData.daily;

      for (let i = 0; i < time.length; i++) {
        const date = new Date(time[i]);
        daily.push({
          date: time[i],
          day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
          condition: weatherCodeToCondition(weather_code[i]),
          weatherCode: weather_code[i],
          high: Math.round(temperature_2m_max[i] ?? 0),
          low: Math.round(temperature_2m_min[i] ?? 0),
          precipitationProbability: precipitation_probability_max?.[i] ?? 0,
          windSpeed: Math.round(wind_speed_10m_max?.[i] ?? 0),
          sunrise: sunrise?.[i] ? sunrise[i].substring(11, 16) : '',
          sunset: sunset?.[i] ? sunset[i].substring(11, 16) : '',
        });
      }
    }

    const response = {
      location,
      current,
      hourly,
      daily,
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
