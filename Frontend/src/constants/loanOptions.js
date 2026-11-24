import {
  Briefcase,
  Building2,
  GraduationCap,
  Hammer,
  HeartPulse,
  Home,
  KeyRound,
  Landmark,
  Layers,
  Rocket,
  Wallet,
} from 'lucide-react'

// Values must match the categories the model was trained on (see main.py).
export const HOME_OWNERSHIP = [
  { value: 'RENT', label: 'Rent', icon: KeyRound },
  { value: 'OWN', label: 'Own', icon: Home },
  { value: 'MORTGAGE', label: 'Mortgage', icon: Landmark },
  { value: 'OTHER', label: 'Other', icon: Building2 },
]

export const LOAN_INTENTS = [
  { value: 'PERSONAL', label: 'Personal', icon: Wallet },
  { value: 'EDUCATION', label: 'Education', icon: GraduationCap },
  { value: 'MEDICAL', label: 'Medical', icon: HeartPulse },
  { value: 'VENTURE', label: 'Venture', icon: Rocket },
  { value: 'HOMEIMPROVEMENT', label: 'Home improvement', icon: Hammer },
  { value: 'DEBTCONSOLIDATION', label: 'Debt consolidation', icon: Layers },
]

export const LOAN_GRADES = [
  { value: 'A', label: 'A', hint: 'Excellent' },
  { value: 'B', label: 'B', hint: 'Very good' },
  { value: 'C', label: 'C', hint: 'Good' },
  { value: 'D', label: 'D', hint: 'Fair' },
  { value: 'E', label: 'E', hint: 'Weak' },
  { value: 'F', label: 'F', hint: 'Poor' },
  { value: 'G', label: 'G', hint: 'Very poor' },
]

export const DEFAULT_ON_FILE = [
  { value: 'N', label: 'No previous default' },
  { value: 'Y', label: 'Has defaulted before' },
]

export const FORM_STEPS = [
  { id: 'profile', title: 'About you', subtitle: 'Personal & employment', icon: Briefcase },
  { id: 'loan', title: 'Loan details', subtitle: 'Amount, purpose & rate', icon: Wallet },
  { id: 'credit', title: 'Credit history', subtitle: 'Bureau information', icon: Landmark },
]

export const INITIAL_FORM = {
  person_age: '',
  person_income: '',
  person_home_ownership: 'RENT',
  person_emp_length: '',
  loan_intent: 'PERSONAL',
  loan_grade: 'B',
  loan_amnt: '',
  loan_int_rate: '',
  cb_person_default_on_file: 'N',
  cb_person_cred_hist_length: '',
}

export const SAMPLE_FORM = {
  person_age: '29',
  person_income: '65000',
  person_home_ownership: 'MORTGAGE',
  person_emp_length: '5',
  loan_intent: 'EDUCATION',
  loan_grade: 'A',
  loan_amnt: '9000',
  loan_int_rate: '7.9',
  cb_person_default_on_file: 'N',
  cb_person_cred_hist_length: '6',
}
