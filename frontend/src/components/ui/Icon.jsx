// SVG Icon component using the sprite

export function Icon({ id, className, ...props }) {
  return (
    <svg className={className} {...props} aria-hidden="true">
      <use href={`#${id}`} />
    </svg>
  )
}

// All icons are defined in App.jsx as a sprite
// This component just references them