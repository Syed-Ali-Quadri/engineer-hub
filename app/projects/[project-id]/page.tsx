"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProjectData {
    id: number
    coverImage: string
    title: string
    description: string
    creator: {
        name: string
        avatar?: string
    }
    tags: string[]
    timestamp: string
    cost: number
    duration: string
    requirements: string[]
    deliverables: string[]
    status: 'open' | 'in-progress' | 'completed'
}

const ProjectDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const projectId = params['project-id']
    
    const [project, setProject] = useState<ProjectData | null>(null)
    
    // Mock data - replace with API call
    const mockProjects: ProjectData[] = [
        {
            id: 1,
            coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
            title: "E-Commerce Platform Development",
            description: "Building a modern e-commerce platform with payment integration, inventory management, and real-time analytics dashboard for tracking sales and customer behavior. This project requires a team of experienced developers who can work on both frontend and backend systems. The platform should support multiple payment gateways, have a responsive design, and include features like product reviews, wishlists, and order tracking.",
            creator: {
                name: "Sarah Johnson",
                avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=91ADC8&color=fff"
            },
            tags: ["Frontend Dev", "Backend Dev", "UI/UX Designer", "DevOps"],
            timestamp: "2 days ago",
            cost: 5000,
            duration: "3-4 months",
            requirements: [
                "5+ years of experience in full-stack development",
                "Proficiency in React, Node.js, and MongoDB",
                "Experience with payment gateway integration",
                "Knowledge of cloud deployment (AWS/Azure)",
                "Strong understanding of security best practices"
            ],
            deliverables: [
                "Fully functional e-commerce website",
                "Admin dashboard for inventory management",
                "Payment gateway integration",
                "User authentication and authorization",
                "Responsive mobile design",
                "Comprehensive documentation"
            ],
            status: "open"
        },
        {
            id: 2,
            coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop",
            title: "Mobile Banking App",
            description: "Secure mobile banking application with biometric authentication, real-time transactions, and spending insights for modern banking experience.",
            creator: {
                name: "Michael Chen"
            },
            tags: ["iOS Developer", "Android Dev", "Security Engineer"],
            timestamp: "5 hours ago",
            cost: 8000,
            duration: "4-6 months",
            requirements: [
                "Experience in native iOS and Android development",
                "Knowledge of banking security standards",
                "Biometric authentication implementation",
                "Real-time data synchronization"
            ],
            deliverables: [
                "iOS and Android applications",
                "Secure authentication system",
                "Transaction processing module",
                "Spending analytics dashboard"
            ],
            status: "open"
        },
        {
            id: 3,
            coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop",
            title: "AI-Powered Healthcare System",
            description: "Developing an AI-driven healthcare platform for patient diagnosis assistance, appointment scheduling, and medical records management.",
            creator: {
                name: "Emily Davis"
            },
            tags: ["ML Engineer", "Full Stack", "Data Scientist"],
            timestamp: "1 week ago",
            cost: 12000,
            duration: "6-8 months",
            requirements: [
                "Machine learning expertise",
                "Healthcare domain knowledge",
                "HIPAA compliance understanding",
                "Python, TensorFlow experience"
            ],
            deliverables: [
                "AI diagnosis assistance module",
                "Appointment scheduling system",
                "Medical records database",
                "Patient portal interface"
            ],
            status: "in-progress"
        },
        {
            id: 4,
            coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=400&fit=crop",
            title: "Smart Home Automation",
            description: "IoT-based smart home solution with voice control, energy monitoring, and automated security systems for modern living.",
            creator: {
                name: "Alex Kumar"
            },
            tags: ["IoT Engineer", "Embedded Systems", "Cloud Architect"],
            timestamp: "3 days ago",
            cost: 6500,
            duration: "4-5 months",
            requirements: [
                "IoT device integration experience",
                "Embedded systems programming",
                "Cloud architecture knowledge",
                "Voice assistant API integration"
            ],
            deliverables: [
                "Smart home hub application",
                "Device integration framework",
                "Voice control system",
                "Energy monitoring dashboard"
            ],
            status: "open"
        }
    ]
    
    useEffect(() => {
        const foundProject = mockProjects.find(p => p.id === Number(projectId))
        setProject(foundProject || null)
    }, [projectId])
    
    if (!project) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                padding: '40px'
            }}>
                <div style={{ textAlign: 'center', color: '#647FBC' }}>
                    <h2>Project not found</h2>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            marginTop: '20px',
                            padding: '1px 20px',
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
            case 'open': return '#4CAF50'
            case 'in-progress': return '#FF9800'
            case 'completed': return '#647FBC'
            default: return '#999'
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
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        <h1 style={{
                            color: '#fff',
                            fontSize: '36px',
                            fontWeight: '700',
                            margin: '0 0 12px 0'
                        }}>
                            {project.title}
                        </h1>
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
                            {project.status.replace('-', ' ')}
                        </div>
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
                                    {project.creator.avatar ? (
                                        <Image
                                            src={project.creator.avatar}
                                            alt={project.creator.name}
                                            width={50}
                                            height={50}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        project.creator.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#333'
                                    }}>
                                        {project.creator.name}
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#888'
                                    }}>
                                        Posted {project.timestamp}
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
                                    ${project.cost.toLocaleString()}
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
                            
                            <button style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#647FBC',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                                marginBottom: '12px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#5570a8'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#647FBC'
                            }}>
                                Apply for Project
                            </button>
                            
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
        </>
    )
}

export default ProjectDetailPage