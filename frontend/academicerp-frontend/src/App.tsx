import React from 'react'
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import OrganisationList from './pages/OrganisationList'
import OrganisationForm from './pages/OrganisationForm'
import './App.css'

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
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
            <Nav.Link href="/organisations" className="me-3">
              <i className="bi bi-list me-1"></i>Organisations
            </Nav.Link>
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

          <Route
            path="/organisations"
            element={<PrivateRoute>{<OrganisationList />}</PrivateRoute>}
          />
          <Route
            path="/organisations/new"
            element={<PrivateRoute>{<OrganisationForm />}</PrivateRoute>}
          />
          <Route
            path="/organisations/:id/edit"
            element={<PrivateRoute>{<OrganisationForm />}</PrivateRoute>}
          />

          <Route path="*" element={<Navigate to="/organisations" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
