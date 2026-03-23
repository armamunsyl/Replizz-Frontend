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

            // Auto-select page logic
            if (list.length > 0) {
                const savedPageId = localStorage.getItem('selectedPageId')
                if (savedPageId) {
                    const found = list.find((p) => p.pageId === savedPageId)
                    if (found) {
                        setSelectedPage(found)
                        return
                    }
                }
                // Fallback to first if nothing saved or saved page not found
                setSelectedPage(list[0])
            }
        } catch (err) {
            console.error('Failed to fetch pages:', err)
        } finally {
            setLoadingPages(false)
        }
    }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

    // Custom setter that also saves to localStorage
    const handleSetSelectedPage = useCallback((page) => {
        if (page) {
            localStorage.setItem('selectedPageId', page.pageId)
        } else {
            localStorage.removeItem('selectedPageId')
        }
        setSelectedPage(page)
    }, [])

    useEffect(() => {
        if (user) {
            fetchPages()
        } else {
            setPages([])
            setSelectedPage(null)
        }
    }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <PageContext.Provider value={{ pages, setPages, selectedPage, setSelectedPage: handleSetSelectedPage, loadingPages, fetchPages }}>
            {children}
        </PageContext.Provider>
    )
}

export function usePage() {
    return useContext(PageContext)
}
