import { useEffect } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import './Fields.css'

function FieldError({ id, error }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
          className="field__error"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/**
 * Numeric input with optional prefix/suffix. `shakeKey` changes on every
 * failed "Next" press so invalid fields shake each time.
 */
export function NumberField({
  name,
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  error,
  hint,
  integer = false,
  shakeKey = 0,
}) {
  const [scope, animate] = useAnimate()
  const id = `field-${name}`
  const errorId = `${id}-error`

  useEffect(() => {
    if (error && shakeKey > 0 && scope.current) {
      animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.45 })
    }
  }, [shakeKey, error, animate, scope])

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control" ref={scope}>
        {prefix && <span className="field__affix">{prefix}</span>}
        <input
          id={id}
          name={name}
          type="number"
          inputMode={integer ? 'numeric' : 'decimal'}
          step={integer ? 1 : 'any'}
          min="0"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        {suffix && <span className="field__affix">{suffix}</span>}
      </div>
      {hint && !error && <p className="field__hint">{hint}</p>}
      <FieldError id={errorId} error={error} />
    </div>
  )
}

/** Accessible radio group rendered as animated cards or pills. */
export function ChoiceGroup({ name, label, options, value, onChange, variant = 'cards', columns = 4 }) {
  return (
    <div className="field">
      <span className="field__label" id={`${name}-label`}>
        {label}
      </span>
      <div
        className={`choices choices--${variant}`}
        style={{ '--cols': columns }}
        role="radiogroup"
        aria-labelledby={`${name}-label`}
      >
        {options.map((opt) => {
          const selected = opt.value === value
          const Icon = opt.icon
          return (
            <motion.button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`choice ${selected ? 'choice--selected' : ''}`}
              onClick={() => onChange(name, opt.value)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              title={opt.hint}
            >
              {selected && (
                <motion.span
                  layoutId={`${name}-highlight`}
                  className="choice__highlight"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              {Icon && <Icon size={18} className="choice__icon" />}
              <span className="choice__label">{opt.label}</span>
              {variant === 'pills' && opt.hint && <span className="choice__hint">{opt.hint}</span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
