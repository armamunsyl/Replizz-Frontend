import { useEffect, useState } from 'react'
import Avatar from '../ui/Avatar'
import api from '../../lib/api'

function InfoPanel({ thread }) {
  const name = thread?.profile?.name || thread?.senderId?.slice(-6) || 'Unknown User'
  const [isHumanActive, setIsHumanActive] = useState(thread?.humanActive || false)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    setIsHumanActive(thread?.humanActive || false)
  }, [thread?.humanActive, thread?._id])

  const handleToggle = async () => {
    if (!thread?._id) return
    setToggling(true)
    try {
      const newState = !isHumanActive
      setIsHumanActive(newState)
      await api.patch(`/api/conversations/${thread._id}/human-toggle`, { humanActive: newState })
    } catch (err) {
      console.error('Toggle error:', err)
      setIsHumanActive(prev => !prev)
    } finally {
      setToggling(false)
    }
  }

  return (
    <div style={{ width: 240, flexShrink: 0, background: '#fff', borderLeft: '1px solid #E5E7EB', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {!thread ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>Select a conversation</p>
        </div>
      ) : (
        <>
          {/* Customer info */}
          <div style={{ padding: '16px', borderBottom: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Customer</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Avatar name={name} src={thread?.profile?.profilePic} size="md" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{name}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>Facebook User</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>Messages</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{thread?.messageCount || thread?.messages?.length || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>Status</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', background: '#F0FDF4', padding: '2px 7px', borderRadius: 4 }}>Active</span>
              </div>
            </div>
          </div>

          {/* AI Control */}
          <div style={{ padding: '16px', borderBottom: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>AI Control</p>
            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: isHumanActive ? '#EA580C' : '#16A34A', marginBottom: 2 }}>
                    {isHumanActive ? 'Human Active' : 'AI Active'}
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                    {isHumanActive ? 'You are handling this chat' : 'AI is auto-replying'}
                  </p>
                </div>
                {/* Toggle */}
                <button
                  type="button" onClick={handleToggle} disabled={toggling}
                  style={{
                    width: 40, height: 22, borderRadius: 11, border: 'none',
                    background: isHumanActive ? '#EF4444' : '#10B981',
                    cursor: toggling ? 'not-allowed' : 'pointer',
                    position: 'relative', transition: 'background 0.2s', opacity: toggling ? 0.7 : 1,
                    flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 3, width: 16, height: 16,
                    borderRadius: '50%', background: '#fff',
                    left: isHumanActive ? 21 : 3,
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>
            </div>
          </div>

          {/* Conversation context */}
          {thread?.contextStory && (
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>AI Context Summary</p>
              <p style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.6, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 12px' }}>
                {thread.contextStory}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InfoPanel
