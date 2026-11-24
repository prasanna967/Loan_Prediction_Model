import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, BrainCircuit, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react'
import RiskGauge from '../ui/RiskGauge'
import AnimatedNumber from '../ui/AnimatedNumber'
import './Hero.css'

const HEADLINE = [
  { text: 'Know' },
  { text: 'your' },
  { text: 'loan', highlight: true },
  { text: 'eligibility', highlight: true },
  { text: 'in' },
  { text: 'seconds.' },
]

const STATS = [
  { value: 32581, label: 'Historical loans learned from' },
  { value: 11, label: 'Risk signals analysed' },
  { value: 92, suffix: '%', label: 'Accuracy on held-out test data' },
]

const DEMO = [
  { value: 0.18, label: 'Low Risk' },
  { value: 0.46, label: 'Low Risk' },
  { value: 0.82, label: 'High Risk' },
]

const DEMO_THRESHOLD = 0.668
const ease = [0.22, 1, 0.36, 1]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
}
const word = {
  hidden: { opacity: 0, y: 40, rotateX: -50, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
}

export default function Hero() {
  const [demoIndex, setDemoIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setDemoIndex((i) => (i + 1) % DEMO.length), 3200)
    return () => clearInterval(id)
  }, [])

  const demo = DEMO[demoIndex]
  const isHigh = demo.value >= DEMO_THRESHOLD

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__copy">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Sparkles size={14} /> AI-powered credit risk engine
          </motion.span>

          <motion.h1 className="hero__title" variants={container} initial="hidden" animate="show">
            {HEADLINE.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                className={`hero__word ${w.highlight ? 'gradient-text' : ''}`}
              >
                {w.text}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
          >
            CreditLens runs your application through a gradient-boosted model trained on
            more than 32,000 historical loans and returns an instant default-risk score. No
            paperwork, and no impact on your credit file.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05, ease }}
          >
            <motion.a
              href="#check"
              className="btn btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Check my eligibility <ArrowRight size={18} />
            </motion.a>
            <motion.a
              href="#how"
              className="btn btn-ghost"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              How it works
            </motion.a>
          </motion.div>

          <motion.dl
            className="hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="hero__stat">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <strong>
                    <AnimatedNumber value={s.value} suffix={s.suffix} delay={1.3} />
                  </strong>
                  <span>{s.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5, ease }}
        >
          <motion.div
            className="preview glass"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="preview__head">
              <span className="preview__title">
                <BrainCircuit size={16} /> Live risk preview
              </span>
              <span className="preview__dots">
                <i />
                <i />
                <i />
              </span>
            </div>

            <RiskGauge value={demo.value} threshold={DEMO_THRESHOLD} />

            <div className="preview__readout">
              <AnimatePresence mode="wait">
                <motion.strong
                  key={demoIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  {(demo.value * 100).toFixed(0)}%
                </motion.strong>
              </AnimatePresence>
              <span>default probability</span>
            </div>

            <motion.div
              className={`preview__badge ${isHigh ? 'is-high' : 'is-low'}`}
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              {isHigh ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />} {demo.label}
            </motion.div>
          </motion.div>

          <motion.div
            className="floating-chip floating-chip--a glass"
            animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ⚡ Result in &lt; 1s
          </motion.div>
          <motion.div
            className="floating-chip floating-chip--b glass"
            animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            🔒 No credit check
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
