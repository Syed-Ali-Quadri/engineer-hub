"use client"

import ProjectCard from '@/components/ProjectCard'
import React, { useState, useEffect } from 'react'

const CardsComponent = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

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

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                padding: '40px'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: '#647FBC'
                }}>
                    <div style={{
                        fontSize: '20px',
                        color: '#666'
                    }}>Loading projects...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                padding: '40px'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: '#dc3545'
                }}>
                    <p style={{ fontSize: '18px', marginBottom: '16px' }}>{error}</p>
                    <button 
                        onClick={fetchProjects}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#647FBC',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (projects.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                padding: '40px'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: '#647FBC'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px'
                    }}>📂</div>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#647FBC'
                    }}>No Projects Available</h2>
                    <p style={{
                        fontSize: '16px',
                        color: '#91ADC8'
                    }}>There are no projects to display at the moment.</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
            padding: '20px',
            maxWidth: '1400px',
            margin: '0 auto'
        }}>
            {projects.map((project: any) => (
                <ProjectCard
                    key={project._id}
                    id={project._id}
                    coverImage={project.coverImage}
                    title={project.title}
                    description={project.description}
                    creator={{
                        name: project.clientId?.name || 'Unknown'
                    }}
                    tags={project.tags}
                    timestamp={new Date(project.createdAt).toLocaleDateString()}
                />
            ))}
        </div>
    )
}

export default CardsComponent