// Weather service - calls backend Spring Boot API

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const weatherService = {
  async getWeather(city) {
    const response = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city)}`)
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to fetch weather data')
    }
    return response.json()
  },

  async getCurrentWeather(city) {
    const response = await fetch(`${API_BASE}/weather/current?city=${encodeURIComponent(city)}`)
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to fetch current weather')
    }
    return response.json()
  },

  async getHourlyForecast(city) {
    const response = await fetch(`${API_BASE}/weather/hourly?city=${encodeURIComponent(city)}`)
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to fetch hourly forecast')
    }
    return response.json()
  },

  async getDailyForecast(city) {
    const response = await fetch(`${API_BASE}/weather/daily?city=${encodeURIComponent(city)}`)
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to fetch daily forecast')
    }
    return response.json()
  },

  async searchCities(query) {
    // Always show only top Indian cities
    const indiaCities = [
      { name: 'Mumbai', state: 'Maharashtra', country: 'India' },
      { name: 'Delhi', state: 'Delhi', country: 'India' },
      { name: 'Bengaluru', state: 'Karnataka', country: 'India' },
      { name: 'Hyderabad', state: 'Telangana', country: 'India' },
      { name: 'Chennai', state: 'Tamil Nadu', country: 'India' },
      { name: 'Kolkata', state: 'West Bengal', country: 'India' },
      { name: 'Pune', state: 'Maharashtra', country: 'India' },
      { name: 'Ahmedabad', state: 'Gujarat', country: 'India' },
      { name: 'Jaipur', state: 'Rajasthan', country: 'India' },
      { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
      { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India' },
      { name: 'Nagpur', state: 'Maharashtra', country: 'India' },
      { name: 'Indore', state: 'Madhya Pradesh', country: 'India' },
      { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India' },
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
      { name: 'Patna', state: 'Bihar', country: 'India' },
      { name: 'Vadodara', state: 'Gujarat', country: 'India' },
      { name: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India' },
      { name: 'Ludhiana', state: 'Punjab', country: 'India' },
      { name: 'Agra', state: 'Uttar Pradesh', country: 'India' },
      { name: 'Nashik', state: 'Maharashtra', country: 'India' },
      { name: 'Faridabad', state: 'Haryana', country: 'India' },
      { name: 'Kochi', state: 'Kerala', country: 'India' },
      { name: 'Coimbatore', state: 'Tamil Nadu', country: 'India' },
      { name: 'Surat', state: 'Gujarat', country: 'India' },
      { name: 'Chandigarh', state: 'Chandigarh', country: 'India' },
      { name: 'Guwahati', state: 'Assam', country: 'India' },
      { name: 'Thiruvananthapuram', state: 'Kerala', country: 'India' },
      { name: 'Mysuru', state: 'Karnataka', country: 'India' },
      { name: 'Bhubaneswar', state: 'Odisha', country: 'India' },
    ]
    if (!query || query.length < 1) return indiaCities.map((c, i) => ({ ...c, index: i }))
    const q = query.toLowerCase()
    return indiaCities.filter(c => c.name.toLowerCase().includes(q)).map((c, i) => ({ ...c, index: i }))
  },

  async askWeatherQuestion(city, question) {
    const response = await fetch(`${API_BASE}/weather/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, question })
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Weather Assistant is temporarily unavailable. Try again shortly.')
    }
    const data = await response.json()
    return data.answer
  }
}

export default weatherService