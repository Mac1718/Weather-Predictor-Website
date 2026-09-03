package com.weatherpredictor.provider;

import com.weatherpredictor.dto.*;
import com.weatherpredictor.exception.CityNotFoundException;
import com.weatherpredictor.exception.WeatherApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
public class OpenMeteoProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenMeteoProvider.class);

    private final WebClient weatherClient;
    private final WebClient geocodingClient;
    private final int connectTimeout;
    private final int readTimeout;

    public OpenMeteoProvider(
            @Value("${weather.api.base-url}") String weatherBaseUrl,
            @Value("${weather.geocoding.base-url}") String geocodingBaseUrl,
            @Value("${weather.api.timeout.connect}") int connectTimeout,
            @Value("${weather.api.timeout.read}") int readTimeout) {
        this.connectTimeout = connectTimeout;
        this.readTimeout = readTimeout;

        this.weatherClient = WebClient.builder()
                .baseUrl(weatherBaseUrl)
                .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
                .build();

        this.geocodingClient = WebClient.builder()
                .baseUrl(geocodingBaseUrl)
                .defaultHeader("Accept", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Cacheable(value = "geocoding", key = "#city.toLowerCase()", unless = "#result == null")
    public LocationDto findCity(String city) {
        log.debug("Geocoding city: {}", city);

        try {
            GeocodingResponse response = geocodingClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search")
                            .queryParam("name", city)
                            .queryParam("count", 10)
                            .queryParam("language", "en")
                            .queryParam("format", "json")
                            .build())
                    .retrieve()
                    .bodyToMono(GeocodingResponse.class)
                    .block();

            if (response == null || response.getResults() == null || response.getResults().isEmpty()) {
                throw new CityNotFoundException(city);
            }

            // Prefer Indian cities
            var indianResult = response.getResults().stream()
                    .filter(r -> "India".equalsIgnoreCase(r.getCountry()))
                    .findFirst()
                    .orElse(response.getResults().get(0));

            return mapToLocationDto(indianResult);

        } catch (CityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Geocoding failed for city: {}", city, e);
            throw new WeatherApiException("Failed to geocode city: " + city, e);
        }
    }

    @Cacheable(value = "weather", key = "#latitude + ',' + #longitude", unless = "#result == null")
    public WeatherResponseDto getWeather(double latitude, double longitude, String timezone) {
        log.debug("Fetching weather for lat={}, lon={}, timezone={}", latitude, longitude, timezone);

        try {
            WeatherApiResponse response = weatherClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/forecast")
                            .queryParam("latitude", latitude)
                            .queryParam("longitude", longitude)
                            .queryParam("hourly", "temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m")
                            .queryParam("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset")
                            .queryParam("current_weather", "true")
                            .queryParam("timezone", timezone)
                            .queryParam("forecast_days", 7)
                            .build())
                    .retrieve()
                    .bodyToMono(WeatherApiResponse.class)
                    .block();

            if (response == null) {
                throw new WeatherApiException("Empty response from weather API");
            }

            return mapToWeatherResponse(response, latitude, longitude, timezone);

        } catch (WeatherApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Weather fetch failed for lat={}, lon={}", latitude, longitude, e);
            throw new WeatherApiException("Failed to fetch weather data", e);
        }
    }

    private LocationDto mapToLocationDto(GeocodingResult result) {
        return LocationDto.builder()
                .city(result.getName())
                .state(result.getAdmin1())
                .country(result.getCountry())
                .latitude(result.getLatitude())
                .longitude(result.getLongitude())
                .timezone(result.getTimezone())
                .displayName(String.format("%s, %s, %s", result.getName(), result.getAdmin1(), result.getCountry()))
                .build();
    }

    private WeatherResponseDto mapToWeatherResponse(WeatherApiResponse response, double lat, double lon, String timezone) {
        ZoneId zoneId = ZoneId.of(timezone);
        ZonedDateTime now = ZonedDateTime.now(zoneId);

        // Current weather
        CurrentWeatherDto current = null;
        if (response.getCurrentWeather() != null) {
            CurrentWeather cw = response.getCurrentWeather();
            current = CurrentWeatherDto.builder()
                    .temperature(cw.getTemperature())
                    .condition(weatherCodeToCondition(cw.getWeatherCode()))
                    .weatherCode(cw.getWeatherCode())
                    .windSpeed(cw.getWindSpeed())
                    .windDirection(cw.getWindDirection())
                    .precipitationProbability(0)
                    .precipitation(0.0)
                    .humidity(0)
                    .build();
        }

        // Hourly forecast - convert to 3-hour intervals
        List<HourlyForecastDto> hourly = new ArrayList<>();
        if (response.getHourly() != null) {
            HourlyData h = response.getHourly();
            int size = h.getTime().size();
ZonedDateTime cutoff = now.minusHours(1);

            for (int i = 0; i < size; i += 3) { // Every 3 hours
                if (i >= size) break;

                String timeStr = h.getTime().get(i);
                ZonedDateTime entryTime = ZonedDateTime.parse(timeStr + "Z").withZoneSameInstant(zoneId);

                // Only include future/current hours
                if (entryTime.isBefore(cutoff)) continue;

                Double temp = h.getTemperature2m().get(i);
                Integer precipProb = h.getPrecipitationProbability().get(i);
                Double precip = h.getPrecipitation().get(i);
                Double windSpeed = h.getWindSpeed10m().get(i);
                Integer weatherCode = h.getWeatherCode().get(i);

                hourly.add(HourlyForecastDto.builder()
                        .time(entryTime.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                        .temperature(temp != null ? Math.round(temp) : 0.0)
                        .precipitationProbability(precipProb != null ? precipProb : 0)
                        .precipitation(precip != null ? precip : 0.0)
                        .windSpeed(windSpeed != null ? Math.round(windSpeed) : 0.0)
                        .weatherCode(weatherCode != null ? weatherCode : 0)
                        .condition(weatherCodeToCondition(weatherCode != null ? weatherCode : 0))
                        .build());

                if (hourly.size() >= 24) break; // Limit to 24 entries (3 days of 3-hour intervals)
            }
        }

        // Daily forecast
        List<DailyForecastDto> daily = new ArrayList<>();
        if (response.getDaily() != null) {
            DailyData d = response.getDaily();
            int size = d.getTime().size();

            for (int i = 0; i < size; i++) {
                String dateStr = d.getTime().get(i);
                LocalDate date = LocalDate.parse(dateStr);

                DailyForecastDto dailyDto = DailyForecastDto.builder()
                        .date(dateStr)
                        .day(date.getDayOfWeek().toString().substring(0, 3))
                        .condition(weatherCodeToCondition(d.getWeatherCode().get(i)))
                        .weatherCode(d.getWeatherCode().get(i))
                        .high(d.getTemperature2mMax().get(i) != null ? Math.round(d.getTemperature2mMax().get(i)) : 0.0)
                        .low(d.getTemperature2mMin().get(i) != null ? Math.round(d.getTemperature2mMin().get(i)) : 0.0)
                        .precipitationProbability(d.getPrecipitationProbabilityMax().get(i) != null ? d.getPrecipitationProbabilityMax().get(i) : 0)
                        .windSpeed(d.getWindSpeed10mMax().get(i) != null ? Math.round(d.getWindSpeed10mMax().get(i)) : 0.0)
                        .sunrise(d.getSunrise().get(i) != null ? d.getSunrise().get(i).substring(11, 16) : "")
                        .sunset(d.getSunset().get(i) != null ? d.getSunset().get(i).substring(11, 16) : "")
                        .build();
                daily.add(dailyDto);
            }
        }

        // If we have current weather but no hourly data, create a basic hourly from daily
        if (hourly.isEmpty() && !daily.isEmpty()) {
            // Generate basic 3-hour intervals from daily data
            hourly.addAll(generateBasicHourly(daily.get(0), now));
        }

        LocationDto location = LocationDto.builder()
                .city("")
                .state("")
                .country("India")
                .latitude(lat)
                .longitude(lon)
                .timezone(timezone)
                .build();

        return WeatherResponseDto.builder()
                .location(location)
                .current(current)
                .hourly(hourly)
                .daily(daily)
                .build();
    }

    private List<HourlyForecastDto> generateBasicHourly(DailyForecastDto daily, ZonedDateTime now) {
        List<HourlyForecastDto> hourly = new ArrayList<>();
        double high = daily.getHigh();
        double low = daily.getLow();
        double mid = (high + low) / 2;

        // Generate 8 3-hour intervals
        for (int i = 0; i < 8; i++) {
            int hour = (now.getHour() / 3 + i) * 3 % 24;
            String timeStr = String.format("%02d:00", hour);

            double temp;
            if (hour >= 6 && hour <= 18) {
                temp = low + (high - low) * Math.sin(Math.PI * (hour - 6) / 12);
            } else {
                temp = low + (high - low) * 0.3;
            }

            hourly.add(HourlyForecastDto.builder()
                    .time(timeStr)
                    .temperature((double) Math.round(temp))
                    .precipitationProbability(daily.getPrecipitationProbability())
                    .precipitation(0.0)
                    .windSpeed(daily.getWindSpeed())
                    .weatherCode(daily.getWeatherCode())
                    .condition(daily.getCondition())
                    .build());
        }
        return hourly;
    }

    private String weatherCodeToCondition(int code) {
        return switch (code) {
            case 0 -> "Clear";
            case 1 -> "Sunny";
            case 2 -> "Partly Cloudy";
            case 3 -> "Partly Cloudy";
            case 4 -> "Cloudy";
            case 45, 48 -> "Fog";
            case 51, 53, 55 -> "Drizzle";
            case 56, 57 -> "Freezing Drizzle";
            case 61, 63 -> "Rain";
            case 65 -> "Heavy Rain";
            case 66, 67 -> "Freezing Rain";
            case 71 -> "Light Snow";
            case 73 -> "Snow";
            case 75 -> "Heavy Snow";
            case 77 -> "Snow Grains";
            case 80, 81 -> "Rain Showers";
            case 82 -> "Heavy Rain Showers";
            case 85, 86 -> "Snow Showers";
            case 95 -> "Thunderstorm";
            case 96, 99 -> "Thunderstorm with Hail";
            default -> "Unknown";
        };
    }

    // Internal DTOs for Open-Meteo API response mapping
    @lombok.Data
    public static class GeocodingResponse {
        private List<GeocodingResult> results;
    }

    @lombok.Data
    public static class GeocodingResult {
        private String name;
        private String admin1;
        private String country;
        private Double latitude;
        private Double longitude;
        private String timezone;
    }

    @lombok.Data
    public static class WeatherApiResponse {
        @JsonProperty("current_weather")
        private CurrentWeather currentWeather;
        private HourlyData hourly;
        private DailyData daily;
        private String timezone;
    }

    @lombok.Data
    public static class CurrentWeather {
        private Double temperature;
        @JsonProperty("weathercode")
        private Integer weatherCode;
        @JsonProperty("windspeed")
        private Double windSpeed;
        @JsonProperty("winddirection")
        private Integer windDirection;
        private String time;
    }

    @lombok.Data
    public static class HourlyData {
        private List<String> time;
        @JsonProperty("temperature_2m")
        private List<Double> temperature2m;
        @JsonProperty("relative_humidity_2m")
        private List<Integer> relativeHumidity2m;
        @JsonProperty("precipitation_probability")
        private List<Integer> precipitationProbability;
        private List<Double> precipitation;
        private List<Double> rain;
        @JsonProperty("weather_code")
        private List<Integer> weatherCode;
        @JsonProperty("wind_speed_10m")
        private List<Double> windSpeed10m;
        @JsonProperty("wind_direction_10m")
        private List<Integer> windDirection10m;
        @JsonProperty("wind_gusts_10m")
        private List<Double> windGusts10m;
    }

    @lombok.Data
    public static class DailyData {
        private List<String> time;
        @JsonProperty("weather_code")
        private List<Integer> weatherCode;
        @JsonProperty("temperature_2m_max")
        private List<Double> temperature2mMax;
        @JsonProperty("temperature_2m_min")
        private List<Double> temperature2mMin;
        @JsonProperty("precipitation_probability_max")
        private List<Integer> precipitationProbabilityMax;
        @JsonProperty("wind_speed_10m_max")
        private List<Double> windSpeed10mMax;
        private List<String> sunrise;
        private List<String> sunset;
    }
}