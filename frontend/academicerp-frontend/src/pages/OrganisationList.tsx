import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Table, Button, Form, Spinner, Alert, Modal } from 'react-bootstrap'
import type { Organisation } from '../types/organisation'
import { OrganisationService } from '../services/organisationService'
import { useAuth } from '../auth/AuthContext'

const OrganisationList: React.FC = () => {
    const [items, setItems] = useState<Organisation[]>([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedOrg, setSelectedOrg] = useState<Organisation | null>(null)
    const [showModal, setShowModal] = useState(false)
    const { token } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        load()
    }, [token])

    async function load() {
        setLoading(true)
        try {
            const data = await OrganisationService.getAll()
            setItems(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSearch(searchTerm: string) {
        setQuery(searchTerm)
        if (!searchTerm.trim()) {
            load()
            return
        }
        setLoading(true)
        try {
            const data = await OrganisationService.search(searchTerm)
            setItems(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id?: number | string) {
        if (!id) return
        if (!confirm('Are you sure you want to delete this organisation?')) return
        try {
            await OrganisationService.remove(id)
            load()
        } catch (err) {
            console.error(err)
        }
    }

    function handleRowClick(org: Organisation) {
        setSelectedOrg(org)
        setShowModal(true)
    }

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col md={8}>
                    <h1 className="display-5 fw-bold text-primary">
                        <i className="bi bi-building me-2"></i>Organisations
                    </h1>
                </Col>
                <Col md={4} className="text-end">
                    <Button
                        variant="success"
                        size="lg"
                        onClick={() => navigate('/organisations/new')}
                        className="shadow-sm"
                    >
                        <i className="bi bi-plus-circle me-2"></i>New Organisation
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Control
                            size="lg"
                            placeholder="🔍 Search by name, address, HR name, email, or contact"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="rounded-pill shadow-sm"
                        />
                    </Form.Group>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : items.length === 0 ? (
                <Alert variant="info" className="text-center">
                    <i className="bi bi-info-circle me-2"></i>No organisations found. Create one to get started!
                </Alert>
            ) : (
                <Card className="shadow-sm border-0">
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="text-center fw-bold text-primary" style={{ width: '60px' }}>
                                            <i className="bi bi-hash"></i>
                                        </th>
                                        <th className="fw-bold text-primary">Name</th>
                                        <th className="fw-bold text-primary">HR Contact</th>
                                        <th className="fw-bold text-primary">Email</th>
                                        <th className="text-center fw-bold text-primary" style={{ width: '120px' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((o, index) => (
                                        <tr 
                                            key={o.id} 
                                            className="align-middle"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleRowClick(o)}
                                        >
                                            <td className="text-center fw-bold text-secondary">
                                                {index + 1}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            background: `hsl(${Math.abs(o.name?.charCodeAt(0) || 0) % 360}, 70%, 60%)`,
                                                            color: 'white',
                                                            fontSize: '14px',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {o.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="fw-500">{o.name}</span>
                                                </div>
                                            </td>
                                            <td>{o.hrDetails ? `${o.hrDetails.firstName} ${o.hrDetails.lastName}` : 'N/A'}</td>
                                            <td>
                                                <small className="text-muted">{o.hrDetails?.email || 'N/A'}</small>
                                            </td>
                                            <td className="text-center" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => navigate(`/organisations/${o.id}/edit`)}
                                                    className="me-2 rounded-circle"
                                                    title="Edit"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(o.id)}
                                                    className="rounded-circle"
                                                    title="Delete"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {/* Organisation Detail Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        <i className="bi bi-building me-2"></i>
                        Organisation Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrg && (
                        <Container>
                            <Row className="mb-4">
                                <Col className="text-center">
                                    <div
                                        className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            background: `hsl(${Math.abs(selectedOrg.name?.charCodeAt(0) || 0) % 360}, 70%, 60%)`,
                                            color: 'white',
                                            fontSize: '32px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {selectedOrg.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <h4 className="fw-bold text-primary">{selectedOrg.name}</h4>
                                </Col>
                            </Row>

                            <Card className="border-0 shadow-sm mb-3">
                                <Card.Body>
                                    <h6 className="text-secondary mb-3">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Organisation Information
                                    </h6>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <div className="text-muted small">ID</div>
                                            <div className="fw-semibold">{selectedOrg.id || 'N/A'}</div>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <div className="text-muted small">Name</div>
                                            <div className="fw-semibold">{selectedOrg.name || 'N/A'}</div>
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <div className="text-muted small">Address</div>
                                            <div className="fw-semibold">{selectedOrg.address || 'N/A'}</div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {selectedOrg.hrDetails && (
                                <Card className="border-0 shadow-sm">
                                    <Card.Body>
                                        <h6 className="text-secondary mb-3">
                                            <i className="bi bi-person-circle me-2"></i>
                                            HR Contact Details
                                        </h6>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <div className="text-muted small">First Name</div>
                                                <div className="fw-semibold">{selectedOrg.hrDetails.firstName || 'N/A'}</div>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <div className="text-muted small">Last Name</div>
                                                <div className="fw-semibold">{selectedOrg.hrDetails.lastName || 'N/A'}</div>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <div className="text-muted small">Email</div>
                                                <div className="fw-semibold">
                                                    <a href={`mailto:${selectedOrg.hrDetails.email}`} className="text-decoration-none">
                                                        {selectedOrg.hrDetails.email || 'N/A'}
                                                    </a>
                                                </div>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <div className="text-muted small">Contact Number</div>
                                                <div className="fw-semibold">
                                                    <a href={`tel:${selectedOrg.hrDetails.contactNumber}`} className="text-decoration-none">
                                                        {selectedOrg.hrDetails.contactNumber || 'N/A'}
                                                    </a>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            )}
                        </Container>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        <i className="bi bi-x-circle me-2"></i>
                        Close
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => {
                            setShowModal(false)
                            navigate(`/organisations/${selectedOrg?.id}/edit`)
                        }}
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Edit
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default OrganisationList
