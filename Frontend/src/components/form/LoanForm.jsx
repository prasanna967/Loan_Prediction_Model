import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowLeft, ArrowRight, Sparkles, Wand2 } from 'lucide-react'
import Stepper from './Stepper'
import { ChoiceGroup, NumberField } from './Fields'
import {
  DEFAULT_ON_FILE,
  FORM_STEPS,
  HOME_OWNERSHIP,
  LOAN_GRADES,
  LOAN_INTENTS,
  SAMPLE_FORM,
} from '../../constants/loanOptions'
import { buildPayload, formatCurrency, loanPercentIncome, validateStep } from '../../utils/loanForm'
import './LoanForm.css'

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, filter: 'blur(6px)' }),
}

function LoanToIncome({ form }) {
  const ratio = loanPercentIncome(form)
  const pct = ratio == null ? 0 : Math.min(ratio, 1)
  const level = ratio == null ? 'none' : ratio <= 0.2 ? 'good' : ratio <= 0.35 ? 'fair' : 'high'
  const label = { none: 'Enter amount & income', good: 'Healthy', fair: 'Moderate', high: 'Stretched' }

  return (
    <div className={`lti lti--${level}`}>
      <div className="lti__head">
        <span>Loan-to-income ratio</span>
        <strong>
          {ratio == null ? '—' : `${Math.round(ratio * 100)}%`} <small>{label[level]}</small>
        </strong>
      </div>
      <div className="lti__bar">
        <motion.div
          className="lti__fill"
          initial={false}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="lti__note">Calculated automatically and sent to the model as loan_percent_income.</p>
    </div>
  )
}

function Review({ form }) {
  const intent = LOAN_INTENTS.find((o) => o.value === form.loan_intent)?.label
  const items = [
    ['Age', form.person_age],
    ['Annual income', form.person_income && formatCurrency(form.person_income)],
    ['Loan amount', form.loan_amnt && formatCurrency(form.loan_amnt)],
    ['Purpose', intent],
    ['Grade', form.loan_grade],
    ['Interest rate', form.loan_int_rate && `${form.loan_int_rate}%`],
  ]
  return (
    <div className="review">
      <span className="review__title">Quick review</span>
      <dl>
        {items.map(([k, v], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
          >
            <dt>{k}</dt>
            <dd>{v || '—'}</dd>
          </motion.div>
        ))}
      </dl>
    </div>
  )
}

export default function LoanForm({ form, onFieldChange, onFill, onSubmit, apiError }) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [errors, setErrors] = useState({})
  const [attempt, setAttempt] = useState(0)
  const isLast = step === FORM_STEPS.length - 1

  const change = (name, value) => {
    onFieldChange(name, value)
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const stepErrors = validateStep(step, form)
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors)
      setAttempt((a) => a + 1)
      return
    }
    setErrors({})
    if (isLast) onSubmit(buildPayload(form))
    else goTo(step + 1)
  }

  const fillSample = () => {
    onFill(SAMPLE_FORM)
    setErrors({})
  }

  const fieldProps = (name) => ({
    name,
    value: form[name],
    onChange: change,
    error: errors[name],
    shakeKey: attempt,
  })

  return (
    <form className="loan-form" onSubmit={handleSubmit} noValidate>
      <Stepper steps={FORM_STEPS} current={step} />

      <div className="loan-form__viewport">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="loan-form__step"
          >
            {step === 0 && (
              <>
                <div className="grid-3">
                  <NumberField {...fieldProps('person_age')} label="Age" suffix="yrs" placeholder="28" integer />
                  <NumberField {...fieldProps('person_income')} label="Annual income" prefix="$" placeholder="60,000" />
                  <NumberField {...fieldProps('person_emp_length')} label="Employment length" suffix="yrs" placeholder="4" />
                </div>
                <ChoiceGroup
                  name="person_home_ownership"
                  label="Home ownership"
                  options={HOME_OWNERSHIP}
                  value={form.person_home_ownership}
                  onChange={change}
                />
              </>
            )}

            {step === 1 && (
              <>
                <ChoiceGroup
                  name="loan_intent"
                  label="What is the loan for?"
                  options={LOAN_INTENTS}
                  value={form.loan_intent}
                  onChange={change}
                  columns={3}
                />
                <div className="grid-2">
                  <NumberField {...fieldProps('loan_amnt')} label="Loan amount" prefix="$" placeholder="10,000" />
                  <NumberField {...fieldProps('loan_int_rate')} label="Interest rate" suffix="%" placeholder="11.5" />
                </div>
                <ChoiceGroup
                  name="loan_grade"
                  label="Loan grade"
                  options={LOAN_GRADES}
                  value={form.loan_grade}
                  onChange={change}
                  variant="pills"
                />
                <LoanToIncome form={form} />
              </>
            )}

            {step === 2 && (
              <>
                <ChoiceGroup
                  name="cb_person_default_on_file"
                  label="Any previous default on file?"
                  options={DEFAULT_ON_FILE}
                  value={form.cb_person_default_on_file}
                  onChange={change}
                  variant="toggle"
                />
                <NumberField
                  {...fieldProps('cb_person_cred_hist_length')}
                  label="Credit history length"
                  suffix="yrs"
                  placeholder="5"
                  hint="Years since your first credit account was opened."
                  integer
                />
                <Review form={form} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {apiError && (
          <motion.div
            className="loan-form__alert"
            role="alert"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <AlertTriangle size={18} /> {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="loan-form__actions">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={() => goTo(step - 1)}>
            <ArrowLeft size={18} /> Back
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={fillSample}>
            <Wand2 size={18} /> Try sample data
          </button>
        )}

        <motion.button
          type="submit"
          className="btn btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLast ? (
            <>
              <Sparkles size={18} /> Check eligibility
            </>
          ) : (
            <>
              Continue <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </div>
    </form>
  )
}
