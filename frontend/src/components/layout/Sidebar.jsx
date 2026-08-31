import { useState } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { icon: 'i-cloud-rain', label: 'Dashboard' },
  { icon: 'i-chart', label: 'Reports' },
  { icon: 'i-insights', label: 'Insights' },
  { icon: 'i-globe', label: 'Climate Atlas' },
  { icon: 'i-cal', label: 'Calendar' },
  { icon: 'i-gear', label: 'Settings' },
]

export function Sidebar({ onNavClick, activePage }) {
  const handleClick = (label) => {
    if (onNavClick) onNavClick(label)
  }

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <motion.img
        className="logo"
        src="/logo.svg"
        alt="Weather Predictor Logo"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '48px', height: '48px', objectFit: 'contain' }}
      />

      <nav className="nav">
        {navItems.map((item, index) => {
          const isActive = activePage === item.label
          return (
            <motion.div
              key={item.label}
              className={`nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.36 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(item.label)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(item.label) }}
              role="button"
              tabIndex={0}
              title={item.label}
            >
              <svg className="nav-icon" aria-hidden="true">
                <use href={`#${item.icon}`} />
              </svg>
              <span className="nav-item-label">{item.label}</span>
            </motion.div>
          )
        })}
      </nav>
      <div className="sidebar-label">{activePage || 'Dashboard'}</div>
    </aside>
  )
}
