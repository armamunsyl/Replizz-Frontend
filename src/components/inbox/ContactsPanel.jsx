import { useState } from 'react'
import Avatar from '../ui/Avatar'
import Icon from '../ui/Icon'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getInitials(name, senderId) {
  if (name) return name
  return `User ${senderId?.slice(-4) || '??'}`
}

function ContactsPanel({ conversations, loading, selectedSenderId, onSelect }) {
  const [search, setSearch] = useState('')

  const filtered = conversations.filter((c) => {
    const name = c.name || c.senderId || ''
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <section className="contacts-panel anim-slide-left anim-delay-1" aria-label="Contact list">
      <label className="panel-search">
        <Icon name="search" className="panel-search-icon" />
        <input
          className="panel-search-input"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      <div className="contact-list">
        {loading && conversations.length === 0 ? (
          <p style={{ padding: '1rem', opacity: 0.5, fontSize: '0.85rem' }}>Loading conversations…</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '1rem', opacity: 0.5, fontSize: '0.85rem' }}>
            {search ? 'No match found.' : 'No conversations yet.'}
          </p>
        ) : (
          filtered.map((c, index) => {
            const name = getInitials(c.name, c.senderId)
            const preview = c.lastMessage || '…'
            const isActive = c.senderId === selectedSenderId
            const colors = ['#57b9d8', '#c3f5ff']

            return (
              <article
                key={c.senderId}
                className={`contact-row anim-pop anim-hover-lift ${isActive ? 'active' : ''}`}
                style={{ animationDelay: `${0.12 + index * 0.04}s`, cursor: 'pointer' }}
                onClick={() => onSelect(c.senderId)}
              >
                <Avatar name={name} src={c.profilePic} colors={colors} size="md" />
                <div className="contact-meta">
                  <div className="contact-name-row">
                    <h3 className="contact-name">{name}</h3>
                    <span className="contact-time">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', opacity: 0.5, margin: '0 0 2px' }}>
                    {c.humanActive ? '👤 Human Active' : '🤖 AI Active'}
                  </p>
                  <p className="contact-preview">{preview.slice(0, 60)}</p>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

export default ContactsPanel
