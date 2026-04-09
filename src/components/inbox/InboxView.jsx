import { useCallback, useEffect, useRef, useState } from 'react'
import ProfilePill from '../ui/ProfilePill'
import ChatPanel from './ChatPanel'
import ContactsPanel from './ContactsPanel'
import InfoPanel from './InfoPanel'
import api from '../../lib/api'
import { usePage } from '../../context/PageContext'
import { useSocket } from '../../hooks/useSocket'

function InboxView() {
  const { selectedPage } = usePage()
  const socket = useSocket()

  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [selectedSenderId, setSelectedSenderId] = useState(null)
  const [loadingConvos, setLoadingConvos] = useState(false)
  const [loadingThread, setLoadingThread] = useState(false)

  // Track the latest known message timestamp per sender to enable incremental polling
  const lastSeenAtRef = useRef({})
  const pollRef = useRef(null)
  const selectedSenderRef = useRef(null)

  // Keep ref in sync so socket callback always reads fresh value
  useEffect(() => {
    selectedSenderRef.current = selectedSenderId
  }, [selectedSenderId])

  // ── Fetch the full conversations list (sidebar) ──────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!selectedPage) return
    setLoadingConvos(true)
    try {
      const { data } = await api.get(`/api/conversations/${selectedPage.pageId}`)
      setConversations(data.data || [])
    } catch (err) {
      console.error('Fetch conversations error:', err)
    } finally {
      setLoadingConvos(false)
    }
  }, [selectedPage])

  // ── Fetch the full thread for a sender (initial load) ────────────────────
  const fetchThread = useCallback(async (senderId) => {
    if (!selectedPage || !senderId) return
    setLoadingThread(true)
    try {
      const { data } = await api.get(`/api/conversations/${selectedPage.pageId}/${senderId}`)
      const thread = data.data
      setSelected(thread)
      // Record the timestamp of the last message we know about
      const msgs = thread?.messages || []
      if (msgs.length > 0) {
        const last = msgs[msgs.length - 1]
        lastSeenAtRef.current[senderId] = last.createdAt || last.timestamp || Date.now()
      }
    } catch (err) {
      console.error('Fetch thread error:', err)
    } finally {
      setLoadingThread(false)
    }
  }, [selectedPage])

  // ── Merge incoming socket/poll message into state ────────────────────────
  const appendMessage = useCallback((senderId, message) => {
    // Update sidebar conversation list
    setConversations(prev => prev.map(c => {
      if (c.senderId !== senderId) return c
      return {
        ...c,
        lastMessage: message.content,
        lastMessageAt: message.timestamp || new Date().toISOString(),
        humanActive: message.role === 'admin' ? true : c.humanActive,
      }
    }))

    // Append to active thread only if it matches current sender
    if (selectedSenderRef.current === senderId) {
      setSelected(prev => {
        if (!prev) return prev
        const existing = prev.messages || []
        // Deduplicate: skip if same content+role appeared in last 2 seconds
        const recent = existing.slice(-3)
        const isDupe = recent.some(m =>
          m.role === message.role &&
          m.content === message.content &&
          Math.abs(new Date(m.createdAt || m.timestamp) - new Date(message.createdAt || message.timestamp)) < 3000
        )
        if (isDupe) return prev
        return {
          ...prev,
          messages: [...existing, message],
          messageCount: (prev.messageCount || existing.length) + 1,
          humanActive: message.role === 'admin' ? true : prev.humanActive,
        }
      })
      // Update last seen timestamp
      lastSeenAtRef.current[senderId] = message.timestamp || Date.now()
    }
  }, [])

  // ── Socket.io real-time events ────────────────────────────────────────────
  useEffect(() => {
    if (!selectedPage || !socket) return

    socket.emit('join_page', selectedPage.pageId)

    const handleNewMessage = ({ senderId, message }) => {
      appendMessage(senderId, {
        ...message,
        timestamp: message.timestamp || new Date().toISOString(),
      })
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.emit('leave_page', selectedPage.pageId)
      socket.off('new_message', handleNewMessage)
    }
  }, [selectedPage, socket, appendMessage])

  // ── Polling: full conversation list + incremental thread refresh ──────────
  useEffect(() => {
    fetchConversations()
    if (pollRef.current) clearInterval(pollRef.current)

    pollRef.current = setInterval(async () => {
      // Always refresh the sidebar list (lightweight)
      if (selectedPage) {
        try {
          const { data } = await api.get(`/api/conversations/${selectedPage.pageId}`)
          setConversations(data.data || [])
        } catch { /* non-blocking */ }
      }

      // If a thread is open, check for any new messages (incremental)
      const currentSender = selectedSenderRef.current
      if (selectedPage && currentSender) {
        try {
          const { data } = await api.get(`/api/conversations/${selectedPage.pageId}/${currentSender}`)
          const freshThread = data.data
          const freshMsgs = freshThread?.messages || []

          setSelected(prev => {
            if (!prev) return freshThread
            const existingCount = (prev.messages || []).length
            const prevTotal = prev.totalMessages ?? existingCount
            const newTotal = freshThread.totalMessages ?? freshMsgs.length

            if (newTotal <= prevTotal) return prev

            // New messages arrived — append those beyond what we already have
            const newMsgs = freshMsgs.slice(existingCount)
            return {
              ...prev,
              messages: newMsgs.length > 0
                ? [...(prev.messages || []), ...newMsgs]
                : (prev.messages || []),
              totalMessages: newTotal,
              humanActive: freshThread.humanActive,
              contextStory: freshThread.contextStory,
            }
          })
        } catch { /* non-blocking */ }
      }
    }, 30000) // 30s fallback poll — sockets handle real-time

    return () => clearInterval(pollRef.current)
  }, [fetchConversations, selectedPage])

  // ── Selecting a contact ───────────────────────────────────────────────────
  const handleSelectContact = (senderId) => {
    setSelectedSenderId(senderId)
    fetchThread(senderId)
  }

  // ── Sending a manual message ──────────────────────────────────────────────
  const handleSendMessage = async (text) => {
    if (!selectedPage || !selectedSenderId || !text.trim()) return

    const optimisticMsg = {
      role: 'admin',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }

    // Optimistic update — show immediately without waiting for API
    setSelected(prev => ({
      ...prev,
      messages: [...(prev?.messages || []), optimisticMsg],
    }))
    setConversations(prev => prev.map(c =>
      c.senderId === selectedSenderId
        ? { ...c, lastMessage: text.trim(), lastMessageAt: optimisticMsg.timestamp }
        : c
    ))

    try {
      await api.post('/api/messages/send', {
        pageId: selectedPage.pageId,
        senderId: selectedSenderId,
        text: text.trim(),
      })
    } catch (err) {
      console.error('Send message error:', err)
      // Remove optimistic message on failure
      setSelected(prev => ({
        ...prev,
        messages: (prev?.messages || []).filter(m => m !== optimisticMsg),
      }))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
            {selectedPage?.pageName || 'Inbox'}
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Conversations</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: 6 }}>
            {conversations.length} conversations
          </span>
          <ProfilePill />
        </div>
      </div>

      {/* Body */}
      {!selectedPage ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
          <div style={{ textAlign: 'center', maxWidth: 320 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 6.5h14v9H9l-4 3v-12Z" /></svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>No page selected</h3>
            <p style={{ fontSize: 14, color: '#6B7280' }}>Select a Facebook page from the sidebar to view conversations.</p>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <ContactsPanel
            conversations={conversations}
            loading={loadingConvos}
            selectedSenderId={selectedSenderId}
            onSelect={handleSelectContact}
          />
          <ChatPanel
            thread={selected}
            loading={loadingThread}
            onSend={handleSendMessage}
            selectedPage={selectedPage}
          />
          <InfoPanel thread={selected} />
        </div>
      )}
    </div>
  )
}

export default InboxView
