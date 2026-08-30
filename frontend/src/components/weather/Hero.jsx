import { motion } from 'framer-motion'

export function Hero({ condition = 'Strom with Heavy Rain', description = 'Partly cloudy with occasional snow showers. High around 50°F. Wind from the east 11 to 21 mph. Snow chance is 40%, with rainfall expected to be less than an inch.' }) {
  const lines = condition.split(' with ')

  return (
    <section className="hero" aria-labelledby="hero-title">
      <motion.span
        className="chip"
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
      >
        Weather Forecast
      </motion.span>
      <motion.h1
        id="hero-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.56 }}
      >
        {lines.map((line, index) => (
          <motion.span
            key={index}
            className="ln"
            initial={{ y: '115%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.05, delay: 0.56 + index * 0.11, ease: [0.37, 0.01, 0.2, 1] }}
          >
            <span>{line}{index === 0 ? ' with' : ''}</span>
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        className="blurb"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
      >
        {description}
      </motion.p>
    </section>
  )
}