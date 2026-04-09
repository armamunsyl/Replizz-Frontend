import { useState } from 'react'
import Avatar from '../ui/Avatar'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function getDisplayName(c) {
  if (c.name) return c.name
  const id = c.senderId || ''
  return `User ${id.slice(-4) || '??'}`
}

function ContactsPanel({ conversations, loading, selectedSenderId, onSelect }) {
  const [search, setSearch] = useState('')

  const filtered = conversations.filter((c) => {
    const name = c.name || c.senderId || ''
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Search */}
      <div style={{ padding: '14px 14px 10px' }}>
        <div style={{ position: 'relative' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" />
          </svg>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations…"
            style={{ width: '100%', paddingLeft: 32, paddingRight: 10, paddingTop: 8, paddingBottom: 8, fontSize: 13, border: '1px solid #E5E7EB', borderRadius: 8, outline: 'none', background: '#F9FAFB', color: '#111827' }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && conversations.length === 0 ? (
          <p style={{ padding: '20px 16px', fontSize: 13, color: '#9CA3AF' }}>Loading conversations…</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '20px 16px', fontSize: 13, color: '#9CA3AF' }}>
            {search ? 'No matches found.' : 'No conversations yet.'}
          </p>
        ) : (
          filtered.map((c) => {
            const name = getDisplayName(c)
            const isActive = c.senderId === selectedSenderId
            return (
              <button
                key={c.senderId} type="button"
                onClick={() => onSelect(c.senderId)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', background: isActive ? '#EFF6FF' : 'transparent',
                  border: 'none', borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F9FAFB' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <Avatar name={name} src={c.profilePic} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{name}</span>
                    <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0, marginLeft: 6 }}>{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, color: c.humanActive ? '#EA580C' : '#16A34A', fontWeight: 500, background: c.humanActive ? '#FFF7ED' : '#F0FDF4', padding: '1px 5px', borderRadius: 4 }}>
                      {c.humanActive ? 'Human' : 'AI'}
                    </span>
                    <span style={{ fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {(c.lastMessage || '…').slice(0, 35)}
                    </span>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ContactsPanel
