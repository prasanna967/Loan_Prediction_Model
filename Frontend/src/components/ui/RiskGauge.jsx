import { useId } from 'react'
import { motion } from 'motion/react'
import './RiskGauge.css'

const CX = 110
const CY = 110
const R = 90
const ARC = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`

const pointAt = (fraction, radius) => {
  const angle = fraction * Math.PI
  return { x: CX - radius * Math.cos(angle), y: CY - radius * Math.sin(angle) }
}

const spring = { type: 'spring', stiffness: 60, damping: 14, mass: 1 }

/**
 * Semicircular gauge. `value` and `threshold` are probabilities between 0 and 1.
 */
export default function RiskGauge({ value = 0, threshold, delay = 0, className = '' }) {
  const id = useId()
  const v = Math.min(Math.max(value, 0), 1)
  const tickIn = threshold != null ? pointAt(threshold, R - 16) : null
  const tickOut = threshold != null ? pointAt(threshold, R + 10) : null

  return (
    <svg
      className={`gauge ${className}`}
      viewBox="0 0 220 128"
      role="img"
      aria-label={`Default probability ${(v * 100).toFixed(1)} percent`}
    >
      <defs>
        <linearGradient id={`${id}-grad`} gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="200" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f87171" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={ARC} className="gauge__track" />
      <motion.path
        d={ARC}
        className="gauge__value"
        stroke={`url(#${id}-grad)`}
        filter={`url(#${id}-glow)`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.max(v, 0.001) }}
        transition={{ ...spring, delay }}
      />

      {tickIn && (
        <motion.line
          x1={tickIn.x}
          y1={tickIn.y}
          x2={tickOut.x}
          y2={tickOut.y}
          className="gauge__threshold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.6 }}
        />
      )}

      {/* The invisible circle centres the group's bounding box on the pivot point. */}
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: v * 180 }}
        transition={{ ...spring, delay }}
      >
        <circle cx={CX} cy={CY} r={R - 22} fill="transparent" />
        <line x1={CX} y1={CY} x2={CX - (R - 22)} y2={CY} className="gauge__needle" />
      </motion.g>
      <circle cx={CX} cy={CY} r="8" className="gauge__hub" />
      <circle cx={CX} cy={CY} r="3" className="gauge__hub-dot" />
    </svg>
  )
}
