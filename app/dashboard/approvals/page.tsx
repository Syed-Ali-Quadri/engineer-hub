"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardSidebar from '@/components/DashboardSidebar'
import Image from 'next/image'

interface Application {
    id: number
    employeeName: string
    employeeEmail: string
    employeeAvatar: string
    employeeRole: string
    experience: string
    skills: string[]
    projectId: number
    projectTitle: string
    appliedDate: string
    coverLetter: string
    portfolio?: string
    status: 'pending' | 'approved' | 'rejected'
}

const ApprovalsPage = () => {
    const { user } = useUser()
    const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || 'client'

    const [applications, setApplications] = useState<Application[]>([
        {
            id: 1,
            employeeName: "John Doe",
            employeeEmail: "groupera19@gmail.com",
            employeeAvatar: "https://ui-avatars.com/api/?name=John+Doe&background=647FBC&color=fff",
            employeeRole: "Full Stack Developer",
            experience: "5 years",
            skills: ["React", "Node.js", "MongoDB", "AWS"],
            projectId: 1,
            projectTitle: "E-Commerce Platform Development",
            appliedDate: "2 days ago",
            coverLetter: "I am excited to apply for this position. With 5 years of experience in full-stack development, I have successfully delivered multiple e-commerce platforms using React and Node.js. I'm confident I can contribute significantly to this project.",
            portfolio: "https://johndoe.dev",
            status: 'pending'
        },
        {
            id: 2,
            employeeName: "Jane Smith",
            employeeEmail: "jane.smith@example.com",
            employeeAvatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=91ADC8&color=fff",
            employeeRole: "UI/UX Designer",
            experience: "4 years",
            skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
            projectId: 1,
            projectTitle: "E-Commerce Platform Development",
            appliedDate: "1 day ago",
            coverLetter: "I specialize in creating user-centric designs that drive conversions. My portfolio includes several e-commerce projects with proven results in improving user experience and sales.",
            portfolio: "https://janesmith.design",
            status: 'pending'
        },
        {
            id: 3,
            employeeName: "Mike Johnson",
            employeeEmail: "mike.johnson@example.com",
            employeeAvatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=AED6CF&color=fff",
            employeeRole: "Backend Developer",
            experience: "6 years",
            skills: ["Python", "Django", "PostgreSQL", "Redis"],
            projectId: 3,
            projectTitle: "AI-Powered Healthcare System",
            appliedDate: "3 days ago",
            coverLetter: "With extensive experience in healthcare systems and backend development, I'm well-equipped to build robust and secure solutions. I've worked on HIPAA-compliant systems and understand the critical nature of healthcare data.",
            portfolio: "https://mikej.dev",
            status: 'pending'
        }
    ])

    const [processingId, setProcessingId] = useState<number | null>(null)
    const [showDetailsId, setShowDetailsId] = useState<number | null>(null)

    const handleApprove = async (application: Application) => {
        setProcessingId(application.id)
        
        try {
            const response = await fetch('/api/send-approval-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeEmail: application.employeeEmail,
                    employeeName: application.employeeName,
                    projectTitle: application.projectTitle,
                    clientName: user?.firstName + ' ' + user?.lastName || 'Client',
                    action: 'approve'
                }),
            })

            const data = await response.json()

            if (data.success) {
                // Update application status
                setApplications(applications.map(app =>
                    app.id === application.id
                        ? { ...app, status: 'approved' as const }
                        : app
                ))
                alert('Application approved! Email sent to employee.')
            } else {
                alert('Application approved locally, but email failed to send. Please check SMTP configuration.')
                // Still update status even if email fails
                setApplications(applications.map(app =>
                    app.id === application.id
                        ? { ...app, status: 'approved' as const }
                        : app
                ))
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Application approved locally, but email service is not configured.')
            // Update status anyway
            setApplications(applications.map(app =>
                app.id === application.id
                    ? { ...app, status: 'approved' as const }
                    : app
            ))
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (application: Application) => {
        setProcessingId(application.id)
        
        try {
            const response = await fetch('/api/send-approval-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeEmail: application.employeeEmail,
                    employeeName: application.employeeName,
                    projectTitle: application.projectTitle,
                    clientName: user?.firstName + ' ' + user?.lastName || 'Client',
                    action: 'reject'
                }),
            })

            const data = await response.json()

            if (data.success) {
                setApplications(applications.map(app =>
                    app.id === application.id
                        ? { ...app, status: 'rejected' as const }
                        : app
                ))
                alert('Application rejected. Email sent to employee.')
            } else {
                alert('Application rejected locally, but email failed to send.')
                setApplications(applications.map(app =>
                    app.id === application.id
                        ? { ...app, status: 'rejected' as const }
                        : app
                ))
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Application rejected locally, but email service is not configured.')
            setApplications(applications.map(app =>
                app.id === application.id
                    ? { ...app, status: 'rejected' as const }
                    : app
            ))
        } finally {
            setProcessingId(null)
        }
    }

    const pendingApplications = applications.filter(app => app.status === 'pending')
    const processedApplications = applications.filter(app => app.status !== 'pending')

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <DashboardSidebar role={userRole} />
            
            <div style={{ 
                marginLeft: '260px',
                flex: 1,
                padding: '40px'
            }}>
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

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Pending</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>{pendingApplications.length}</p>
                    </div>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Approved</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#28a745' }}>
                            {applications.filter(app => app.status === 'approved').length}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Rejected</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#dc3545' }}>
                            {applications.filter(app => app.status === 'rejected').length}
                        </p>
                    </div>
                </div>

                {/* Pending Applications */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                        Pending Applications ({pendingApplications.length})
                    </h2>
                    {pendingApplications.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {pendingApplications.map((application) => (
                                <div
                                    key={application.id}
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
                                            <Image
                                                src={application.employeeAvatar}
                                                alt={application.employeeName}
                                                width={80}
                                                height={80}
                                                style={{ borderRadius: '50%' }}
                                            />
                                            
                                            {/* Info */}
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                                                    {application.employeeName}
                                                </h3>
                                                <p style={{ fontSize: '15px', color: '#647FBC', marginBottom: '8px' }}>
                                                    {application.employeeRole}
                                                </p>
                                                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                                                    <span>📧 {application.employeeEmail}</span>
                                                    <span>💼 {application.experience} experience</span>
                                                    <span>🕒 Applied {application.appliedDate}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <button
                                                    onClick={() => handleReject(application)}
                                                    disabled={processingId === application.id}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '50%',
                                                        border: '2px solid #dc3545',
                                                        backgroundColor: '#fff',
                                                        cursor: processingId === application.id ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        opacity: processingId === application.id ? 0.5 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (processingId !== application.id) {
                                                            e.currentTarget.style.backgroundColor = '#dc3545'
                                                            const svg = e.currentTarget.querySelector('svg')
                                                            if (svg) svg.setAttribute('stroke', '#fff')
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (processingId !== application.id) {
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
                                                    disabled={processingId === application.id}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '50%',
                                                        border: '2px solid #28a745',
                                                        backgroundColor: '#fff',
                                                        cursor: processingId === application.id ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        opacity: processingId === application.id ? 0.5 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (processingId !== application.id) {
                                                            e.currentTarget.style.backgroundColor = '#28a745'
                                                            const svg = e.currentTarget.querySelector('svg')
                                                            if (svg) svg.setAttribute('stroke', '#fff')
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (processingId !== application.id) {
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
                                            Project: {application.projectTitle}
                                        </div>

                                        {/* Skills */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Skills:</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {application.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            padding: '4px 12px',
                                                            backgroundColor: '#AED6CF',
                                                            color: '#111',
                                                            borderRadius: '12px',
                                                            fontSize: '13px'
                                                        }}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Expandable Cover Letter */}
                                        <div>
                                            <button
                                                onClick={() => setShowDetailsId(showDetailsId === application.id ? null : application.id)}
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
                                                {showDetailsId === application.id ? '▼' : '▶'} Cover Letter & Portfolio
                                            </button>
                                            {showDetailsId === application.id && (
                                                <div style={{
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '16px',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    color: '#333',
                                                    lineHeight: '1.6'
                                                }}>
                                                    <p style={{ marginBottom: '12px' }}>{application.coverLetter}</p>
                                                    {application.portfolio && (
                                                        <a
                                                            href={application.portfolio}
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
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
                {processedApplications.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                            Processed Applications ({processedApplications.length})
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {processedApplications.map((application) => (
                                <div
                                    key={application.id}
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <Image
                                            src={application.employeeAvatar}
                                            alt={application.employeeName}
                                            width={50}
                                            height={50}
                                            style={{ borderRadius: '50%' }}
                                        />
                                        <div>
                                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '2px' }}>
                                                {application.employeeName}
                                            </h4>
                                            <p style={{ fontSize: '14px', color: '#666' }}>{application.projectTitle}</p>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '6px 16px',
                                        backgroundColor: application.status === 'approved' ? '#d4edda' : '#f8d7da',
                                        color: application.status === 'approved' ? '#155724' : '#721c24',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
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
