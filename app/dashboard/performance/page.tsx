"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardSidebar from '@/components/DashboardSidebar'

interface Review {
    id: number
    clientName: string
    projectTitle: string
    rating: number
    comment: string
    date: string
}

const PerformancePage = () => {
    const { user } = useUser()
    const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || 'employee'

    const [performanceStats] = useState({
        totalProjects: 15,
        completedProjects: 12,
        ongoingProjects: 3,
        averageRating: 4.7,
        totalReviews: 12,
        totalEarnings: 425000,
        completionRate: 95,
        onTimeDelivery: 92
    })

    const [reviews] = useState<Review[]>([
        {
            id: 1,
            clientName: "Sarah Johnson",
            projectTitle: "E-Commerce Platform",
            rating: 5,
            comment: "Exceptional work! Delivered ahead of schedule with excellent code quality. Great communication throughout the project.",
            date: "2024-02-15"
        },
        {
            id: 2,
            clientName: "Michael Chen",
            projectTitle: "Mobile Banking App",
            rating: 4.5,
            comment: "Very professional and skilled developer. Minor delays but overall satisfied with the final product.",
            date: "2024-01-28"
        },
        {
            id: 3,
            clientName: "Alex Kumar",
            projectTitle: "Smart Home Automation",
            rating: 5,
            comment: "Outstanding performance! The IoT integration was flawless and the documentation was comprehensive.",
            date: "2024-01-15"
        },
        {
            id: 4,
            clientName: "Emma Wilson",
            projectTitle: "Analytics Dashboard",
            rating: 4,
            comment: "Good work on the data visualization. Could improve on responsiveness but overall happy with results.",
            date: "2023-12-20"
        }
    ])

    const [earningsHistory] = useState([
        { month: 'Aug', amount: 45000 },
        { month: 'Sep', amount: 52000 },
        { month: 'Oct', amount: 48000 },
        { month: 'Nov', amount: 68000 },
        { month: 'Dec', amount: 85000 },
        { month: 'Jan', amount: 75000 },
        { month: 'Feb', amount: 52000 }
    ])

    const maxEarning = Math.max(...earningsHistory.map(e => e.amount))

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0
        const stars = []

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <span key={`full-${i}`} style={{ color: '#ffc107', fontSize: '18px' }}>★</span>
            )
        }
        if (hasHalfStar) {
            stars.push(
                <span key="half" style={{ color: '#ffc107', fontSize: '18px' }}>⯪</span>
            )
        }
        const emptyStars = 5 - Math.ceil(rating)
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <span key={`empty-${i}`} style={{ color: '#e0e0e0', fontSize: '18px' }}>★</span>
            )
        }
        return stars
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
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#333',
                        marginBottom: '8px'
                    }}>
                        Performance Dashboard
                    </h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        Track your performance metrics and client feedback
                    </p>
                </div>

                {/* Performance Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {/* Average Rating */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Average Rating</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                        </div>
                        <p style={{ fontSize: '36px', fontWeight: '700', color: '#ffc107', marginBottom: '8px' }}>{performanceStats.averageRating}</p>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {renderStars(performanceStats.averageRating)}
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Based on {performanceStats.totalReviews} reviews</p>
                    </div>

                    {/* Completion Rate */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Completion Rate</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12l2 2 4-4"/>
                                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                            </svg>
                        </div>
                        <p style={{ fontSize: '36px', fontWeight: '700', color: '#28a745' }}>{performanceStats.completionRate}%</p>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>{performanceStats.completedProjects}/{performanceStats.totalProjects} projects</p>
                    </div>

                    {/* On-Time Delivery */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>On-Time Delivery</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#647FBC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <p style={{ fontSize: '36px', fontWeight: '700', color: '#647FBC' }}>{performanceStats.onTimeDelivery}%</p>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Delivered on schedule</p>
                    </div>

                    {/* Total Earnings */}
                    <div style={{
                        backgroundColor: '#fff',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Total Earnings</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"/>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                            </svg>
                        </div>
                        <p style={{ fontSize: '36px', fontWeight: '700', color: '#28a745' }}>₹{(performanceStats.totalEarnings / 1000).toFixed(0)}K</p>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Lifetime earnings</p>
                    </div>
                </div>

                {/* Earnings Chart */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    marginBottom: '40px'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                        Monthly Earnings
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
                        {earningsHistory.map((earning, index) => (
                            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                                <div style={{
                                    width: '100%',
                                    height: `${(earning.amount / maxEarning) * 100}%`,
                                    backgroundColor: earning.amount === maxEarning ? '#28a745' : '#91ADC8',
                                    borderRadius: '8px 8px 0 0',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    paddingTop: '8px',
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: '11px',
                                    minHeight: '50px',
                                    position: 'relative'
                                }}>
                                    <span style={{ transform: 'rotate(-45deg)', whiteSpace: 'nowrap' }}>
                                        {(earning.amount / 1000).toFixed(0)}K
                                    </span>
                                </div>
                                <p style={{ marginTop: '8px', fontSize: '13px', color: '#666', fontWeight: '600' }}>{earning.month}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                        Client Reviews ({reviews.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                style={{
                                    padding: '20px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                                            {review.clientName}
                                        </h4>
                                        <p style={{ fontSize: '13px', color: '#666' }}>{review.projectTitle}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                                            {renderStars(review.rating)}
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#999' }}>{review.date}</p>
                                    </div>
                                </div>
                                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                                    "{review.comment}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PerformancePage
