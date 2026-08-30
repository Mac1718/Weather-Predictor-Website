import { motion } from 'framer-motion'
import { weatherCodeToIcon } from '../../data/mockWeather.js'

export function WeeklyForecast({ daily = [], tempUnit = '°C' }) {
  if (!daily || daily.length === 0) return null

  const fmt = (v) => tempUnit === '°F' ? Math.round(v * 9 / 5 + 32) : v

  return (
    <motion.div
      className="weekly-forecast"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(12 * var(--u))',
        marginTop: 'calc(24 * var(--u))',
        padding: '0 calc(4 * var(--u))',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 style={{ fontSize: 'calc(18 * var(--u))', fontWeight: 500, letterSpacing: 'calc(-0.3 * var(--u))', marginBottom: 'calc(16 * var(--u))' }}>
        7-Day Forecast
      </h2>
      {daily.map((day, index) => (
        <motion.div
          key={day.date}
          className="card row"
          style={{
            height: 'auto',
            minHeight: 'calc(80 * var(--u))',
            padding: 'calc(16 * var(--u)) calc(20 * var(--u))',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          initial={{ x: 30, scale: 0.985, opacity: 0 }}
          animate={{ x: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.95, delay: 1.8 + index * 0.11, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ x: 4 }}
        >
          <div className="card-info" style={{ flex: 1 }}>
            <span className="card-location">{day.day}</span>
            <span className="card-city" style={{ fontSize: 'calc(18 * var(--u))' }}>{day.condition}</span>
            <span className="card-condition" style={{ display: 'flex', alignItems: 'center', gap: 'calc(8 * var(--u))', marginTop: 'calc(4 * var(--u))' }}>
              <span>High: {fmt(day.high)}{tempUnit}</span>
              <span>Low: {fmt(day.low)}{tempUnit}</span>
              <svg width="14" height="14" aria-hidden="true"><use href="#i-drop" /></svg>
              <span>{day.precipitationProbability}%</span>
              <svg width="14" height="14" aria-hidden="true"><use href="#i-wind" /></svg>
              <span>{day.windSpeed} km/h</span>
            </span>
          </div>
          <div className="card-temp">
            <span className="card-temp-value" style={{ fontSize: 'calc(32 * var(--u))' }}>{fmt(day.high)}{tempUnit}</span>
            <svg className="card-temp-icon" style={{ width: 'calc(40 * var(--u))', height: 'calc(40 * var(--u))' }} aria-hidden="true">
              <use href={`#${weatherCodeToIcon(day.weatherCode)}`} />
            </svg>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}