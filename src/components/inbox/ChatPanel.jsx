import { useEffect, useRef, useState } from 'react'
import Avatar from '../ui/Avatar'
import Icon from '../ui/Icon'

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function ChatPanel({ thread, loading, onSend, selectedPage }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  const messages = thread?.messages || []
  const name = thread?.profile?.name || thread?.senderId?.slice(-6) || 'Customer'

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

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
      <section className="chat-panel anim-pop anim-delay-2" aria-label="Chat window">
        <div className="chat-scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ opacity: 0.4, fontSize: '0.9rem' }}>Select a conversation to view messages</p>
        </div>
        <footer className="chat-compose">
          <input type="text" className="compose-input" placeholder="Select a conversation first…" disabled />
        </footer>
      </section>
    )
  }

  return (
    <section className="chat-panel anim-pop anim-delay-2" aria-label="Chat window">
      <div className="chat-scroll" ref={scrollRef}>
        {loading ? (
          <p style={{ padding: '2rem', opacity: 0.4, fontSize: '0.85rem' }}>Loading messages…</p>
        ) : messages.length === 0 ? (
          <p style={{ padding: '2rem', opacity: 0.4, fontSize: '0.85rem' }}>No messages yet.</p>
        ) : (
          messages.map((msg, index) => {
            const isOutgoing = msg.role === 'assistant' || msg.role === 'admin'
            const side = isOutgoing ? 'right' : 'left'
            const senderName = msg.role === 'admin' ? 'You (Admin)' : msg.role === 'assistant' ? 'AI Reply' : name
            const colors = isOutgoing ? ['#8b5cf6', '#c4b5fd'] : ['#57b9d8', '#c3f5ff']

            return (
              <article
                key={`${msg.timestamp}-${index}`}
                className={`message-group anim-pop ${side}`}
                style={{ animationDelay: `${0.05 + index * 0.02}s` }}
              >
                {side === 'left' ? (
                  <div className="message-avatar">
                    <Avatar name={senderName} src={!isOutgoing ? thread?.profilePic : undefined} colors={colors} size="sm" />
                  </div>
                ) : null}

                <div className="message-body">
                  <div className="message-top">
                    {side === 'left' ? <span className="message-name">{senderName}</span> : null}
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                    {msg.role === 'admin' ? (
                      <span className="message-meta" style={{ fontSize: '0.65rem', opacity: 0.6, background: 'rgba(139,92,246,0.2)', borderRadius: '4px', padding: '1px 5px' }}>
                        Manual
                      </span>
                    ) : msg.role === 'assistant' ? (
                      <span className="message-meta" style={{ fontSize: '0.65rem', opacity: 0.6, background: 'rgba(16,185,129,0.2)', borderRadius: '4px', padding: '1px 5px' }}>
                        AI
                      </span>
                    ) : null}
                  </div>

                  <div className={`bubble ${side === 'right' ? 'bubble-out' : 'bubble-in'}`}>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>

      <footer className="chat-compose">
        <div className="compose-tools">
          <button type="button" className="anim-hover-lift" aria-label="Attach file" disabled>
            <Icon name="clip" />
          </button>
          <button type="button" className="anim-hover-lift" aria-label="Voice message" disabled>
            <Icon name="mic" />
          </button>
        </div>
        <input
          type="text"
          className="compose-input"
          placeholder={thread ? 'Type a reply…' : 'Select a conversation first…'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!thread}
        />
        <button
          type="button"
          className="compose-send anim-hover-lift"
          aria-label="Send"
          onClick={handleSend}
          disabled={!thread || sending || !text.trim()}
        >
          <Icon name="send" />
        </button>
      </footer>
    </section>
  )
}

export default ChatPanel
