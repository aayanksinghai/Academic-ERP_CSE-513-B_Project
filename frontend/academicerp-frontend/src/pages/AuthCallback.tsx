import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const AuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setToken, setIsOutreach, setUserEmail } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [retrying, setRetrying] = useState(false)
    const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8080'

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token')
            const code = searchParams.get('code')
            const state = searchParams.get('state')
            const errorParam = searchParams.get('error')
            const isOutreachParam = searchParams.get('isOutreach')

            if (token) {
                // Token provided directly by backend
                setToken(token)
                
                // Parse isOutreach parameter
                const isOutreach = isOutreachParam === 'true'
                console.log('isOutreachParam:', isOutreachParam, 'isOutreach:', isOutreach)
                setIsOutreach(isOutreach)
                
                // Fetch user info to get email
                try {
                    const response = await fetch(`${BACKEND_URL}/api/auth/user-info`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token }),
                    })
                    
                    if (response.ok) {
                        const userData = await response.json()
                        console.log('User data:', userData)
                        setUserEmail(userData.email)
                    }
                } catch (err) {
                    console.error('Failed to fetch user info:', err)
                }
                
                // Navigate based on department
                console.log('Navigating - isOutreach:', isOutreach)
                if (isOutreach) {
                    console.log('Navigating to /organisations')
                    navigate('/organisations')
                } else {
                    console.log('Navigating to /welcome')
                    navigate('/welcome')
                }
            } else if (code && state) {
                // Google OAuth code received - try to exchange it for a token
                setRetrying(true)
                try {
                    const response = await fetch(`${BACKEND_URL}/api/auth/oauth/token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, state }),
                    })

                    if (response.ok) {
                        const data = await response.json()
                        if (data?.token) {
                            setToken(data.token)
                            navigate('/organisations')
                            return
                        }
                    }
                    throw new Error('Failed to exchange code for token')
                } catch (err) {
                    console.error('Token exchange failed:', err)
                    setError('OAuth authentication incomplete. Please use username/password login or try again.')
                    setRetrying(false)
                }
            } else if (errorParam) {
                // Handle specific error cases
                let errorMessage = 'Authentication failed'
                switch (errorParam) {
                    case 'oauth2_required':
                        errorMessage = 'OAuth2 authentication required'
                        break
                    case 'email_not_found':
                        errorMessage = 'Email not found in Google account'
                        break
                    case 'not_employee':
                        errorMessage = 'Access denied. Only registered employees can access this system.'
                        break
                    case 'not_outreach':
                        errorMessage = 'Access denied. Only Outreach department employees can access Organisation operations.'
                        break
                    case 'auth_failed':
                        errorMessage = 'Authentication failed. Please try again.'
                        break
                    case 'server_error':
                        errorMessage = 'Server error during authentication. Backend issue detected.'
                        break
                    default:
                        errorMessage = 'Authentication failed'
                }
                setError(errorMessage)
                setRetrying(false)
            } else {
                // no token, code, or error: navigate to login
                navigate('/login')
            }
        }

        handleCallback()
    }, [searchParams, setToken, setIsOutreach, setUserEmail, navigate, BACKEND_URL])

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                <div style={{
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ color: '#991b1b', margin: '0 0 10px 0' }}>Authentication Error</h2>
                    <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '10px 20px',
                        background: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Return to Login
                </button>
            </div>
        )
    }

    if (retrying) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e6eef6',
                    borderTop: '4px solid #1976d2',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p>Exchanging code for access token...</p>
            </div>
        )
    }

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #e6eef6',
                borderTop: '4px solid #1976d2',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '20px'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p>Processing authentication...</p>
        </div>
    )
}

export default AuthCallback
