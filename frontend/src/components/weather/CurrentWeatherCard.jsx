import { motion } from 'framer-motion'

export function CurrentWeatherCard({ data, delay = 0.8, tempUnit = '°C' }) {
  if (!data?.current) return null

  const { location, current } = data
  const condition = current.condition
  const temp = tempUnit === '°F' ? Math.round(current.temperature * 9 / 5 + 32) : current.temperature
  const windSpeed = current.windSpeed
  const rainProb = current.precipitationProbability
  const humidity = current.humidity

  return (
    <motion.div
      className="card big"
      initial={{ x: 30, scale: 0.985, opacity: 0 }}
      animate={{ x: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="card-header">
        <svg className="pin-icon" aria-hidden="true">
          <use href="#i-pin" />
        </svg>
        <span className="location-name">{location.city}{location.state && `, ${location.state}`}</span>
      </div>
      <motion.div
        className="big-temp"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        {temp}{tempUnit}
      </motion.div>
      <motion.div
        className="metrics"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.36, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="metric">
          <span className="metric-label">Wind</span>
          <div className="metric-value">
            <svg className="metric-icon" aria-hidden="true">
              <use href="#i-wind" />
            </svg>
            {windSpeed} km/h
          </div>
        </div>
        <div className="metric">
          <span className="metric-label">Rain</span>
          <div className="metric-value">
            <svg className="metric-icon" aria-hidden="true">
              <use href="#i-drop" />
            </svg>
            {rainProb}%
          </div>
        </div>
        <div className="metric">
          <span className="metric-label">Humidity</span>
          <div className="metric-value">
            <svg className="metric-icon" aria-hidden="true">
              <use href="#i-drop" />
            </svg>
            {humidity}%
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}