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
public class HourlyForecastDto {
    private String time;
    private Double temperature;
    private Integer precipitationProbability;
    private Double precipitation;
    private Double windSpeed;
    private Integer weatherCode;
    private String condition;
}