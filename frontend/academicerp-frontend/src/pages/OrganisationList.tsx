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

    const [searchFocused, setSearchFocused] = useState(false)

    return (
        <Container fluid style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            {/* Header Section */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '20px 0',
                    marginBottom: '40px',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)'
                }}
            >
                <Container fluid className="px-4 px-md-5">
                    <Row className="align-items-center py-3">
                        <Col xs={12} md={8}>
                            <h1
                                style={{
                                    color: 'white',
                                    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                                    fontWeight: '800',
                                    letterSpacing: '0.5px',
                                    margin: 0,
                                    textAlign: 'left'
                                }}
                            >
                                <i className="bi bi-building me-2 me-md-3" style={{ fontSize: 'clamp(1.3rem, 5vw, 2.2rem)' }}></i>
                                Organisations
                            </h1>
                        </Col>
                        <Col xs={12} md={4} className="text-start text-md-end mt-3 mt-md-0">
                            <Button
                                onClick={() => navigate('/organisations/new')}
                                style={{
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '10px 20px',
                                    fontWeight: '700',
                                    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                                    color: 'white',
                                    boxShadow: '0 8px 20px rgba(245, 87, 108, 0.4)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    width: '100%',
                                    maxWidth: '200px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)'
                                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(245, 87, 108, 0.5)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 87, 108, 0.4)'
                                }}
                            >
                                <i className="bi bi-plus-circle me-1"></i>
                                New Organisation
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Main Content */}
            <Container fluid className="px-4 px-md-5">
                {/* Search Section */}
                <Row className="mb-5">
                    <Col xs={12} lg={6} className="d-flex">
                        <div
                            style={{
                                position: 'relative',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                width: searchFocused ? '100%' : '60px',
                                maxWidth: searchFocused ? '100%' : '60px'
                            }}
                        >
                            <Form.Group
                                style={{
                                    position: 'relative',
                                    background: 'white',
                                    borderRadius: searchFocused ? '12px' : '50px',
                                    padding: searchFocused ? '12px 20px' : '12px 12px',
                                    boxShadow: searchFocused
                                        ? '0 12px 40px rgba(102, 126, 234, 0.3)'
                                        : '0 4px 12px rgba(102, 126, 234, 0.15)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <i
                                    className="bi bi-search"
                                    style={{
                                        color: searchFocused ? '#667eea' : '#a0aec0',
                                        fontSize: '1.1rem',
                                        transition: 'all 0.4s ease',
                                        flexShrink: 0
                                    }}
                                ></i>
                                <Form.Control
                                    type="text"
                                    placeholder={searchFocused ? 'Search by Name, Address, HR Name, Email...' : ''}
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => {
                                        if (!query) setSearchFocused(false)
                                    }}
                                    style={{
                                        border: 'none',
                                        paddingLeft: searchFocused ? '12px' : '0px',
                                        paddingRight: '8px',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        color: '#2d3748',
                                        background: 'transparent',
                                        outline: 'none',
                                        width: searchFocused ? '100%' : '0px',
                                        opacity: searchFocused ? 1 : 0,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        minHeight: 'auto'
                                    }}
                                />
                                {(query || searchFocused) && (
                                    <i
                                        className="bi bi-x-circle-fill"
                                        onClick={() => handleSearch('')}
                                        style={{
                                            color: '#cbd5e0',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s',
                                            flexShrink: 0,
                                            marginLeft: '8px'
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#667eea')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e0')}
                                    ></i>
                                )}
                            </Form.Group>
                        </div>
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
                        <i className="bi bi-info-circle me-2"></i>No organisations found.
                    </Alert>
                ) : (
                    <Card className="shadow-lg border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="mb-0" style={{ tableLayout: 'fixed' }}>
                                    <thead style={{ background: '#667eea', position: 'sticky', top: 0, zIndex: 10 }}>
                                        <tr>
                                            <th className="text-center fw-bold" style={{ width: '50px', color: 'black', fontSize: '0.85rem', padding: '12px 6px', verticalAlign: 'middle', borderBottom: '3px solid #764ba2' }}>
                                                <i className="bi bi-hash"></i>
                                            </th>
                                            <th className="fw-bold" style={{ color: 'black', fontSize: '0.85rem', padding: '12px 10px', verticalAlign: 'middle', borderBottom: '3px solid #764ba2', textAlign: 'left' }}>Name</th>
                                            <th className="fw-bold d-none d-md-table-cell" style={{ color: 'black', fontSize: '0.85rem', padding: '12px 10px', verticalAlign: 'middle', borderBottom: '3px solid #764ba2', textAlign: 'center' }}>HR Contact</th>
                                            <th className="fw-bold d-none d-lg-table-cell" style={{ color: 'black', fontSize: '0.85rem', padding: '12px 10px', verticalAlign: 'middle', borderBottom: '3px solid #764ba2', textAlign: 'center' }}>Email</th>
                                            <th className="text-center fw-bold" style={{ width: '90px', color: 'black', fontSize: '0.85rem', padding: '12px 6px', verticalAlign: 'middle', borderBottom: '3px solid #764ba2', textAlign: 'center' }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((o, index) => (
                                            <tr
                                                key={o.id}
                                                className="align-middle"
                                                style={{
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    transition: 'all 0.3s ease',
                                                    background: 'white'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#f8f9fa'
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.1)'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'white'
                                                    e.currentTarget.style.boxShadow = 'none'
                                                }}
                                                onClick={() => handleRowClick(o)}
                                            >
                                                <td className="text-center fw-bold" style={{ color: '#667eea', fontSize: '0.8rem', padding: '10px 6px', verticalAlign: 'middle', width: '50px' }}>
                                                    {index + 1}
                                                </td>
                                                <td style={{ padding: '10px 8px', verticalAlign: 'middle' }}>
                                                    <div className="d-flex align-items-center">
                                                        {/* <div
                                                            className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: '36px',
                                                                height: '36px',
                                                                minWidth: '36px',
                                                                background: `linear-gradient(135deg, hsl(${Math.abs(o.name?.charCodeAt(0) || 0) % 360}, 70%, 60%), hsl(${(Math.abs(o.name?.charCodeAt(0) || 0) + 30) % 360}, 70%, 60%))`,
                                                                color: 'white',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                                                            }}
                                                        >
                                                            {o.name?.charAt(0).toUpperCase()}
                                                        </div> */}
                                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
                                                            <div style={{ color: '#2d3748', fontWeight: '600', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</div>
                                                            {/* <div style={{ color: '#a0aec0', fontSize: '0.7rem' }}>Organisation</div> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="d-none d-md-table-cell" style={{ color: '#2d3748', fontWeight: '500', fontSize: '0.8rem', padding: '10px 8px', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {o.hrDetails ? `${o.hrDetails.firstName} ${o.hrDetails.lastName}` : 'N/A'}
                                                </td>
                                                <td className="d-none d-lg-table-cell" style={{ padding: '10px 8px', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    <small style={{ color: '#667eea', fontWeight: '500', fontSize: '0.75rem' }}>{o.hrDetails?.email || 'N/A'}</small>
                                                </td>
                                                <td className="text-center" style={{ padding: '10px 6px', verticalAlign: 'middle', width: '90px', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        onClick={() => navigate(`/organisations/${o.id}/edit`)}
                                                        className="rounded-circle"
                                                        title="Edit"
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            padding: '0',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            border: 'none',
                                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                                            transition: 'all 0.3s ease',
                                                            cursor: 'pointer',
                                                            color: 'white',
                                                            fontSize: '0.85rem',
                                                            marginRight: '6px'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.15) translateY(-2px)'
                                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.5)'
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1) translateY(0)'
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                                                        }}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(o.id)}
                                                        className="rounded-circle"
                                                        title="Delete"
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            padding: '0',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                            border: 'none',
                                                            boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
                                                            transition: 'all 0.3s ease',
                                                            cursor: 'pointer',
                                                            color: 'white',
                                                            fontSize: '0.85rem'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.15) translateY(-2px)'
                                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 87, 108, 0.5)'
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1) translateY(0)'
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 87, 108, 0.3)'
                                                        }}
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

            {/* Organisation Detail Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered backdrop="static">
                <Modal.Header
                    closeButton
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        padding: '24px'
                    }}
                >
                    <Modal.Title style={{ color: 'white', fontSize: '1.4rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                        <i className="bi bi-building me-2"></i>
                        Organisation Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '32px', background: '#f8f9fa' }}>
                    {selectedOrg && (
                        <div>
                            {/* Header Section with Avatar */}
                            <div className="text-center mb-4 pb-4" style={{ borderBottom: '2px solid #e2e8f0' }}>
                                {/* <div
                                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        background: `linear-gradient(135deg, hsl(${Math.abs(selectedOrg.name?.charCodeAt(0) || 0) % 360}, 70%, 60%), hsl(${(Math.abs(selectedOrg.name?.charCodeAt(0) || 0) + 30) % 360}, 70%, 60%))`,
                                        color: 'white',
                                        fontSize: '42px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                                    }}
                                >
                                    {selectedOrg.name?.charAt(0).toUpperCase()}
                                </div> */}
                                <h3 style={{ color: '#667eea', fontWeight: '700', fontSize: '1.6rem', marginBottom: '4px' }}>
                                    {selectedOrg.name}
                                </h3>
                                <p style={{ color: '#718096', fontSize: '0.9rem', margin: 0 }}>
                                    <i className="bi bi-building me-1"></i>
                                    Organisation Information
                                </p>
                            </div>

                            {/* Organisation Details Card */}
                            <div
                                className="mb-4 p-4"
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <h6
                                    style={{
                                        color: '#667eea',
                                        fontSize: '0.95rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        marginBottom: '16px'
                                    }}
                                >
                                    <i className="bi bi-info-circle me-2"></i>
                                    Details
                                </h6>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <div style={{ color: '#a0aec0', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                                            Name
                                        </div>
                                        <div style={{ color: '#2d3748', fontSize: '1rem', fontWeight: '600' }}>
                                            {selectedOrg.name || 'N/A'}
                                        </div>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <div style={{ color: '#a0aec0', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                                            Address
                                        </div>
                                        <div style={{ color: '#2d3748', fontSize: '1rem', fontWeight: '600' }}>
                                            {selectedOrg.address || 'N/A'}
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* HR Contact Details Card */}
                            {selectedOrg.hrDetails && (
                                <div
                                    className="p-4"
                                    style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <h6
                                        style={{
                                            color: '#667eea',
                                            fontSize: '0.95rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            marginBottom: '16px'
                                        }}
                                    >
                                        <i className="bi bi-person-circle me-2"></i>
                                        HR Contact
                                    </h6>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <div style={{ color: '#a0aec0', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                                                First Name
                                            </div>
                                            <div style={{ color: '#2d3748', fontSize: '1rem', fontWeight: '600' }}>
                                                {selectedOrg.hrDetails.firstName || 'N/A'}
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <div style={{ color: '#a0aec0', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                                                Last Name
                                            </div>
                                            <div style={{ color: '#2d3748', fontSize: '1rem', fontWeight: '600' }}>
                                                {selectedOrg.hrDetails.lastName || 'N/A'}
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <div style={{ color: '#a0aec0', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                                                Email
                                            </div>
                                            <div style={{ color: '#667eea', fontSize: '1rem', fontWeight: '600' }}>
                                                <a
                                                    href={`mailto:${selectedOrg.hrDetails.email}`}
                                                    style={{ textDecoration: 'none', color: '#667eea' }}
                                                >
                                                    {selectedOrg.hrDetails.email || 'N/A'}
                                                </a>
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <div style={{ color: '#a0aec0', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                                                Contact Number
                                            </div>
                                            <div style={{ color: '#667eea', fontSize: '1rem', fontWeight: '600' }}>
                                                <a
                                                    href={`tel:${selectedOrg.hrDetails.contactNumber}`}
                                                    style={{ textDecoration: 'none', color: '#667eea' }}
                                                >
                                                    {selectedOrg.hrDetails.contactNumber || 'N/A'}
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer
                    style={{
                        padding: '20px 32px',
                        background: '#f8f9fa',
                        borderTop: '1px solid #e2e8f0'
                    }}
                >
                    <Button
                        onClick={() => setShowModal(false)}
                        style={{
                            borderRadius: '8px',
                            padding: '8px 20px',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            border: '2px solid #cbd5e0',
                            color: '#4a5568',
                            background: 'white'
                        }}
                    >
                        <i className="bi bi-x-circle me-2"></i>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            setShowModal(false)
                            navigate(`/organisations/${selectedOrg?.id}/edit`)
                        }}
                        style={{
                            borderRadius: '8px',
                            padding: '8px 20px',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
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
