import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'

const blue = '#2563EB'
const blueDark = '#1D4ED8'
const border = '#E5E7EB'
const textPrimary = '#111827'
const textSecondary = '#4B5563'
const textMuted = '#9CA3AF'

function LoginView() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/overview')
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message)
    } finally {
      setLoading(false)
    }
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
          <h1 style={{ fontSize: 24, fontWeight: 700, color: textPrimary, marginTop: 20, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: textMuted }}>Sign in to your Replizz account</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: `1px solid ${border}`, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: textPrimary, marginBottom: 6 }}>Email address</label>
              <input
                id="email" type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '10px 12px', fontSize: 14, color: textPrimary, border: `1px solid ${border}`, borderRadius: 8, outline: 'none', transition: 'border-color 0.15s', background: '#fff' }}
                onFocus={e => e.target.style.borderColor = blue}
                onBlur={e => e.target.style.borderColor = border}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label htmlFor="password" style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>Password</label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: 13, color: blue, cursor: 'pointer', padding: 0 }}>Forgot password?</button>
              </div>
              <input
                id="password" type="password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: '100%', padding: '10px 12px', fontSize: 14, color: textPrimary, border: `1px solid ${border}`, borderRadius: 8, outline: 'none', transition: 'border-color 0.15s', background: '#fff' }}
                onFocus={e => e.target.style.borderColor = blue}
                onBlur={e => e.target.style.borderColor = border}
              />
            </div>

            {error && <p style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', margin: 0 }}>{error}</p>}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', fontSize: 15, fontWeight: 600, color: '#fff', background: loading ? '#93C5FD' : blue, border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!loading) e.target.style.background = blueDark }}
              onMouseLeave={e => { if (!loading) e.target.style.background = blue }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ position: 'relative', margin: '20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: border }} />
            <span style={{ fontSize: 12, color: textMuted, whiteSpace: 'nowrap' }}>or</span>
            <div style={{ flex: 1, height: 1, background: border }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: textSecondary }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: blue, fontWeight: 600, textDecoration: 'none' }}>Create one free</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: textMuted }}>
          <Link to="/" style={{ color: textMuted, textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginView
