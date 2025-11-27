import React, { createContext, useContext, useEffect, useState } from 'react'

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8080'

type AuthContextType = {
    token: string | null
    setToken: (t: string | null) => void
    loginRedirect: () => void
    logout: () => void
    isOutreach: boolean | null
    setIsOutreach: (isOutreach: boolean | null) => void
    userEmail: string | null
    setUserEmail: (email: string | null) => void
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
    const [isOutreach, setIsOutreachState] = useState<boolean | null>(() => {
        try {
            const stored = localStorage.getItem('is_outreach')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })
    const [userEmail, setUserEmailState] = useState<string | null>(() => {
        try {
            return localStorage.getItem('user_email')
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

    useEffect(() => {
        try {
            if (isOutreach !== null) localStorage.setItem('is_outreach', JSON.stringify(isOutreach))
            else localStorage.removeItem('is_outreach')
        } catch {
            // ignore
        }
    }, [isOutreach])

    useEffect(() => {
        try {
            if (userEmail) localStorage.setItem('user_email', userEmail)
            else localStorage.removeItem('user_email')
        } catch {
            // ignore
        }
    }, [userEmail])

    const setToken = (t: string | null) => setTokenState(t)
    const setIsOutreach = (isOut: boolean | null) => setIsOutreachState(isOut)
    const setUserEmail = (email: string | null) => setUserEmailState(email)

    const loginRedirect = () => {
        // Redirect to backend OAuth2 authorization endpoint.
        // Backend handles Google OAuth and redirects back to frontend with token.
        window.location.href = `${BACKEND_URL}/oauth2/authorization/google`
    }

    const logout = () => {
        setTokenState(null)
        setIsOutreachState(null)
        setUserEmailState(null)
    }

    return (
        <AuthContext.Provider value={{ token, setToken, loginRedirect, logout, isOutreach, setIsOutreach, userEmail, setUserEmail }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
