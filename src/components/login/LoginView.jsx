import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import './LoginView.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function LoginView() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const shellRef = useRef(null)
  const headRef = useRef(null)
  const targetPoseRef = useRef({
    lookX: 0,
    lookY: 0,
    headRotation: 0,
    bodyX: 0,
    bodyY: 0,
    bodyRotation: 0,
  })
  const currentPoseRef = useRef({
    lookX: 0,
    lookY: 0,
    headRotation: 0,
    bodyX: 0,
    bodyY: 0,
    bodyRotation: 0,
  })

  useEffect(() => {
    let rafId = 0

    const animate = () => {
      const current = currentPoseRef.current
      const target = targetPoseRef.current

      current.lookX += (target.lookX - current.lookX) * 0.14
      current.lookY += (target.lookY - current.lookY) * 0.14
      current.headRotation += (target.headRotation - current.headRotation) * 0.12
      current.bodyX += (target.bodyX - current.bodyX) * 0.12
      current.bodyY += (target.bodyY - current.bodyY) * 0.12
      current.bodyRotation += (target.bodyRotation - current.bodyRotation) * 0.11

      if (shellRef.current) {
        shellRef.current.style.setProperty('--look-x', `${current.lookX.toFixed(2)}px`)
        shellRef.current.style.setProperty('--look-y', `${current.lookY.toFixed(2)}px`)
        shellRef.current.style.setProperty('--head-rot', `${current.headRotation.toFixed(2)}deg`)
        shellRef.current.style.setProperty('--body-x', `${current.bodyX.toFixed(2)}px`)
        shellRef.current.style.setProperty('--body-y', `${current.bodyY.toFixed(2)}px`)
        shellRef.current.style.setProperty('--body-rot', `${current.bodyRotation.toFixed(2)}deg`)
      }

      rafId = window.requestAnimationFrame(animate)
    }

    rafId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [])

  const updateTargetFromPointer = (clientX, clientY) => {
    if (!headRef.current) {
      return
    }

    const rect = headRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width * 0.5
    const centerY = rect.top + rect.height * 0.44

    const dx = (clientX - centerX) / rect.width
    const dy = (clientY - centerY) / rect.height

    targetPoseRef.current = {
      lookX: clamp(dx * 14, -10, 10),
      lookY: clamp(dy * 10, -7, 7),
      headRotation: clamp(dx * 18, -12, 12),
      bodyX: clamp(dx * 12, -9, 9),
      bodyY: clamp(dy * 8, -6, 6),
      bodyRotation: clamp(dx * 10, -7, 7),
    }
  }

  const resetTarget = () => {
    targetPoseRef.current = {
      lookX: 0,
      lookY: 0,
      headRotation: 0,
      bodyX: 0,
      bodyY: 0,
      bodyRotation: 0,
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
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
    <section className="workspace login-view anim-reveal" aria-label="Interactive login demo">
      <div
        ref={shellRef}
        className="login-shell anim-pop anim-delay-1"
        onMouseMove={(event) => updateTargetFromPointer(event.clientX, event.clientY)}
        onMouseLeave={resetTarget}
        onTouchMove={(event) => {
          const touch = event.touches[0]
          if (touch) {
            updateTargetFromPointer(touch.clientX, touch.clientY)
          }
        }}
        onTouchEnd={resetTarget}
      >
        <div className="login-frame">
          <div className="login-card">
            <section className="login-visual anim-slide-left" aria-label="Interactive mascot panel">
              <div className="mascot-stage">
                <div className="mascot" ref={headRef}>
                  <div className="mascot-ear mascot-ear-left" />
                  <div className="mascot-ear mascot-ear-right" />
                  <div className="mascot-head">
                    <div className="mascot-eye mascot-eye-left">
                      <span className="mascot-pupil" />
                    </div>
                    <div className="mascot-eye mascot-eye-right">
                      <span className="mascot-pupil" />
                    </div>
                    <span className="mascot-mouth" />
                  </div>
                  <div className="mascot-body" />
                  <div className="mascot-arm mascot-arm-left" />
                  <div className="mascot-arm mascot-arm-right" />
                </div>
              </div>
              <p className="login-tagline">EXPLORE. LEARN. GROW.</p>
            </section>

            <section className="login-form-panel anim-slide-right anim-delay-1" aria-label="Login form">
              <div className="login-form-brand">
                <img src="/replizz-logo.png" alt="Replizz" />
                <p>REPLIZZ</p>
              </div>

              <h1>WELCOME BACK</h1>
              <p className="login-subtitle">Enter your email and password to access your account</p>

              <form className="login-form" onSubmit={handleLogin}>
                <label className="login-label" htmlFor="email">
                  Email
                </label>
                <input id="email" type="email" className="login-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label className="login-label" htmlFor="password">
                  Password
                </label>
                <input id="password" type="password" className="login-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <div className="login-row">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="link-button">
                    Forgot Password
                  </button>
                </div>

                {error ? <p style={{ color: '#ff6b6b', fontSize: '0.82rem', margin: '0 0 0.5rem' }}>{error}</p> : null}
                <button type="submit" className="sign-in-button anim-hover-lift" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>

                <button type="button" className="google-button anim-hover-lift">
                  <span>G</span>
                  <span>Sign in with Google</span>
                </button>
              </form>

              <p className="signup-text">
                Don&apos;t have an account? <Link to="/register">Sign up</Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginView
