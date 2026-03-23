import { useState, useEffect } from 'react'
import Avatar from '../ui/Avatar'
import Icon from '../ui/Icon'
import api from '../../lib/api'

function InfoPanel({ thread, noteRows, accordionRows }) {
  const name = thread?.name || 'Unknown User'
  const profilePic = thread?.profilePic

  const [isHumanActive, setIsHumanActive] = useState(thread?.humanActive || false)
  const [loading, setLoading] = useState(false)

  // Sync state if thread changes (e.g., selecting a different conversation)
  useEffect(() => {
    setIsHumanActive(thread?.humanActive || false)
  }, [thread?.humanActive, thread?._id])

  const handleToggle = async () => {
    if (!thread?._id) return

    setLoading(true)
    try {
      const newState = !isHumanActive
      setIsHumanActive(newState)

      await api.patch(`/api/conversations/${thread._id}/human-toggle`, {
        humanActive: newState
      })
    } catch (err) {
      console.error("Failed to toggle human active:", err)
      setIsHumanActive((prev) => !prev) // Revert on failure
    } finally {
      setLoading(false)
    }
  }

  return (
    <aside className="info-panel anim-slide-right anim-delay-1" aria-label="Customer details">

      {/* AI Controls Section */}
      {thread && (
        <>
          <h2 className="info-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>AI Control</span>
          </h2>
          <div className="general-card anim-pop anim-delay-2" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: isHumanActive ? '#ef4444' : '#10b981' }}>
                  {isHumanActive ? 'AI Paused' : 'AI Active'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {isHumanActive ? 'Human took over this chat' : 'AI is replying automatically'}
                </span>
              </div>

              <div style={{ position: 'relative', width: '36px', height: '20px' }}>
                <input
                  type="checkbox"
                  checked={!isHumanActive}
                  onChange={handleToggle}
                  disabled={loading}
                  style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                />
                <span
                  style={{
                    position: 'absolute', cursor: loading ? 'not-allowed' : 'pointer',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: !isHumanActive ? '#10b981' : '#ef4444',
                    transition: '.3s', borderRadius: '20px', opacity: loading ? 0.5 : 1
                  }}
                />
                <span
                  style={{
                    position: 'absolute', content: '""', height: '14px', width: '14px',
                    left: !isHumanActive ? '19px' : '3px', bottom: '3px',
                    backgroundColor: 'white', transition: '.3s', borderRadius: '50%'
                  }}
                />
              </div>
            </label>
          </div>
        </>
      )}

      <h2 className="info-section-title">General info</h2>
      <div className="general-card anim-pop anim-delay-2">
        <div className="general-head">
          <Avatar name={name} src={profilePic} colors={['#d58f4e', '#f3d29f']} size="md" />
          <div>
            <h3>{name}</h3>
            <p>(1) 234-543-4321</p>
          </div>
        </div>
        <dl className="general-lines">
          <div>
            <dt>Email</dt>
            <dd>mary_franci@gmail.com</dd>
          </div>
          <div>
            <dt>Date Created</dt>
            <dd>Oct 12, 2022</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className="pill-status">Active User</span>
            </dd>
          </div>
        </dl>
      </div>

      <h2 className="info-section-title">Notes</h2>
      <div className="notes-card anim-pop anim-delay-3">
        {noteRows.map((note, index) => (
          <article
            key={note}
            className="note-item anim-pop"
            style={{ animationDelay: `${0.18 + index * 0.06}s` }}
          >
            <p>{note}</p>
            <span>23 Oct, 2023</span>
            {index === 0 ? <div className="note-divider" /> : null}
          </article>
        ))}
      </div>

      <div className="accordion-list">
        {accordionRows.map((row, index) => (
          <button
            key={row}
            className="accordion-item anim-pop anim-hover-lift"
            style={{ animationDelay: `${0.2 + index * 0.05}s` }}
            type="button"
          >
            <span>{row}</span>
            <Icon name="chevron" className="accordion-icon" />
          </button>
        ))}
      </div>
    </aside>
  )
}

export default InfoPanel
