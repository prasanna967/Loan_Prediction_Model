import { MotionConfig } from 'motion/react'
import Background from './components/layout/Background'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import HowItWorks from './components/sections/HowItWorks'
import Eligibility from './components/sections/Eligibility'
import { useApiHealth } from './hooks/useApiHealth'

export default function App() {
  const apiStatus = useApiHealth()

  return (
    // reducedMotion="user" respects the OS "reduce motion" accessibility setting
    <MotionConfig reducedMotion="user">
      <Background />
      <Navbar apiStatus={apiStatus} />
      <main>
        <Hero />
        <HowItWorks />
        <Eligibility />
      </main>
      <Footer />
    </MotionConfig>
  )
}
