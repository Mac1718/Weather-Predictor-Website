package com.weatherpredictor.controller;

import com.weatherpredictor.dto.AssistantRequestDto;
import com.weatherpredictor.dto.AssistantResponseDto;
import com.weatherpredictor.dto.WeatherResponseDto;
import com.weatherpredictor.service.AssistantService;
import com.weatherpredictor.service.WeatherService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/weather")
public class AssistantController {

    private static final Logger log = LoggerFactory.getLogger(AssistantController.class);

    private final AssistantService assistantService;
    private final WeatherService weatherService;

    public AssistantController(AssistantService assistantService, WeatherService weatherService) {
        this.assistantService = assistantService;
        this.weatherService = weatherService;
    }

    @PostMapping("/ask")
    public ResponseEntity<AssistantResponseDto> askWeather(@Valid @RequestBody AssistantRequestDto request) {
        log.info("POST /weather/ask - city: {}, question: {}", request.getCity(), request.getQuestion());

        // Fetch weather data for the city
        WeatherResponseDto weatherData = weatherService.getWeatherForCity(request.getCity());

        // Generate answer using the assistant service
        AssistantResponseDto response = assistantService.answerQuestion(request, weatherData);

        return ResponseEntity.ok(response);
    }
}