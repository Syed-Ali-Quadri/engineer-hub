"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'

const NavBar = () => {
    const { isSignedIn } = useUser()
    const router = useRouter()
    const pathname = usePathname()
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [projectDetails, setProjectDetails] = useState([
        {
            id: 1,
            coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
            title: "E-Commerce Platform Development",
            description: "Building a modern e-commerce platform with payment integration, inventory management, and real-time analytics dashboard for tracking sales and customer behavior.",
            creator: {
                name: "Sarah Johnson"
            },
            tags: ["Frontend Dev", "Backend Dev", "UI/UX Designer", "DevOps"],
            timestamp: "2 days ago"
        },
        {
            id: 2,
            coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
            title: "Mobile Banking App",
            description: "Secure mobile banking application with biometric authentication, real-time transactions, and spending insights for modern banking experience.",
            creator: {
                name: "Michael Chen"
            },
            tags: ["iOS Developer", "Android Dev", "Security Engineer"],
            timestamp: "5 hours ago"
        },
        {
            id: 3,
            coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=200&fit=crop",
            title: "AI-Powered Healthcare System",
            description: "Developing an AI-driven healthcare platform for patient diagnosis assistance, appointment scheduling, and medical records management.",
            creator: {
                name: "Emily Davis"
            },
            tags: ["ML Engineer", "Full Stack", "Data Scientist"],
            timestamp: "1 week ago"
        },
        {
            id: 4,
            coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=200&fit=crop",
            title: "Smart Home Automation",
            description: "IoT-based smart home solution with voice control, energy monitoring, and automated security systems for modern living.",
            creator: {
                name: "Alex Kumar"
            },
            tags: ["IoT Engineer", "Embedded Systems", "Cloud Architect"],
            timestamp: "3 days ago"
        }
    ])

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        
        if (query.trim() === "") {
            setSearchResults([])
            return
        }

        const lowercaseQuery = query.toLowerCase()
        
        const filtered = projectDetails.filter(project => {
            // Search in title
            const titleMatch = project.title.toLowerCase().includes(lowercaseQuery)
            
            // Search in creator name
            const creatorMatch = project.creator.name.toLowerCase().includes(lowercaseQuery)
            
            // Search in tags
            const tagsMatch = project.tags.some(tag => 
                tag.toLowerCase().includes(lowercaseQuery)
            )
            
            return titleMatch || creatorMatch || tagsMatch
        })
        
        setSearchResults(filtered)
        setSearchResults(filtered)
    }

    const getPageTitle = () => {
        if (pathname?.startsWith('/dashboard')) {
            return 'Dashboard'
        } else if (pathname?.startsWith('/projects/')) {
            const projectId = pathname.split('/projects/')[1]
            const project = projectDetails.find(p => p.id.toString() === projectId)
            return project ? project.title : 'Project Details'
        } else if (pathname === '/onboarding') {
            return 'Onboarding'
        } else if (pathname === '/') {
            return 'Recent Projects'
        }
        return 'Home'
    }

    const pageTitle = getPageTitle()

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 32px',
            backgroundColor: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Left - Logo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                minWidth: '150px'
            }}>
                <Image
                    src="/logo.jpeg"
                    alt="Logo"
                    width={120}
                    height={120}
                    style={{
                        borderRadius: '8px',
                        objectFit: 'contain'
                    }}
                />
            </div>

            {/* Center - Page Title */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f8f9fa',
                padding: '8px 20px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                maxWidth: '600px',
                margin: '0 20px'
            }}>
                {/* Bullet Point */}
                <span style={{
                    color: '#647FBC',
                    fontSize: '20px',
                    lineHeight: '1'
                }}>•</span>

                <h1 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#333',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {pageTitle}
                </h1>

                {/* Arrow Icon */}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </div>

            {/* Right - Search Icon & User Profile/Sign In */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '150px',
                justifyContent: 'flex-end'
            }}>
                    
                        <button 
                            onClick={() => router.push(pathname === '/dashboard' ? '/' : '/dashboard')}
                            style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#333'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#000'
                            }}>
                            {pathname.startsWith("/dashboard") ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                    <span>Home</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                                    <span>Dashboard</span>
                                </>
                            )}
                        </button>

                {/* Search Icon */}
                <button
                    onClick={() => setShowSearch(!showSearch)}
                    style={{
                        background: '#f5f5f5',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        transition: 'background 0.2s',
                        width: '44px',
                        height: '44px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e8e8e8'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5'
                    }}
                    aria-label="Search"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#333"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
                <UserButton
                        appearance={{
                            elements: {
                                avatarBox: {
                                    width: '40px',
                                    height: '40px'
                                }
                            }
                        }}
                    />
            </div>

            {/* Search Overlay */}
            {showSearch && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #e0e0e0',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    maxHeight: '500px',
                    overflowY: 'auto'
                }}>
                    <div style={{ padding: '20px 32px' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="Search by title, creator, or tags..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    paddingRight: '45px',
                                    fontSize: '16px',
                                    border: '2px solid #AED6CF',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = '#647FBC'
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = '#AED6CF'
                                }}
                            />
                            {/* Close/Cancel Icon */}
                            <button
                                onClick={() => {
                                    setShowSearch(false)
                                    setSearchQuery("")
                                    setSearchResults([])
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f5f5f5'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                                aria-label="Close search"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#666"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchQuery && (
                        <div style={{ padding: '0 32px 20px 32px' }}>
                            {searchResults.length > 0 ? (
                                <>
                                    <div style={{
                                        fontSize: '13px',
                                        color: '#888',
                                        marginBottom: '12px'
                                    }}>
                                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                    </div>
                                    {searchResults.map((project) => (
                                        <a
                                            key={project.id}
                                            href={`/projects/${project.id}`}
                                            style={{
                                                display: 'flex',
                                                gap: '12px',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                transition: 'background 0.2s',
                                                marginBottom: '8px',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f8f9fa'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent'
                                            }}
                                        >
                                            <Image
                                                src={project.coverImage}
                                                alt={project.title}
                                                width={80}
                                                height={60}
                                                style={{
                                                    borderRadius: '6px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontSize: '15px',
                                                    fontWeight: '600',
                                                    color: '#647FBC',
                                                    marginBottom: '4px'
                                                }}>
                                                    {project.title}
                                                </div>
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: '#666',
                                                    marginBottom: '6px'
                                                }}>
                                                    by {project.creator.name}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '6px',
                                                    flexWrap: 'wrap'
                                                }}>
                                                    {project.tags.slice(0, 2).map((tag: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            style={{
                                                                fontSize: '11px',
                                                                padding: '2px 8px',
                                                                backgroundColor: '#AED6CF',
                                                                color: '#111',
                                                                borderRadius: '8px'
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px',
                                    color: '#888'
                                }}>
                                    No projects found matching &ldquo;{searchQuery}&rdquo;
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}

export default NavBar