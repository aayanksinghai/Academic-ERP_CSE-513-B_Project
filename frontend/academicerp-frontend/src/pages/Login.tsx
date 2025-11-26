import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import '../styles/Login.css'

const Login: React.FC = () => {
    const { loginRedirect } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8080'

    return (
        <div className="login-root">
            <Container fluid>
                <Row className="align-items-center min-vh-100">
                    <Col lg={6} className="d-none d-lg-flex justify-content-center">
                        <div className="login-hero text-center">
                            <div className="mb-4">
                                <i className="bi bi-building" style={{ fontSize: '80px', color: '#1976d2' }}></i>
                            </div>
                            <h1 className="display-4 fw-bold mb-3">Academic ERP</h1>
                            <p className="fs-5 text-secondary">Outreach Department</p>
                            <p className="fs-6 text-muted">Organisation Registration & Management</p>
                            <hr className="my-4" />
                            <p className="text-secondary">
                                <i className="bi bi-check-circle me-2 text-success"></i>
                                Secure authentication
                            </p>
                            <p className="text-secondary">
                                <i className="bi bi-check-circle me-2 text-success"></i>
                                Efficient management
                            </p>
                            <p className="text-secondary">
                                <i className="bi bi-check-circle me-2 text-success"></i>
                                Easy to use
                            </p>
                        </div>
                    </Col>

                    <Col lg={6} md={12} className="d-flex justify-content-center py-5">
                        <Card className="shadow-lg border-0 w-100" style={{ maxWidth: '450px' }}>
                            <Card.Body className="p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                                    <p className="text-muted">Sign in to your account</p>
                                </div>

                                <Form
                                    onSubmit={async (e: React.FormEvent) => {
                                        e.preventDefault()
                                        setError(null)
                                        setLoading(true)
                                        try {
                                            const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ username, password }),
                                            })
                                            if (!res.ok) {
                                                const txt = await res.text()
                                                throw new Error(txt || res.statusText)
                                            }
                                            const data = await res.json()
                                            if (data?.token) {
                                                localStorage.setItem('auth_token', data.token)
                                                navigate('/organisations')
                                            } else {
                                                throw new Error('Invalid response from server')
                                            }
                                        } catch (err: any) {
                                            setError(err?.message || 'Login failed')
                                        } finally {
                                            setLoading(false)
                                        }
                                    }}
                                >
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-500">Username</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            placeholder="Enter your username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="rounded-3"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-500">Password</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="rounded-3"
                                        />
                                    </Form.Group>

                                    {error && (
                                        <Alert variant="danger" className="rounded-3 mb-3">
                                            <i className="bi bi-exclamation-circle me-2"></i>
                                            {error}
                                        </Alert>
                                    )}

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        type="submit"
                                        disabled={loading}
                                        className="w-100 fw-bold rounded-3 shadow-sm mb-3"
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                <div className="d-flex align-items-center my-4">
                                    <hr className="flex-grow-1" />
                                    <span className="mx-2 text-muted small">OR</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                <Button
                                    variant="outline-secondary"
                                    size="lg"
                                    onClick={loginRedirect}
                                    className="w-100 fw-bold rounded-3 shadow-sm"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 48 48"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="me-2"
                                        style={{ display: 'inline' }}
                                    >
                                        <path
                                            d="M44.5 20H24v8.5h11.9C34.7 32.1 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.6 6.6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 18.3-7.4 19.6-17H44.5z"
                                            fill="#FFC107"
                                        />
                                        <path
                                            d="M6.3 14.5l7 5.1C15.5 16 19.4 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.6 6.6 29.6 4 24 4 16.9 4 10.7 7.9 6.3 14.5z"
                                            fill="#FF3D00"
                                        />
                                        <path
                                            d="M24 44c5.6 0 10.6-2.1 14.4-5.6l-6.6-5.4C29.9 33.9 27 35 24 35c-6 0-10.7-3.9-12.1-9.5l-7 5.1C6.4 36.6 14.1 44 24 44z"
                                            fill="#4CAF50"
                                        />
                                        <path
                                            d="M44.5 20H24v8.5h11.9C35 31.5 30 35 24 35c-3 0-5.9-1.1-8.1-2.9l-7 5.1C10.7 39.6 16.9 44 24 44c10 0 18.3-7.4 19.6-17H44.5z"
                                            fill="#1976D2"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>

                                <p className="text-center text-muted mt-4 small">
                                    By signing in, you agree to our policies
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login
