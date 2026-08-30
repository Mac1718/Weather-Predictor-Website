import { useState } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { icon: 'i-cloud-rain', label: 'Dashboard' },
  { icon: 'i-chart', label: 'Reports' },
  { icon: 'i-globe', label: 'Explore regions' },
  { icon: 'i-cal', label: 'Calendar' },
  { icon: 'i-gear', label: 'Settings' },
]

export function Sidebar({ onNavClick, activePage }) {
  const handleClick = (label) => {
    if (onNavClick) onNavClick(label)
  }

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <motion.svg
        className="logo"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
      >
        <defs>
          <clipPath id="logoClip">
            <rect x="4" y="4" width="32" height="32" rx="8" />
          </clipPath>
        </defs>
        <g clipPath="url(#logoClip)">
          <rect x="4" y="4" width="32" height="32" rx="8" fill="rgba(255,255,255,0.1)" />
          <g stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none">
            <path d="M10 16c3 0 4-2 7-2s4 2 7 2" />
            <path d="M10 20c3 0 4-2 7-2s4 2 7 2" />
            <path d="M10 24c3 0 4-2 7-2s4 2 7 2" />
            <path d="M10 12c3 0 4-2 7-2s4 2 7 2" />
            <path d="M10 8c3 0 4-2 7-2s4 2 7 2" />
            <path d="M10 28c3 0 4-2 7-2s4 2 7 2" />
          </g>
        </g>
      </motion.svg>

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
            </motion.div>
          )
        })}
      </nav>
      <div className="sidebar-label">{activePage || 'Dashboard'}</div>
    </aside>
  )
}
