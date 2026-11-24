import { motion } from 'motion/react'
import { Lightbulb, PencilLine, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react'
import RiskGauge from '../ui/RiskGauge'
import AnimatedNumber from '../ui/AnimatedNumber'
import { LOAN_INTENTS } from '../../constants/loanOptions'
import { formatCurrency } from '../../utils/loanForm'
import './ResultPanel.css'

const ease = [0.22, 1, 0.36, 1]

// Deterministic burst particles (no randomness during render).
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2
  const distance = i % 2 ? 78 : 110
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, delay: (i % 4) * 0.03 }
})

const list = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

/** General, rule-based guidance. These are not model explanations. */
function buildTips(p) {
  const tips = []
  if (p.loan_percent_income > 0.3)
    tips.push('Requesting a smaller amount would lower your loan-to-income ratio.')
  if (['D', 'E', 'F', 'G'].includes(p.loan_grade))
    tips.push('Improving your loan grade typically unlocks lower interest rates.')
  if (p.loan_int_rate > 15) tips.push('Shopping around for a lower interest rate reduces repayment pressure.')
  if (p.cb_person_default_on_file === 'Y')
    tips.push('A clean repayment record over time offsets a previous default.')
  if (p.person_emp_length < 2) tips.push('Longer, stable employment strengthens future applications.')
  if (!tips.length) tips.push('Your application profile looks well balanced. Keep repayments on time.')
  return tips.slice(0, 3)
}

export default function ResultPanel({ result, onReset, onEdit }) {
  const { default_probability: prob, threshold, default_prediction: prediction, payload } = result
  const isHigh = prediction === 1
  const Icon = isHigh ? ShieldAlert : ShieldCheck
  const margin = Math.abs(threshold - prob) * 100
  const intent = LOAN_INTENTS.find((o) => o.value === payload.loan_intent)?.label

  const snapshot = [
    ['Loan amount', formatCurrency(payload.loan_amnt)],
    ['Purpose', intent],
    ['Loan grade', payload.loan_grade],
    ['Interest rate', `${payload.loan_int_rate}%`],
    ['Loan-to-income', `${Math.round(payload.loan_percent_income * 100)}%`],
    ['Prior default', payload.cb_person_default_on_file === 'Y' ? 'Yes' : 'No'],
  ]

  return (
    <div className={`result ${isHigh ? 'result--high' : 'result--low'}`}>
      <div className="result__hero">
        <div className="result__badge-wrap">
          {!isHigh &&
            PARTICLES.map((pt, i) => (
              <motion.span
                key={i}
                className="result__particle"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: pt.x, y: pt.y, opacity: 0, scale: 0.3 }}
                transition={{ duration: 1, delay: 0.35 + pt.delay, ease: 'easeOut' }}
              />
            ))}
          <motion.span
            className="result__badge"
            initial={{ scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.15 }}
          >
            <Icon size={34} />
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
        >
          <span className="result__label">{result.Result}</span>
          <h3 className="result__title">
            {isHigh ? 'This application looks risky' : 'You look eligible for this loan'}
          </h3>
          <p className="result__text">
            {isHigh
              ? 'The model estimates a default probability above the approval threshold.'
              : 'The model estimates a default probability below the approval threshold.'}
          </p>
        </motion.div>
      </div>

      <div className="result__body">
        <motion.div
          className="result__gauge"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <RiskGauge value={prob} threshold={threshold} delay={0.4} />
          <div className="result__score">
            <strong>
              <AnimatedNumber value={prob * 100} decimals={1} suffix="%" delay={0.4} />
            </strong>
            <span>Default probability</span>
          </div>
          <div className="result__legend">
            <span>
              <i className="legend-line" /> Threshold {(threshold * 100).toFixed(1)}%
            </span>
            <span>
              {margin.toFixed(1)} pts {isHigh ? 'above' : 'below'}
            </span>
          </div>
        </motion.div>

        <div className="result__details">
          <motion.dl className="snapshot" variants={list} initial="hidden" animate="show">
            {snapshot.map(([k, v]) => (
              <motion.div key={k} variants={item} className="snapshot__item">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.div
            className="tips"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <span className="tips__title">
              <Lightbulb size={16} /> Ways to strengthen an application
            </span>
            <ul>
              {buildTips(payload).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="result__actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <button type="button" className="btn btn-ghost" onClick={onEdit}>
          <PencilLine size={18} /> Edit details
        </button>
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={onReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <RotateCcw size={18} /> New application
        </motion.button>
      </motion.div>
    </div>
  )
}
