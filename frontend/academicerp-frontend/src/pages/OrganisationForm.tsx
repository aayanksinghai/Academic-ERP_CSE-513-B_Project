import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap'
import type { Organisation } from '../types/organisation'
import { OrganisationService } from '../services/organisationService'

const OrganisationForm: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const isEdit = Boolean(id)
    const [model, setModel] = useState<Organisation>({
        name: '',
        address: '',
        hrDetails: {
            firstName: '',
            lastName: '',
            email: '',
            contactNumber: ''
        }
    })
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const navigate = useNavigate()

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validateContactNumber = (number: string): boolean => {
        return /^\d{10}$/.test(number)
    }

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!model.name.trim()) {
            errors.name = 'Organisation name is required'
        }

        if (!model.address.trim()) {
            errors.address = 'Address is required'
        }

        if (!model.hrDetails?.firstName.trim()) {
            errors.firstName = 'First name is required'
        }

        if (!model.hrDetails?.lastName.trim()) {
            errors.lastName = 'Last name is required'
        }

        if (!model.hrDetails?.email.trim()) {
            errors.email = 'Email is required'
        } else if (!validateEmail(model.hrDetails.email)) {
            errors.email = 'Email must contain @ and . (e.g., user@example.com)'
        }

        if (!model.hrDetails?.contactNumber.trim()) {
            errors.contactNumber = 'Contact number is required'
        } else if (!validateContactNumber(model.hrDetails.contactNumber)) {
            errors.contactNumber = 'Contact number must be exactly 10 digits'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleContactNumberChange = (value: string) => {
        // Allow only digits and limit to 10 characters
        const numericValue = value.replace(/\D/g, '').slice(0, 10)
        setModel({
            ...model,
            hrDetails: { ...model.hrDetails!, contactNumber: numericValue }
        })
        // Clear error when user starts typing
        if (validationErrors.contactNumber) {
            setValidationErrors({ ...validationErrors, contactNumber: '' })
        }
    }

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true)
            OrganisationService.getById(id)
                .then((data) => setModel(data))
                .catch((e) => {
                    setError(e instanceof Error ? e.message : 'Failed to load organisation')
                    console.error(e)
                })
                .finally(() => setLoading(false))
        }
    }, [isEdit, id])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Validate form before submission
        if (!validateForm()) {
            return
        }

        setSubmitting(true)
        try {
            if (isEdit && id) {
                await OrganisationService.update(id, model)
                setSuccess('Organisation updated successfully!')
            } else {
                await OrganisationService.create(model)
                setSuccess('Organisation created successfully!')
            }
            setTimeout(() => navigate('/organisations'), 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading && isEdit) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        )
    }

    return (
        <Container className="py-5" style={{ minHeight: '100vh' }}>
            <Row className="justify-content-center">
                <Col lg={7} md={9}>
                    <Card
                        className="shadow-lg border-0"
                        style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                        }}
                    >
                        {/* Header Section */}
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                padding: '30px',
                                color: 'white'
                            }}
                        >
                            <h2 className="mb-0 fw-bold" style={{ fontSize: '1.8rem', letterSpacing: '0.5px' }}>
                                <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-plus-circle'} me-3`}></i>
                                {isEdit ? 'Edit Organisation' : 'Create New Organisation'}
                            </h2>
                            <p className="mb-0 mt-2" style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                                {isEdit ? 'Update organisation and HR details' : 'Add a new organisation to the system'}
                            </p>
                        </div>

                        <Card.Body className="p-5" style={{ background: 'white' }}>
                            {error && (
                                <Alert
                                    variant="danger"
                                    onClose={() => setError('')}
                                    dismissible
                                    className="mb-4"
                                    style={{ borderRadius: '8px', border: 'none' }}
                                >
                                    <i className="bi bi-exclamation-circle me-2"></i>
                                    <strong>Error:</strong> {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert
                                    variant="success"
                                    onClose={() => setSuccess('')}
                                    dismissible
                                    className="mb-4"
                                    style={{ borderRadius: '8px', border: 'none' }}
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    <strong>Success:</strong> {success}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                {/* Organisation Section */}
                                <div className="mb-4">
                                    <h5
                                        className="mb-3 fw-bold"
                                        style={{
                                            color: '#667eea',
                                            fontSize: '1.1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        <i className="bi bi-building me-2"></i>Organisation Details
                                    </h5>

                                    <Form.Group className="mb-4">
                                        <Form.Label
                                            className="fw-semibold mb-2"
                                            style={{ color: '#2d3748', fontSize: '0.95rem' }}
                                        >
                                            Organisation Name <span style={{ color: '#e53e3e' }}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={model.name}
                                            onChange={(e) => {
                                                setModel({ ...model, name: e.target.value })
                                                if (validationErrors.name) {
                                                    setValidationErrors({ ...validationErrors, name: '' })
                                                }
                                            }}
                                            // placeholder="e.g., Bosch BGSW"
                                            disabled={submitting}
                                            isInvalid={!!validationErrors.name}
                                            style={{
                                                borderRadius: '8px',
                                                border: validationErrors.name ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                                                padding: '10px 14px',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                        {validationErrors.name && (
                                            <Form.Text style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {validationErrors.name}
                                            </Form.Text>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label
                                            className="fw-semibold mb-2"
                                            style={{ color: '#2d3748', fontSize: '0.95rem' }}
                                        >
                                            Address <span style={{ color: '#e53e3e' }}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={model.address}
                                            onChange={(e) => {
                                                setModel({ ...model, address: e.target.value })
                                                if (validationErrors.address) {
                                                    setValidationErrors({ ...validationErrors, address: '' })
                                                }
                                            }}
                                            // placeholder="Enter complete address"
                                            disabled={submitting}
                                            isInvalid={!!validationErrors.address}
                                            style={{
                                                borderRadius: '8px',
                                                border: validationErrors.address ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                                                padding: '10px 14px',
                                                fontSize: '0.95rem',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                        {validationErrors.address && (
                                            <Form.Text style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {validationErrors.address}
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                </div>

                                <hr style={{ borderColor: '#e2e8f0', margin: '30px 0' }} />

                                {/* HR Details Section */}
                                <div className="mb-4">
                                    <h5
                                        className="mb-3 fw-bold"
                                        style={{
                                            color: '#667eea',
                                            fontSize: '1.1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        <i className="bi bi-person-circle me-2"></i>HR Contact Details
                                    </h5>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label
                                                    className="fw-semibold mb-2"
                                                    style={{ color: '#2d3748', fontSize: '0.95rem' }}
                                                >
                                                    First Name <span style={{ color: '#e53e3e' }}>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={model.hrDetails?.firstName || ''}
                                                    onChange={(e) => {
                                                        setModel({
                                                            ...model,
                                                            hrDetails: { ...model.hrDetails!, firstName: e.target.value }
                                                        })
                                                        if (validationErrors.firstName) {
                                                            setValidationErrors({ ...validationErrors, firstName: '' })
                                                        }
                                                    }}
                                                    // placeholder="e.g., Diya"
                                                    disabled={submitting}
                                                    isInvalid={!!validationErrors.firstName}
                                                    style={{
                                                        borderRadius: '8px',
                                                        border: validationErrors.firstName ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                                                        padding: '10px 14px',
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                                {validationErrors.firstName && (
                                                    <Form.Text style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                                        <i className="bi bi-exclamation-circle me-1"></i>
                                                        {validationErrors.firstName}
                                                    </Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label
                                                    className="fw-semibold mb-2"
                                                    style={{ color: '#2d3748', fontSize: '0.95rem' }}
                                                >
                                                    Last Name <span style={{ color: '#e53e3e' }}>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={model.hrDetails?.lastName || ''}
                                                    onChange={(e) => {
                                                        setModel({
                                                            ...model,
                                                            hrDetails: { ...model.hrDetails!, lastName: e.target.value }
                                                        })
                                                        if (validationErrors.lastName) {
                                                            setValidationErrors({ ...validationErrors, lastName: '' })
                                                        }
                                                    }}
                                                    // placeholder="e.g., Raj"
                                                    disabled={submitting}
                                                    isInvalid={!!validationErrors.lastName}
                                                    style={{
                                                        borderRadius: '8px',
                                                        border: validationErrors.lastName ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                                                        padding: '10px 14px',
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                                {validationErrors.lastName && (
                                                    <Form.Text style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                                        <i className="bi bi-exclamation-circle me-1"></i>
                                                        {validationErrors.lastName}
                                                    </Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-4">
                                        <Form.Label
                                            className="fw-semibold mb-2"
                                            style={{ color: '#2d3748', fontSize: '0.95rem' }}
                                        >
                                            Email Address <span style={{ color: '#e53e3e' }}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={model.hrDetails?.email || ''}
                                            onChange={(e) => {
                                                setModel({
                                                    ...model,
                                                    hrDetails: { ...model.hrDetails!, email: e.target.value }
                                                })
                                                if (validationErrors.email) {
                                                    setValidationErrors({ ...validationErrors, email: '' })
                                                }
                                            }}
                                            // placeholder="e.g., diya@example.com"
                                            disabled={submitting}
                                            isInvalid={!!validationErrors.email}
                                            style={{
                                                borderRadius: '8px',
                                                border: validationErrors.email ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                                                padding: '10px 14px',
                                                fontSize: '0.95rem'
                                            }}
                                        />
                                        {validationErrors.email && (
                                            <Form.Text style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {validationErrors.email}
                                            </Form.Text>
                                        )}
                                        {!validationErrors.email && (
                                            <Form.Text style={{ color: '#718096', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                                {/* <i className="bi bi-info-circle me-1"></i>
                                                Must contain @ and . (e.g., user@example.com) */}
                                            </Form.Text>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label
                                            className="fw-semibold mb-2"
                                            style={{ color: '#2d3748', fontSize: '0.95rem' }}
                                        >
                                            Contact Number <span style={{ color: '#e53e3e' }}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="tel"
                                            value={model.hrDetails?.contactNumber || ''}
                                            onChange={(e) => handleContactNumberChange(e.target.value)}
                                            // placeholder="10-digit number"
                                            disabled={submitting}
                                            isInvalid={!!validationErrors.contactNumber}
                                            maxLength={10}
                                            style={{
                                                borderRadius: '8px',
                                                border: validationErrors.contactNumber ? '2px solid #e53e3e' : '1px solid #cbd5e0',
                                                padding: '10px 14px',
                                                fontSize: '0.95rem',
                                                letterSpacing: '1px'
                                            }}
                                        />
                                        {validationErrors.contactNumber && (
                                            <Form.Text style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                                <i className="bi bi-exclamation-circle me-1"></i>
                                                {validationErrors.contactNumber}
                                            </Form.Text>
                                        )}
                                        {!validationErrors.contactNumber && (
                                            <Form.Text style={{ color: '#718096', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                                {/* <i className="bi bi-info-circle me-1"></i>
                                                Enter exactly 10 digits (numbers only) */}
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                </div>

                                {/* Action Buttons */}
                                <div
                                    className="d-flex gap-3 mt-5 pt-3"
                                    style={{ borderTop: '1px solid #e2e8f0' }}
                                >
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate('/organisations')}
                                        disabled={submitting}
                                        style={{
                                            borderRadius: '8px',
                                            padding: '10px 24px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            border: '2px solid #cbd5e0',
                                            color: '#4a5568'
                                        }}
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            borderRadius: '8px',
                                            padding: '10px 24px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi ${isEdit ? 'bi-pencil' : 'bi-check'} me-2`}></i>
                                                {isEdit ? 'Update Organisation' : 'Create Organisation'}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default OrganisationForm
