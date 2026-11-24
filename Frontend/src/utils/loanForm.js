const num = (v) => (v === '' || v === null || v === undefined ? NaN : Number(v))

/** Loan amount as a fraction of annual income, rounded like the training data. */
export function loanPercentIncome(form) {
  const income = num(form.person_income)
  const amount = num(form.loan_amnt)
  if (!(income > 0) || !(amount > 0)) return null
  return Math.round((amount / income) * 100) / 100
}

const RULES = {
  person_age: (v) =>
    !Number.isInteger(v) || v < 18 || v > 100 ? 'Enter an age between 18 and 100' : null,
  person_income: (v) => (!(v > 0) ? 'Enter your annual income' : null),
  person_emp_length: (v) =>
    Number.isNaN(v) || v < 0 || v > 80 ? 'Enter years of employment (0 to 80)' : null,
  loan_amnt: (v) => (!(v > 0) ? 'Enter the loan amount' : null),
  loan_int_rate: (v) => (!(v > 0) || v > 100 ? 'Enter a rate between 0 and 100' : null),
  cb_person_cred_hist_length: (v) =>
    !Number.isInteger(v) || v < 0 || v > 80 ? 'Enter whole years (0 to 80)' : null,
}

const STEP_FIELDS = [
  ['person_age', 'person_income', 'person_emp_length'],
  ['loan_amnt', 'loan_int_rate'],
  ['cb_person_cred_hist_length'],
]

export function validateStep(step, form) {
  const errors = {}
  for (const field of STEP_FIELDS[step]) {
    const msg = RULES[field](num(form[field]))
    if (msg) errors[field] = msg
  }
  if (step === 1 && !errors.loan_amnt && loanPercentIncome(form) > 5) {
    errors.loan_amnt = 'Loan amount looks too high relative to income'
  }
  return errors
}

/** Convert the string-based form state into the API request body. */
export function buildPayload(form) {
  return {
    person_age: Math.trunc(num(form.person_age)),
    person_income: num(form.person_income),
    person_home_ownership: form.person_home_ownership,
    person_emp_length: num(form.person_emp_length),
    loan_intent: form.loan_intent,
    loan_grade: form.loan_grade,
    loan_amnt: num(form.loan_amnt),
    loan_int_rate: num(form.loan_int_rate),
    loan_percent_income: loanPercentIncome(form) ?? 0,
    cb_person_default_on_file: form.cb_person_default_on_file,
    cb_person_cred_hist_length: Math.trunc(num(form.cb_person_cred_hist_length)),
  }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatCurrency = (v) => currencyFormatter.format(v)
