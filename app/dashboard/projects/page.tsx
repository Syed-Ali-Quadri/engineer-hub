"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardSidebar from '@/components/DashboardSidebar'
import ProjectForm from '@/components/ProjectForm'
import Image from 'next/image'

interface Project {
    id: number
    title: string
    description: string
    coverImage: string
    creator: {
        name: string
        avatar: string
    }
    tags: string[]
    timestamp: string
    cost: number
    duration: string
    status: 'active' | 'inactive' | 'full'
    seats: {
        total: number
        filled: number
    }
    requirements: string[]
    deliverables: string[]
}

const ProjectsPage = () => {
    const { user } = useUser()
    const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || 'client'

    const [showForm, setShowForm] = useState(false)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [showMenu, setShowMenu] = useState<number | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

    const [projects, setProjects] = useState<Project[]>([
        {
            id: 1,
            coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
            title: "E-Commerce Platform Development",
            description: "Building a modern e-commerce platform with payment integration, inventory management, and real-time analytics dashboard for tracking sales and customer behavior.",
            creator: {
                name: user?.firstName + ' ' + user?.lastName || "Sarah Johnson",
                avatar: user?.imageUrl || "https://ui-avatars.com/api/?name=Sarah+Johnson&background=647FBC&color=fff"
            },
            tags: ["Frontend Dev", "Backend Dev", "UI/UX Designer", "DevOps"],
            timestamp: "2 days ago",
            cost: 50000,
            duration: "3 months",
            status: "active",
            seats: { total: 4, filled: 2 },
            requirements: ["React/Next.js expertise", "Node.js backend", "Payment gateway integration", "AWS/Cloud experience"],
            deliverables: ["Complete source code", "Deployment documentation", "User manual", "3 months support"]
        },
        {
            id: 2,
            coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
            title: "Mobile Banking App",
            description: "Secure mobile banking application with biometric authentication, real-time transactions, and spending insights.",
            creator: {
                name: user?.firstName + ' ' + user?.lastName || "Michael Chen",
                avatar: user?.imageUrl || "https://ui-avatars.com/api/?name=Michael+Chen&background=91ADC8&color=fff"
            },
            tags: ["iOS Developer", "Android Dev", "Security Engineer"],
            timestamp: "5 hours ago",
            cost: 80000,
            duration: "4 months",
            status: "full",
            seats: { total: 3, filled: 3 },
            requirements: ["Native mobile development", "Banking security standards", "Biometric integration"],
            deliverables: ["iOS and Android apps", "Security audit report", "API documentation"]
        },
        {
            id: 3,
            coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop",
            title: "AI-Powered Healthcare System",
            description: "Developing an AI-driven healthcare platform for patient diagnosis assistance and medical records management.",
            creator: {
                name: user?.firstName + ' ' + user?.lastName || "Emily Davis",
                avatar: user?.imageUrl || "https://ui-avatars.com/api/?name=Emily+Davis&background=AED6CF&color=fff"
            },
            tags: ["ML Engineer", "Full Stack", "Data Scientist"],
            timestamp: "1 week ago",
            cost: 120000,
            duration: "6 months",
            status: "active",
            seats: { total: 5, filled: 1 },
            requirements: ["Machine Learning expertise", "Healthcare domain knowledge", "Python/TensorFlow"],
            deliverables: ["ML models", "Web platform", "Training data", "Documentation"]
        },
        {
            id: 4,
            coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=200&fit=crop",
            title: "Smart Home Automation",
            description: "IoT-based smart home solution with voice control and energy monitoring.",
            creator: {
                name: user?.firstName + ' ' + user?.lastName || "Alex Kumar",
                avatar: user?.imageUrl || "https://ui-avatars.com/api/?name=Alex+Kumar&background=647FBC&color=fff"
            },
            tags: ["IoT Engineer", "Embedded Systems", "Cloud Architect"],
            timestamp: "3 days ago",
            cost: 35000,
            duration: "2 months",
            status: "inactive",
            seats: { total: 3, filled: 0 },
            requirements: ["IoT protocols", "Embedded C/C++", "Cloud integration"],
            deliverables: ["Hardware setup", "Mobile app", "Cloud backend", "User guide"]
        }
    ])

    const handleCreateProject = (data: any) => {
        const newProject: Project = {
            id: Date.now(),
            title: data.title,
            description: data.description,
            coverImage: data.coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
            creator: {
                name: user?.firstName + ' ' + user?.lastName || "User",
                avatar: user?.imageUrl || "https://ui-avatars.com/api/?name=User&background=647FBC&color=fff"
            },
            tags: data.tags,
            timestamp: "Just now",
            cost: parseInt(data.cost),
            duration: data.duration,
            status: "active",
            seats: { total: parseInt(data.seats), filled: 0 },
            requirements: data.requirements,
            deliverables: data.deliverables
        }
        setProjects([newProject, ...projects])
        setShowForm(false)
    }

    const handleEditProject = (data: any) => {
        if (selectedProject) {
            const updatedProjects = projects.map(p => 
                p.id === selectedProject.id 
                    ? {
                        ...p,
                        title: data.title,
                        description: data.description,
                        coverImage: data.coverImage || p.coverImage,
                        tags: data.tags,
                        cost: parseInt(data.cost),
                        duration: data.duration,
                        seats: { ...p.seats, total: parseInt(data.seats) },
                        requirements: data.requirements,
                        deliverables: data.deliverables
                    }
                    : p
            )
            setProjects(updatedProjects)
            setShowForm(false)
            setSelectedProject(null)
        }
    }

    const handleDeleteProject = (id: number) => {
        setProjects(projects.filter(p => p.id !== id))
        setShowDeleteConfirm(null)
        setShowMenu(null)
    }

    const getStatusBadge = (project: Project) => {
        if (project.status === 'full') {
            return { bg: '#dc3545', text: 'Full' }
        } else if (project.status === 'inactive') {
            return { bg: '#6c757d', text: 'Inactive' }
        } else {
            return { bg: '#28a745', text: 'Active' }
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            My Projects
                        </h1>
                        <p style={{ color: '#666', fontSize: '16px' }}>
                            Manage all your project listings
                        </p>
                    </div>

                    {/* Create Project Button */}
                    <button
                        onClick={() => {
                            setFormMode('create')
                            setSelectedProject(null)
                            setShowForm(true)
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            backgroundColor: '#647FBC',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {projects.map((project) => {
                        const statusBadge = getStatusBadge(project)
                        return (
                            <div
                                key={project.id}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid #e0e0e0',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    position: 'relative'
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
                                    {/* Status Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: statusBadge.bg,
                                        color: '#fff',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {statusBadge.text}
                                    </div>
                                    {/* Three Dots Menu */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px'
                                    }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setShowMenu(showMenu === project.id ? null : project.id)
                                            }}
                                            style={{
                                                background: 'rgba(255,255,255,0.9)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="1"/>
                                                <circle cx="12" cy="5" r="1"/>
                                                <circle cx="12" cy="19" r="1"/>
                                            </svg>
                                        </button>
                                        {/* Dropdown Menu */}
                                        {showMenu === project.id && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '40px',
                                                right: '0',
                                                backgroundColor: '#fff',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                overflow: 'hidden',
                                                minWidth: '150px',
                                                zIndex: 10
                                            }}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProject(project)
                                                        setFormMode('edit')
                                                        setShowForm(true)
                                                        setShowMenu(null)
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: 'none',
                                                        backgroundColor: '#fff',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        color: '#333',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteConfirm(project.id)
                                                        setShowMenu(null)
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 16px',
                                                        border: 'none',
                                                        backgroundColor: '#fff',
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        color: '#dc3545',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 6h18"/>
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '20px' }}>
                                    {/* Title */}
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#333',
                                        marginBottom: '8px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {project.title}
                                    </h3>

                                    {/* Description */}
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#666',
                                        marginBottom: '16px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px',
                                        marginBottom: '16px'
                                    }}>
                                        {project.tags.slice(0, 3).map((tag, index) => (
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

                                    {/* Meta Info */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '16px',
                                        borderTop: '1px solid #e0e0e0'
                                    }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>Cost</p>
                                            <p style={{ fontSize: '16px', fontWeight: '600', color: '#647FBC' }}>₹{project.cost.toLocaleString()}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>Seats</p>
                                            <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{project.seats.filled}/{project.seats.total}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Confirmation Overlay */}
                                {showDeleteConfirm === project.id && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(255,255,255,0.95)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '20px',
                                        zIndex: 20
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="12" y1="8" x2="12" y2="12"/>
                                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                                        </svg>
                                        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px', textAlign: 'center' }}>
                                            Delete Project?
                                        </h4>
                                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
                                            This action cannot be undone.
                                        </p>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                onClick={() => setShowDeleteConfirm(null)}
                                                style={{
                                                    padding: '10px 20px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#fff',
                                                    color: '#666',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProject(project.id)}
                                                style={{
                                                    padding: '10px 20px',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#dc3545',
                                                    color: '#fff',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {projects.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px' }}>
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                        </svg>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            No projects yet
                        </h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            Create your first project to get started
                        </p>
                    </div>
                )}
            </div>

            {/* Project Form Modal */}
            <ProjectForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false)
                    setSelectedProject(null)
                }}
                onSubmit={formMode === 'create' ? handleCreateProject : handleEditProject}
                initialData={selectedProject}
                mode={formMode}
            />
        </div>
    )
}

export default ProjectsPage
