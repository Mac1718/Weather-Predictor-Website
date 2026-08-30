import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCitySearch, useSavedLocations } from '../../hooks/useWeather.js'

export function Header({ onCitySearch, onCitySelect, currentCity }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const searchRef = useRef(null)
  const { results, search, loading: searchLoading } = useCitySearch()
  const { locations, saveLocation, isSaved, removeLocation } = useSavedLocations()

  const debouncedSearch = useCallback(
    debounce((query) => search(query), 250),
    [search]
  )

  useEffect(() => {
    if (searchQuery.length >= 1) {
      debouncedSearch(searchQuery)
    } else {
      search('')  // load all cities
    }
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
        setShowSaved(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectCity = (city) => {
    onCitySelect(city)
    setSearchOpen(false)
    setShowSaved(false)
    setSearchQuery('')
  }

  const handleSaveCurrent = () => {
    if (currentCity && !isSaved(currentCity)) {
      saveLocation(currentCity)
    }
  }

  return (
    <header className="header" ref={searchRef}>
      <div className="header-left">
        <motion.div
          className="greeting-pill"
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="greeting"
            style={{ margin: 0 }}
          >
            Welcome
          </motion.span>
          <motion.span
            className="username"
            style={{ margin: 0 }}
          >
            Weather Predictor
          </motion.span>
        </motion.div>
      </div>

      <div className="header-tools">
        {/* Search Button */}
        <div className="dropdown-container">
          <motion.button
            className="tool-btn"
            onClick={() => {
              setSearchOpen(!searchOpen)
              setShowSaved(false)
              if (!searchOpen) setSearchQuery('')
            }}
            aria-label="Search cities"
            aria-expanded={searchOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="tool-icon" aria-hidden="true">
              <use href="#i-search" />
            </svg>
          </motion.button>

          <AnimatePresence>
            {searchOpen && !showSaved && (
              <motion.div
                className="dropdown-panel"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="search-input-wrap">
                  <svg aria-hidden="true"><use href="#i-search" /></svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a city..."
                    className="search-input"
                    autoFocus
                  />
                </div>

                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {searchLoading ? (
                      <p className="empty-state">Searching...</p>
                    ) : results.length > 0 ? (
                      results.map((result, index) => (
                        <motion.button
                          key={`${result.name}-${index}`}
                          className="city-item"
                          onClick={() => handleSelectCity(result)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15, delay: index * 0.03 }}
                        >
                          <div>
                            <span className="city-item-name">{result.name}</span>
                            <span className="city-item-state">{result.state}, {result.country}</span>
                          </div>
                          {!isSaved(result) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                saveLocation(result)
                              }}
                              className="remove-btn"
                              title="Save location"
                            >
                              <svg width="14" height="14" aria-hidden="true"><use href="#i-pin" /></svg>
                            </button>
                          )}
                        </motion.button>
                      ))
                    ) : (
                      <p className="empty-state">No cities found</p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Saved Locations Button */}
        <div className="dropdown-container">
          <motion.button
            className="tool-btn"
            onClick={() => {
              setShowSaved(!showSaved)
              setSearchOpen(false)
            }}
            aria-label="Saved locations"
            aria-expanded={showSaved}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="tool-icon" aria-hidden="true">
              <use href="#i-pin" />
            </svg>
            {locations.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '16px',
                height: '16px',
                background: '#fff',
                color: '#04121b',
                borderRadius: '50%',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {locations.length}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showSaved && (
              <motion.div
                className="dropdown-panel"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="section-header">
                  <span className="section-title">Saved Locations</span>
                  {currentCity && !isSaved(currentCity) && (
                    <motion.button
                      onClick={handleSaveCurrent}
                      className="save-current-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Save Current
                    </motion.button>
                  )}
                </div>

                {locations.length === 0 ? (
                  <p className="empty-state">No saved locations yet</p>
                ) : (
                  locations.map((loc, index) => (
                    <motion.div
                      key={`${loc.name}-${loc.state}`}
                      className={`saved-item ${currentCity?.name === loc.name && currentCity?.state === loc.state ? 'active' : ''}`}
                      onClick={() => handleSelectCity(loc)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      whileHover={{ background: 'rgba(255,255,255,.15)' }}
                    >
                      <div className="saved-item-info">
                        <span className="saved-item-name">{loc.name}</span>
                        <span className="saved-item-state">{loc.state}, {loc.country}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeLocation(loc); }}
                        className="remove-btn"
                        aria-label={`Remove ${loc.name}`}
                      >
                        <svg width="14" height="14" aria-hidden="true"><use href="#i-out" /></svg>
                      </button>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  )
}

function debounce(fn, delay) {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
