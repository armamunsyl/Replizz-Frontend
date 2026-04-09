import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import AuthPage from './components/auth/AuthPage'
import HomeView from './components/home/HomeView'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'
import InboxView from './components/inbox/InboxView'
import PublicLayout from './components/layout/PublicLayout'
import LoginView from './components/login/LoginView'
import OverviewView from './components/overview/OverviewView'
import PlanView from './components/plan/PlanView'
import ProductView from './components/product/ProductView'
import SettingsView from './components/settings/SettingsView'
import PrivacyPolicy from './components/legal/PrivacyPolicy'
import TermsOfService from './components/legal/TermsOfService'
import AdminOverviewView from './components/admin/AdminOverviewView'
import AdminUsersView from './components/admin/AdminUsersView'
import AdminAnalyticsView from './components/admin/AdminAnalyticsView'
import AdminReportsView from './components/admin/AdminReportsView'
import AdminPagesView from './components/admin/AdminPagesView'
import AdminPaymentsView from './components/admin/AdminPaymentsView'
import PaymentPage from './components/plan/PaymentPage'
import BillingView from './components/plan/BillingView'
import { menuItems } from './data/dashboardData'
import { adminMenuItems } from './data/adminData'
import { useAuth } from './context/AuthContext'
import { usePage } from './context/PageContext'

const sectionPathMap = menuItems.reduce((accumulator, item) => {
  if (item.path) {
    accumulator[item.key] = item.path
  }
  return accumulator
}, {})

const pathSectionMap = menuItems.reduce((accumulator, item) => {
  if (item.path) {
    accumulator[item.path] = item.key
  }
  return accumulator
}, {})

const adminSectionPathMap = adminMenuItems.reduce((accumulator, item) => {
  if (item.path) {
    accumulator[item.key] = item.path
  }
  return accumulator
}, {})

const adminPathSectionMap = adminMenuItems.reduce((accumulator, item) => {
  if (item.path) {
    accumulator[item.path] = item.key
  }
  return accumulator
}, {})

// Handle redirect from backend after successful Facebook OAuth
// Backend redirects to FRONTEND_URL/pages?connected=N
function OAuthCallback() {
  const navigate = useNavigate()
  const { fetchPages } = usePage()
  const params = new URLSearchParams(window.location.search)
  const error = params.get('error')
  const connected = params.get('connected')

  useEffect(() => {
    if (error) return // don't redirect, show error UI
    fetchPages().then(() => {
      navigate('/overview', { replace: true })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const errorMessages = {
    no_pages: 'এই Facebook account-এ কোনো Page পাওয়া যায়নি।\nনিশ্চিত করুন আপনি যে account দিয়ে login করেছেন সেটায় Facebook Page আছে এবং আপনি সেটার Admin।',
    invalid_token: 'Authentication expired। আবার try করুন।',
    missing_code: 'Facebook authorization incomplete। আবার try করুন।',
    oauth_failed: 'Facebook connection failed। কিছুক্ষণ পর আবার try করুন।',
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, background: '#F9FAFB', padding: '2rem', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Page connection failed</p>
        <p style={{ fontSize: 13, color: '#6B7280', maxWidth: 360, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {errorMessages[error] || 'An unknown error occurred. Please try again.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/overview', { replace: true })}
          style={{ marginTop: 8, padding: '9px 20px', borderRadius: 8, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12, background: '#F9FAFB' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #E5E7EB', borderTopColor: '#2563EB', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 13, color: '#6B7280' }}>{connected ? `${connected} page(s) connecting…` : 'Connecting your page…'}</p>
    </div>
  )
}

// Protect dashboard routes — redirect to /login if not authenticated
function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null // wait for Firebase to resolve
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Protect admin routes — redirect to /overview if not admin
function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/overview" replace />
  return children
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeSection = pathSectionMap[location.pathname] ?? 'overview'
  const adminActiveSection = adminPathSectionMap[location.pathname] ?? 'admin-overview'

  const handleSectionChange = (sectionKey) => {
    const nextPath = sectionPathMap[sectionKey]
    if (!nextPath || nextPath === location.pathname) return
    navigate(nextPath)
  }

  const handleAdminSectionChange = (sectionKey) => {
    const nextPath = adminSectionPathMap[sectionKey]
    if (!nextPath || nextPath === location.pathname) return
    navigate(nextPath)
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/login-page" element={<Navigate to="/login" replace />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/payment" element={<RequireAuth><PaymentPage /></RequireAuth>} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <DashboardLayout
              menuItems={menuItems}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </RequireAuth>
        }
      >
        <Route path="/overview" element={<OverviewView />} />
        <Route path="/inbox" element={<InboxView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/your-product" element={<ProductView />} />
        <Route path="/my-plan" element={<PlanView />} />
        <Route path="/billing" element={<BillingView />} />
        {/* Facebook OAuth callback — backend redirects here after saving pages */}
        <Route path="/pages" element={<OAuthCallback />} />
      </Route>

      {/* ─── Admin Routes ─── */}
      <Route
        element={
          <RequireAdmin>
            <AdminLayout
              menuItems={adminMenuItems}
              activeSection={adminActiveSection}
              onSectionChange={handleAdminSectionChange}
            />
          </RequireAdmin>
        }
      >
        <Route path="/admin" element={<AdminOverviewView />} />
        <Route path="/admin/users" element={<AdminUsersView />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsView />} />
        <Route path="/admin/reports" element={<AdminReportsView />} />
        <Route path="/admin/pages" element={<AdminPagesView />} />
        <Route path="/admin/payments" element={<AdminPaymentsView />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
