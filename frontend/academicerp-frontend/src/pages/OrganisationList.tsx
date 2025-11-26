import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Table, Button, Form, Spinner, Alert } from 'react-bootstrap'
import type { Organisation } from '../types/organisation'
import { OrganisationService } from '../services/organisationService'
import { useAuth } from '../auth/AuthContext'

const OrganisationList: React.FC = () => {
    const [items, setItems] = useState<Organisation[]>([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
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

    const filtered = items.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))

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
                            placeholder="🔍 Search by organisation name"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
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
            ) : filtered.length === 0 ? (
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
                                    {filtered.map((o, index) => (
                                        <tr key={o.id} className="align-middle">
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
                                            <td className="text-center">
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
        </Container>
    )
}

export default OrganisationList
