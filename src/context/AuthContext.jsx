import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined) // undefined = loading, null = not logged in
    const [dbUser, setDbUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser)
            if (firebaseUser) {
                try {
                    const { data } = await api.get('/api/auth/me')
                    setDbUser(data.data || null)
                } catch (err) {
                    console.error('Failed to fetch user profile:', err)
                    setDbUser(null)
                }
            } else {
                setDbUser(null)
            }
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const logout = () => signOut(auth)

    const role = dbUser?.role || 'User'
    const isAdmin = role === 'Admin'
    const isModerator = role === 'Moderator' || role === 'Admin'

    return (
        <AuthContext.Provider value={{ user, dbUser, loading, logout, role, isAdmin, isModerator }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
