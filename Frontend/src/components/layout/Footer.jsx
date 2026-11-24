import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} CreditLens. Built with React, Motion &amp; FastAPI.
        </p>
        <p className="footer__note">
          Predictions are estimates from a machine-learning model and are not a lending decision.
        </p>
      </div>
    </footer>
  )
}
