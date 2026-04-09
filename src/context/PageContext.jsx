import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuth } from './AuthContext'

const PageContext = createContext(null)

export function PageProvider({ children }) {
    const { user } = useAuth()
    const [pages, setPages] = useState([])
    const [selectedPage, setSelectedPage] = useState(null)
    const [loadingPages, setLoadingPages] = useState(false)

    const fetchPages = useCallback(async () => {
        if (!user) return
        setLoadingPages(true)
        try {
            const { data } = await api.get('/api/pages')
            const list = data.data || []
            setPages(list)

            if (list.length > 0) {
                const savedPageId = localStorage.getItem('selectedPageId')
                if (savedPageId) {
                    const found = list.find((p) => p.pageId === savedPageId)
                    if (found) { setSelectedPage(found); return }
                }
                setSelectedPage(list[0])
            }
        } catch (err) {
            console.error('Failed to fetch pages:', err)
        } finally {
            setLoadingPages(false)
        }
    }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSetSelectedPage = useCallback((page) => {
        if (page) {
            localStorage.setItem('selectedPageId', page.pageId)
        } else {
            localStorage.removeItem('selectedPageId')
        }
        setSelectedPage(page)
    }, [])

    // Toggle per-page automation on/off
    const toggleAutomation = useCallback(async (pageId) => {
        const page = pages.find(p => p.pageId === pageId)
        if (!page) return
        const newState = !page.automationEnabled
        // Optimistic update
        setPages(prev => prev.map(p => p.pageId === pageId ? { ...p, automationEnabled: newState } : p))
        if (selectedPage?.pageId === pageId) {
            setSelectedPage(prev => prev ? { ...prev, automationEnabled: newState } : prev)
        }
        try {
            const { data } = await api.patch(`/api/pages/${pageId}/automation`, { automationEnabled: newState })
            // Sync with server response
            setPages(prev => prev.map(p => p.pageId === pageId ? { ...p, automationEnabled: data.data.automationEnabled } : p))
            if (selectedPage?.pageId === pageId) {
                setSelectedPage(prev => prev ? { ...prev, automationEnabled: data.data.automationEnabled } : prev)
            }
        } catch (err) {
            console.error('Toggle automation error:', err)
            // Revert on failure
            setPages(prev => prev.map(p => p.pageId === pageId ? { ...p, automationEnabled: !newState } : p))
            if (selectedPage?.pageId === pageId) {
                setSelectedPage(prev => prev ? { ...prev, automationEnabled: !newState } : prev)
            }
        }
    }, [pages, selectedPage])

    useEffect(() => {
        if (user) { fetchPages() }
        else { setPages([]); setSelectedPage(null) }
    }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <PageContext.Provider value={{
            pages, setPages,
            selectedPage, setSelectedPage: handleSetSelectedPage,
            loadingPages, fetchPages,
            toggleAutomation,
        }}>
            {children}
        </PageContext.Provider>
    )
}

export function usePage() {
    return useContext(PageContext)
}
