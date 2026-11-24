import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { Gauge } from 'lucide-react'
import './Navbar.css'

const STATUS_LABEL = {
  checking: 'Connecting…',
  online: 'Model online',
  offline: 'API offline',
}

export default function Navbar({ apiStatus }) {
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  return (
    <motion.header
      className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__logo">
            <Gauge size={18} />
          </span>
          <span>
            Credit<span className="gradient-text">Lens</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          <a href="#how">How it works</a>
          <a href="#check">Check eligibility</a>
        </nav>

        <div className={`status status--${apiStatus}`} role="status">
          <span className="status__dot" />
          <span className="status__label">{STATUS_LABEL[apiStatus]}</span>
        </div>
      </div>
      <motion.div className="nav__progress" style={{ scaleX: progress }} />
    </motion.header>
  )
}
