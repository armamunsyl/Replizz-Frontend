import { useCallback, useEffect, useState } from 'react'
import ProfilePill from '../ui/ProfilePill'
import api from '../../lib/api'
import { usePage } from '../../context/PageContext'

function SettingsView() {
  const { selectedPage, setSelectedPage, setPages } = usePage()
  const [disconnecting, setDisconnecting] = useState(false)
  const [instructions, setInstructions] = useState([])
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [aiSettings, setAiSettings] = useState({
    customInstructions: '', language: 'English', replyStyle: 'Short and helpful', tone: 'Professional'
  })
  const [savingAI, setSavingAI] = useState(false)
  const [aiSuccessMsg, setAiSuccessMsg] = useState('')

  useEffect(() => {
    if (selectedPage) {
      setAiSettings({
        customInstructions: selectedPage.customInstructions || '',
        language: selectedPage.language || 'English',
        replyStyle: selectedPage.replyStyle || 'Short and helpful',
        tone: selectedPage.tone || 'Professional',
      })
    }
  }, [selectedPage])

  const handleSaveAISettings = async () => {
    if (!selectedPage) return
    setSavingAI(true)
    setAiSuccessMsg('')
    try {
      const { data } = await api.patch(`/api/pages/${selectedPage.pageId}/ai-settings`, aiSettings)
      setPages(prev => prev.map(p => p.pageId === selectedPage.pageId ? data.data : p))
      setSelectedPage(data.data)
      setAiSuccessMsg('AI settings saved.')
      setTimeout(() => setAiSuccessMsg(''), 3000)
    } catch (err) {
      console.error('Save AI settings error:', err)
      setError('Failed to save AI configuration.')
    } finally {
      setSavingAI(false)
    }
  }

  const fetchInstructions = useCallback(async () => {
    if (!selectedPage) return
    setLoading(true)
    try {
      const { data } = await api.get(`/api/instructions/${selectedPage.pageId}`)
      setInstructions(data.data || [])
    } catch (err) { console.error('Fetch instructions error:', err) }
    finally { setLoading(false) }
  }, [selectedPage])

  useEffect(() => { fetchInstructions(); setEditingId(null) }, [fetchInstructions])

  const handleAdd = async () => {
    const text = newText.trim()
    if (!text || !selectedPage) return
    setSaving(true); setError('')
    try {
      const { data } = await api.post(`/api/instructions/${selectedPage.pageId}`, { text })
      setInstructions(prev => [...prev, data.data])
      setNewText('')
    } catch { setError('Failed to add instruction.') }
    finally { setSaving(false) }
  }

  const handleEditSave = async (id) => {
    const text = editingValue.trim()
    if (!text || !selectedPage) return
    setSaving(true)
    try {
      await api.put(`/api/instructions/${selectedPage.pageId}/${id}`, { text })
      setInstructions(prev => prev.map(i => i._id === id ? { ...i, text } : i))
      setEditingId(null); setEditingValue('')
    } catch { setError('Failed to update instruction.') }
    finally { setSaving(false) }
  }

  const handleToggle = async (id) => {
    if (!selectedPage) return
    try {
      const { data } = await api.patch(`/api/instructions/${selectedPage.pageId}/${id}/toggle`)
      setInstructions(prev => prev.map(i => i._id === id ? { ...i, isActive: data.data.isActive } : i))
    } catch (err) { console.error('Toggle error:', err) }
  }

  const handleDelete = async (id) => {
    if (!selectedPage) return
    try {
      await api.delete(`/api/instructions/${selectedPage.pageId}/${id}`)
      setInstructions(prev => prev.filter(i => i._id !== id))
      if (editingId === id) { setEditingId(null); setEditingValue('') }
    } catch (err) { console.error('Delete error:', err) }
  }

  const inputStyle = { width: '100%', padding: '8px 10px', fontSize: 13, color: '#111827', border: '1px solid #E5E7EB', borderRadius: 8, outline: 'none', background: '#fff', transition: 'border-color 0.15s' }

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Workspace</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>AI Settings</h1>
        </div>
        <ProfilePill />
      </div>

      {!selectedPage ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>Select a Facebook page from the sidebar to manage settings.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
          {/* Connected page */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {selectedPage.pagePicture ? (
                <img src={selectedPage.pagePicture} alt={selectedPage.pageName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>
                  {selectedPage.pageName?.[0]?.toUpperCase() || 'F'}
                </div>
              )}
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{selectedPage.pageName}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF' }}>ID: {selectedPage.pageId}</p>
              </div>
            </div>
            <button
              type="button"
              disabled={disconnecting}
              onClick={async () => {
                if (!window.confirm(`Disconnect "${selectedPage.pageName}"? This will stop AI auto-replies.`)) return
                setDisconnecting(true)
                try {
                  await api.delete(`/api/pages/${selectedPage.pageId}`)
                  setSelectedPage(null)
                  setPages(prev => prev.filter(p => p.pageId !== selectedPage.pageId))
                } catch (err) { console.error('Disconnect error:', err); alert('Disconnect failed.') }
                finally { setDisconnecting(false) }
              }}
              style={{ padding: '7px 14px', fontSize: 13, fontWeight: 500, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, cursor: disconnecting ? 'not-allowed' : 'pointer', opacity: disconnecting ? 0.6 : 1, transition: 'background 0.15s', whiteSpace: 'nowrap' }}
            >
              {disconnecting ? 'Disconnecting…' : 'Disconnect Page'}
            </button>
          </div>

          {/* AI Configuration */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>AI Configuration</h2>
              <p style={{ fontSize: 13, color: '#6B7280' }}>Control how the AI responds on this page.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
              {[
                { label: 'Language', field: 'language', placeholder: 'e.g. English, Bengali' },
                { label: 'Tone', field: 'tone', placeholder: 'e.g. Professional, Friendly' },
                { label: 'Reply Style', field: 'replyStyle', placeholder: 'e.g. Short and helpful' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <input
                    type="text" value={aiSettings[field]} placeholder={placeholder}
                    onChange={e => setAiSettings({ ...aiSettings, [field]: e.target.value })}
                    disabled={savingAI} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 5 }}>Global Custom Instructions</label>
              <textarea
                value={aiSettings.customInstructions} disabled={savingAI}
                onChange={e => setAiSettings({ ...aiSettings, customInstructions: e.target.value })}
                placeholder="e.g. Always mention our holiday sale at the end of every message..."
                rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button" onClick={handleSaveAISettings} disabled={savingAI}
                style={{ padding: '8px 18px', fontSize: 13, fontWeight: 600, color: '#fff', background: savingAI ? '#93C5FD' : '#2563EB', border: 'none', borderRadius: 8, cursor: savingAI ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
              >
                {savingAI ? 'Saving…' : 'Save AI Settings'}
              </button>
              {aiSuccessMsg && <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 500 }}>✓ {aiSuccessMsg}</span>}
            </div>
          </div>

          {/* Add instruction */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>Add Instruction</h2>
              <p style={{ fontSize: 13, color: '#6B7280' }}>Add specific rules or behaviors for the AI to follow.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text" value={newText}
                onChange={e => setNewText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. Always reply in Bengali, never discuss competitors…"
                disabled={saving}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="button" onClick={handleAdd} disabled={saving || !newText.trim()}
                style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#fff', background: saving || !newText.trim() ? '#93C5FD' : '#2563EB', border: 'none', borderRadius: 8, cursor: saving || !newText.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
              >
                {saving ? 'Adding…' : 'Add'}
              </button>
            </div>
            {error && <p style={{ fontSize: 13, color: '#EF4444', marginTop: 8 }}>{error}</p>}
          </div>

          {/* Instructions list */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Instruction List</h2>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{instructions.length} total</span>
            </div>

            {loading ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', padding: '12px 0' }}>Loading…</p>
            ) : instructions.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', padding: '12px 0' }}>No instructions yet. Add one above.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {instructions.map((row) => {
                  const isEditing = editingId === row._id
                  return (
                    <div key={row._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: 8, opacity: row.isActive ? 1 : 0.5 }}>
                      {isEditing ? (
                        <input type="text" value={editingValue} onChange={e => setEditingValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEditSave(row._id)} style={{ ...inputStyle, flex: 1, background: '#fff' }} autoFocus />
                      ) : (
                        <p style={{ flex: 1, fontSize: 13, color: '#374151', margin: 0 }}>{row.text}</p>
                      )}
                      <button
                        type="button" onClick={() => handleToggle(row._id)}
                        style={{ fontSize: 11, fontWeight: 600, color: row.isActive ? '#16A34A' : '#9CA3AF', background: row.isActive ? '#F0FDF4' : '#F3F4F6', border: 'none', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', flexShrink: 0 }}
                      >
                        {row.isActive ? 'ON' : 'OFF'}
                      </button>
                      <button
                        type="button" onClick={() => { if (isEditing) handleEditSave(row._id); else { setEditingId(row._id); setEditingValue(row.text) } }}
                        style={{ fontSize: 12, fontWeight: 500, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', flexShrink: 0 }}
                      >
                        {isEditing ? 'Save' : 'Edit'}
                      </button>
                      <button
                        type="button" onClick={() => handleDelete(row._id)}
                        style={{ fontSize: 12, fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', flexShrink: 0 }}
                      >
                        Delete
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsView
