import { motion } from 'motion/react'
import { ClipboardList, Cpu, ShieldCheck } from 'lucide-react'
import Reveal from '../ui/Reveal'
import './HowItWorks.css'

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Share a few details',
    text: 'Tell us about your income, employment, the loan you need and your credit history. It takes under a minute.',
  },
  {
    icon: Cpu,
    title: 'Model scores the risk',
    text: 'A tuned XGBoost pipeline estimates the probability of default from 11 signals learned from historical loans.',
  },
  {
    icon: ShieldCheck,
    title: 'Get an instant verdict',
    text: 'The score is compared with an optimised decision threshold to tell you whether the application is low or high risk.',
  },
]

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 className="section-title">
            From application to <span className="gradient-text">decision</span> in three steps
          </h2>
          <p className="section-sub">
            Behind the scenes, a FastAPI service hosts the trained model and responds in milliseconds.
          </p>
        </Reveal>

        <motion.ol
          className="steps"
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <motion.li
              key={title}
              className="step glass"
              variants={card}
              whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              <span className="step__number">0{i + 1}</span>
              <span className="step__icon">
                <Icon size={24} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
