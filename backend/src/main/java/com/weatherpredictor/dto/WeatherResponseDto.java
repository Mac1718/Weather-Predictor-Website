package com.weatherpredictor.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherResponseDto {
    private LocationDto location;
    private CurrentWeatherDto current;
    private List<HourlyForecastDto> hourly;
    private List<DailyForecastDto> daily;
}