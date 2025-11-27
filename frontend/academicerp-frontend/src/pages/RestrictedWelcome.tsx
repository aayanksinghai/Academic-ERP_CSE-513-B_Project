import React from 'react'
import { Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const RestrictedWelcome: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="text-center" style={{ maxWidth: '600px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '60px 40px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            color: 'white',
          }}
        >
          <div style={{ marginBottom: '30px' }}>
            <i
              className="bi bi-building"
              style={{
                fontSize: '64px',
                display: 'block',
                marginBottom: '20px',
              }}
            ></i>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '15px',
              letterSpacing: '0.5px',
            }}
          >
            Welcome to Academic ERP
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              marginBottom: '30px',
              opacity: 0.95,
              lineHeight: '1.6',
            }}
          >
            You have successfully logged in to the Academic ERP system. However, you do not have access to the Organisation module as it is restricted to Outreach department employees only.
          </p>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <p style={{ marginBottom: 0, fontSize: '0.95rem' }}>
              If you believe you should have access to the Organisation module, please contact your administrator.
            </p>
          </div>

          <Button
            variant="light"
            size="lg"
            onClick={handleLogout}
            style={{
              fontWeight: '600',
              padding: '12px 30px',
              fontSize: '1rem',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </Button>
        </div>

        <div
          style={{
            marginTop: '40px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
          }}
        >
          <p style={{ marginBottom: 0, color: '#6c757d', fontSize: '0.9rem' }}>
            <i className="bi bi-info-circle me-2"></i>
            For support or access requests, please contact your department administrator.
          </p>
        </div>
      </div>
    </Container>
  )
}

export default RestrictedWelcome
