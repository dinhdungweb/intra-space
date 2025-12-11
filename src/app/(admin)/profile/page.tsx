'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Card, Form, Button, Row, Col } from 'react-bootstrap'
import Image from 'next/image'
import userAvatar from '@/assets/images/users/user-3.jpg'

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        bio: '',
        phone: '',
        location: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Save to database
        console.log('Saving profile:', formData)
        setIsEditing(false)
        // Update session
        await update({ name: formData.name })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                        <h4 className="page-title">My Profile</h4>
                    </div>
                </div>
            </div>

            <Row>
                <Col lg={4}>
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <Image
                                    src={userAvatar}
                                    alt="avatar"
                                    className="rounded-circle"
                                    width={120}
                                    height={120}
                                />
                                <h4 className="mt-3 mb-0">{session?.user?.name || 'User'}</h4>
                                <p className="text-muted">{session?.user?.email}</p>

                                <Button variant="primary" size="sm" className="mt-2">
                                    Upload New Photo
                                </Button>
                            </div>

                            <div className="mt-4">
                                <h5 className="mb-3">About</h5>
                                <p className="text-muted">
                                    {formData.bio || 'No bio yet. Click Edit Profile to add one.'}
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="header-title mb-0">Profile Information</h4>
                                {!isEditing ? (
                                    <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                                        Edit Profile
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
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="+84 xxx xxx xxx"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="City, Country"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Bio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Tell us about yourself..."
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="mt-3">
                        <Card.Body>
                            <h4 className="header-title mb-3">Change Password</h4>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control type="password" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control type="password" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control type="password" />
                                </Form.Group>
                                <Button variant="primary">Update Password</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
