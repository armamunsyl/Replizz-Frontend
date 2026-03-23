import { useCallback, useEffect, useState } from 'react'
import ProfilePill from '../ui/ProfilePill'
import api from '../../lib/api'
import { usePage } from '../../context/PageContext'
import { useAuth } from '../../context/AuthContext'

function SettingsView() {
  const { selectedPage, setSelectedPage, setPages } = usePage()
  const { user } = useAuth()
  const [disconnecting, setDisconnecting] = useState(false)
  const [instructions, setInstructions] = useState([])
  const [newText, setNewText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ** New AI Settings State **
  const [aiSettings, setAiSettings] = useState({
    customInstructions: '',
    language: 'English',
    replyStyle: 'Short and helpful',
    tone: 'Professional'
  })
  const [savingAI, setSavingAI] = useState(false)
  const [aiSuccessMsg, setAiSuccessMsg] = useState('')

  useEffect(() => {
    if (selectedPage) {
      setAiSettings({
        customInstructions: selectedPage.customInstructions || '',
        language: selectedPage.language || 'English',
        replyStyle: selectedPage.replyStyle || 'Short and helpful',
        tone: selectedPage.tone || 'Professional'
      })
    }
  }, [selectedPage])

  const handleSaveAISettings = async () => {
    if (!selectedPage) return
    setSavingAI(true)
    setAiSuccessMsg('')
    try {
      const { data } = await api.patch(`/api/pages/${selectedPage.pageId}/ai-settings`, aiSettings)

      // Update global context so other components reflect changes
      setPages((prev) => prev.map((p) => p.pageId === selectedPage.pageId ? data.data : p))
      setSelectedPage(data.data)

      setAiSuccessMsg('AI Settings saved successfully!')
      setTimeout(() => setAiSuccessMsg(''), 3000)
    } catch (err) {
      console.error('Save AI Settings error:', err)
      setError('Failed to save AI configuration.')
    } finally {
      setSavingAI(false)
    }
  }

  const displayName = user?.displayName || user?.email || 'User'

  const fetchInstructions = useCallback(async () => {
    if (!selectedPage) return
    setLoading(true)
    try {
      const { data } = await api.get(`/api/instructions/${selectedPage.pageId}`)
      setInstructions(data.data || [])
    } catch (err) {
      console.error('Fetch instructions error:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedPage])

  useEffect(() => {
    fetchInstructions()
    setEditingId(null)
  }, [fetchInstructions])

  const handleAdd = async () => {
    const text = newText.trim()
    if (!text || !selectedPage) return
    setSaving(true)
    setError('')
    try {
      const { data } = await api.post(`/api/instructions/${selectedPage.pageId}`, { text })
      setInstructions((prev) => [...prev, data.data])
      setNewText('')
    } catch (err) {
      setError('Failed to add instruction.')
    } finally {
      setSaving(false)
    }
  }

  const handleEditSave = async (id) => {
    const text = editingValue.trim()
    if (!text || !selectedPage) return
    setSaving(true)
    try {
      await api.put(`/api/instructions/${selectedPage.pageId}/${id}`, { text })
      setInstructions((prev) => prev.map((i) => i._id === id ? { ...i, text } : i))
      setEditingId(null)
      setEditingValue('')
    } catch (err) {
      setError('Failed to update instruction.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (id) => {
    if (!selectedPage) return
    try {
      const { data } = await api.patch(`/api/instructions/${selectedPage.pageId}/${id}/toggle`)
      setInstructions((prev) => prev.map((i) => i._id === id ? { ...i, isActive: data.data.isActive } : i))
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!selectedPage) return
    try {
      await api.delete(`/api/instructions/${selectedPage.pageId}/${id}`)
      setInstructions((prev) => prev.filter((i) => i._id !== id))
      if (editingId === id) { setEditingId(null); setEditingValue('') }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  return (
    <section className="workspace settings-view anim-reveal" aria-label="Settings dashboard">
      <header className="workspace-top settings-top anim-pop anim-delay-1">
        <div className="overview-title-wrap">
          <p className="overview-kicker">Workspace</p>
          <h1>Instruction Settings</h1>
        </div>
        <div className="workspace-actions">
          <ProfilePill />
        </div>
      </header>

      <div className="settings-content anim-pop anim-delay-2">
        {!selectedPage ? (
          <p style={{ opacity: 0.5, padding: '2rem' }}>Select a Facebook page from the sidebar to manage instructions.</p>
        ) : (
          <>
            {/* ─── Connected Page Card ─── */}
            <section
              className="settings-card anim-hover-lift"
              aria-label="Connected page"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.4rem 0.6rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {selectedPage.pagePicture ? (
                  <img
                    src={selectedPage.pagePicture}
                    alt={selectedPage.pageName}
                    style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.12)' }}
                  />
                ) : (
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.85rem', color: '#fff',
                  }}>
                    {selectedPage.pageName?.[0]?.toUpperCase() || 'F'}
                  </div>
                )}
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#23283a' }}>
                    {selectedPage.pageName}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.5 }}>
                    ID: {selectedPage.pageId}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={disconnecting}
                onClick={async () => {
                  if (!window.confirm(`"${selectedPage.pageName}" disconnect করবেন? এটা AI auto-reply বন্ধ করে দেবে।`)) return
                  setDisconnecting(true)
                  try {
                    await api.delete(`/api/pages/${selectedPage.pageId}`)
                    setSelectedPage(null)
                    // remove from pages list in context
                    setPages((prev) => prev.filter((p) => p.pageId !== selectedPage.pageId))
                  } catch (err) {
                    console.error('Disconnect error:', err)
                    alert('Disconnect failed. Please try again.')
                  } finally {
                    setDisconnecting(false)
                  }
                }}
                style={{
                  minHeight: 36,
                  padding: '0 1rem',
                  borderRadius: 10,
                  border: '1.5px solid rgba(239,68,68,0.5)',
                  background: 'rgba(239,68,68,0.08)',
                  color: '#ef4444',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: disconnecting ? 'not-allowed' : 'pointer',
                  opacity: disconnecting ? 0.6 : 1,
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (!disconnecting) e.target.style.background = 'rgba(239,68,68,0.18)' }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(239,68,68,0.08)' }}
              >
                {disconnecting ? 'Disconnecting…' : '🔌 Disconnect Page'}
              </button>
            </section>

            {/* ─── AI Settings Card ─── */}
            <section className="settings-card anim-hover-lift" aria-label="AI Configuration" style={{ padding: '0.4rem 0.6rem' }}>
              <header style={{ marginBottom: '0.4rem' }}>
                <h2 style={{ fontSize: '0.9rem', margin: '0 0 0.1rem', color: '#1e2132' }}>AI Configuration</h2>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>Manage how the AI assistant replies to messages on this page.</p>
              </header>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <label className="settings-label" style={{ display: 'block', marginBottom: '0.15rem', fontWeight: 600, color: '#1e2132', fontSize: '0.65rem' }}>Language</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={aiSettings.language}
                    onChange={(e) => setAiSettings({ ...aiSettings, language: e.target.value })}
                    disabled={savingAI}
                    placeholder="e.g. English, Bengali..."
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                  />
                </div>

                <div>
                  <label className="settings-label" style={{ display: 'block', marginBottom: '0.15rem', fontWeight: 600, color: '#1e2132', fontSize: '0.65rem' }}>Tone</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={aiSettings.tone}
                    onChange={(e) => setAiSettings({ ...aiSettings, tone: e.target.value })}
                    disabled={savingAI}
                    placeholder="e.g. Professional, Friendly..."
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                  />
                </div>

                <div>
                  <label className="settings-label" style={{ display: 'block', marginBottom: '0.15rem', fontWeight: 600, color: '#1e2132', fontSize: '0.65rem' }}>Reply Style</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={aiSettings.replyStyle}
                    onChange={(e) => setAiSettings({ ...aiSettings, replyStyle: e.target.value })}
                    disabled={savingAI}
                    placeholder="e.g. Short and helpful..."
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                  />
                </div>
              </div>

              <div className="settings-input-wrap" style={{ marginBottom: '0.5rem', minHeight: 'auto', padding: 0, border: 'none', background: 'transparent', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                  <label className="settings-label" style={{ display: 'block', fontSize: '0.65rem' }}>Global Custom Instructions</label>
                  <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', margin: 0 }}>Applies to ALL AI responses</p>
                </div>
                <textarea
                  className="settings-input"
                  value={aiSettings.customInstructions}
                  onChange={(e) => setAiSettings({ ...aiSettings, customInstructions: e.target.value })}
                  disabled={savingAI}
                  placeholder="e.g. Always mention our holiday sale at the end of messages..."
                  style={{ width: '100%', minHeight: '40px', resize: 'vertical', padding: '0.4rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '-0.2rem' }}>
                <button
                  className="settings-save-button anim-hover-lift"
                  type="button"
                  onClick={handleSaveAISettings}
                  disabled={savingAI}
                  style={{ width: 'auto', minHeight: '30px', padding: '0 0.75rem', fontSize: '0.62rem' }}
                >
                  {savingAI ? 'Saving...' : 'Save AI Settings'}
                </button>
                {aiSuccessMsg && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>{aiSuccessMsg}</span>}
              </div>
            </section>

            <section className="settings-card anim-hover-lift" aria-label="Add instruction" style={{ padding: '0.4rem 0.6rem' }}>
              <div className="settings-input-row" style={{ gap: '0.5rem' }}>
                <label htmlFor="basic-instruction" className="settings-label" style={{ width: '100px' }}>
                  New Instruction
                </label>
                <div className="settings-input-wrap" style={{ minHeight: '34px' }}>
                  <input
                    id="basic-instruction"
                    type="text"
                    className="settings-input"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Write instruction for AI (e.g. Always reply in Bengali)"
                    disabled={saving}
                  />
                </div>
                <button
                  className="settings-save-button anim-hover-lift"
                  type="button"
                  onClick={handleAdd}
                  disabled={saving || !newText.trim()}
                  style={{ minHeight: '34px' }}
                >
                  {saving ? 'Adding…' : 'Add'}
                </button>
              </div>
              {error ? <p style={{ color: '#ff6b6b', fontSize: '0.75rem', margin: '0.3rem 0 0' }}>{error}</p> : null}
            </section>

            <section className="settings-table-card anim-hover-lift" aria-label="Instruction list" style={{ padding: '0.4rem 0.6rem' }}>
              <header className="settings-table-header" style={{ marginBottom: '0.3rem' }}>
                <h2 style={{ fontSize: '0.85rem' }}>Instruction List</h2>
                <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>{instructions.length} total</span>
              </header>

              <div className="settings-table-wrap">
                <table className="settings-table">
                  <thead>
                    <tr>
                      <th>Instruction</th>
                      <th>Active</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={4} style={{ opacity: 0.4, padding: '1rem' }}>Loading…</td></tr>
                    ) : instructions.length === 0 ? (
                      <tr><td colSpan={4} style={{ opacity: 0.4, padding: '1rem' }}>No instructions yet. Add one above.</td></tr>
                    ) : (
                      instructions.map((row, index) => {
                        const isEditing = editingId === row._id
                        const updatedAt = row.updatedAt
                          ? new Date(row.updatedAt).toLocaleDateString()
                          : '—'

                        return (
                          <tr
                            key={row._id}
                            className="anim-pop"
                            style={{
                              animationDelay: `${0.14 + index * 0.04}s`,
                              opacity: row.isActive ? 1 : 0.45,
                            }}
                          >
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  className="settings-row-input"
                                  value={editingValue}
                                  onChange={(e) => setEditingValue(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleEditSave(row._id)}
                                />
                              ) : (
                                <p className="settings-row-text">{row.text}</p>
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                title={row.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                                style={{
                                  background: row.isActive ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                                  color: row.isActive ? '#10b981' : '#888',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '3px 10px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                }}
                                onClick={() => handleToggle(row._id)}
                              >
                                {row.isActive ? 'ON' : 'OFF'}
                              </button>
                            </td>
                            <td>
                              <span className="settings-updated-at">{updatedAt}</span>
                            </td>
                            <td>
                              <div className="settings-row-actions">
                                <button
                                  type="button"
                                  className="settings-edit-button anim-hover-lift"
                                  onClick={() => {
                                    if (isEditing) handleEditSave(row._id)
                                    else { setEditingId(row._id); setEditingValue(row.text) }
                                  }}
                                >
                                  {isEditing ? 'Save' : 'Edit'}
                                </button>
                                <button
                                  type="button"
                                  className="settings-delete-button anim-hover-lift"
                                  onClick={() => handleDelete(row._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  )
}

export default SettingsView
