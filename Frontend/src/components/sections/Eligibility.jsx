import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Clock, Lock, Zap } from 'lucide-react'
import LoanForm from '../form/LoanForm'
import LoadingState from '../result/LoadingState'
import ResultPanel from '../result/ResultPanel'
import Reveal from '../ui/Reveal'
import { predictLoan } from '../../api/client'
import { INITIAL_FORM } from '../../constants/loanOptions'
import './Eligibility.css'

// Keep the analysing animation on screen long enough to be readable.
const MIN_LOADING_MS = 1500
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const PERKS = [
  { icon: Zap, text: 'Instant result' },
  { icon: Lock, text: 'Data is not stored' },
  { icon: Clock, text: 'Takes about 1 minute' },
]

const panel = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.98 },
}

export default function Eligibility() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('form') // 'form' | 'loading' | 'result'
  const [result, setResult] = useState(null)
  const [apiError, setApiError] = useState(null)
  const cardRef = useRef(null)

  const scrollToCard = () =>
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))

  const handleFieldChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (payload) => {
    setApiError(null)
    setStatus('loading')
    scrollToCard()
    try {
      const [response] = await Promise.all([predictLoan(payload), wait(MIN_LOADING_MS)])
      setResult({ ...response, payload })
      setStatus('result')
    } catch (err) {
      setApiError(err.message)
      setStatus('form')
    }
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setResult(null)
    setStatus('form')
    scrollToCard()
  }

  const handleEdit = () => {
    setStatus('form')
    scrollToCard()
  }

  return (
    <section className="section" id="check">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Eligibility check</span>
          <h2 className="section-title">
            See where you <span className="gradient-text">stand</span>
          </h2>
          <p className="section-sub">
            Fill in three short steps and our model will estimate your default risk instantly.
          </p>
          <ul className="perks">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon size={15} /> {text}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="check-card glass" ref={cardRef}>
            <div className="check-card__glow" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                variants={panel}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {status === 'form' && (
                  <LoanForm
                    form={form}
                    onFieldChange={handleFieldChange}
                    onFill={setForm}
                    onSubmit={handleSubmit}
                    apiError={apiError}
                  />
                )}
                {status === 'loading' && <LoadingState />}
                {status === 'result' && result && (
                  <ResultPanel result={result} onReset={handleReset} onEdit={handleEdit} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
