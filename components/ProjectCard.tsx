"use client"

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ProjectCardProps {
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
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    coverImage,
    title,
    description,
    creator,
    tags,
    timestamp,
    id
}) => {
    const router = useRouter()

    const handleCardClick = () => {
        router.push(`/projects/${id}`)
    }

    return (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            maxWidth: '380px',
            width: '100%'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(100, 127, 188, 0.3)'
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onClick={handleCardClick}
        >
            {/* Cover Image */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                backgroundColor: '#AED6CF',
                overflow: 'hidden'
            }}>
                <Image
                    src={coverImage}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>

            {/* Content */}
            <div style={{ padding: '16px' }}>
                {/* Title */}
                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#647FBC',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {title}
                </h3>

                {/* Description - 2 lines */}
                <p style={{
                    margin: '0 0 12px 0',
                    fontSize: '14px',
                    color: '#555',
                    lineHeight: '1.5',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                    minHeight: '42px'
                }}>
                    {description}
                </p>

                {/* Creator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#91ADC8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#fff',
                        overflow: 'hidden'
                    }}>
                        {creator.avatar ? (
                            <Image
                                src={creator.avatar}
                                alt={creator.name}
                                width={32}
                                height={32}
                                style={{ objectFit: 'cover' }}
                            />
                        ) : (
                            creator.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '13px',
                            color: '#333',
                            fontWeight: '500'
                        }}>
                            {creator.name}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: '#888'
                        }}>
                            {timestamp}
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                }}>
                    {tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#111111',
                                backgroundColor: '#AED6CF',
                                borderRadius: '12px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                    {tags.length > 3 && (
                        <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#111111',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '12px'
                        }}>
                            +{tags.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard