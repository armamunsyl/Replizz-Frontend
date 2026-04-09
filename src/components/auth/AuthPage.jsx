import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import api from '../../lib/api'

const blue = '#2563EB'
const blueDark = '#1D4ED8'
const border = '#E5E7EB'
const textPrimary = '#111827'
const textSecondary = '#4B5563'
const textMuted = '#9CA3AF'

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
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    } else {
      if (!form.email || !form.password) { setError('Email and password are required.'); return }
    }
    setLoading(true)
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, form.email, form.password)
        try {
          await api.post('/api/auth/register', { name: form.name, email: form.email, password: form.password })
        } catch (backendError) {
          console.error('Backend registration failed:', backendError)
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

  const inputStyle = {
    width: '100%', padding: '10px 12px', fontSize: 14,
    color: textPrimary, border: `1px solid ${border}`,
    borderRadius: 8, outline: 'none',
    transition: 'border-color 0.15s', background: '#fff',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/replizz-logo.png" alt="Replizz" style={{ width: 36, height: 36, borderRadius: 8 }} onError={e => e.target.style.display = 'none'} />
            <span style={{ fontSize: 20, fontWeight: 700, color: textPrimary, letterSpacing: '-0.02em' }}>Replizz</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: textPrimary, marginTop: 20, marginBottom: 6 }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: 14, color: textMuted }}>
            {isRegister ? 'Start automating your Facebook inbox today' : 'Sign in to your Replizz account'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: `1px solid ${border}`, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {isRegister && (
              <div>
                <label htmlFor="name" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: textPrimary, marginBottom: 6 }}>Full Name</label>
                <input id="name" type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Enter your full name" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = blue}
                  onBlur={e => e.target.style.borderColor = border} />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: textPrimary, marginBottom: 6 }}>Email address</label>
              <input id="auth-email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = blue}
                onBlur={e => e.target.style.borderColor = border} />
            </div>

            <div>
              <label htmlFor="auth-password" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: textPrimary, marginBottom: 6 }}>Password</label>
              <input id="auth-password" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder={isRegister ? 'Minimum 6 characters' : 'Enter your password'} style={inputStyle}
                onFocus={e => e.target.style.borderColor = blue}
                onBlur={e => e.target.style.borderColor = border} />
            </div>

            {isRegister && (
              <div>
                <label htmlFor="auth-confirm" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: textPrimary, marginBottom: 6 }}>Confirm Password</label>
                <input id="auth-confirm" type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} placeholder="Repeat your password" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = blue}
                  onBlur={e => e.target.style.borderColor = border} />
              </div>
            )}

            {isRegister && (
              <p style={{ fontSize: 12, color: textMuted, lineHeight: 1.6 }}>
                By creating an account, you agree to our{' '}
                <Link to="/terms-of-service" style={{ color: blue }}>Terms of Service</Link> and{' '}
                <Link to="/privacy-policy" style={{ color: blue }}>Privacy Policy</Link>.
              </p>
            )}

            {error && (
              <p style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', margin: 0 }}>{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', fontSize: 15, fontWeight: 600, color: '#fff', background: loading ? '#93C5FD' : blue, border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!loading) e.target.style.background = blueDark }}
              onMouseLeave={e => { if (!loading) e.target.style.background = blue }}
            >
              {loading ? 'Please wait…' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={{ position: 'relative', margin: '20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: border }} />
            <span style={{ fontSize: 12, color: textMuted, whiteSpace: 'nowrap' }}>or</span>
            <div style={{ flex: 1, height: 1, background: border }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: textSecondary }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <Link to={isRegister ? '/login' : '/register'} style={{ color: blue, fontWeight: 600, textDecoration: 'none' }}>
              {isRegister ? 'Sign In' : 'Create one free'}
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: textMuted }}>
          <Link to="/" style={{ color: textMuted, textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  )
}

export default AuthPage
