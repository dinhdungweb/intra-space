'use client'

import { useState } from 'react'
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import Image from 'next/image'
import logo from '@/assets/images/logo.png'

export default function OrganizationSettingsPage() {
    const [isEditing, setIsEditing] = useState(false)
    const [saved, setSaved] = useState(false)
    const [formData, setFormData] = useState({
        companyName: 'Intraspace',
        companyEmail: 'contact@intraspace.com',
        companyPhone: '+84 123 456 789',
        companyAddress: 'Ha Noi, Vietnam',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi',
        dateFormat: 'DD/MM/YYYY',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Save to database
        console.log('Saving organization settings:', formData)
        setSaved(true)
        setIsEditing(false)
        setTimeout(() => setSaved(false), 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">Organization Settings</h4>
                    </div>
                </div>
            </div>

            {saved && (
                <Alert variant="success" dismissible onClose={() => setSaved(false)}>
                    Settings saved successfully!
                </Alert>
            )}

            <Row>
                <Col lg={4}>
                    <Card>
                        <Card.Body>
                            <h4 className="header-title mb-3">Company Logo</h4>
                            <div className="text-center">
                                <Image
                                    src={logo}
                                    alt="Company Logo"
                                    width={180}
                                    height={60}
                                    className="mb-3"
                                />
                                <div className="d-grid gap-2">
                                    <Button variant="primary" size="sm">
                                        Upload New Logo
                                    </Button>
                                    <Button variant="outline-secondary" size="sm">
                                        Remove Logo
                                    </Button>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <h4 className="header-title mb-3">Branding Colors</h4>
                            <Form.Group className="mb-3">
                                <Form.Label>Primary Color</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control type="color" defaultValue="#6658dd" style={{ width: '60px' }} />
                                    <Form.Control type="text" defaultValue="#6658dd" disabled />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Secondary Color</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control type="color" defaultValue="#4a81d4" style={{ width: '60px' }} />
                                    <Form.Control type="text" defaultValue="#4a81d4" disabled />
                                </div>
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="header-title mb-0">Company Information</h4>
                                {!isEditing ? (
                                    <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                                        Edit Settings
                                    </Button>
                                ) : (
                                    <div className="d-flex gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" size="sm" onClick={handleSubmit}>
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Company Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Company Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="companyEmail"
                                                value={formData.companyEmail}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Company Phone</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="companyPhone"
                                                value={formData.companyPhone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Timezone</Form.Label>
                                            <Form.Select
                                                name="timezone"
                                                value={formData.timezone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            >
                                                <option value="Asia/Ho_Chi_Minh">Vietnam (GMT+7)</option>
                                                <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                                                <option value="Asia/Singapore">Singapore (GMT+8)</option>
                                                <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Company Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="companyAddress"
                                        value={formData.companyAddress}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Language</Form.Label>
                                            <Form.Select
                                                name="language"
                                                value={formData.language}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            >
                                                <option value="vi">Tiếng Việt</option>
                                                <option value="en">English</option>
                                                <option value="th">ภาษาไทย</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Date Format</Form.Label>
                                            <Form.Select
                                                name="dateFormat"
                                                value={formData.dateFormat}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            >
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="mt-3">
                        <Card.Body>
                            <h4 className="header-title mb-3">Features & Modules</h4>
                            <Form>
                                <Form.Check
                                    type="switch"
                                    id="enable-chat"
                                    label="Enable Chat Module"
                                    defaultChecked
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="switch"
                                    id="enable-calendar"
                                    label="Enable Calendar"
                                    defaultChecked
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="switch"
                                    id="enable-social-feed"
                                    label="Enable Social Feed"
                                    defaultChecked
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="switch"
                                    id="enable-file-manager"
                                    label="Enable File Manager"
                                    defaultChecked
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="switch"
                                    id="enable-crm"
                                    label="Enable CRM Module"
                                    className="mb-2"
                                />
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
