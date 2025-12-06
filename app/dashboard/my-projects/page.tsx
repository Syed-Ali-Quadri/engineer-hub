"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardSidebar from '@/components/DashboardSideBar'
import Image from 'next/image'

interface MyProject {
    id: number
    title: string
    description: string
    client: {
        name: string
        avatar: string
    }
    status: 'in-progress' | 'completed' | 'pending'
    payment: number
    deadline: string
    progress: number
    startDate: string
}

const MyProjectsPage = () => {
    const { user } = useUser()
    const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || 'employee'

    const [myProjects] = useState<MyProject[]>([
        {
            id: 1,
            title: "E-Commerce Platform Development",
            description: "Building frontend components and integrating payment gateway for the e-commerce platform.",
            client: {
                name: "Sarah Johnson",
                avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=647FBC&color=fff"
            },
            status: 'in-progress',
            payment: 50000,
            deadline: "2024-03-15",
            progress: 65,
            startDate: "2024-01-10"
        },
        {
            id: 2,
            title: "Mobile Banking App",
            description: "Developing secure authentication module and transaction features for iOS platform.",
            client: {
                name: "Michael Chen",
                avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=91ADC8&color=fff"
            },
            status: 'in-progress',
            payment: 80000,
            deadline: "2024-04-20",
            progress: 40,
            startDate: "2024-02-01"
        },
        {
            id: 3,
            title: "Smart Home Automation",
            description: "Completed IoT integration and cloud backend setup for smart home devices.",
            client: {
                name: "Alex Kumar",
                avatar: "https://ui-avatars.com/api/?name=Alex+Kumar&background=AED6CF&color=fff"
            },
            status: 'completed',
            payment: 35000,
            deadline: "2024-01-30",
            progress: 100,
            startDate: "2023-12-01"
        },
        {
            id: 4,
            title: "Social Media Analytics Dashboard",
            description: "Waiting for client approval to start building real-time analytics dashboard.",
            client: {
                name: "Emma Wilson",
                avatar: "https://ui-avatars.com/api/?name=Emma+Wilson&background=ffc107&color=fff"
            },
            status: 'pending',
            payment: 45000,
            deadline: "2024-05-10",
            progress: 0,
            startDate: "Pending approval"
        }
    ])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'in-progress':
                return { bg: '#ffc107', text: 'In Progress' }
            case 'completed':
                return { bg: '#28a745', text: 'Completed' }
            case 'pending':
                return { bg: '#6c757d', text: 'Pending' }
            default:
                return { bg: '#6c757d', text: 'Unknown' }
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
                        My Projects
                    </h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        Track and manage your assigned projects
                    </p>
                </div>

                {/* Stats Summary */}
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
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Projects</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#647FBC' }}>{myProjects.length}</p>
                    </div>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>In Progress</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>
                            {myProjects.filter(p => p.status === 'in-progress').length}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Completed</p>
                        <p style={{ fontSize: '32px', fontWeight: '700', color: '#28a745' }}>
                            {myProjects.filter(p => p.status === 'completed').length}
                        </p>
                    </div>
                </div>

                {/* Projects List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {myProjects.map((project) => {
                        const statusBadge = getStatusBadge(project.status)
                        return (
                            <div
                                key={project.id}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0',
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <div style={{ padding: '24px' }}>
                                    {/* Header with Status */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                                {project.title}
                                            </h3>
                                            <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                                                {project.description}
                                            </p>
                                        </div>
                                        <div style={{
                                            padding: '6px 16px',
                                            backgroundColor: statusBadge.bg,
                                            color: '#fff',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            marginLeft: '20px'
                                        }}>
                                            {statusBadge.text}
                                        </div>
                                    </div>

                                    {/* Client Info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <Image
                                            src={project.client.avatar}
                                            alt={project.client.name}
                                            width={40}
                                            height={40}
                                            style={{ borderRadius: '50%' }}
                                        />
                                        <div>
                                            <p style={{ fontSize: '13px', color: '#999' }}>Client</p>
                                            <p style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>{project.client.name}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    {project.status !== 'pending' && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '13px', color: '#666' }}>Progress</span>
                                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{project.progress}%</span>
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '8px',
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${project.progress}%`,
                                                    height: '100%',
                                                    backgroundColor: project.status === 'completed' ? '#28a745' : '#647FBC',
                                                    transition: 'width 0.3s'
                                                }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Project Details */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '20px',
                                        paddingTop: '16px',
                                        borderTop: '1px solid #e0e0e0'
                                    }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Payment</p>
                                            <p style={{ fontSize: '16px', fontWeight: '600', color: '#28a745' }}>₹{project.payment.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Deadline</p>
                                            <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{project.deadline}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Started</p>
                                            <p style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{project.startDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {myProjects.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px' }}>
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            No projects yet
                        </h3>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            Apply to available projects to start working
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyProjectsPage
