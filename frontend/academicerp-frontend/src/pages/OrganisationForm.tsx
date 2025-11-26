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
    const navigate = useNavigate()

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
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <h2 className="mb-4 fw-bold text-primary">
                                <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                                {isEdit ? 'Edit' : 'New'} Organisation
                            </h2>

                            {error && (
                                <Alert variant="danger" onClose={() => setError('')} dismissible className="mb-3">
                                    <i className="bi bi-exclamation-circle me-2"></i>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert variant="success" onClose={() => setSuccess('')} dismissible className="mb-3">
                                    <i className="bi bi-check-circle me-2"></i>
                                    {success}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Organisation Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={model.name}
                                        onChange={(e) => setModel({ ...model, name: e.target.value })}
                                        placeholder="Enter organisation name"
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={model.address}
                                        onChange={(e) => setModel({ ...model, address: e.target.value })}
                                        placeholder="Enter organisation address"
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <hr className="my-4" />

                                <h5 className="mb-3 text-secondary">
                                    <i className="bi bi-person-circle me-2"></i>
                                    HR Details
                                </h5>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">First Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={model.hrDetails?.firstName || ''}
                                        onChange={(e) => setModel({
                                            ...model,
                                            hrDetails: { ...model.hrDetails!, firstName: e.target.value }
                                        })}
                                        placeholder="Enter first name"
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Last Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={model.hrDetails?.lastName || ''}
                                        onChange={(e) => setModel({
                                            ...model,
                                            hrDetails: { ...model.hrDetails!, lastName: e.target.value }
                                        })}
                                        placeholder="Enter last name"
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Email *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        required
                                        value={model.hrDetails?.email || ''}
                                        onChange={(e) => setModel({
                                            ...model,
                                            hrDetails: { ...model.hrDetails!, email: e.target.value }
                                        })}
                                        placeholder="Enter email address"
                                        disabled={submitting}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Contact Number *</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        required
                                        pattern="[0-9]{10}"
                                        value={model.hrDetails?.contactNumber || ''}
                                        onChange={(e) => setModel({
                                            ...model,
                                            hrDetails: { ...model.hrDetails!, contactNumber: e.target.value }
                                        })}
                                        placeholder="10 digits"
                                        disabled={submitting}
                                    />
                                    <Form.Text className="text-muted">
                                        Please enter a 10-digit contact number
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate('/organisations')}
                                        disabled={submitting}
                                        className="me-sm-2"
                                    >
                                        <i className="bi bi-x-circle me-2"></i>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className={`bi ${isEdit ? 'bi-pencil' : 'bi-plus'} me-2`}></i>
                                                {isEdit ? 'Update' : 'Save'}
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
