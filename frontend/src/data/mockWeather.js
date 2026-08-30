// Mock weather data for frontend development
// This will be replaced with real API data once backend is integrated

export const mockWeatherData = {
  location: {
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'Asia/Kolkata',
  },
  current: {
    temperature: 27,
    condition: 'Partly Cloudy',
    weatherCode: 3,
    windSpeed: 12,
    windDirection: 220,
    precipitationProbability: 30,
    precipitation: 0.2,
    humidity: 65,
    feelsLike: 28,
    uvIndex: 6,
    visibility: 10,
    pressure: 1013,
  },
  hourly: [
    { time: '06:00', temperature: 22, precipitationProbability: 10, precipitation: 0, windSpeed: 8, weatherCode: 2, condition: 'Clear' },
    { time: '09:00', temperature: 25, precipitationProbability: 15, precipitation: 0, windSpeed: 10, weatherCode: 2, condition: 'Partly Cloudy' },
    { time: '12:00', temperature: 29, precipitationProbability: 20, precipitation: 0, windSpeed: 12, weatherCode: 3, condition: 'Partly Cloudy' },
    { time: '15:00', temperature: 31, precipitationProbability: 35, precipitation: 0.1, windSpeed: 14, weatherCode: 3, condition: 'Partly Cloudy' },
    { time: '18:00', temperature: 28, precipitationProbability: 65, precipitation: 2.5, windSpeed: 16, weatherCode: 61, condition: 'Rain' },
    { time: '21:00', temperature: 25, precipitationProbability: 70, precipitation: 3.2, windSpeed: 14, weatherCode: 61, condition: 'Rain' },
    { time: '00:00', temperature: 23, precipitationProbability: 40, precipitation: 0.8, windSpeed: 10, weatherCode: 3, condition: 'Partly Cloudy' },
    { time: '03:00', temperature: 21, precipitationProbability: 15, precipitation: 0, windSpeed: 8, weatherCode: 2, condition: 'Clear' },
  ],
  daily: [
    { date: '2026-08-30', day: 'Saturday', condition: 'Partly Cloudy', weatherCode: 3, high: 31, low: 22, precipitationProbability: 35, windSpeed: 14, sunrise: '06:15', sunset: '18:45' },
    { date: '2026-08-31', day: 'Sunday', condition: 'Rain', weatherCode: 61, high: 28, low: 23, precipitationProbability: 75, windSpeed: 16, sunrise: '06:15', sunset: '18:44' },
    { date: '2026-09-01', day: 'Monday', condition: 'Rain', weatherCode: 61, high: 27, low: 22, precipitationProbability: 80, windSpeed: 18, sunrise: '06:15', sunset: '18:44' },
    { date: '2026-09-02', day: 'Tuesday', condition: 'Cloudy', weatherCode: 4, high: 29, low: 22, precipitationProbability: 40, windSpeed: 12, sunrise: '06:14', sunset: '18:43' },
    { date: '2026-09-03', day: 'Wednesday', condition: 'Partly Cloudy', weatherCode: 3, high: 30, low: 21, precipitationProbability: 25, windSpeed: 10, sunrise: '06:14', sunset: '18:42' },
    { date: '2026-09-04', day: 'Thursday', condition: 'Sunny', weatherCode: 1, high: 32, low: 22, precipitationProbability: 10, windSpeed: 8, sunrise: '06:14', sunset: '18:42' },
    { date: '2026-09-05', day: 'Friday', condition: 'Partly Cloudy', weatherCode: 3, high: 31, low: 23, precipitationProbability: 20, windSpeed: 10, sunrise: '06:13', sunset: '18:41' },
  ],
  metrics: {
    temperature: 27,
    windSpeed: 12,
    rainProbability: 30,
    humidity: 65,
    feelsLike: 28,
    uvIndex: 6,
    visibility: 10,
    pressure: 1013,
  },
  cities: [
    { name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707 },
    { name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777 },
    { name: 'Delhi', state: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025 },
    { name: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lon: 78.4867 },
    { name: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lon: 88.3639 },
    { name: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, lon: 73.8567 },
    { name: 'Ahmedabad', state: 'Gujarat', country: 'India', lat: 23.0225, lon: 72.5714 },
    { name: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124, lon: 75.7873 },
    { name: 'Surat', state: 'Gujarat', country: 'India', lat: 21.1702, lon: 72.8311 },
    { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', lat: 26.8467, lon: 80.9462 },
    { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', lat: 26.4499, lon: 80.3319 },
    { name: 'Nagpur', state: 'Maharashtra', country: 'India', lat: 21.1458, lon: 79.0882 },
    { name: 'Indore', state: 'Madhya Pradesh', country: 'India', lat: 22.7196, lon: 75.8577 },
    { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', lat: 23.2599, lon: 77.4126 },
    { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', lat: 11.0168, lon: 76.9558 },
    { name: 'Kochi', state: 'Kerala', country: 'India', lat: 9.9312, lon: 76.2673 },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', lat: 17.6868, lon: 83.2185 },
    { name: 'Patna', state: 'Bihar', country: 'India', lat: 25.5941, lon: 85.1376 },
    { name: 'Bhubaneswar', state: 'Odisha', country: 'India', lat: 20.2961, lon: 85.8245 },
    { name: 'Chandigarh', state: 'Chandigarh', country: 'India', lat: 30.7333, lon: 76.7794 },
    { name: 'Guwahati', state: 'Assam', country: 'India', lat: 26.1445, lon: 91.7362 },
    { name: 'Mysuru', state: 'Karnataka', country: 'India', lat: 12.2958, lon: 76.6394 },
    { name: 'Madurai', state: 'Tamil Nadu', country: 'India', lat: 9.9252, lon: 78.1198 },
    { name: 'Thiruvananthapuram', state: 'Kerala', country: 'India', lat: 8.5241, lon: 76.9366 },
  ],
}

export const weatherCodeToCondition = (code) => {
  const codes = {
    0: 'Clear',
    1: 'Sunny',
    2: 'Partly Cloudy',
    3: 'Partly Cloudy',
    4: 'Cloudy',
    45: 'Fog',
    48: 'Fog',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    56: 'Freezing Drizzle',
    57: 'Freezing Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    66: 'Freezing Rain',
    67: 'Freezing Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Rain Showers',
    81: 'Rain Showers',
    82: 'Heavy Rain Showers',
    85: 'Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Heavy Hail',
  }
  return codes[code] || 'Unknown'
}

export const weatherCodeToIcon = (code) => {
  if (code === 0 || code === 1) return 'i-sun'
  if (code === 2 || code === 3) return 'i-cloud2'
  if (code === 4) return 'i-cloud'
  if (code >= 45 && code <= 48) return 'i-cloud'
  if (code >= 51 && code <= 57) return 'i-cloud2'
  if (code >= 61 && code <= 67) return 'i-hail'
  if (code >= 71 && code <= 77) return 'i-hail'
  if (code >= 80 && code <= 82) return 'i-hail'
  if (code >= 85 && code <= 86) return 'i-hail'
  if (code >= 95) return 'i-hail'
  return 'i-cloud'
}