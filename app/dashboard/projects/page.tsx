"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardSidebar from '@/components/DashboardSidebar'
import ProjectForm from '@/components/ProjectForm'
import Image from 'next/image'

interface Project {
    _id: string
    title: string
    description: string
    coverImage: string
    clientId: {
        _id: string
        name: string
        profilePicture: string
    }
    tags: string[]
    cost: number
    duration: string
    status: 'active' | 'inactive' | 'full' | 'completed'
    seatsAvailable: number
    totalSeats: number
    requirements: string[]
    deliverables: string[]
    createdAt: string
    updatedAt: string
}

const ProjectsPage = () => {
    const { user, isLoaded } = useUser()
    const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || 'client'

    const [showForm, setShowForm] = useState(false)
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [showMenu, setShowMenu] = useState<string | null>(null)
    const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusButtonRect, setStatusButtonRect] = useState<DOMRect | null>(null)
    const statusButtonRef = useRef<HTMLButtonElement>(null)

    // Fetch projects on mount
    useEffect(() => {
        if (isLoaded) {
            fetchProjects()
        }
    }, [isLoaded])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/projects')
            const data = await response.json()

            if (data.success) {
                setProjects(data.projects)
            } else {
                setError('Failed to fetch projects')
            }
        } catch (error) {
            console.error('Error fetching projects:', error)
            setError('Failed to load projects')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateProject = async (data: any) => {
        // Prevent employees from creating projects
        if (userRole === 'employee') {
            alert('Only clients can create projects')
            return
        }

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    coverImage: data.coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
                    cost: parseInt(data.cost),
                    duration: data.duration,
                    seatsAvailable: parseInt(data.seats),
                    totalSeats: parseInt(data.seats),
                    tags: data.tags,
                    requirements: data.requirements,
                    deliverables: data.deliverables
                })
            })

            const result = await response.json()

            if (result.success) {
                await fetchProjects() // Refresh the list
                setShowForm(false)
                alert('Project created successfully!')
            } else {
                alert('Failed to create project: ' + result.error)
            }
        } catch (error) {
            console.error('Error creating project:', error)
            alert('Failed to create project')
        }
    }

    const handleEditProject = async (data: any) => {
        if (!selectedProject) return

        try {
            const response = await fetch(`/api/projects/${selectedProject._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    coverImage: data.coverImage,
                    cost: parseInt(data.cost),
                    duration: data.duration,
                    seatsAvailable: parseInt(data.seats),
                    totalSeats: parseInt(data.seats),
                    tags: data.tags,
                    requirements: data.requirements,
                    deliverables: data.deliverables
                })
            })

            const result = await response.json()

            if (result.success) {
                await fetchProjects() // Refresh the list
                setShowForm(false)
                setSelectedProject(null)
                alert('Project updated successfully!')
            } else {
                alert('Failed to update project: ' + result.error)
            }
        } catch (error) {
            console.error('Error updating project:', error)
            alert('Failed to update project')
        }
    }

    const handleDeleteProject = async (id: string) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE'
            })

            const result = await response.json()

            if (result.success) {
                await fetchProjects() // Refresh the list
                setShowDeleteConfirm(null)
                setShowMenu(null)
                alert('Project deleted successfully!')
            } else {
                alert('Failed to delete project: ' + result.error)
            }
        } catch (error) {
            console.error('Error deleting project:', error)
            alert('Failed to delete project')
        }
    }

    const handleStatusChange = async (projectId: string, newStatus: 'active' | 'inactive' | 'completed' | 'full') => {
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            })

            const result = await response.json()

            if (result.success) {
                await fetchProjects()
                setShowStatusMenu(null)
                setShowMenu(null)
                alert('Project status updated successfully!')
            } else {
                alert('Failed to update status: ' + result.error)
            }
        } catch (error) {
            console.error('Error updating status:', error)
            alert('Failed to update status')
        }
    }

    // Show loading state (also wait for user to load to prevent hydration mismatch)
    if (!isLoaded || loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <DashboardSidebar role={userRole} />
                <div style={{ marginLeft: '260px', flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', color: '#666' }}>Loading projects...</div>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <DashboardSidebar role={userRole} />
                <div style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                        <p style={{ color: '#dc3545', fontSize: '18px' }}>{error}</p>
                        <button onClick={fetchProjects} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#647FBC', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'full':
                return { bg: '#dc3545', text: 'Full' }
            case 'inactive':
                return { bg: '#6c757d', text: 'Inactive' }
            case 'completed':
                return { bg: '#647FBC', text: 'Completed' }
            default:
                return { bg: '#28a745', text: 'Active' }
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return '1 day ago'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        return date.toLocaleDateString()
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

                    {/* Create Project Button - Only for clients */}
                    {userRole !== 'employee' && (
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
                    )}
                </div>

                {/* Projects Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '24px'
                }}>
                    {projects.map((project) => {
                        const statusBadge = getStatusBadge(project.status)
                        return (
                            <div
                                key={project._id}
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

                                    {/* Three Dots Menu - Only for clients */}
                                    {userRole !== 'employee' && (
                                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setShowMenu(showMenu === project._id ? null : project._id)
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
                                                <svg width="18" height="18" viewBox="0 0 24 24" stroke="#333" strokeWidth="2" fill="none">
                                                    <circle cx="12" cy="12" r="1" />
                                                    <circle cx="12" cy="5" r="1" />
                                                    <circle cx="12" cy="19" r="1" />
                                                </svg>
                                            </button>

                                            {showMenu === project._id && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '40px',
                                                    right: '0',
                                                    backgroundColor: '#fff',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                    overflow: 'visible',
                                                    minWidth: '150px',
                                                    zIndex: 10
                                                }}>
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => {
                                                            setFormMode('edit')
                                                            setSelectedProject(project)
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
                                                        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    {/* Status Submenu */}
                                                    <div
                                                        style={{ position: 'relative' }}
                                                        onMouseEnter={(e) => {
                                                            setShowStatusMenu(project._id)
                                                            const rect = (e.currentTarget.querySelector('button') as HTMLElement)?.getBoundingClientRect()
                                                            if (rect) setStatusButtonRect(rect)
                                                        }}
                                                        onMouseLeave={() => {
                                                            setShowStatusMenu(null)
                                                            setStatusButtonRect(null)
                                                        }}
                                                    >
                                                        <button
                                                            ref={statusButtonRef}
                                                            style={{
                                                                width: '100%',
                                                                padding: '12px 16px',
                                                                border: 'none',
                                                                backgroundColor: showStatusMenu === project._id ? '#f8f9fa' : '#fff',
                                                                textAlign: 'left',
                                                                cursor: 'pointer',
                                                                fontSize: '14px',
                                                                color: '#333',
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                gap: '8px'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                                                                    <circle cx="12" cy="12" r="10" />
                                                                    <path d="M12 6v6l4 2" />
                                                                </svg>
                                                                Status
                                                            </div>
                                                            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                                                                <path d="M9 18l6-6-6-6" />
                                                            </svg>
                                                        </button>
                                                                    {showStatusMenu === project._id && statusButtonRect && (
                                                                        <div
                                                                            style={{
                                                                                position: 'fixed',
                                                                                left: `${statusButtonRect.right + 8}px`,
                                                                                top: `${statusButtonRect.top}px`,
                                                                                backgroundColor: '#fff',
                                                                                borderRadius: '8px',
                                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                                                overflow: 'hidden',
                                                                                minWidth: '140px',
                                                                                zIndex: 9999,
                                                                                marginLeft: '150px',
                                                                                marginTop: '-12px'
                                                                            }}
                                                                        >
                                                                            <button
                                                                                onClick={() => handleStatusChange(project._id, 'active')}
                                                                                style={{
                                                                                    width: '100%',
                                                                                    padding: '12px 16px',
                                                                                    border: 'none',
                                                                                    backgroundColor: project.status === 'active' ? '#e8f5e9' : '#fff',
                                                                                    textAlign: 'left',
                                                                                    cursor: 'pointer',
                                                                                    fontSize: '14px',
                                                                                    color: '#28a745',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '8px'
                                                                                }}
                                                                            >
                                                                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#28a745' }} />
                                                                                Active
                                                                            </button>

                                                                            <button
                                                                                onClick={() => handleStatusChange(project._id, 'inactive')}
                                                                                style={{
                                                                                    width: '100%',
                                                                                    padding: '12px 16px',
                                                                                    border: 'none',
                                                                                    backgroundColor: project.status === 'inactive' ? '#f5f5f5' : '#fff',
                                                                                    textAlign: 'left',
                                                                                    cursor: 'pointer',
                                                                                    fontSize: '14px',
                                                                                    color: '#6c757d',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '8px'
                                                                                }}
                                                                            >
                                                                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#6c757d' }} />
                                                                                Inactive
                                                                            </button>

                                                                            <button
                                                                                onClick={() => handleStatusChange(project._id, 'completed')}
                                                                                style={{
                                                                                    width: '100%',
                                                                                    padding: '12px 16px',
                                                                                    border: 'none',
                                                                                    backgroundColor: project.status === 'completed' ? '#e3f2fd' : '#fff',
                                                                                    textAlign: 'left',
                                                                                    cursor: 'pointer',
                                                                                    fontSize: '14px',
                                                                                    color: '#647FBC',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '8px'
                                                                                }}
                                                                            >
                                                                                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#647FBC' }} />
                                                                                Completed
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                            </div>

                                                            {/* Delete */}
                                                            <button
                                                                onClick={() => {
                                                                    setShowDeleteConfirm(project._id)
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
                                                                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                                                                    <path d="M3 6h18" />
                                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                    </div>
                                            )}
                                                </div>
                                            )}
                                        </div>


                                {/* Content */}
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
                                                <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{project.totalSeats - project.seatsAvailable}/{project.totalSeats}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Confirmation Overlay */}
                                    {showDeleteConfirm === project._id && (
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
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
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
                                                    onClick={() => handleDeleteProject(project._id)}
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

                {/* Empty State */ }
                        {
                            projects.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px' }}>
                                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                    </svg>
                                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                        No projects yet
                                    </h3>
                                    <p style={{ color: '#666', marginBottom: '20px' }}>
                                        Create your first project to get started
                                    </p>
                                </div>
                            )
                        }
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
