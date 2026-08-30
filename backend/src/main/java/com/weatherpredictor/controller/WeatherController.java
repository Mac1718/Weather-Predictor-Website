package com.weatherpredictor.controller;

import com.weatherpredictor.dto.LocationDto;
import com.weatherpredictor.dto.WeatherResponseDto;
import com.weatherpredictor.service.WeatherService;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/weather")
@Validated
public class WeatherController {

    private static final Logger log = LoggerFactory.getLogger(WeatherController.class);

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<WeatherResponseDto> getWeather(@RequestParam @NotBlank String city) {
        log.info("GET /weather?city={}", city);
        WeatherResponseDto weather = weatherService.getWeatherForCity(city);
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/current")
    public ResponseEntity<WeatherResponseDto> getCurrentWeather(@RequestParam @NotBlank String city) {
        log.info("GET /weather/current?city={}", city);
        WeatherResponseDto weather = weatherService.getWeatherForCity(city);
        // Return only current weather (but full response is fine for now)
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/hourly")
    public ResponseEntity<WeatherResponseDto> getHourlyForecast(@RequestParam @NotBlank String city) {
        log.info("GET /weather/hourly?city={}", city);
        WeatherResponseDto weather = weatherService.getWeatherForCity(city);
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/daily")
    public ResponseEntity<WeatherResponseDto> getDailyForecast(@RequestParam @NotBlank String city) {
        log.info("GET /weather/daily?city={}", city);
        WeatherResponseDto weather = weatherService.getWeatherForCity(city);
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/search")
    public ResponseEntity<LocationDto> searchCity(@RequestParam @NotBlank String q) {
        log.info("GET /weather/search?q={}", q);
        LocationDto location = weatherService.searchCity(q);
        return ResponseEntity.ok(location);
    }
}