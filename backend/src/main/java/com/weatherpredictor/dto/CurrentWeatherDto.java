package com.weatherpredictor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentWeatherDto {
    private Double temperature;
    private String condition;
    private Integer weatherCode;
    private Double windSpeed;
    private Integer windDirection;
    private Integer precipitationProbability;
    private Double precipitation;
    private Integer humidity;
    private Double feelsLike;
    private Integer uvIndex;
    private Double visibility;
    private Double pressure;
}