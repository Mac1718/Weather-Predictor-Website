import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSavedLocations } from '../../hooks/useWeather.js'

export function SavedLocations({ currentCity, onSelectCity }) {
  const { locations, saveLocation, removeLocation, isSaved } = useSavedLocations()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSave = () => {
    if (currentCity) {
      saveLocation(currentCity)
    }
  }

  const handleSelect = (location) => {
    onSelectCity(location)
    setShowDropdown(false)
  }

  const handleRemove = (e, location) => {
    e.stopPropagation()
    removeLocation(location)
  }

  return (
    <div className="saved-locations" style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="tool-btn"
        aria-label="Saved locations"
        aria-expanded={showDropdown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="tool-icon" aria-hidden="true">
          <use href="#i-pin" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(60 * var(--u))',
              right: 0,
              minWidth: 'calc(240 * var(--u))',
              maxWidth: 'calc(320 * var(--u))',
              background: 'linear-gradient(180deg, rgba(255,255,255,.20) 0%, rgba(255,255,255,.12) 100%)',
              backdropFilter: 'blur(calc(20 * var(--u))) saturate(115%)',
              border: 'calc(1 * var(--u)) solid rgba(255,255,255,.15)',
              borderRadius: 'calc(16 * var(--u))',
              padding: 'calc(12 * var(--u))',
              zIndex: 100,
              boxShadow: '0 calc(8 * var(--u)) calc(32 * var(--u)) rgba(0,0,0,.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'calc(12 * var(--u))', paddingBottom: 'calc(12 * var(--u))', borderBottom: 'calc(1 * var(--u)) solid rgba(255,255,255,.1)' }}>
              <h4 style={{ fontSize: 'calc(14 * var(--u))', fontWeight: 600, letterSpacing: 'calc(0.5 * var(--u))', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>
                Saved Locations
              </h4>
              {currentCity && !isSaved(currentCity) && (
                <motion.button
                  onClick={handleSave}
                  style={{
                    padding: 'calc(6 * var(--u)) calc(12 * var(--u))',
                    background: 'rgba(255,255,255,.15)',
                    backdropFilter: 'blur(calc(12 * var(--u))) saturate(115%)',
                    border: 'calc(1 * var(--u)) solid rgba(255,255,255,.15)',
                    borderRadius: 'calc(10 * var(--u))',
                    color: '#fff',
                    fontSize: 'calc(11 * var(--u))',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  whileHover={{ background: 'rgba(255,255,255,.25)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Save Current
                </motion.button>
              )}
            </div>

            {locations.length === 0 ? (
              <p style={{ fontSize: 'calc(13 * var(--u))', color: 'rgba(255,255,255,.5)', textAlign: 'center', padding: 'calc(20 * var(--u))' }}>
                No saved locations yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(6 * var(--u))' }}>
                {locations.map((loc, index) => (
                  <motion.div
                    key={`${loc.name}-${loc.state}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'calc(12 * var(--u)) calc(14 * var(--u))',
                      background: currentCity?.name === loc.name && currentCity?.state === loc.state
                        ? 'rgba(255,255,255,.12)'
                        : 'rgba(255,255,255,.06)',
                      backdropFilter: 'blur(calc(12 * var(--u))) saturate(115%)',
                      border: 'calc(1 * var(--u)) solid rgba(255,255,255,.1)',
                      borderRadius: 'calc(12 * var(--u))',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => handleSelect(loc)}
                    whileHover={{ background: 'rgba(255,255,255,.15)', x: 4 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(2 * var(--u))' }}>
                      <span style={{ fontSize: 'calc(15 * var(--u))', fontWeight: 500, color: '#fff' }}>
                        {loc.name}
                      </span>
                      <span style={{ fontSize: 'calc(11 * var(--u))', color: 'rgba(255,255,255,.55)' }}>
                        {loc.state}, {loc.country}
                      </span>
                    </div>
                    <motion.button
                      onClick={(e) => handleRemove(e, loc)}
                      style={{
                        padding: 'calc(4 * var(--u))',
                        background: 'rgba(255,255,255,.08)',
                        border: 'none',
                        borderRadius: 'calc(8 * var(--u))',
                        color: 'rgba(255,255,255,.5)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      whileHover={{ background: 'rgba(255,100,100,.2)', color: '#ff6464' }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Remove ${loc.name}`}
                    >
                      <svg width="14" height="14" aria-hidden="true"><use href="#i-out" /></svg>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}