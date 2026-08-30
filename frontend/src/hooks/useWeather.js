import { useState, useEffect, useCallback } from 'react'
import { weatherService } from '../services/weatherService.js'

export function useWeather(initialCity = 'Bengaluru') {
  const [city, setCity] = useState(initialCity)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (cityName) => {
    setLoading(true)
    setError(null)
    try {
      const data = await weatherService.getWeather(cityName)
      setWeatherData(data)
      setCity(cityName)
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather(city)
  }, [fetchWeather])

  return {
    city,
    weatherData,
    loading,
    error,
    refresh: fetchWeather,
    setCity: fetchWeather,
  }
}

export function useWeatherAssistant() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const ask = useCallback(async (city, question) => {
    setLoading(true)
    setError(null)
    try {
      const answer = await weatherService.askWeatherQuestion(city, question)
      return answer
    } catch (err) {
      const errorMsg = 'Weather Assistant is temporarily unavailable. Try again shortly.'
      setError(errorMsg)
      return errorMsg
    } finally {
      setLoading(false)
    }
  }, [])

  return { ask, loading, error }
}

export function useCitySearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await weatherService.searchCities(query)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Failed to search cities')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, error, search }
}

export function useSavedLocations() {
  const [locations, setLocations] = useState(() => {
    try {
      const saved = localStorage.getItem('weather-predictor-saved-locations')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const saveLocation = useCallback((location) => {
    setLocations(prev => {
      const exists = prev.find(l => l.name === location.name && l.state === location.state)
      if (exists) return prev
      const updated = [...prev, location]
      localStorage.setItem('weather-predictor-saved-locations', JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeLocation = useCallback((location) => {
    setLocations(prev => {
      const updated = prev.filter(l => l.name !== location.name || l.state !== location.state)
      localStorage.setItem('weather-predictor-saved-locations', JSON.stringify(updated))
      return updated
    })
  }, [])

  const isSaved = useCallback((location) => {
    return locations.some(l => l.name === location.name && l.state === location.state)
  }, [locations])

  return { locations, saveLocation, removeLocation, isSaved }
}