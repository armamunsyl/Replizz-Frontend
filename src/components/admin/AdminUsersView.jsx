import { useCallback, useEffect, useState, Fragment } from 'react'
import api from '../../lib/api'

function AdminUsersView() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [expandedUserId, setExpandedUserId] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/users')
      setUsers(data.data || [])
    } catch (err) {
      console.error('Fetch users error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId + '-role')
    try {
      const { data } = await api.put(`/api/admin/users/${userId}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: data.data.role } : u))
    } catch (err) {
      console.error('Update role error:', err)
      alert('Failed to update role')
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete "${userName}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u._id !== userId))
    } catch (err) {
      console.error('Delete user error:', err)
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const toggleExpand = (userId) => {
    setExpandedUserId(prev => prev === userId ? null : userId)
  }

  const thStyle = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', borderBottom: '1px solid #E5E7EB' }
  const tdStyle = { padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6', verticalAlign: 'middle' }

  const roleBg = (role) => role === 'Admin' ? { bg: '#FEF3C7', color: '#92400E' } : role === 'Moderator' ? { bg: '#EDE9FE', color: '#5B21B6' } : { bg: '#F3F4F6', color: '#374151' }
  const planColor = (p) => p === 'pro' ? { bg: '#F5F3FF', color: '#7C3AED' } : p === 'standard' ? { bg: '#EFF6FF', color: '#2563EB' } : p === 'custom' ? { bg: '#FEF3C7', color: '#92400E' } : { bg: '#F3F4F6', color: '#6B7280' }

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Admin Panel</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>User Management</h1>
        </div>
        <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: 6 }}>{users.length} users</span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#2563EB', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Loading users…
        </div>
      ) : users.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>No users found.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Plan</th>
                  <th style={thStyle}>Usage</th>
                  <th style={thStyle}>Pages</th>
                  <th style={thStyle}>Registered</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <Fragment key={user._id}>
                    <tr style={{ background: expandedUserId === user._id ? '#F9FAFB' : 'transparent' }}>
                      {/* Name */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span style={{ fontWeight: 500, color: '#111827' }}>{user.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ ...tdStyle, color: '#6B7280' }}>{user.email}</td>

                      {/* Role */}
                      <td style={tdStyle}>
                        <select
                          value={user.role || 'User'}
                          disabled={updating === user._id + '-role'}
                          onChange={e => handleRoleChange(user._id, e.target.value)}
                          style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, border: '1px solid #E5E7EB', background: roleBg(user.role).bg, color: roleBg(user.role).color, cursor: 'pointer' }}
                        >
                          <option value="User">User</option>
                          <option value="Moderator">Moderator</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>

                      {/* Plan — managed via workspace; read-only here */}
                      <td style={tdStyle}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: planColor(user.planType).bg, color: planColor(user.planType).color, textTransform: 'uppercase' }}>
                          {user.planType || 'free'}
                        </span>
                      </td>

                      {/* Usage */}
                      <td style={tdStyle}>
                        <div style={{ fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>
                          {(user.usedMessages ?? 0).toLocaleString()} / {(user.messageLimit ?? 100).toLocaleString()}
                        </div>
                        <div style={{ marginTop: 4, height: 4, width: 80, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            borderRadius: 99,
                            width: `${Math.min(((user.usedMessages ?? 0) / (user.messageLimit || 100)) * 100, 100)}%`,
                            background: ((user.usedMessages ?? 0) / (user.messageLimit || 100)) >= 0.9 ? '#EF4444' : ((user.usedMessages ?? 0) / (user.messageLimit || 100)) >= 0.7 ? '#F59E0B' : '#2563EB',
                          }} />
                        </div>
                      </td>

                      {/* Pages */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 600, color: '#111827' }}>{user.pages?.length || 0}</span>
                          {(user.pages?.length || 0) > 0 && (
                            <button type="button" onClick={() => toggleExpand(user._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563EB', padding: 0, display: 'flex', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedUserId === user._id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Registered */}
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: '#6B7280' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>

                      {/* Actions */}
                      <td style={tdStyle}>
                        <button type="button" onClick={() => handleDelete(user._id, user.name)} style={{ fontSize: 12, fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>Delete</button>
                      </td>
                    </tr>

                    {/* Expanded page rows */}
                    {expandedUserId === user._id && user.pages?.length > 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: '0 12px 16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                          <div style={{ padding: '14px 0 0' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Connected Facebook Pages</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                              {user.pages.map(page => (
                                <div key={page.pageId} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 14px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    {page.pagePicture ? (
                                      <img src={page.pagePicture} alt={page.pageName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                                        {page.pageName?.charAt(0) || 'P'}
                                      </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.pageName}</p>
                                      <p style={{ fontSize: 11, color: '#9CA3AF' }}>ID: {page.pageId}</p>
                                    </div>
                                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: page.isActive ? '#F0FDF4' : '#F3F4F6', color: page.isActive ? '#16A34A' : '#9CA3AF', flexShrink: 0 }}>
                                      {page.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', gap: 16 }}>
                                    {[
                                      { label: 'AI', value: page.aiEnabled ? 'ON' : 'OFF', green: page.aiEnabled },
                                      { label: 'Auto', value: page.automationEnabled !== false ? 'ON' : 'OFF', green: page.automationEnabled !== false },
                                      { label: 'Messages', value: page.totalMessages || 0 },
                                    ].map(s => (
                                      <div key={s.label}>
                                        <p style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 1 }}>{s.label}</p>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: s.green !== undefined ? (s.green ? '#16A34A' : '#9CA3AF') : '#111827' }}>{s.value}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsersView
