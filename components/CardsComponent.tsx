"use client"

import ProjectCard from '@/components/ProjectCard'
import React, { useState } from 'react'

const CardsComponent = () => {
    const [projects, setProjects] = useState([
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
    ]);

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
            {projects.map((exampleProject, index) => (
                <ProjectCard
                    key={`${exampleProject.id}-${index}`}
                    id={exampleProject.id}
                    coverImage={exampleProject.coverImage}
                    title={exampleProject.title}
                    description={exampleProject.description}
                    creator={exampleProject.creator}
                    tags={exampleProject.tags}
                    timestamp={exampleProject.timestamp}
                />
            ))}
        </div>
    )
}

export default CardsComponent