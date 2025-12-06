"use client"

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardSidebar from '@/components/DashboardSideBar'
import Image from 'next/image'

interface Application {
    _id: string
    employeeId: {
        _id: string
        name: string
        email: string
        profilePicture?: string
        engineeringField?: string
        employeeType?: string
    }
    projectId: {
        _id: string
        title: string
        coverImage: string
        cost: number
        duration: string
    }
    coverLetter: string
    expectedSalary: number
    portfolioLink?: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
    reviewedAt?: string
    rejectionReason?: string
}

const ApprovalsPage = () => {
    const { user, isLoaded } = useUser()
    const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || 'client'

    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [showDetailsId, setShowDetailsId] = useState<string | null>(null)

    useEffect(() => {
        if (isLoaded) {
            fetchApplications()
        }
    }, [isLoaded])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/client/approvals')
            const data = await response.json()

            if (data.success) {
                setApplications(data.applications)
            } else {
                setError('Failed to fetch applications')
            }
        } catch (error) {
            console.error('Error fetching applications:', error)
            setError('Failed to load applications')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (application: Application) => {
        setProcessingId(application._id)

        try {
            const response = await fetch(`/api/applications/${application._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'approve'
                }),
            })

            const data = await response.json()

            if (data.success) {
                // Send approval email
                await fetch('/api/send-approval-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        employeeEmail: application.employeeId.email,
                        employeeName: application.employeeId.name,
                        projectTitle: application.projectId.title,
                        clientName: user?.firstName + ' ' + user?.lastName || 'Client',
                        action: 'approve'
                    }),
                })

                // Refresh applications
                await fetchApplications()
                alert('Application approved successfully!')
            } else {
                alert('Failed to approve application: ' + data.error)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to approve application')
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (application: Application) => {
        const reason = prompt('Please provide a reason for rejection (optional):')

        setProcessingId(application._id)

        try {
            const response = await fetch(`/api/applications/${application._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'reject',
                    rejectionReason: reason || ''
                }),
            })

            const data = await response.json()

            if (data.success) {
                // Send rejection email
                await fetch('/api/send-approval-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        employeeEmail: application.employeeId.email,
                        employeeName: application.employeeId.name,
                        projectTitle: application.projectId.title,
                        clientName: user?.firstName + ' ' + user?.lastName || 'Client',
                        action: 'reject',
                        rejectionReason: reason || ''
                    }),
                })

                // Refresh applications
                await fetchApplications()
                alert('Application rejected successfully!')
            } else {
                alert('Failed to reject application: ' + data.error)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to reject application')
        } finally {
            setProcessingId(null)
        }
    }

    const pendingApplications = applications.filter(app => app.status === 'pending')
    const processedApplications = applications.filter(app => app.status !== 'pending')

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return '1 day ago'
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString()
    }

    if (!isLoaded || loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <DashboardSidebar role={userRole} />
                <div style={{ marginLeft: '260px', flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '20px', color: '#666' }}>Loading applications...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <DashboardSidebar role={userRole} />
                <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                        <p style={{ color: '#dc3545', fontSize: '18px' }}>{error}</p>
                        <button onClick={fetchApplications} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#647FBC', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <DashboardSidebar role={userRole} />
            <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#333',
                        marginBottom: '8px'
                    }}>
                        Approvals
                    </h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        Review and approve employee applications for your projects
                    </p>
                </div>

                {/* Pending Applications */}
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                        Pending Applications ({pendingApplications.length})
                    </h2>
                    {pendingApplications.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {pendingApplications.map((application) => (
                                <div
                                    key={application._id}
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                            {/* Avatar */}
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                backgroundColor: '#91ADC8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '32px',
                                                fontWeight: '600',
                                                color: '#fff',
                                                overflow: 'hidden',
                                                flexShrink: 0
                                            }}>
                                                {application.employeeId.profilePicture ? (
                                                    <Image
                                                        src={application.employeeId.profilePicture}
                                                        alt={application.employeeId.name}
                                                        width={80}
                                                        height={80}
                                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                    />
                                                ) : (
                                                    application.employeeId.name.charAt(0).toUpperCase()
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                                                    {application.employeeId.name}
                                                </h3>
                                                <p style={{ fontSize: '15px', color: '#647FBC', marginBottom: '8px' }}>
                                                    {application.employeeId.engineeringField || 'Engineer'} • {application.employeeId.employeeType || 'Professional'}
                                                </p>
                                                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666', flexWrap: 'wrap' }}>
                                                    <span>📧 {application.employeeId.email}</span>
                                                    {application.expectedSalary > 0 && (
                                                        <span>💰 ₹{application.expectedSalary.toLocaleString()}</span>
                                                    )}
                                                    <span>🕒 Applied {formatDate(application.createdAt)}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <button
                                                    onClick={() => handleReject(application)}
                                                    disabled={processingId === application._id}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '50%',
                                                        border: '2px solid #dc3545',
                                                        backgroundColor: '#fff',
                                                        cursor: processingId === application._id ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        opacity: processingId === application._id ? 0.5 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (processingId !== application._id) {
                                                            e.currentTarget.style.backgroundColor = '#dc3545'
                                                            const svg = e.currentTarget.querySelector('svg')
                                                            if (svg) svg.setAttribute('stroke', '#fff')
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (processingId !== application._id) {
                                                            e.currentTarget.style.backgroundColor = '#fff'
                                                            const svg = e.currentTarget.querySelector('svg')
                                                            if (svg) svg.setAttribute('stroke', '#dc3545')
                                                        }
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleApprove(application)}
                                                    disabled={processingId === application._id}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '50%',
                                                        border: '2px solid #28a745',
                                                        backgroundColor: '#fff',
                                                        cursor: processingId === application._id ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        opacity: processingId === application._id ? 0.5 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (processingId !== application._id) {
                                                            e.currentTarget.style.backgroundColor = '#28a745'
                                                            const svg = e.currentTarget.querySelector('svg')
                                                            if (svg) svg.setAttribute('stroke', '#fff')
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (processingId !== application._id) {
                                                            e.currentTarget.style.backgroundColor = '#fff'
                                                            const svg = e.currentTarget.querySelector('svg')
                                                            if (svg) svg.setAttribute('stroke', '#28a745')
                                                        }
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Project Tag */}
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '6px 12px',
                                            backgroundColor: '#647FBC',
                                            color: '#fff',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            marginBottom: '16px'
                                        }}>
                                            Project: {application.projectId.title}
                                        </div>

                                        {/* Expandable Cover Letter */}
                                        <div>
                                            <button
                                                onClick={() => setShowDetailsId(showDetailsId === application._id ? null : application._id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#647FBC',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                    marginBottom: '8px'
                                                }}
                                            >
                                                {showDetailsId === application._id ? '▼' : '▶'} Cover Letter & Portfolio
                                            </button>
                                            {showDetailsId === application._id && (
                                                <div style={{
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '16px',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    color: '#333',
                                                    lineHeight: '1.6'
                                                }}>
                                                    <p style={{ marginBottom: '12px' }}>{application.coverLetter}</p>
                                                    {application.portfolioLink && (
                                                        <a
                                                            href={application.portfolioLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: '#647FBC',
                                                                textDecoration: 'none',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            🔗 View Portfolio →
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '60px 20px',
                            borderRadius: '12px',
                            border: '1px solid #e0e0e0',
                            textAlign: 'center'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px' }}>
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                No pending applications
                            </h3>
                            <p style={{ color: '#666' }}>
                                You'll see new applications here as employees apply to your projects
                            </p>
                        </div>
                    )}
                </div>

                {/* Processed Applications */}
                {/* Processed Applications */}
                {processedApplications.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                            Processed Applications ({processedApplications.length})
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {processedApplications.map((application) => (
                                <div
                                    key={application._id}
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                backgroundColor: '#91ADC8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                color: '#fff',
                                                overflow: 'hidden',
                                                flexShrink: 0
                                            }}
                                        >
                                            {application.employeeId.profilePicture ? (
                                                <Image
                                                    src={application.employeeId.profilePicture}
                                                    alt={application.employeeId.name}
                                                    width={50}
                                                    height={50}
                                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                />
                                            ) : (
                                                application.employeeId.name.charAt(0).toUpperCase()
                                            )}
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                                                {application.employeeId.name}
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#666' }}>
                                                {application.employeeId.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            padding: '6px 16px',
                                            backgroundColor: application.status === 'approved' ? '#d4edda' : '#f8d7da',
                                            color: application.status === 'approved' ? '#155724' : '#721c24',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {application.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ApprovalsPage