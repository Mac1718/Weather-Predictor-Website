import { motion } from 'framer-motion'
import { weatherCodeToIcon } from '../../data/mockWeather.js'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function ForecastStrip({ hourly = [], tempUnit = '°C' }) {
  const displayHours = hourly.slice(0, 7)
  const temps = displayHours.map(h => tempUnit === '°F' ? Math.round(h.temperature * 9 / 5 + 32) : h.temperature)
  const minTemp = Math.min(...temps)
  const maxTemp = Math.max(...temps)
  const range = maxTemp - minTemp || 1

  const chartPoints = buildChartPoints(temps, 835, 160, minTemp, range)

  return (
    <section className="forecast" aria-label="Hourly forecast">
      <motion.div
        className="forecast-temps"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {displayHours.map((hour, index) => (
          <motion.div
            key={hour.time}
            className="temp-item"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.26 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="temp-value">{temps[index]}{tempUnit}</span>
            <svg className="temp-icon" aria-hidden="true">
              <use href={`#${hour.icon || weatherCodeToIcon(hour.weatherCode)}`} />
            </svg>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
              {hour.time}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <svg width="12" height="12" aria-hidden="true"><use href="#i-drop" /></svg>
              {hour.precipitationProbability}%
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <svg width="12" height="12" aria-hidden="true"><use href="#i-wind" /></svg>
              {hour.windSpeed} km/h
            </span>
          </motion.div>
        ))}
      </motion.div>
      <ForecastChart points={chartPoints} />
      <ForecastDays />
    </section>
  )
}

function buildChartPoints(temps, width, height, minTemp, range) {
  if (temps.length < 2) return ''

  const points = temps.map((t, i) => {
    const x = (i / (temps.length - 1)) * width
    const y = height - ((t - minTemp) / range) * (height - 30) - 15
    return { x, y }
  })

  if (points.length < 2) return ''

  let path = `M${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx1 = prev.x + (curr.x - prev.x) / 3
    const cpx2 = curr.x - (curr.x - prev.x) / 3
    path += ` C${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`
  }
  return path
}

function ForecastChart({ points }) {
  const defaultPath = "M0,79 C139,79 167,127 210,127 C253,127 288,35 340,35 C392,35 435,115 495,115 C555,115 605,43 675,43 C745,43 810,79 835,79"
  const pathD = points || defaultPath

  return (
    <motion.div
      className="chart-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg className="chart-svg" viewBox="0 0 835 160" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wf" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#fff" stopOpacity=".35" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="wfade">
            <rect x="0" y="0" width="835" height="160" fill="url(#wf)" />
          </mask>
          <clipPath id="wclip">
            <motion.rect
              id="wclipr"
              className="wclip"
              x="0"
              y="0"
              width="835"
              height="160"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.42, delay: 1.72, ease: [0.37, 0.01, 0.2, 1] }}
              style={{ transformOrigin: 'left center' }}
            />
          </clipPath>
        </defs>
        <motion.path
          className="wline"
          fill="none"
          stroke="url(#wg)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={pathD}
          pathLength="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, delay: 1.5, ease: [0.37, 0.01, 0.2, 1] }}
        />
        <path fill="url(#wg)" stroke="none" opacity="0.17" d={`${pathD} L835,160 L0,160 Z`} />
        <path fill="url(#wg)" stroke="none" opacity="0.26" d={`${pathD} L835,160 L0,160 Z`} />
        <motion.path
          className="wclip"
          fill="url(#wf)"
          mask="url(#wfade)"
          clipPath="url(#wclip)"
          d={`${pathD} L835,160 L0,160 Z`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.42, delay: 1.72, ease: [0.37, 0.01, 0.2, 1] }}
        />
      </svg>
    </motion.div>
  )
}

function ForecastDays() {
  return (
    <motion.div
      className="forecast-days"
      role="tablist"
      aria-label="Days"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {days.map((day, index) => (
        <motion.button
          key={day}
          className={`day-item ${index === 3 ? 'active' : ''}`}
          aria-pressed={index === 3}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.1 + index * 0.055, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {day}
        </motion.button>
      ))}
    </motion.div>
  )
}
