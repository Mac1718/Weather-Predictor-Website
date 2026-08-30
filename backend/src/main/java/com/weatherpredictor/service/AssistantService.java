package com.weatherpredictor.service;

import com.weatherpredictor.dto.AssistantRequestDto;
import com.weatherpredictor.dto.AssistantResponseDto;
import com.weatherpredictor.dto.HourlyForecastDto;
import com.weatherpredictor.dto.DailyForecastDto;
import com.weatherpredictor.dto.CurrentWeatherDto;
import com.weatherpredictor.dto.WeatherResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssistantService {

    private static final Logger log = LoggerFactory.getLogger(AssistantService.class);

    public AssistantResponseDto answerQuestion(AssistantRequestDto request, WeatherResponseDto weatherData) {
        String question = request.getQuestion().toLowerCase().trim();
        log.info("Processing question: {}", question);

        String answer;
        try {
            answer = generateAnswer(question, weatherData);
        } catch (Exception e) {
            log.error("Error generating answer", e);
            answer = "I can't answer that accurately right now because the latest forecast isn't available.";
        }

        return AssistantResponseDto.builder()
                .question(request.getQuestion())
                .answer(answer)
                .build();
    }

    private String generateAnswer(String question, WeatherResponseDto data) {
        List<HourlyForecastDto> hourly = data.getHourly();
        List<DailyForecastDto> daily = data.getDaily();
        CurrentWeatherDto current = data.getCurrent();

        if (hourly == null || hourly.isEmpty()) {
            return "I can't answer that accurately right now because the latest forecast isn't available.";
        }

        // Rain time questions
        if (isRainTimeQuestion(question)) {
            return answerRainTime(hourly);
        }

        // Will it rain today? (general rain question without time qualifier)
        if (isRainTodayQuestion(question)) {
            return answerRainToday(hourly);
        }

        // Hottest/peak temperature
        if (isHottestQuestion(question)) {
            return answerHottest(hourly);
        }

        // Coldest/lowest temperature
        if (isColdestQuestion(question)) {
            return answerColdest(hourly);
        }

        // Sunny/sunniest
        if (isSunnyQuestion(question)) {
            return answerSunniest(hourly);
        }

        // Wind
        if (isWindQuestion(question)) {
            return answerWind(hourly);
        }

        // Tomorrow morning
        if (isTomorrowMorningQuestion(question)) {
            return answerTomorrowMorning(hourly, daily);
        }

        // Tomorrow
        if (isTomorrowQuestion(question)) {
            return answerTomorrow(daily);
        }

        // Best time to go outside
        if (isBestTimeQuestion(question)) {
            return answerBestTime(hourly);
        }

        // Evening
        if (isEveningQuestion(question)) {
            return answerEvening(hourly);
        }

        // Morning
        if (isMorningQuestion(question)) {
            return answerMorning(hourly);
        }

        // Afternoon
        if (isAfternoonQuestion(question)) {
            return answerAfternoon(hourly);
        }

        // Night/tonight
        if (isNightQuestion(question)) {
            return answerNight(hourly);
        }

        // Comparison today vs tomorrow
        if (isComparisonQuestion(question)) {
            return answerComparison(question, daily);
        }

        // What's the weather like / general weather summary
        if (isWeatherLikeQuestion(question)) {
            return answerWeatherSummary(current, daily, hourly);
        }

        return answerWeatherSummary(current, daily, hourly);
    }

    private boolean isRainTimeQuestion(String q) {
        return (q.contains("rain") || q.contains("precipitation")) &&
               (q.contains("time") || q.contains("when") || q.contains("hour"));
    }

    private boolean isRainTodayQuestion(String q) {
        return (q.contains("rain") || q.contains("raining")) &&
               !q.contains("time") && !q.contains("when") && !q.contains("hour") &&
               !q.contains("tomorrow") &&
               !q.contains("hottest") && !q.contains("wind") && !q.contains("sunny") &&
               !q.contains("weather like");
    }

    private boolean isWeatherLikeQuestion(String q) {
        return q.contains("weather like") || q.contains("how's the weather") || q.contains("what is the weather") ||
               q.contains("how is the weather") || q.contains("weather today") || q.contains("weather forecast");
    }

    private boolean isHottestQuestion(String q) {
        return q.contains("hottest") || q.contains("highest") || q.contains("peak") ||
               (q.contains("temperature") && (q.contains("max") || q.contains("warmest")));
    }

    private boolean isColdestQuestion(String q) {
        return q.contains("coldest") || q.contains("lowest") || q.contains("minimum") ||
               (q.contains("temperature") && q.contains("min"));
    }

    private boolean isSunnyQuestion(String q) {
        return q.contains("sunny") || q.contains("sunniest") || q.contains("clear") ||
               q.contains("bright");
    }

    private boolean isWindQuestion(String q) {
        return q.contains("wind") || q.contains("breezy") || q.contains("gust");
    }

    private boolean isTomorrowMorningQuestion(String q) {
        return q.contains("tomorrow") && (q.contains("morning") || q.contains("am"));
    }

    private boolean isTomorrowQuestion(String q) {
        return q.contains("tomorrow") && !isTomorrowMorningQuestion(q);
    }

    private boolean isBestTimeQuestion(String q) {
        return q.contains("best") && (q.contains("outside") || q.contains("go out") ||
               q.contains("outdoor") || q.contains("activity"));
    }

    private boolean isEveningQuestion(String q) {
        return q.contains("evening") || q.contains("this evening");
    }

    private boolean isMorningQuestion(String q) {
        return (q.contains("morning") || q.contains("this morning")) && !q.contains("tomorrow");
    }

    private boolean isAfternoonQuestion(String q) {
        return q.contains("afternoon") || q.contains("this afternoon");
    }

    private boolean isNightQuestion(String q) {
        return q.contains("night") || q.contains("tonight");
    }

    private boolean isComparisonQuestion(String q) {
        return q.contains("tomorrow") && (q.contains("hotter") || q.contains("warmer") ||
               q.contains("colder") || q.contains("cooler") || q.contains("better"));
    }

    private String answerRainToday(List<HourlyForecastDto> hourly) {
        Optional<HourlyForecastDto> maxRain = hourly.stream()
                .filter(h -> h.getPrecipitationProbability() != null && h.getPrecipitationProbability() > 30)
                .max(Comparator.comparingInt(h -> h.getPrecipitationProbability() != null ? h.getPrecipitationProbability() : 0));

        if (maxRain.isEmpty()) {
            int maxProb = hourly.stream()
                    .filter(h -> h.getPrecipitationProbability() != null)
                    .mapToInt(h -> h.getPrecipitationProbability())
                    .max()
                    .orElse(0);
            if (maxProb == 0) {
                return "No rain is expected today — it looks like a dry day.";
            }
            return String.format("Rain is unlikely today, though there's up to a %d%% chance of showers at times.", maxProb);
        }

        HourlyForecastDto rain = maxRain.get();
        return String.format("Yes, rain is likely today around %s, with a precipitation probability of %d%%.",
                rain.getTime(), rain.getPrecipitationProbability());
    }

    private String answerWeatherSummary(CurrentWeatherDto current, List<DailyForecastDto> daily, List<HourlyForecastDto> hourly) {
        if (current == null) {
            return "Weather data isn't available right now.";
        }
        String city = "the selected city";
        if (daily.size() > 0) {
            DailyForecastDto today = daily.get(0);
            return String.format("In %s today: %s, high of %.0f°C, low of %.0f°C. Rain chance is %d%%. Winds around %.0f km/h.",
                    city, today.getCondition().toLowerCase(), today.getHigh(), today.getLow(),
                    today.getPrecipitationProbability(), today.getWindSpeed());
        }
        return String.format("Current conditions in %s: %s, %.0f°C, wind %.0f km/h.",
                city, current.getCondition(), current.getTemperature(), current.getWindSpeed());
    }

    private String answerRainTime(List<HourlyForecastDto> hourly) {
        Optional<HourlyForecastDto> maxRain = hourly.stream()
                .filter(h -> h.getPrecipitationProbability() != null && h.getPrecipitationProbability() > 30)
                .max(Comparator.comparingInt(h -> h.getPrecipitationProbability() != null ? h.getPrecipitationProbability() : 0));

        if (maxRain.isEmpty()) {
            int maxProb = hourly.stream()
                    .filter(h -> h.getPrecipitationProbability() != null)
                    .mapToInt(h -> h.getPrecipitationProbability())
                    .max()
                    .orElse(0);
            return String.format("No significant rain is currently forecast today. The highest precipitation probability is around %d%%.", maxProb);
        }

        HourlyForecastDto rain = maxRain.get();
        return String.format("Rain is most likely around %s today, with a precipitation probability of %d%%.",
                rain.getTime(), rain.getPrecipitationProbability());
    }

    private String answerHottest(List<HourlyForecastDto> hourly) {
        Optional<HourlyForecastDto> maxTemp = hourly.stream()
                .filter(h -> h.getTemperature() != null)
                .max(Comparator.comparingDouble(h -> h.getTemperature()));

        if (maxTemp.isEmpty()) {
            return "Temperature data is not available.";
        }

        HourlyForecastDto hottest = maxTemp.get();
        return String.format("The temperature is forecast to peak around %s at %.0f°C.",
                hottest.getTime(), hottest.getTemperature());
    }

    private String answerColdest(List<HourlyForecastDto> hourly) {
        Optional<HourlyForecastDto> minTemp = hourly.stream()
                .filter(h -> h.getTemperature() != null)
                .min(Comparator.comparingDouble(h -> h.getTemperature()));

        if (minTemp.isEmpty()) {
            return "Temperature data is not available.";
        }

        HourlyForecastDto coldest = minTemp.get();
        return String.format("The lowest temperature is forecast around %s at %.0f°C.",
                coldest.getTime(), coldest.getTemperature());
    }

    private String answerSunniest(List<HourlyForecastDto> hourly) {
        // Clear/sunny = weather code 0 or 1
        List<HourlyForecastDto> clearPeriods = hourly.stream()
                .filter(h -> h.getWeatherCode() != null && (h.getWeatherCode() == 0 || h.getWeatherCode() == 1))
                .collect(Collectors.toList());

        if (clearPeriods.isEmpty()) {
            // Find least cloudy (code 2 - partly cloudy)
            List<HourlyForecastDto> partlyCloudy = hourly.stream()
                    .filter(h -> h.getWeatherCode() != null && h.getWeatherCode() == 2)
                    .collect(Collectors.toList());

            if (!partlyCloudy.isEmpty()) {
                return String.format("The sunniest period will be around %s with partly cloudy conditions.",
                        partlyCloudy.get(0).getTime());
            }
            return "No clear periods are forecast today. Conditions will be cloudy throughout.";
        }

        return String.format("The sunniest period will be around %s with clear conditions.",
                clearPeriods.get(0).getTime());
    }

    private String answerWind(List<HourlyForecastDto> hourly) {
        Optional<HourlyForecastDto> maxWind = hourly.stream()
                .filter(h -> h.getWindSpeed() != null)
                .max(Comparator.comparingDouble(h -> h.getWindSpeed()));

        if (maxWind.isEmpty()) {
            return "Wind data is not available.";
        }

        HourlyForecastDto wind = maxWind.get();
        return String.format("The strongest winds are expected around %s at %.0f km/h.",
                wind.getTime(), wind.getWindSpeed());
    }

    private String answerTomorrowMorning(List<HourlyForecastDto> hourly, List<DailyForecastDto> daily) {
        if (daily.size() < 2) {
            return "Tomorrow's forecast is not available yet.";
        }

        DailyForecastDto tomorrow = daily.get(1);
        // Morning hours: 6am, 9am
        List<HourlyForecastDto> morningHours = hourly.stream()
                .filter(h -> h.getTime().startsWith("06") || h.getTime().startsWith("09"))
                .collect(Collectors.toList());

        if (morningHours.isEmpty()) {
            return String.format("Tomorrow morning will be %s with a high of %.0f°C. Rain probability: %d%%.",
                    tomorrow.getCondition().toLowerCase(), tomorrow.getHigh(), tomorrow.getPrecipitationProbability());
        }

        Optional<HourlyForecastDto> maxRain = morningHours.stream()
                .filter(h -> h.getPrecipitationProbability() != null)
                .max(Comparator.comparingInt(h -> h.getPrecipitationProbability() != null ? h.getPrecipitationProbability() : 0));

        int maxProb = maxRain.map(h -> h.getPrecipitationProbability()).orElse(0);

        if (maxProb > 30) {
            return String.format("Rain is likely tomorrow morning around %s, with a precipitation probability of %d%%.",
                    maxRain.get().getTime(), maxProb);
        }

        return String.format("Rain is unlikely tomorrow morning. The highest precipitation probability before noon is around %d%%.", maxProb);
    }

    private String answerTomorrow(List<DailyForecastDto> daily) {
        if (daily.size() < 2) {
            return "Tomorrow's forecast is not available yet.";
        }

        DailyForecastDto tomorrow = daily.get(1);
        return String.format("Tomorrow will be %s with a high of %.0f°C and low of %.0f°C. Rain probability is %d%%.",
                tomorrow.getCondition().toLowerCase(), tomorrow.getHigh(), tomorrow.getLow(), tomorrow.getPrecipitationProbability());
    }

    private String answerBestTime(List<HourlyForecastDto> hourly) {
        // Score each hour: prefer low rain probability, comfortable temp (20-28°C), low wind
        List<ScoredHour> scored = hourly.stream()
                .filter(h -> h.getTemperature() != null && h.getPrecipitationProbability() != null && h.getWindSpeed() != null)
                .map(h -> {
                    double score = 0;
                    score += Math.max(0, 100 - h.getPrecipitationProbability() * 2); // prefer low rain
                    score += Math.max(0, 50 - Math.abs(h.getTemperature() - 24) * 5); // prefer ~24°C
                    score += Math.max(0, 30 - h.getWindSpeed() * 2); // prefer low wind
                    return new ScoredHour(h, score);
                })
                .collect(Collectors.toList());

        if (scored.isEmpty()) {
            return "Unable to determine the best time based on available data.";
        }

        ScoredHour best = scored.stream().max(Comparator.comparingDouble(ScoredHour::score)).get();
        HourlyForecastDto h = best.hour;

        return String.format("Based on the current forecast, %s looks best for outdoor activities - %.0f°C, %d%% rain chance, %.0f km/h wind.",
                h.getTime(), h.getTemperature(), h.getPrecipitationProbability(), h.getWindSpeed());
    }

    private String answerEvening(List<HourlyForecastDto> hourly) {
        // Evening hours: 18:00, 21:00
        List<HourlyForecastDto> eveningHours = hourly.stream()
                .filter(h -> h.getTime().startsWith("18") || h.getTime().startsWith("21"))
                .collect(Collectors.toList());

        if (eveningHours.isEmpty()) {
            return "Evening forecast is not available.";
        }

        Optional<HourlyForecastDto> maxRain = eveningHours.stream()
                .filter(h -> h.getPrecipitationProbability() != null)
                .max(Comparator.comparingInt(h -> h.getPrecipitationProbability() != null ? h.getPrecipitationProbability() : 0));

        double avgTemp = eveningHours.stream()
                .filter(h -> h.getTemperature() != null)
                .mapToDouble(HourlyForecastDto::getTemperature)
                .average()
                .orElse(0);

        int maxProb = maxRain.map(h -> h.getPrecipitationProbability()).orElse(0);
        String condition = eveningHours.get(0).getCondition();

        return String.format("This evening will be %s with temperatures around %.0f°C. Rain probability: %d%%.",
                condition.toLowerCase(), avgTemp, maxProb);
    }

    private String answerMorning(List<HourlyForecastDto> hourly) {
        // Morning hours: 06:00, 09:00
        List<HourlyForecastDto> morningHours = hourly.stream()
                .filter(h -> h.getTime().startsWith("06") || h.getTime().startsWith("09"))
                .collect(Collectors.toList());

        if (morningHours.isEmpty()) {
            return "Morning forecast is not available.";
        }

        double avgTemp = morningHours.stream()
                .filter(h -> h.getTemperature() != null)
                .mapToDouble(HourlyForecastDto::getTemperature)
                .average()
                .orElse(0);

        Optional<HourlyForecastDto> maxRain = morningHours.stream()
                .filter(h -> h.getPrecipitationProbability() != null)
                .max(Comparator.comparingInt(h -> h.getPrecipitationProbability() != null ? h.getPrecipitationProbability() : 0));

        int maxProb = maxRain.map(h -> h.getPrecipitationProbability()).orElse(0);
        String condition = morningHours.get(0).getCondition();

        return String.format("This morning will be %s with temperatures around %.0f°C. Highest rain chance: %d%%.",
                condition.toLowerCase(), avgTemp, maxProb);
    }

    private String answerAfternoon(List<HourlyForecastDto> hourly) {
        // Afternoon hours: 12:00, 15:00
        List<HourlyForecastDto> afternoonHours = hourly.stream()
                .filter(h -> h.getTime().startsWith("12") || h.getTime().startsWith("15"))
                .collect(Collectors.toList());

        if (afternoonHours.isEmpty()) {
            return "Afternoon forecast is not available.";
        }

        double avgTemp = afternoonHours.stream()
                .filter(h -> h.getTemperature() != null)
                .mapToDouble(HourlyForecastDto::getTemperature)
                .average()
                .orElse(0);

        Optional<HourlyForecastDto> maxRain = afternoonHours.stream()
                .filter(h -> h.getPrecipitationProbability() != null)
                .max(Comparator.comparingInt(h -> h.getPrecipitationProbability() != null ? h.getPrecipitationProbability() : 0));

        int maxProb = maxRain.map(h -> h.getPrecipitationProbability()).orElse(0);
        String condition = afternoonHours.get(0).getCondition();

        return String.format("This afternoon will be %s with temperatures around %.0f°C. Highest rain chance: %d%%.",
                condition.toLowerCase(), avgTemp, maxProb);
    }

    private String answerNight(List<HourlyForecastDto> hourly) {
        // Night hours: 21:00, 00:00, 03:00
        List<HourlyForecastDto> nightHours = hourly.stream()
                .filter(h -> h.getTime().startsWith("21") || h.getTime().startsWith("00") || h.getTime().startsWith("03"))
                .collect(Collectors.toList());

        if (nightHours.isEmpty()) {
            return "Night forecast is not available.";
        }

        double avgTemp = nightHours.stream()
                .filter(h -> h.getTemperature() != null)
                .mapToDouble(HourlyForecastDto::getTemperature)
                .average()
                .orElse(0);

        Optional<HourlyForecastDto> maxRain = nightHours.stream()
                .filter(h -> h.getPrecipitationProbability() != null)
                .max(Comparator.comparingInt(h -> h.getPrecipitationProbability() != null ? h.getPrecipitationProbability() : 0));

        int maxProb = maxRain.map(h -> h.getPrecipitationProbability()).orElse(0);
        String condition = nightHours.get(0).getCondition();

        return String.format("Tonight will be %s with temperatures around %.0f°C. Rain probability: %d%%.",
                condition.toLowerCase(), avgTemp, maxProb);
    }

    private String answerComparison(String question, List<DailyForecastDto> daily) {
        if (daily.size() < 2) {
            return "Tomorrow's forecast is not available for comparison.";
        }

        DailyForecastDto today = daily.get(0);
        DailyForecastDto tomorrow = daily.get(1);

        if (question.contains("hotter") || question.contains("warmer")) {
            boolean hotter = tomorrow.getHigh() > today.getHigh();
            return String.format("%s, tomorrow will %s be hotter than today. High of %.0f°C vs %.0f°C today.",
                    hotter ? "Yes" : "No", hotter ? "" : "not", tomorrow.getHigh(), today.getHigh());
        } else {
            boolean cooler = tomorrow.getLow() < today.getLow();
            return String.format("%s, tomorrow will %s be cooler than today. Low of %.0f°C vs %.0f°C today.",
                    cooler ? "Yes" : "No", cooler ? "" : "not", tomorrow.getLow(), today.getLow());
        }
    }

    private record ScoredHour(HourlyForecastDto hour, double score) {}
}