import { useCallback, useEffect, useState, Fragment } from 'react'
import Icon from '../ui/Icon'
import api from '../../lib/api'

function AdminUsersView() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [expandedUserId, setExpandedUserId] = useState(null)
    const [editingPageId, setEditingPageId] = useState(null)
    const [editPlanForm, setEditPlanForm] = useState({ planType: 'free', monthlyLimit: 100 })

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

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleRoleChange = async (userId, newRole) => {
        setUpdating(userId)
        try {
            const { data } = await api.put(`/api/admin/users/${userId}/role`, { role: newRole })
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: data.data.role } : u)))
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
            setUsers((prev) => prev.filter((u) => u._id !== userId))
        } catch (err) {
            console.error('Delete user error:', err)
            alert(err.response?.data?.message || 'Failed to delete user')
        }
    }

    const toggleExpand = (userId) => {
        setExpandedUserId(prev => prev === userId ? null : userId)
        setEditingPageId(null)
    }

    const handleEditPlanClick = (page) => {
        setEditingPageId(page.pageId)
        setEditPlanForm({
            planType: page.planType || 'free',
            monthlyLimit: page.monthlyLimit || 100
        })
    }

    const handleCancelEdit = () => {
        setEditingPageId(null)
    }

    const handleSavePlan = async (userId, pageId) => {
        try {
            setUpdating(pageId)
            const { data } = await api.put(`/api/admin/pages/${pageId}/plan`, editPlanForm)
            const updatedPage = data.data
            
            setUsers((prev) => prev.map((u) => {
                if (u._id !== userId) return u
                return {
                    ...u,
                    pages: u.pages.map(p => p.pageId === pageId ? { ...p, planType: updatedPage.planType, monthlyLimit: updatedPage.monthlyLimit } : p)
                }
            }))
            
            setEditingPageId(null)
        } catch (err) {
            console.error('Update page plan error:', err)
            alert(err.response?.data?.message || 'Failed to update plan')
        } finally {
            setUpdating(null)
        }
    }

    const roleBadgeClass = (role) => {
        switch (role) {
            case 'Admin': return 'admin-role-badge admin-role-admin'
            case 'Moderator': return 'admin-role-badge admin-role-moderator'
            default: return 'admin-role-badge admin-role-user'
        }
    }

    return (
        <section className="workspace admin-workspace anim-reveal" aria-label="User Management">
            <header className="workspace-top admin-workspace-top anim-pop anim-delay-1">
                <div className="overview-title-wrap">
                    <p className="overview-kicker">Admin Panel</p>
                    <h1>User Management</h1>
                </div>
                <div className="admin-user-count">
                    <span>{users.length} users</span>
                </div>
            </header>

            <div className="admin-content anim-pop anim-delay-2">
                {loading ? (
                    <div className="admin-loading">
                        <div className="admin-spinner" />
                        <p>Loading users…</p>
                    </div>
                ) : users.length === 0 ? (
                    <p className="admin-empty">No users found.</p>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Plan</th>
                                    <th>Pages</th>
                                    <th>Registered</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <Fragment key={user._id}>
                                        <tr className={expandedUserId === user._id ? 'admin-row-expanded' : ''}>
                                            <td>
                                                <div className="admin-user-cell">
                                                    <div className="admin-user-avatar">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <span>{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="admin-email-cell">{user.email}</td>
                                            <td>
                                                <select
                                                    className={roleBadgeClass(user.role)}
                                                    value={user.role || 'User'}
                                                    disabled={updating === user._id}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                >
                                                    <option value="User">User</option>
                                                    <option value="Moderator">Moderator</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                            </td>
                                            <td>
                                                <span className={`admin-plan-badge ${user.planType === 'pro' ? 'admin-plan-pro' : ''}`}>
                                                    {user.planType || 'free'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-pages-count">
                                                    <span>{user.pages?.length || 0}</span>
                                                    {(user.pages?.length || 0) > 0 && (
                                                        <button
                                                            className="admin-expand-btn"
                                                            onClick={() => toggleExpand(user._id)}
                                                            title={expandedUserId === user._id ? "Collapse pages" : "View connected pages"}
                                                        >
                                                            <svg
                                                                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                                                style={{ transform: expandedUserId === user._id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                                                            >
                                                                <polyline points="6 9 12 15 18 9"></polyline>
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="admin-date-cell">
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : '—'}
                                            </td>
                                            <td>
                                                <button
                                                    className="admin-delete-btn"
                                                    type="button"
                                                    onClick={() => handleDelete(user._id, user.name)}
                                                    title="Delete user"
                                                >
                                                    <Icon name="trash" />
                                                </button>
                                            </td>
                                        </tr>
                                        {/* Expandable row for Pages details */}
                                        {expandedUserId === user._id && user.pages && user.pages.length > 0 && (
                                            <tr className="admin-expanded-details-row">
                                                <td colSpan="7" className="admin-expanded-td">
                                                    <div className="admin-user-details-box anim-reveal">
                                                        <h4 className="admin-details-title">Connected Facebook Pages</h4>
                                                        <div className="admin-details-grid">
                                                            {user.pages.map(page => (
                                                                <div key={page.pageId} className="admin-page-detail-card">
                                                                    <div className="admin-page-card-header">
                                                                        {page.pagePicture ? (
                                                                            <img src={page.pagePicture} alt={page.pageName} />
                                                                        ) : (
                                                                            <div className="admin-page-placeholder">{page.pageName?.charAt(0) || 'P'}</div>
                                                                        )}
                                                                        <div>
                                                                            <strong>{page.pageName}</strong>
                                                                            <span className="admin-page-id">ID: {page.pageId}</span>
                                                                        </div>
                                                                        <span className={`admin-status-pill ${page.isActive ? 'admin-status-active' : 'admin-status-inactive'}`} style={{ marginLeft: 'auto' }}>
                                                                            {page.isActive ? 'Active' : 'Inactive'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="admin-page-stats-mini">
                                                                        <div className="stat-mini">
                                                                            <span className="stat-mini-label">AI Status</span>
                                                                            <span className={`stat-mini-val ${page.aiEnabled ? 'text-green' : 'text-gray'}`}>{page.aiEnabled ? 'ON' : 'OFF'}</span>
                                                                        </div>
                                                                        <div className="stat-mini">
                                                                            <span className="stat-mini-label">Messages</span>
                                                                            <span className="stat-mini-val">{page.totalMessages || 0}</span>
                                                                        </div>
                                                                        <div className="stat-mini">
                                                                            <span className="stat-mini-label">Tokens</span>
                                                                            <span className="stat-mini-val">{(page.totalTokensUsed || 0).toLocaleString()}</span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {editingPageId === page.pageId ? (
                                                                        <div className="admin-page-edit-form" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                                                                <div>
                                                                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Plan Type</label>
                                                                                    <select 
                                                                                        value={editPlanForm.planType} 
                                                                                        onChange={e => setEditPlanForm(p => ({ ...p, planType: e.target.value }))}
                                                                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                                                                                    >
                                                                                        <option value="free">Free</option>
                                                                                        <option value="pro">Pro</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div>
                                                                                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Monthly Limit</label>
                                                                                    <input 
                                                                                        type="number" 
                                                                                        min="0"
                                                                                        value={editPlanForm.monthlyLimit} 
                                                                                        onChange={e => setEditPlanForm(p => ({ ...p, monthlyLimit: e.target.value }))}
                                                                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                                <button onClick={handleCancelEdit} style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                                                                <button onClick={() => handleSavePlan(user._id, page.pageId)} disabled={updating === page.pageId} style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                                                                    {updating === page.pageId ? 'Saving...' : 'Save'}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color-light)' }}>
                                                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                                                <div>
                                                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Plan</span>
                                                                                    <span className="uppercase" style={{ fontSize: '0.85rem', fontWeight: '600' }}>{page.planType || 'free'}</span>
                                                                                </div>
                                                                                <div>
                                                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Limit</span>
                                                                                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{page.monthlyUsageCount || 0} / {page.monthlyLimit || 100}</span>
                                                                                </div>
                                                                            </div>
                                                                            <button 
                                                                                onClick={() => handleEditPlanClick(page)}
                                                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'var(--surface-color-hover)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                                                            >
                                                                                <Icon name="edit" size={12} /> Edit Plan
                                                                            </button>
                                                                        </div>
                                                                    )}
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
                )}
            </div>
        </section>
    )
}

export default AdminUsersView
