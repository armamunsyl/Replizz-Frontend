import { useCallback, useEffect, useRef, useState } from 'react'
import ProfilePill from '../ui/ProfilePill'
import Icon from '../ui/Icon'
import ChatPanel from './ChatPanel'
import ContactsPanel from './ContactsPanel'
import InfoPanel from './InfoPanel'
import api from '../../lib/api'
import { usePage } from '../../context/PageContext'
import { useAuth } from '../../context/AuthContext'

function InboxView({ noteRows = [], accordionRows = [] }) {
  const { selectedPage } = usePage()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null) // full conversation thread
  const [selectedSenderId, setSelectedSenderId] = useState(null)
  const [loadingConvos, setLoadingConvos] = useState(false)
  const [loadingThread, setLoadingThread] = useState(false)
  const pollRef = useRef(null)

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

  const fetchThread = useCallback(async (senderId) => {
    if (!selectedPage || !senderId) return
    setLoadingThread(true)
    try {
      const { data } = await api.get(`/api/conversations/${selectedPage.pageId}/${senderId}`)
      setSelected(data.data)
    } catch (err) {
      console.error('Fetch thread error:', err)
    } finally {
      setLoadingThread(false)
    }
  }, [selectedPage])

  // Initial load + auto-poll every 10s
  useEffect(() => {
    fetchConversations()
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(fetchConversations, 10000)
    return () => clearInterval(pollRef.current)
  }, [fetchConversations])

  // Refresh thread when convo list refreshes
  useEffect(() => {
    if (selectedSenderId) fetchThread(selectedSenderId)
  }, [conversations]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectContact = (senderId) => {
    setSelectedSenderId(senderId)
    fetchThread(senderId)
  }

  const handleSendMessage = async (text) => {
    if (!selectedPage || !selectedSenderId || !text.trim()) return
    try {
      const { data } = await api.post('/api/messages/send', {
        pageId: selectedPage.pageId,
        senderId: selectedSenderId,
        text: text.trim(),
      })
      // Optimistically add to thread
      setSelected((prev) => ({
        ...prev,
        messages: [...(prev?.messages || []), { role: 'admin', content: text.trim(), timestamp: new Date() }],
      }))
      // Refresh conversation list
      fetchConversations()
    } catch (err) {
      console.error('Send message error:', err)
    }
  }

  const displayName = user?.displayName || user?.email || 'User'

  return (
    <section className="workspace anim-reveal" aria-label="Messaging dashboard">
      <header className="workspace-top anim-pop anim-delay-1">
        <div className="workspace-tabs" role="tablist" aria-label="Main tabs">
          <button className="workspace-tab active anim-hover-lift" type="button">Chat</button>
          <button className="workspace-tab anim-hover-lift" type="button">Contacts</button>
          <button className="workspace-tab anim-hover-lift" type="button">Templates</button>
          <button className="workspace-tab anim-hover-lift" type="button">My Projects</button>
        </div>
        <div className="workspace-actions">
          <ProfilePill />
          <button className="control-button anim-hover-lift" type="button" aria-label="Notifications">
            <Icon name="bell" />
          </button>
        </div>
      </header>

      <div className="workspace-body anim-pop anim-delay-2">
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
        <InfoPanel thread={selected} noteRows={noteRows} accordionRows={accordionRows} />
      </div>
    </section>
  )
}

export default InboxView
