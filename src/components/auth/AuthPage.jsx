import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import api from '../../lib/api'
import './AuthPage.css'

function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (isRegister) {
      if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    } else {
      if (!form.email || !form.password) { setError('Email and password are required.'); return }
    }
    setLoading(true)
    try {
      if (isRegister) {
        // 1. Create in Firebase
        await createUserWithEmailAndPassword(auth, form.email, form.password)
        // 2. Create in MongoDB Backend
        try {
          await api.post('/api/auth/register', {
            name: form.name,
            email: form.email,
            password: form.password
          })
        } catch (backendError) {
          console.error("Backend registration failed:", backendError)
          // Continue to overview even if backend fails, getMe will auto-create if we add that fallback
        }
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password)
      }
      navigate('/overview')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className={`auth-page anim-reveal ${isRegister ? 'auth-register' : 'auth-login'}`}
      aria-label={isRegister ? 'Register page' : 'Login page'}
    >
      <div className="auth-shell anim-pop anim-delay-1">
        <aside className="auth-side anim-slide-left">
          <div className="auth-brand">
            <img src="/replizz-logo.png" alt="Replizz logo" />
            <span>Replizz</span>
          </div>

          <p className="auth-kicker">Secure Access</p>
          <h1>{isRegister ? 'Create your workspace account' : 'Welcome back to your workspace'}</h1>
          <p className="auth-side-text">
            Manage inbox, products, plans, and automation from one dashboard powered by Replizz.
          </p>

          <ul className="auth-side-list">
            <li>Real-time inbox and customer view</li>
            <li>Product instruction and plan management</li>
            <li>Facebook page based workflow setup</li>
          </ul>
        </aside>

        <div className="auth-form-panel anim-slide-right anim-delay-1">
          <Link className="auth-back-home anim-hover-lift" to="/">
            ← Back to Home
          </Link>

          <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Enter your details to start using your workspace.'
              : 'Use your email and password to continue.'}
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {isRegister ? (
              <label className="auth-field">
                <span>Full Name</span>
                <input type="text" placeholder="Enter your full name" value={form.name} onChange={e => update('name', e.target.value)} />
              </label>
            ) : null}

            <label className="auth-field">
              <span>Email</span>
              <input type="email" placeholder="Enter your email" value={form.email} onChange={e => update('email', e.target.value)} />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input type="password" placeholder="Enter your password" value={form.password} onChange={e => update('password', e.target.value)} />
            </label>

            {isRegister ? (
              <label className="auth-field">
                <span>Confirm Password</span>
                <input type="password" placeholder="Confirm your password" value={form.confirm} onChange={e => update('confirm', e.target.value)} />
              </label>
            ) : null}

            {isRegister ? (
              <label className="auth-checkline">
                <input type="checkbox" />
                <span>I agree with Terms and Privacy Policy</span>
              </label>
            ) : (
              <div className="auth-row">
                <label className="auth-checkline">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="auth-link-btn anim-hover-lift">
                  Forgot Password?
                </button>
              </div>
            )}

            {error ? <p style={{ color: '#ff6b6b', fontSize: '0.82rem', margin: '0.4rem 0' }}>{error}</p> : null}
            <button className="auth-submit anim-hover-lift" type="submit" disabled={loading}>
              {loading ? 'Please wait…' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? 'Already have an account?' : 'Don’t have an account?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign In' : 'Register'}</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default AuthPage
