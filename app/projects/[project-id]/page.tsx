"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'

interface ProjectData {
    _id: string
    coverImage: string
    title: string
    description: string
    clientId: {
        _id: string
        name: string
        profilePicture?: string
    }
    tags: string[]
    createdAt: string
    cost: number
    duration: string
    requirements: string[]
    deliverables: string[]
    status: 'active' | 'inactive' | 'full' | 'completed'
    seatsAvailable: number
    totalSeats: number
}

const ProjectDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const { user, isLoaded } = useUser()
    const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || null
    const projectId = params['project-id']
    
    const [project, setProject] = useState<ProjectData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showApplicationModal, setShowApplicationModal] = useState(false)
    const [applicationData, setApplicationData] = useState({
        coverLetter: '',
        expectedSalary: '',
        portfolioLink: ''
    })
    const [applying, setApplying] = useState(false)
    const [hasApplied, setHasApplied] = useState(false)
    
    useEffect(() => {
        if (projectId && isLoaded) {
            fetchProject()
            if (userRole === 'employee') {
                checkIfApplied()
            }
        }
    }, [projectId, isLoaded])

    const checkIfApplied = async () => {
        try {
            const response = await fetch('/api/applications')
            const data = await response.json()
            
            if (data.success) {
                const applied = data.applications.some(
                    (app: any) => app.projectId._id === projectId
                )
                setHasApplied(applied)
            }
        } catch (error) {
            setLoading(false)
        }
    }

    const handleApplySubmit = async () => {
        if (!applicationData.coverLetter) {
            alert('Please provide a cover letter')
            return
        }

        try {
            setApplying(true)
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId,
                    ...applicationData
                })
            })

            const result = await response.json()

            if (result.success) {
                alert('Application submitted successfully!')
                setShowApplicationModal(false)
                setHasApplied(true)
                setApplicationData({
                    coverLetter: '',
                    expectedSalary: '',
                    portfolioLink: ''
                })
                // Refresh project to update seats
                fetchProject()
            } else {
                alert('Failed to submit application: ' + result.error)
            }
        } catch (error) {
            console.error('Error submitting application:', error)
            alert('Failed to submit application')
        } finally {
            setApplying(false)
        }
    }

    const fetchProject = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/projects/${projectId}`)
            const data = await response.json()
            
            if (data.success) {
                setProject(data.project)
            } else {
                setError('Project not found')
            }
        } catch (error) {
            console.error('Error fetching project:', error)
            setError('Failed to load project')
        } finally {
            setLoading(false)
        }
    }
    
    if (!isLoaded || loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                padding: '40px'
            }}>
                <div style={{ textAlign: 'center', color: '#647FBC' }}>
                    <div style={{ fontSize: '20px' }}>Loading project...</div>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                padding: '40px'
            }}>
                <div style={{ textAlign: 'center', color: '#647FBC' }}>
                    <h2>{error || 'Project not found'}</h2>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            marginTop: '20px',
                            padding: '12px 20px',
                            backgroundColor: '#647FBC',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#4CAF50'
            case 'inactive': return '#6c757d'
            case 'full': return '#dc3545'
            case 'completed': return '#647FBC'
            default: return '#999'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Active'
            case 'inactive': return 'Inactive'
            case 'full': return 'Full'
            case 'completed': return 'Completed'
            default: return status
        }
    }
    
    return (
        <>
            {/* Back to Home Navigation */}
            <div style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #e0e0e0',
                padding: '1px 0'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '15px',
                            color: '#647FBC',
                            fontWeight: '500',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f5f5'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Home
                    </button>
                </div>
            </div>

            <div style={{
                backgroundColor: '#f9fafb',
                minHeight: '100vh'
            }}>
            {/* Cover Image */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                backgroundColor: '#AED6CF'
            }}>
                <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: '40px'
                }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        backgroundColor: getStatusColor(project.status),
                        color: '#fff',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                    }}>
                        {getStatusLabel(project.status)}
                    </div>
                </div>
            </div>
            
            {/* Content Section */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '40px'
                }}>
                    {/* Left Column - Main Content */}
                    <div>
                        {/* Author & Timestamp */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '30px',
                            padding: '20px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{
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
                                    overflow: 'hidden'
                                }}>
                                    {project.clientId.profilePicture ? (
                                        <Image
                                            src={project.clientId.profilePicture}
                                            alt={project.clientId.name}
                                            width={50}
                                            height={50}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        project.clientId.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }}>
                                        {project.clientId.name}
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#888'
                                    }}>
                                        Posted {new Date(project.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Description */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '30px',
                            borderRadius: '12px',
                            marginBottom: '30px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#647FBC',
                                marginBottom: '16px'
                            }}>
                                Project Description
                            </h2>
                            <p style={{
                                fontSize: '16px',
                                lineHeight: '1.7',
                                color: '#555',
                                margin: 0
                            }}>
                                {project.description}
                            </p>
                        </div>
                        
                        {/* Requirements */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '30px',
                            borderRadius: '12px',
                            marginBottom: '30px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#647FBC',
                                marginBottom: '16px'
                            }}>
                                Requirements
                            </h2>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {project.requirements.map((req, index) => (
                                    <li key={index} style={{
                                        fontSize: '15px',
                                        color: '#555',
                                        marginBottom: '12px',
                                        paddingLeft: '24px',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#AED6CF',
                                            fontSize: '20px'
                                        }}>✓</span>
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Deliverables */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '30px',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#647FBC',
                                marginBottom: '16px'
                            }}>
                                Deliverables
                            </h2>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {project.deliverables.map((del, index) => (
                                    <li key={index} style={{
                                        fontSize: '15px',
                                        color: '#555',
                                        marginBottom: '12px',
                                        paddingLeft: '24px',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#91ADC8',
                                            fontSize: '20px'
                                        }}>📦</span>
                                        {del}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Right Column - Sidebar */}
                    <div>
                        {/* Project Info Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '30px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            position: 'sticky',
                            top: '20px'
                        }}>
                            <div style={{
                                marginBottom: '24px',
                                paddingBottom: '24px',
                                borderBottom: '1px solid #e0e0e0'
                            }}>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#888',
                                    marginBottom: '8px'
                                }}>
                                    Project Budget
                                </div>
                                <div style={{
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    color: '#647FBC'
                                }}>
                                    ₹{project.cost.toLocaleString()}
                                </div>
                            </div>
                            
                            <div style={{
                                marginBottom: '24px',
                                paddingBottom: '24px',
                                borderBottom: '1px solid #e0e0e0'
                            }}>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#888',
                                    marginBottom: '8px'
                                }}>
                                    Duration
                                </div>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    {project.duration}
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#888',
                                    marginBottom: '8px'
                                }}>
                                    Available Seats
                                </div>
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    {project.seatsAvailable} / {project.totalSeats}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#888',
                                    marginBottom: '12px'
                                }}>
                                    Required Skills
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px'
                                }}>
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                padding: '6px 14px',
                                                backgroundColor: '#AED6CF',
                                                color: '#111',
                                                borderRadius: '16px',
                                                fontSize: '13px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Apply Button - Only for employees */}
                            {userRole === 'employee' && (
                                <button 
                                    onClick={() => setShowApplicationModal(true)}
                                    disabled={hasApplied || project.status !== 'active' || project.seatsAvailable === 0}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        backgroundColor: hasApplied || project.status !== 'active' || project.seatsAvailable === 0 ? '#ccc' : '#647FBC',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: hasApplied || project.status !== 'active' || project.seatsAvailable === 0 ? 'not-allowed' : 'pointer',
                                        transition: 'background 0.2s',
                                        marginBottom: '12px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!hasApplied && project.status === 'active' && project.seatsAvailable > 0) {
                                            e.currentTarget.style.backgroundColor = '#5570a8'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!hasApplied && project.status === 'active' && project.seatsAvailable > 0) {
                                            e.currentTarget.style.backgroundColor = '#647FBC'
                                        }
                                    }}
                                >
                                    {hasApplied ? 'Already Applied' : 
                                     project.seatsAvailable === 0 ? 'No Seats Available' :
                                     project.status !== 'active' ? 'Applications Closed' :
                                     'Apply for Project'}
                                </button>
                            )}
                            
                            <button
                                onClick={() => router.push('/')}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: 'transparent',
                                    color: '#647FBC',
                                    border: '2px solid #647FBC',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#647FBC'
                                    e.currentTarget.style.color = '#fff'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.color = '#647FBC'
                                }}
                            >
                                Back to Projects
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* Application Modal */}
            {showApplicationModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }} onClick={() => setShowApplicationModal(false)}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '32px'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>
                                Apply for Project
                            </h2>
                            <button
                                onClick={() => setShowApplicationModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Cover Letter */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                Cover Letter *
                            </label>
                            <textarea
                                value={applicationData.coverLetter}
                                onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                required
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                                placeholder="Tell the client why you're the perfect fit for this project..."
                            />
                        </div>

                        {/* Expected Salary */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                Expected Salary (₹)
                            </label>
                            <input
                                type="number"
                                value={applicationData.expectedSalary}
                                onChange={(e) => setApplicationData({ ...applicationData, expectedSalary: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                                placeholder="Your expected compensation"
                            />
                        </div>

                        {/* Portfolio Link */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                Portfolio Link
                            </label>
                            <input
                                type="url"
                                value={applicationData.portfolioLink}
                                onChange={(e) => setApplicationData({ ...applicationData, portfolioLink: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                                placeholder="https://your-portfolio.com"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowApplicationModal(false)}
                                disabled={applying}
                                style={{
                                    padding: '12px 24px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    color: '#666',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    cursor: applying ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplySubmit}
                                disabled={applying}
                                style={{
                                    padding: '12px 24px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    backgroundColor: applying ? '#ccc' : '#647FBC',
                                    color: '#fff',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    cursor: applying ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProjectDetailPage