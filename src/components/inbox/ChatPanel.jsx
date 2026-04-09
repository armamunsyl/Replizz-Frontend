import { useEffect, useLayoutEffect, useRef, useState, memo } from 'react'
import Avatar from '../ui/Avatar'

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Memoised single message bubble — avoids re-rendering old messages when new ones arrive
const MessageBubble = memo(function MessageBubble({ msg, name, isNew }) {
  const isOutgoing = msg.role === 'assistant' || msg.role === 'admin'
  const badge =
    msg.role === 'admin'
      ? { label: 'Manual', bg: '#FFF7ED', color: '#EA580C' }
      : msg.role === 'assistant'
      ? { label: 'AI', bg: '#F0FDF4', color: '#16A34A' }
      : null

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isOutgoing ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: 8,
        animation: isNew ? 'msgFadeIn 0.22s ease-out' : 'none',
      }}
    >
      {!isOutgoing && <Avatar name={name} size="xs" />}
      <div style={{ maxWidth: '68%' }}>
        {!isOutgoing && (
          <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3, marginLeft: 2 }}>{name}</p>
        )}
        <div
          style={{
            padding: '9px 13px',
            borderRadius: isOutgoing ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
            background: isOutgoing ? '#2563EB' : '#fff',
            color: isOutgoing ? '#fff' : '#111827',
            fontSize: 13,
            lineHeight: 1.55,
            border: isOutgoing ? 'none' : '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          }}
        >
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 3,
            justifyContent: isOutgoing ? 'flex-end' : 'flex-start',
          }}
        >
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>{formatTime(msg.timestamp)}</span>
          {badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: badge.color,
                background: badge.bg,
                padding: '1px 5px',
                borderRadius: 4,
              }}
            >
              {badge.label}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

// Animated typing dots indicator for AI replies in progress
function TypingIndicator({ name }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, animation: 'msgFadeIn 0.2s ease-out' }}>
      <Avatar name={name} size="xs" />
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '12px 12px 12px 4px',
          background: '#fff',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#9CA3AF',
              display: 'inline-block',
              animation: `typingDot 1.2s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function ChatPanel({ thread, loading, onSend }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [showTyping, setShowTyping] = useState(false)

  const scrollRef = useRef(null)
  const prevMsgCountRef = useRef(0)
  const isNearBottomRef = useRef(true)
  const newMsgStartIndexRef = useRef(0)

  const messages = thread?.messages || []
  const name = thread?.profile?.name || thread?.senderId?.slice(-6) || 'Customer'

  // Detect scroll position to know whether to auto-scroll
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    isNearBottomRef.current = distFromBottom < 80
  }

  // Show typing indicator briefly when AI is expected to reply
  useEffect(() => {
    const msgs = thread?.messages || []
    const last = msgs[msgs.length - 1]
    if (last?.role === 'user') {
      setShowTyping(true)
      const t = setTimeout(() => setShowTyping(false), 8000)
      return () => clearTimeout(t)
    }
    setShowTyping(false)
  }, [thread?.messages?.length, thread?.senderId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Track which messages are "new" for animation
  useEffect(() => {
    newMsgStartIndexRef.current = prevMsgCountRef.current
    prevMsgCountRef.current = messages.length
  }, [messages.length])

  // Scroll behaviour: jump to bottom on thread change; gentle auto-scroll on new messages
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const prevCount = prevMsgCountRef.current
    const isThreadSwitch = messages.length > 0 && prevCount === 0

    if (isThreadSwitch || isNearBottomRef.current) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length])

  // Always scroll to bottom when switching to a new thread
  useEffect(() => {
    prevMsgCountRef.current = 0
    isNearBottomRef.current = true
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [thread?._id, thread?.senderId])

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    await onSend(text)
    setText('')
    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!thread && !loading) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F9FAFB', borderRight: '1px solid #E5E7EB' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 6.5h14v9H9l-4 3v-12Z" /></svg>
          </div>
          <p style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>Select a conversation to view messages</p>
        </div>
        <div style={{ padding: '12px 14px', borderTop: '1px solid #E5E7EB', background: '#fff' }}>
          <input type="text" disabled placeholder="Select a conversation first…" style={{ width: '100%', padding: '10px 12px', fontSize: 13, border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', color: '#9CA3AF' }} />
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F9FAFB', borderRight: '1px solid #E5E7EB', overflow: 'hidden' }}>
        {/* Chat header */}
        {thread && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <Avatar name={name} size="sm" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{name}</p>
              <p style={{ fontSize: 11, color: '#9CA3AF' }}>Facebook Messenger</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: 'auto', padding: '16px' }}
        >
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px', fontSize: 13, color: '#9CA3AF' }}>Loading messages…</p>
          ) : messages.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', fontSize: 13, color: '#9CA3AF' }}>No messages yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg._id || `${msg.role}-${msg.timestamp}-${index}`}
                  msg={msg}
                  name={name}
                  isNew={index >= newMsgStartIndexRef.current && newMsgStartIndexRef.current > 0}
                />
              ))}
              {showTyping && <TypingIndicator name={name} />}
            </div>
          )}
        </div>

        {/* Compose */}
        <div style={{ padding: '10px 14px', borderTop: '1px solid #E5E7EB', background: '#fff', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E5E7EB', borderRadius: 10, padding: '6px 6px 6px 12px', background: '#F9FAFB' }}>
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={thread ? 'Type a reply…' : 'Select a conversation first…'}
              disabled={!thread}
              style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: '#111827', outline: 'none' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!thread || sending || !text.trim()}
              style={{
                width: 34, height: 34, borderRadius: 8, border: 'none',
                background: !thread || !text.trim() ? '#E5E7EB' : '#2563EB',
                color: !thread || !text.trim() ? '#9CA3AF' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: !thread || !text.trim() ? 'default' : 'pointer',
                flexShrink: 0, transition: 'background 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11.8 20 4l-5.8 16-3.4-5.1L3 11.8Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatPanel
