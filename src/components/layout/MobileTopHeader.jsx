import { useEffect, useRef, useState } from 'react'
import { usePage } from '../../context/PageContext'

function PageAvatar({ name, picture, size = 28 }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (picture && !imgFailed) {
    return <img src={picture} alt={name} onError={() => setImgFailed(true)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  }
  const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : 'FB'
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#3B5BDB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: size * 0.36, fontWeight: 700, color: '#fff' }}>
      {initials}
    </div>
  )
}

function MobileTopHeader() {
  const { pages, selectedPage, setSelectedPage } = usePage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleConnectPage = async () => {
    try {
      const { auth } = await import('../../lib/firebase')
      const token = await auth.currentUser?.getIdToken()
      if (!token) return
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/facebook/login?token=${token}`
    } catch (err) { console.error('OAuth error:', err) }
  }

  return (
    <div style={{ background: '#1E293B', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/replizz-logo.png" alt="Replizz" style={{ width: 24, height: 24, borderRadius: 6 }} onError={e => e.target.style.display = 'none'} />
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Replizz</span>
      </div>

      {/* Page selector */}
      <div ref={ref} style={{ position: 'relative' }}>
        <button type="button" onClick={() => setOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer' }}>
          {selectedPage && <PageAvatar name={selectedPage.pageName} picture={selectedPage.pagePicture} size={20} />}
          <span style={{ fontSize: 12, fontWeight: 500, color: '#CBD5E1', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedPage?.pageName || 'Select Page'}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>

        {open && (
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, minWidth: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 100, overflow: 'hidden' }}>
            {pages.map(page => (
              <button key={page.pageId} type="button" onClick={() => { setSelectedPage(page); setOpen(false) }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: selectedPage?.pageId === page.pageId ? 'rgba(37,99,235,0.2)' : 'transparent', border: 'none', cursor: 'pointer' }}>
                <PageAvatar name={page.pageName} picture={page.pagePicture} size={24} />
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{page.pageName}</span>
              </button>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '4px 0' }}>
              <button type="button" onClick={handleConnectPage} style={{ width: '100%', padding: '9px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, color: '#60A5FA', fontWeight: 500, textAlign: 'left' }}>
                + Connect Another Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileTopHeader
