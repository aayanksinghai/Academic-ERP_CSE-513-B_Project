import React from 'react'
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import OrganisationList from './pages/OrganisationList'
import OrganisationForm from './pages/OrganisationForm'
import RestrictedWelcome from './pages/RestrictedWelcome'
import './App.css'

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

const OutreachRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isOutreach } = useAuth()
  console.log('OutreachRoute - token:', token, 'isOutreach:', isOutreach)
  if (!token) return <Navigate to="/login" replace />
  if (isOutreach === null) {
    // Still loading, show loading spinner
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
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p>Loading...</p>
      </div>
    )
  }
  if (isOutreach === false) {
    console.log('User is not Outreach, redirecting to /welcome')
    return <Navigate to="/welcome" replace />
  }
  return children
}

const NavBar: React.FC = () => {
  const { token, logout } = useAuth()
  const navigate = useNavigate()

  if (!token) return null

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="fw-bold" style={{ color: '#1976d2', fontSize: '1.5rem' }}>
          <i className="bi bi-building me-2"></i>Academic ERP
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                logout()
                localStorage.removeItem('auth_token')
                navigate('/login')
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/organisations" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/welcome" element={<PrivateRoute>{<RestrictedWelcome />}</PrivateRoute>} />

          <Route
            path="/organisations"
            element={<OutreachRoute>{<OrganisationList />}</OutreachRoute>}
          />
          <Route
            path="/organisations/new"
            element={<OutreachRoute>{<OrganisationForm />}</OutreachRoute>}
          />
          <Route
            path="/organisations/:id/edit"
            element={<OutreachRoute>{<OrganisationForm />}</OutreachRoute>}
          />

          <Route path="*" element={<Navigate to="/organisations" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
