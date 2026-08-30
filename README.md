# Weather Predictor

> A stunning, full-stack weather forecasting platform with AI-powered insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)
![Vite](https://img.shields.io/badge/Vite-5-purple.svg)

<div align="center">

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌤️ **Real-time Weather** | Live temperature, humidity, wind & precipitation data |
| 📊 **7-Day Forecast** | Detailed daily breakdown with high/low temps |
| ⏱️ **Hourly Strip** | Next 24 hours with animated temperature chart |
| 🤖 **AI Weather Assistant** | Natural language Q&A about your forecast |
| 📅 **Smart Calendar** | Weekly grid with temp bars, rain %, sunrise/sunset |
| 🔍 **City Search** | Instant search across 30+ Indian cities |
| 🌡️ **Unit Toggle** | Switch between °C and °F with one click |
| 🎨 **Glassmorphism UI** | Frosted-glass cards with ambient storm backdrop |
| ✨ **Framer Motion** | Smooth staggered animations throughout |
| ⚡ **Offline-Ready** | Mock data fallback when backend is down |

---

## 🏗️ Architecture

```
Weather Predictor
├── frontend/         React 19 · Vite 5 · Framer Motion · CSS Glassmorphism
├── backend/          Spring Boot 3.2 · Java 17 · Open-Meteo API
└── README.md
```

**Frontend stack:** React 19, Framer Motion, Vite, vanilla CSS (no Tailwind)

**Backend stack:** Spring Boot WebFlux, WebClient, Caffeine cache, LLM-powered assistant

---

## 🚀 Quick Start

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
# API available at http://localhost:8080
```

### Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

### Build for production

```bash
# Backend
cd backend && ./mvnw package -DskipTests
java -jar target/weather-predictor-api-1.0.0.jar

# Frontend
cd frontend && npm run build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/weather/{city}` | Current + forecast for a city |
| `GET` | `/api/weather/cities` | List all supported cities |
| `POST` | `/api/weather/ask` | AI weather Q&A (Anthropic) |
| `GET` | `/api/health` | Health check |

### Example response

```json
{
  "location": { "city": "Bengaluru", "state": "Karnataka", "country": "India" },
  "current": { "temperature": 27, "condition": "Partly Cloudy", "humidity": 65 },
  "hourly": [{ "time": "09:00", "temperature": 25, "precipitationProbability": 15 }],
  "daily": [{ "day": "Sunday", "high": 28, "low": 23, "precipitationProbability": 75 }]
}
```

---

## 🗂️ Project Structure

```
backend/
├── src/main/java/com/weatherpredictor/
│   ├── config/          Cache & CORS config
│   ├── controller/      REST endpoints
│   ├── dto/             Request/Response models
│   ├── service/         Open-Meteo + AI logic
│   └── provider/        Weather API client
└── pom.xml

frontend/
├── src/
│   ├── components/
│   │   ├── layout/      Sidebar, Header
│   │   ├── weather/     Hero, CurrentWeatherCard
│   │   ├── forecast/    ForecastStrip, WeeklyForecast
│   │   └── assistant/   WeatherAssistant chat
│   ├── hooks/           useWeather, useWeatherAssistant
│   ├── services/        weatherService
│   ├── data/            mockWeather.js
│   └── App.jsx
├── vite.config.js
└── package.json
```

---

## 🎨 Design System

- **Typography:** System font stack, CSS `--u` scale variables
- **Palette:** Dark glassmorphism over animated storm background
- **Easing:** `[0.16, 1, 0.3, 1]` (custom cubic bezier for all animations)
- **Shadow:** `0 8px 32px rgba(0,0,0,0.35)` on all cards
- **Border:** `1px solid rgba(255,255,255,0.12)` frosted glass

---

## 🛠️ Tech Decisions

| Choice | Why |
|--------|-----|
| **Open-Meteo** | Free, no API key required, excellent forecast data |
| **WebClient (not RestTemplate)** | Non-blocking, better throughput for weather APIs |
| **Caffeine cache** | 5-min TTL avoids rate limits without external services |
| **Framer Motion** | GPU-accelerated, declarative, minimal overhead |
| **Vanilla CSS** | No build-time CSS processing, better dark-mode control |
| **Spring AI** | Declarative LLM calls, structured output, fallback handling |

---

## 📝 License

MIT — feel free to use, modify, and build upon.
