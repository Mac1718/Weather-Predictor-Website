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
public class DailyForecastDto {
    private String date;
    private String day;
    private String condition;
    private Integer weatherCode;
    private Double high;
    private Double low;
    private Integer precipitationProbability;
    private Double windSpeed;
    private String sunrise;
    private String sunset;
}