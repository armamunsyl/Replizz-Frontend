import { useCallback, useEffect, useState } from 'react'
import api from '../../lib/api'

function AdminPagesView() {
    const [pages, setPages] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPages = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/api/admin/pages')
            setPages(data.data || [])
        } catch (err) {
            console.error('Admin pages error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPages()
    }, [fetchPages])

    const statusClass = (active) => active ? 'admin-status-active' : 'admin-status-inactive'

    return (
        <section className="workspace admin-workspace anim-reveal" aria-label="Connected Pages">
            <header className="workspace-top admin-workspace-top anim-pop anim-delay-1">
                <div className="overview-title-wrap">
                    <p className="overview-kicker">Admin Panel</p>
                    <h1>Connected Pages</h1>
                </div>
                <div className="admin-user-count">
                    <span>{pages.length} pages</span>
                </div>
            </header>

            <div className="admin-content anim-pop anim-delay-2">
                {loading ? (
                    <div className="admin-loading">
                        <div className="admin-spinner" />
                        <p>Loading pages…</p>
                    </div>
                ) : pages.length === 0 ? (
                    <p className="admin-empty">No connected pages yet.</p>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Page</th>
                                    <th>Page ID</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                    <th>AI</th>
                                    <th>Messages</th>
                                    <th>Plan</th>
                                    <th>Connected</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((page) => (
                                    <tr key={page._id}>
                                        <td>
                                            <div className="admin-user-cell">
                                                {page.pagePicture ? (
                                                    <img
                                                        src={page.pagePicture}
                                                        alt={page.pageName}
                                                        className="admin-page-avatar"
                                                    />
                                                ) : (
                                                    <div className="admin-user-avatar">
                                                        {page.pageName?.charAt(0)?.toUpperCase() || 'P'}
                                                    </div>
                                                )}
                                                <span>{page.pageName}</span>
                                            </div>
                                        </td>
                                        <td className="admin-mono-cell">{page.pageId}</td>
                                        <td className="admin-mono-cell">{page.userId?.slice(0, 12)}…</td>
                                        <td>
                                            <span className={`admin-status-pill ${statusClass(page.isActive)}`}>
                                                {page.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`admin-status-pill ${statusClass(page.aiEnabled)}`}>
                                                {page.aiEnabled ? 'ON' : 'OFF'}
                                            </span>
                                        </td>
                                        <td>{(page.totalMessages || 0).toLocaleString()}</td>
                                        <td>
                                            <span className="admin-plan-badge">{page.planType || 'free'}</span>
                                        </td>
                                        <td className="admin-date-cell">
                                            {page.connectedAt
                                                ? new Date(page.connectedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
}

export default AdminPagesView
