import { useCallback, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import { Sidebar } from './components/layout/Sidebar.jsx'
import { Header } from './components/layout/Header.jsx'
import { Hero } from './components/weather/Hero.jsx'
import { CurrentWeatherCard } from './components/weather/CurrentWeatherCard.jsx'
import { ForecastStrip } from './components/forecast/ForecastStrip.jsx'
import { WeeklyForecast } from './components/forecast/WeeklyForecast.jsx'
import { WeatherAssistant } from './components/assistant/WeatherAssistant.jsx'
import { useWeather, useWeatherAssistant } from './hooks/useWeather.js'
import { mockWeatherData } from './data/mockWeather.js'
import { weatherService } from './services/weatherService.js'
import { weatherCodeToIcon } from './data/mockWeather.js'

const navMessages = {
  'Dashboard': null,
  'Reports': null,
  'Explore regions': null,
  'Calendar': null,
  'Settings': null,
}

const icons = (
  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
    <symbol id="i-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </symbol>
    <symbol id="i-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </symbol>
    <symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </symbol>
    <symbol id="i-cloud-rain" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H18a5 5 0 0 0 0-10c0-2.5-1.5-4.5-3.5-5A3.5 3.5 0 0 0 9 3H5a3 3 0 0 0 0 6h2.5"/>
      <line id="rd1" x1="8" y1="16" x2="8" y2="20"/>
      <line id="rd2" x1="12" y1="16" x2="12" y2="20"/>
      <line id="rd3" x1="16" y1="16" x2="16" y2="20"/>
    </symbol>
    <symbol id="i-cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </symbol>
    <symbol id="i-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </symbol>
    <symbol id="i-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </symbol>
    <symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </symbol>
    <symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </symbol>
    <symbol id="i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </symbol>
    <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </symbol>
    <symbol id="i-wind" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
    </symbol>
    <symbol id="i-drop" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </symbol>
    <symbol id="i-gust" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="M4.93 4.93l1.41 1.41"/>
      <path d="M17.66 17.66l1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="M4.93 19.07l1.41-1.41"/>
      <path d="M17.66 6.34l1.41-1.41"/>
    </symbol>
    <symbol id="i-cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H18a5 5 0 0 0 0-10c0-2.5-1.5-4.5-3.5-5A3.5 3.5 0 0 0 9 3H5a3 3 0 0 0 0 6h2.5"/>
    </symbol>
    <symbol id="i-cloud2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H18a5 5 0 0 0 0-10c0-2.5-1.5-4.5-3.5-5A3.5 3.5 0 0 0 9 3H5a3 3 0 0 0 0 6h2.5"/>
      <path d="M22 17a5 5 0 0 0-10 0"/>
    </symbol>
    <symbol id="i-hail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H18a5 5 0 0 0 0-10c0-2.5-1.5-4.5-3.5-5A3.5 3.5 0 0 0 9 3H5a3 3 0 0 0 0 6h2.5"/>
      <path d="M16 14v6"/>
      <path d="M8 14v6"/>
      <path d="M12 17v3"/>
    </symbol>
    <symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </symbol>
    <symbol id="i-avatar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5"/>
      <path d="M20 21c0-5.5-4.5-10-10-10S2 15.5 2 21"/>
    </symbol>
  </svg>
)

function Dashboard({ weatherData, currentWeather, hourly, daily, condition, description, handleAsk, city, handleCitySelect, refresh, tempUnit, tempDisplay }) {
  return (
    <>
      <Hero condition={condition} description={description} />
      <ForecastStrip hourly={hourly} tempUnit={tempUnit} />
      <div className="content-grid">
        <aside className="rail" aria-label="Location cards">
          <CurrentWeatherCard data={weatherData} delay={0.8} tempUnit={tempUnit} />
          <WeeklyForecast daily={daily} tempUnit={tempUnit} />
        </aside>
        <WeatherAssistant weatherData={weatherData || mockWeatherData} onAsk={handleAsk} />
      </div>
    </>
  )
}

function CalendarPage({ weatherData, city, refresh, tempUnit, tempDisplay }) {
  const daily = weatherData?.daily || []
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // --- Insights ---
  const highs = daily.map(d => d.high)
  const lows = daily.map(d => d.low)
  const maxHigh = Math.max(...highs)
  const minLow = Math.min(...lows)
  const hottestDay = daily[highs.indexOf(maxHigh)]
  const coldestDay = daily[lows.indexOf(minLow)]
  const avgHigh = Math.round(highs.reduce((a, b) => a + b, 0) / highs.length)
  const avgLow = Math.round(lows.reduce((a, b) => a + b, 0) / lows.length)
  const rainDays = daily.filter(d => d.precipitationProbability >= 50)
  const sunnyDays = daily.filter(d => d.weatherCode <= 2)
  const worstDay = rainDays.length > 0 ? rainDays[0] : daily[daily.length - 1]

  const precipColor = (p) => {
    if (p >= 70) return '#f97316'
    if (p >= 40) return '#f59e0b'
    if (p >= 20) return '#60a5fa'
    return 'rgba(255,255,255,.25)'
  }

  const tempBarWidth = (t) => {
    const range = maxHigh - minLow || 1
    return Math.max(8, ((t - minLow) / range) * 100)
  }

  return (
    <div className="page-calendar">
      <h2 className="page-title">
        <svg className="page-title-icon"><use href="#i-cal" /></svg>
        Weather Calendar
      </h2>

      <div className="cal-month-label">
        <span className="cal-month-text">{months[now.getMonth()]} {now.getFullYear()}</span>
        <span className="cal-city-label">{city}</span>
      </div>

      {/* ── 7-column weekly calendar ── */}
      <div className="cal-grid">
        <div className="cal-grid-header">
          {dayShort.map(d => <div key={d} className="cal-col-hdr">{d}</div>)}
        </div>
        {daily.map((day, i) => {
          const date = new Date(day.date)
          const isToday = day.date === todayStr
          const dow = date.getDay()
          return (
            <motion.div
              key={day.date}
              className={`cal-col ${isToday ? 'today' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Date badge */}
              <div className="cal-date-badge">
                <span className="cal-date-num">{date.getDate()}</span>
                <span className="cal-date-week">{dayShort[dow]}</span>
              </div>

              {/* Icon */}
              <svg className="cal-col-icon"><use href={`#${weatherCodeToIcon(day.weatherCode)}`} /></svg>

              {/* Condition */}
              <span className="cal-col-cond">{day.condition}</span>

              {/* Temps with range bar */}
              <div className="cal-temp-row">
                <span className="cal-temp-low">{tempDisplay(day.low)}°</span>
                <div className="cal-temp-bar">
                  <div
                    className="cal-temp-bar-fill"
                    style={{
                      width: `${tempBarWidth(day.high)}%`,
                      background: `linear-gradient(90deg, #3b82f6, #f97316)`,
                    }}
                  />
                </div>
                <span className="cal-temp-high">{tempDisplay(day.high)}°</span>
              </div>

              {/* Precipitation */}
              <div className="cal-rain-row">
                <svg className="cal-rain-icon"><use href="#i-drop" /></svg>
                <span className="cal-rain-pct">{day.precipitationProbability}%</span>
                <div className="cal-rain-bar-track">
                  <div
                    className="cal-rain-bar-fill"
                    style={{
                      width: `${day.precipitationProbability}%`,
                      background: precipColor(day.precipitationProbability),
                    }}
                  />
                </div>
              </div>

              {/* Sunrise / Sunset */}
              <div className="cal-sun-row">
                <svg className="cal-sun-icon"><use href="#i-sun" /></svg>
                <span className="cal-sun-time">{day.sunrise}</span>
                <span className="cal-sun-sep">·</span>
                <svg className="cal-moon-icon"><use href="#i-sun" /></svg>
                <span className="cal-sun-time">{day.sunset}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Insights strip ── */}
      <div className="cal-insights">
        <div className="cal-insight-card">
          <span className="cal-insight-label">🌧️ Rain Days</span>
          <span className="cal-insight-value">{rainDays.length} / {daily.length}</span>
        </div>
        <div className="cal-insight-card">
          <span className="cal-insight-label">☀️ Sunny Days</span>
          <span className="cal-insight-value">{sunnyDays.length} / {daily.length}</span>
        </div>
        <div className="cal-insight-card">
          <span className="cal-insight-label">🔥 Hottest</span>
          <span className="cal-insight-value">{hottestDay?.day || ''} {tempDisplay(maxHigh)}°{tempUnit}</span>
        </div>
        <div className="cal-insight-card">
          <span className="cal-insight-label">❄️ Coldest</span>
          <span className="cal-insight-value">{coldestDay?.day || ''} {tempDisplay(minLow)}°{tempUnit}</span>
        </div>
        <div className="cal-insight-card">
          <span className="cal-insight-label">🌡️ Avg High</span>
          <span className="cal-insight-value">{avgHigh}°{tempUnit}</span>
        </div>
        <div className="cal-insight-card">
          <span className="cal-insight-label">💧 Worst Rain</span>
          <span className="cal-insight-value">{worstDay?.day || ''} {worstDay?.precipitationProbability || 0}%</span>
        </div>
      </div>
    </div>
  )
}

function AnalyticsPage({ weatherData, city, tempUnit, tempDisplay }) {
  const daily = weatherData?.daily || []
  const hourly = weatherData?.hourly || []
  const current = weatherData?.current

  if (daily.length === 0) return <div className="page-empty"><p>No analytics data available</p></div>

  const highs = daily.map(d => d.high)
  const lows = daily.map(d => d.low)
  const maxHigh = Math.max(...highs)
  const minLow = Math.min(...lows)
  const hottestDay = daily[highs.indexOf(maxHigh)]
  const coldestDay = daily[lows.indexOf(minLow)]

  const rainDays = daily.filter(d => d.precipitationProbability >= 50).length
  const avgWind = Math.round(hourly.reduce((s, h) => s + (h.windSpeed || 0), 0) / (hourly.length || 1))

  const tempChartData = daily.slice(0, 7).map(d => ({
    day: d.day,
    high: tempDisplay(d.high),
    low: tempDisplay(d.low)
  }))
  const maxTemp = Math.max(...tempChartData.map(d => d.high))
  const minTemp = Math.min(...tempChartData.map(d => d.low))
  const range = maxTemp - minTemp || 1

  return (
    <div className="page-analytics">
      <h2 className="page-title">
        <svg className="page-title-icon"><use href="#i-chart" /></svg>
        Weather Analytics — {city}
      </h2>

      <div className="analytics-stats">
        <div className="stat-card">
          <span className="stat-label">Hottest Day</span>
          <span className="stat-value">{hottestDay?.day || ''} {tempDisplay(maxHigh)}{tempUnit}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Coldest Night</span>
          <span className="stat-value">{coldestDay?.day || ''} {tempDisplay(minLow)}{tempUnit}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Rainy Days</span>
          <span className="stat-value">{rainDays} / {daily.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Wind</span>
          <span className="stat-value">{avgWind} km/h</span>
        </div>
      </div>

      <div className="analytics-chart-card">
        <h3 className="chart-title">Temperature Trend — {city}</h3>
        <TempChart data={tempChartData} tempUnit={tempUnit} />
        <div className="chart-legend-row">
          <span className="legend-row-item"><span className="legend-row-dot high" /> Daily High</span>
          <span className="legend-row-item"><span className="legend-row-dot range" /> Temperature Range</span>
          <span className="legend-row-item"><span className="legend-row-dot low" /> Daily Low</span>
        </div>
      </div>

      <div className="analytics-summary-card">
        <h3 className="chart-title">Summary</h3>
        <p className="summary-text">
          {current ? `Currently ${current.condition.toLowerCase()} at ${tempDisplay(current.temperature)}${tempUnit} in ${weatherData?.location?.city || 'your city'}. ` : ''}
          The next 7 days show a high of ${tempDisplay(maxHigh)}${tempUnit} and a low of ${tempDisplay(minLow)}${tempUnit}.
          Rain is expected on {rainDays} day{rainDays !== 1 ? 's' : ''}.
        </p>
      </div>
    </div>
  )
}

const REGIONS = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lon: 72.877 },
  { name: 'Delhi', state: 'Delhi', lat: 28.704, lon: 77.102 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.972, lon: 77.594 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lon: 78.487 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.083, lon: 80.271 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.573, lon: 88.364 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.52, lon: 73.857 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.023, lon: 72.571 },
]

// ── Temperature Chart ──
function TempChart({ data = [], tempUnit = '°C' }) {
  const W = 600, H = 280
  const pad = { top: 20, right: 20, bottom: 36, left: 58 }
  const labelGap = 28 // px gap between label end and first grid line
  const cw = W - pad.left - pad.right
  const ch = H - pad.top - pad.bottom

  if (data.length < 2) return <div className="page-empty"><p>No data</p></div>

  const allVals = data.flatMap(d => [d.high, d.low])
  const chartMin = Math.min(...allVals)
  const chartMax = Math.max(...allVals)
  const chartRange = chartMax - chartMin || 1
  // Add 10% padding to scale
  const padMin = chartMin - chartRange * 0.1
  const padMax = chartMax + chartRange * 0.1
  const padRange = padMax - padMin

  const xPos = (i) => pad.left + (i / (data.length - 1)) * cw
  const yPos = (v) => pad.top + ch - ((v - padMin) / padRange) * ch

  // Y-axis ticks (5 levels)
  const yTicks = Array.from({ length: 5 }, (_, i) => padMin + (i / 4) * padRange)

  // Build high/low path points
  const highPoints = data.map((d, i) => `${xPos(i)},${yPos(d.high)}`)
  const lowPoints = data.map((d, i) => `${xPos(i)},${yPos(d.low)}`).reverse()
  const areaPath = `M${highPoints.join(' L')} L${lowPoints.join(' L')} Z`
  const highLine = `M${highPoints.join(' L')}`
  const lowLine = `M${lowPoints.join(' L')}`

  // Gradient stops for fill
  const gradTop = 'rgba(249,115,22,.35)'
  const gradBot = 'rgba(59,130,246,.35)'

  return (
    <svg className="temp-svg" viewBox={`${-labelGap - 16} 0 ${W + labelGap + 16} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="tempArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradTop} />
          <stop offset="100%" stopColor={gradBot} />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((t, i) => (
        <line key={i} x1={pad.left} y1={yPos(t)} x2={W - pad.right} y2={yPos(t)}
          stroke="rgba(255,255,255,.12)" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '4,4'} />
      ))}

      {/* Temperature range band */}
      <path d={areaPath} fill="url(#tempArea)" />

      {/* High line */}
      <path d={highLine} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Low line */}
      <path d={lowLine} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points + labels */}
      {data.map((d, i) => (
        <g key={i}>
          {/* High dot */}
          <circle cx={xPos(i)} cy={yPos(d.high)} r="4" fill="#f97316" stroke="#fff" strokeWidth="1.5" />
          {/* Low dot */}
          <circle cx={xPos(i)} cy={yPos(d.low)} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
          {/* Temp labels */}
          <text x={xPos(i)} y={yPos(d.high) - 12} textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="600">{d.high}{tempUnit}</text>
          <text x={xPos(i)} y={yPos(d.low) + 18} textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">{d.low}{tempUnit}</text>
          {/* Day label */}
          <text x={xPos(i)} y={H - 8} textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="11" fontWeight="500">{d.day}</text>
          {/* Vertical guide line */}
          <line x1={xPos(i)} y1={yPos(d.high)} x2={xPos(i)} y2={yPos(d.low)}
            stroke="rgba(255,255,255,.15)" strokeWidth="1" strokeDasharray="2,3" />
        </g>
      ))}

      {/* Y-axis labels */}
      {yTicks.map((t, i) => (
        <text key={`yt${i}`} x={pad.left - labelGap - 4} y={yPos(t) + 4} textAnchor="end"
          fill="rgba(255,255,255,.35)" fontSize="10">{Math.round(t)}°</text>
      ))}
    </svg>
  )
}

function RegionsPage({ onCitySelect, regionWeathers, tempUnit, tempDisplay }) {
  return (
    <div className="page-regions">
      <h2 className="page-title">
        <svg className="page-title-icon"><use href="#i-globe" /></svg>
        Explore Regions
      </h2>
      <div className="regions-grid">
        {REGIONS.map((r, i) => {
          const rw = regionWeathers?.[r.name]
          return (
            <motion.div
              key={r.name}
              className="region-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onCitySelect({ name: r.name, state: r.state, country: 'India', latitude: r.lat, longitude: r.lon, timezone: 'Asia/Kolkata' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="region-name">{r.name}</div>
              <div className="region-state">{r.state}</div>
              <div className="region-preview">
                <span className="region-temp">{rw?.current?.temperature ? tempDisplay(rw.current.temperature) : '—'}{tempUnit}</span>
                <span className="region-cond">{rw?.current?.condition || 'Loading...'}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function SettingsPage({ settings, setSettings }) {
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('weather-settings') || '{}')
    if (saved.tempUnit) setSettings(s => ({ ...s, tempUnit: saved.tempUnit }))
    if (typeof saved.darkMode === 'boolean') setSettings(s => ({ ...s, darkMode: saved.darkMode }))
  }, [])

  useEffect(() => {
    localStorage.setItem('weather-settings', JSON.stringify({ tempUnit: settings.tempUnit, darkMode: settings.darkMode }))
  }, [settings.tempUnit, settings.darkMode])

  const Toggle = ({ on, setOn }) => (
    <button
      className={`toggle ${on ? 'on' : 'off'}`}
      onClick={() => setOn(!on)}
      aria-pressed={on}
    >
      <span className="toggle-knob" />
    </button>
  )

  return (
    <div className="page-settings">
      <h2 className="page-title">
        <svg className="page-title-icon"><use href="#i-gear" /></svg>
        Settings
      </h2>
      <div className="settings-section">
        <h3 className="settings-section-title">Appearance</h3>
        <div className="setting-row">
          <span className="setting-label">Dark Mode</span>
          <Toggle on={settings.darkMode} setOn={(v) => setSettings(s => ({ ...s, darkMode: v }))} />
        </div>
      </div>
      <div className="settings-section">
        <h3 className="settings-section-title">Units</h3>
        <div className="unit-picker">
          <button className={`unit-btn ${settings.tempUnit === '°C' ? 'active' : ''}`} onClick={() => setSettings(s => ({ ...s, tempUnit: '°C' }))}>
            Celsius (°C)
          </button>
          <button className={`unit-btn ${settings.tempUnit === '°F' ? 'active' : ''}`} onClick={() => setSettings(s => ({ ...s, tempUnit: '°F' }))}>
            Fahrenheit (°F)
          </button>
        </div>
      </div>
      <div className="settings-section">
        <h3 className="settings-section-title">Data Source</h3>
        <p className="setting-desc">Weather data provided by <strong>Open-Meteo API</strong>. No API key required.</p>
      </div>
    </div>
  )
}

function convertTemp(celsius) {
  return Math.round(celsius * 9 / 5 + 32)
}

export default function App() {
  const { city, weatherData, loading, error, refresh, setCity } = useWeather('Bengaluru')
  const { ask } = useWeatherAssistant()
  const [activePage, setActivePage] = useState('Dashboard')
  const [settings, setSettings] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('weather-settings') || '{}')
    return {
      tempUnit: saved.tempUnit || '°C',
      darkMode: saved.darkMode ?? false,
    }
  })
  const tempSuffix = settings.tempUnit
  const tempDisplay = (c) => {
    const v = settings.tempUnit === '°F' ? convertTemp(c) : c
    return Math.round(v)
  }
  const [regionWeathers, setRegionWeathers] = useState({})

  useEffect(() => {
    const regions = [
      { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lon: 72.8777, timezone: 'Asia/Kolkata' },
      { name: 'Delhi', state: 'Delhi', lat: 28.7041, lon: 77.1025, timezone: 'Asia/Kolkata' },
      { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, timezone: 'Asia/Kolkata' },
      { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, timezone: 'Asia/Kolkata' },
      { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
    ]
    regions.forEach((region) => {
      weatherService.getWeather(region.name)
        .then((data) => {
          setRegionWeathers((prev) => ({ ...prev, [region.name]: data }))
        })
        .catch(() => {})
    })
  }, [])

  const handleNavClick = useCallback((label) => {
    setActivePage(label)
  }, [])

  const handleAsk = useCallback(async (question) => {
    return await ask(city, question)
  }, [city, ask])

  const handleCitySelect = useCallback((location) => {
    setCity(location.name)
    setActivePage('Dashboard')
  }, [setCity])

  const currentLocation = weatherData?.location
  const currentWeather = weatherData?.current
  const hourly = weatherData?.hourly || []
  const daily = weatherData?.daily || []

  const condition = currentWeather?.condition || 'Partly Cloudy'
  const description = daily[0]
    ? `${currentWeather?.condition || 'Partly cloudy'}. High around ${tempDisplay(daily[0]?.high || 31)}${tempSuffix}. Wind ${currentWeather?.windSpeed || 12} km/h. Rain chance ${currentWeather?.precipitationProbability || 30}%.`
    : 'Loading weather data...'

  const pageContent = {
    'Dashboard': (
      <Dashboard
        weatherData={weatherData}
        currentWeather={currentWeather}
        hourly={hourly}
        daily={daily}
        condition={condition}
        description={description}
        handleAsk={handleAsk}
        city={city}
        handleCitySelect={handleCitySelect}
        refresh={refresh}
        tempUnit={settings.tempUnit}
        tempDisplay={tempDisplay}
      />
    ),
    'Calendar': <CalendarPage weatherData={weatherData} city={city} refresh={refresh} tempUnit={settings.tempUnit} tempDisplay={tempDisplay} />,
    'Reports': <AnalyticsPage weatherData={weatherData} regionWeathers={regionWeathers} city={city} tempUnit={settings.tempUnit} tempDisplay={tempDisplay} />,
    'Explore regions': <RegionsPage weatherData={weatherData} onCitySelect={handleCitySelect} regionWeathers={regionWeathers} tempUnit={settings.tempUnit} tempDisplay={tempDisplay} />,
    'Settings': <SettingsPage settings={settings} setSettings={setSettings} />,
  }

  return (
    <>
      {icons}
      <div className="bg-image" />
      <div className="app-layout">
        <Sidebar onNavClick={handleNavClick} activePage={activePage} />

        <main className="main-content" data-theme={settings.darkMode ? 'dark' : 'light'}>
          <Header
            currentCity={currentLocation}
            onCitySearch={setCity}
            onCitySelect={handleCitySelect}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {pageContent[activePage]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Loading overlay */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            className="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="loading-spinner">
              <div className="spinner" />
              <p className="loading-text">Loading weather...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error overlay */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            className="error-overlay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="error-title">Unable to load weather data</p>
            <p className="error-message">{error}</p>
            <motion.button
              onClick={() => refresh(city)}
              className="retry-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
