package com.weatherpredictor.exception;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(CityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCityNotFound(CityNotFoundException ex) {
        log.warn("City not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("City not found", ex.getMessage()));
    }

    @ExceptionHandler(WeatherApiException.class)
    public ResponseEntity<ErrorResponse> handleWeatherApiException(WeatherApiException ex) {
        log.error("Weather API error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(ex.getStatusCode())
                .body(new ErrorResponse("Weather service unavailable", ex.getMessage()));
    }

    @ExceptionHandler(WebClientResponseException.class)
    public ResponseEntity<ErrorResponse> handleWebClientResponseException(WebClientResponseException ex) {
        log.error("External API error: {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString());
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(new ErrorResponse("Weather service error", "Unable to fetch weather data"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        log.warn("Validation error: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Validation failed", errors.toString()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Invalid argument: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Invalid request", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Internal server error", "An unexpected error occurred"));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorResponse {
        private String error;
        private String message;
    }
}