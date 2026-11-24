import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import './Background.css'

const BLOBS = [
  { className: 'blob blob--violet', x: [0, 120, -60, 0], y: [0, 80, 140, 0], duration: 26 },
  { className: 'blob blob--cyan', x: [0, -140, 40, 0], y: [0, 120, -40, 0], duration: 30 },
  { className: 'blob blob--blue', x: [0, 80, -120, 0], y: [0, -100, 60, 0], duration: 34 },
]

/** Fixed animated aurora background with a soft spotlight that follows the cursor. */
export default function Background() {
  const mouseX = useMotionValue(-400)
  const mouseY = useMotionValue(-400)
  const x = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const y = useSpring(mouseY, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set(e.clientX - 300)
      mouseY.set(e.clientY - 300)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mouseX, mouseY])

  return (
    <div className="bg" aria-hidden="true">
      {BLOBS.map((b) => (
        <motion.div
          key={b.className}
          className={b.className}
          animate={{ x: b.x, y: b.y, scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: b.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.div className="bg__spotlight" style={{ x, y }} />
      <div className="bg__grid" />
      <div className="bg__vignette" />
    </div>
  )
}
