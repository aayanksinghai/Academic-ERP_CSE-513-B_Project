import React, { createContext, useContext, useEffect, useState } from 'react'

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8080'

type AuthContextType = {
    token: string | null
    setToken: (t: string | null) => void
    loginRedirect: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setTokenState] = useState<string | null>(() => {
        try {
            return localStorage.getItem('auth_token')
        } catch {
            return null
        }
    })

    useEffect(() => {
        try {
            if (token) localStorage.setItem('auth_token', token)
            else localStorage.removeItem('auth_token')
        } catch {
            // ignore
        }
    }, [token])

    const setToken = (t: string | null) => setTokenState(t)

    const loginRedirect = () => {
        // Redirect to backend OAuth2 authorization endpoint.
        // Backend handles Google OAuth and redirects back to frontend with token.
        window.location.href = `${BACKEND_URL}/oauth2/authorization/google`
    }

    const logout = () => setTokenState(null)

    return (
        <AuthContext.Provider value={{ token, setToken, loginRedirect, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
