"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardSidebar from '@/components/DashboardSidebar'
import Image from 'next/image'

interface AvailableProject {
    id: number
    title: string
    description: string
    coverImage: string
    client: {
        name: string
        avatar: string
        rating: number
    }
    tags: string[]
    payment: number
    duration: string
    seatsAvailable: number
    totalSeats: number
    postedDate: string
    requirements: string[]
    hasApplied: boolean
}

const AvailableProjectsPage = () => {
    const { user } = useUser()
    const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || 'employee'

    const [projects, setProjects] = useState<AvailableProject[]>([
        {
            id: 1,
            title: "AI-Powered Healthcare System",
            description: "Developing an AI-driven healthcare platform for patient diagnosis assistance and medical records management with machine learning integration.",
            coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop",
            client: {
                name: "Emily Davis",
                avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=AED6CF&color=fff",
                rating: 4.9
            },
            tags: ["Machine Learning", "Python", "Healthcare"],
            payment: 120000,
            duration: "6 months",
            seatsAvailable: 4,
            totalSeats: 5,
            postedDate: "2 days ago",
            requirements: ["ML expertise", "Python/TensorFlow", "Healthcare domain knowledge"],
            hasApplied: false
        },
        {
            id: 2,
            title: "Fintech Mobile Application",
            description: "Building a secure fintech mobile app with real-time stock trading, portfolio management, and financial analytics.",
            coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
            client: {
                name: "Robert Smith",
                avatar: "https://ui-avatars.com/api/?name=Robert+Smith&background=647FBC&color=fff",
                rating: 4.7
            },
            tags: ["React Native", "Node.js", "Finance"],
            payment: 95000,
            duration: "4 months",
            seatsAvailable: 2,
            totalSeats: 3,
            postedDate: "5 hours ago",
            requirements: ["Mobile development", "Security best practices", "API integration"],
            hasApplied: true
        },
        {
            id: 3,
            title: "Real Estate Platform",
            description: "Creating a comprehensive real estate marketplace with 3D property tours, mortgage calculators, and booking system.",
            coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop",
            client: {
                name: "Lisa Anderson",
                avatar: "https://ui-avatars.com/api/?name=Lisa+Anderson&background=91ADC8&color=fff",
                rating: 4.8
            },
            tags: ["Full Stack", "3D Graphics", "Payment Integration"],
            payment: 85000,
            duration: "5 months",
            seatsAvailable: 3,
            totalSeats: 4,
            postedDate: "1 day ago",
            requirements: ["React/Next.js", "Three.js", "Payment gateways"],
            hasApplied: false
        },
        {
            id: 4,
            title: "Educational Learning Platform",
            description: "Building an interactive e-learning platform with video streaming, live classes, quizzes, and progress tracking.",
            coverImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=200&fit=crop",
            client: {
                name: "David Kim",
                avatar: "https://ui-avatars.com/api/?name=David+Kim&background=ffc107&color=fff",
                rating: 4.6
            },
            tags: ["Video Streaming", "WebRTC", "MongoDB"],
            payment: 75000,
            duration: "3 months",
            seatsAvailable: 2,
            totalSeats: 3,
            postedDate: "3 days ago",
            requirements: ["MERN Stack", "Video streaming", "Real-time features"],
            hasApplied: false
        }
    ])

    const [selectedProject, setSelectedProject] = useState<AvailableProject | null>(null)
    const [showApplicationForm, setShowApplicationForm] = useState(false)
    const [applicationData, setApplicationData] = useState({
        coverLetter: '',
        expectedSalary: '',
        portfolio: ''
    })

    const handleApply = (project: AvailableProject) => {
        setSelectedProject(project)
        setShowApplicationForm(true)
    }

    const handleSubmitApplication = () => {
        if (selectedProject) {
            setProjects(projects.map(p => 
                p.id === selectedProject.id ? { ...p, hasApplied: true } : p
            ))
            setShowApplicationForm(false)
            setApplicationData({ coverLetter: '', expectedSalary: '', portfolio: '' })
            alert('Application submitted successfully!')
        }
    }

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
                        Available Projects
                    </h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        Browse and apply to projects that match your skills
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
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Available Projects</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#647FBC' }}>{projects.length}</p>
                    </div>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Applied</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#28a745' }}>
                            {projects.filter(p => p.hasApplied).length}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Open Seats</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>
                            {projects.reduce((sum, p) => sum + p.seatsAvailable, 0)}
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            {/* Cover Image */}
                            <div style={{ position: 'relative', height: '180px' }}>
                                <Image
                                    src={project.coverImage}
                                    alt={project.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                {/* Seats Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    backgroundColor: project.seatsAvailable > 0 ? '#28a745' : '#dc3545',
                                    color: '#fff',
                                    padding: '6px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {project.seatsAvailable}/{project.totalSeats} Seats
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '20px' }}>
                                {/* Title */}
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: '8px'
                                }}>
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    fontSize: '14px',
                                    color: '#666',
                                    marginBottom: '16px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: '1.5'
                                }}>
                                    {project.description}
                                </p>

                                {/* Client Info */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <Image
                                        src={project.client.avatar}
                                        alt={project.client.name}
                                        width={36}
                                        height={36}
                                        style={{ borderRadius: '50%' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{project.client.name}</p>
                                        <p style={{ fontSize: '12px', color: '#666' }}>
                                            ⭐ {project.client.rating} • Posted {project.postedDate}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    marginBottom: '16px'
                                }}>
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                padding: '4px 10px',
                                                backgroundColor: '#AED6CF',
                                                color: '#111',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Requirements */}
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Requirements:</p>
                                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#666' }}>
                                        {project.requirements.slice(0, 2).map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Footer */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #e0e0e0'
                                }}>
                                    <div>
                                        <p style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>Payment</p>
                                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#28a745' }}>₹{project.payment.toLocaleString()}</p>
                                        <p style={{ fontSize: '11px', color: '#999' }}>{project.duration}</p>
                                    </div>
                                    <button
                                        onClick={() => handleApply(project)}
                                        disabled={project.hasApplied}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: project.hasApplied ? '#6c757d' : '#647FBC',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: project.hasApplied ? 'not-allowed' : 'pointer',
                                            opacity: project.hasApplied ? 0.6 : 1
                                        }}
                                    >
                                        {project.hasApplied ? 'Applied' : 'Apply Now'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Application Form Modal */}
            {showApplicationForm && selectedProject && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#333', marginBottom: '8px' }}>
                            Apply to {selectedProject.title}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                            Fill in the details to submit your application
                        </p>

                        {/* Cover Letter */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '8px' }}>
                                Cover Letter *
                            </label>
                            <textarea
                                value={applicationData.coverLetter}
                                onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                placeholder="Tell the client why you're the best fit for this project..."
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {/* Expected Salary */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '8px' }}>
                                Expected Salary *
                            </label>
                            <input
                                type="text"
                                value={applicationData.expectedSalary}
                                onChange={(e) => setApplicationData({ ...applicationData, expectedSalary: e.target.value })}
                                placeholder="Enter your expected payment"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                            <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                Project budget: ₹{selectedProject.payment.toLocaleString()}
                            </p>
                        </div>

                        {/* Portfolio Link */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '8px' }}>
                                Portfolio / Website
                            </label>
                            <input
                                type="url"
                                value={applicationData.portfolio}
                                onChange={(e) => setApplicationData({ ...applicationData, portfolio: e.target.value })}
                                placeholder="https://yourportfolio.com"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowApplicationForm(false)
                                    setApplicationData({ coverLetter: '', expectedSalary: '', portfolio: '' })
                                }}
                                style={{
                                    padding: '12px 24px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    color: '#666',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitApplication}
                                disabled={!applicationData.coverLetter || !applicationData.expectedSalary}
                                style={{
                                    padding: '12px 24px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    backgroundColor: applicationData.coverLetter && applicationData.expectedSalary ? '#647FBC' : '#ccc',
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: applicationData.coverLetter && applicationData.expectedSalary ? 'pointer' : 'not-allowed'
                                }}
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AvailableProjectsPage
