import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import './Stepper.css'

export default function Stepper({ steps, current }) {
  const progress = steps.length > 1 ? current / (steps.length - 1) : 0

  return (
    <div className="stepper">
      <div className="stepper__track" aria-hidden="true">
        <motion.div
          className="stepper__fill"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <ol className="stepper__list" aria-label="Application progress">
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo'
        return (
          <li
            key={step.id}
            className={`stepper__item stepper__item--${state}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <motion.span
              className="stepper__dot"
              animate={{ scale: state === 'active' ? 1.12 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {state === 'done' ? (
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                  style={{ display: 'grid' }}
                >
                  <Check size={16} strokeWidth={3} />
                </motion.span>
              ) : (
                i + 1
              )}
            </motion.span>
            <span className="stepper__text">
              <strong>{step.title}</strong>
              <small>{step.subtitle}</small>
            </span>
          </li>
        )
      })}
      </ol>
    </div>
  )
}
