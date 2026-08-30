package com.weatherpredictor.service;

import com.weatherpredictor.dto.LocationDto;
import com.weatherpredictor.dto.WeatherResponseDto;
import com.weatherpredictor.provider.OpenMeteoProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private final OpenMeteoProvider provider;

    public WeatherService(OpenMeteoProvider provider) {
        this.provider = provider;
    }

    @Cacheable(value = "weather-full", key = "#city.toLowerCase()", unless = "#result == null")
    public WeatherResponseDto getWeatherForCity(String city) {
        log.info("Fetching weather for city: {}", city);

        // First, geocode the city to get coordinates
        LocationDto location = provider.findCity(city);

        // Then fetch weather using coordinates
        WeatherResponseDto weather = provider.getWeather(
                location.getLatitude(),
                location.getLongitude(),
                location.getTimezone()
        );

        // Enrich the response with location details
        weather.getLocation().setCity(location.getCity());
        weather.getLocation().setState(location.getState());
        weather.getLocation().setCountry(location.getCountry());
        weather.getLocation().setDisplayName(location.getDisplayName());

        return weather;
    }

    public LocationDto searchCity(String query) {
        log.debug("Searching for city: {}", query);
        return provider.findCity(query);
    }
}