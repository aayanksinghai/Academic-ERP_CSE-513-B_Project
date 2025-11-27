import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import '../styles/Login.css'

const Login: React.FC = () => {
    const { loginRedirect } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleGoogleLogin = () => {
        setLoading(true)
        loginRedirect()
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <Container fluid>
                <Row className="align-items-center justify-content-center">
                    {/* Left Section - Hero (Hidden on Mobile) */}
                    <Col lg={6} className="d-none d-lg-flex justify-content-center align-items-center">
                        <div style={{ textAlign: 'center', color: 'white' }}>
                            <div
                                style={{
                                    fontSize: 'clamp(60px, 10vw, 120px)',
                                    marginBottom: '30px',
                                    animation: 'float 3s ease-in-out infinite'
                                }}
                            >
                                <i className="bi bi-building"></i>
                            </div>
                            <h1
                                style={{
                                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                                    fontWeight: '800',
                                    marginBottom: '10px',
                                    letterSpacing: '1px'
                                }}
                            >
                                Academic ERP
                            </h1>

                            <p
                                style={{
                                    fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                                    marginBottom: '40px',
                                    opacity: 0.85
                                }}
                            >
                                Organisation Registration & Management
                            </p>
                        </div>
                    </Col>

                    {/* Right Section - Login Card */}
                    <Col xs={12} lg={6} className="d-flex justify-content-center">
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: 'clamp(30px, 5vw, 50px)',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                                width: '100%',
                                maxWidth: '450px',
                                animation: 'slideUp 0.6s ease-out'
                            }}
                        >
                            {/* Mobile Logo (Visible on Mobile) */}
                            <div className="d-lg-none text-center mb-4">
                                <div
                                    style={{
                                        fontSize: '60px',
                                        color: '#667eea',
                                        marginBottom: '15px'
                                    }}
                                >
                                    <i className="bi bi-building"></i>
                                </div>
                                <h2
                                    style={{
                                        fontSize: '1.8rem',
                                        fontWeight: '800',
                                        color: '#667eea',
                                        margin: '0 0 5px 0'
                                    }}
                                >
                                    Academic ERP
                                </h2>
                            </div>

                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h1
                                    style={{
                                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                        fontWeight: '800',
                                        color: '#667eea',
                                        marginBottom: '10px',
                                        margin: 0
                                    }}
                                >
                                    Welcome Back
                                </h1>
                                <p
                                    style={{
                                        fontSize: '0.95rem',
                                        color: '#a0aec0',
                                        marginTop: '8px',
                                        margin: 0
                                    }}
                                >
                                    Sign in with your Google account
                                </p>
                            </div>

                            {/* Google Login Button */}
                            <Button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '14px 20px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                                    fontWeight: '700',
                                    color: 'white',
                                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                                    transition: 'all 0.3s ease',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    marginBottom: '20px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(-3px)'
                                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)'
                                    }
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            width="22"
                                            height="22"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M44.5 20H24v8.5h11.9C34.7 32.1 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.6 6.6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 18.3-7.4 19.6-17H44.5z"
                                                fill="white"
                                            />
                                        </svg>
                                        <span>Continue with Google</span>
                                    </>
                                )}
                            </Button>

                            {/* Info Section */}
                            <div
                                style={{
                                    background: '#f0f4ff',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '20px',
                                    borderLeft: '4px solid #667eea'
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: '0.9rem',
                                        color: '#667eea',
                                        fontWeight: '600',
                                        margin: '0 0 8px 0'
                                    }}
                                >
                                    <i className="bi bi-info-circle me-2"></i>
                                    Google OAuth Only
                                </p>
                                <p
                                    style={{
                                        fontSize: '0.85rem',
                                        color: '#764ba2',
                                        margin: 0,
                                        lineHeight: '1.5'
                                    }}
                                >
                                    This system uses secure Google authentication. Sign in with your registered Google account to access the system.
                                </p>
                            </div>

                            {/* Footer */}
                            <p
                                style={{
                                    fontSize: '0.8rem',
                                    color: '#a0aec0',
                                    textAlign: 'center',
                                    margin: 0,
                                    lineHeight: '1.6'
                                }}
                            >
                                By signing in, you agree to our terms and policies
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}

export default Login
