import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BrainCircuit } from 'lucide-react'
import './LoadingState.css'

const MESSAGES = [
  'Validating application…',
  'Imputing & encoding features…',
  'Scoring with XGBoost…',
  'Applying decision threshold…',
]

export default function LoadingState() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => Math.min(i + 1, MESSAGES.length - 1)), 380)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__orb">
        <motion.span
          className="loading__ring loading__ring--outer"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="loading__ring loading__ring--inner"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="loading__core"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BrainCircuit size={30} />
        </motion.span>
      </div>

      <h3>Analysing your application</h3>
      <div className="loading__message">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="loading__bar">
        <motion.span
          initial={{ x: '-100%' }}
          animate={{ x: '250%' }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
