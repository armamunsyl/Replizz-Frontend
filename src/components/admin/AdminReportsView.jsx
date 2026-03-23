import { useCallback, useEffect, useState } from 'react'
import api from '../../lib/api'

function AdminReportsView() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchReports = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/api/admin/reports?limit=100')
            setReports(data.data || [])
        } catch (err) {
            console.error('Admin reports error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    return (
        <section className="workspace admin-workspace anim-reveal" aria-label="Reports">
            <header className="workspace-top admin-workspace-top anim-pop anim-delay-1">
                <div className="overview-title-wrap">
                    <p className="overview-kicker">Admin Panel</p>
                    <h1>Message Reports</h1>
                </div>
                <div className="admin-user-count">
                    <span>{reports.length} logs</span>
                </div>
            </header>

            <div className="admin-content anim-pop anim-delay-2">
                {loading ? (
                    <div className="admin-loading">
                        <div className="admin-spinner" />
                        <p>Loading reports…</p>
                    </div>
                ) : reports.length === 0 ? (
                    <p className="admin-empty">No message logs yet.</p>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Page ID</th>
                                    <th>Sender</th>
                                    <th>Message</th>
                                    <th>Tokens</th>
                                    <th>Cost</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((log) => (
                                    <tr key={log._id}>
                                        <td className="admin-mono-cell">{log.pageId?.slice(0, 12) || '—'}…</td>
                                        <td className="admin-mono-cell">{log.senderId?.slice(0, 10) || '—'}…</td>
                                        <td className="admin-msg-cell">
                                            {log.messageText ? log.messageText.slice(0, 60) : '[media]'}
                                            {log.messageText?.length > 60 ? '…' : ''}
                                        </td>
                                        <td>{(log.totalTokens || 0).toLocaleString()}</td>
                                        <td>${(log.estimatedCost || 0).toFixed(4)}</td>
                                        <td className="admin-date-cell">
                                            {log.createdAt
                                                ? new Date(log.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
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

export default AdminReportsView
