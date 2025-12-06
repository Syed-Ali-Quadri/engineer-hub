"use client"

import React, { useState, useEffect } from 'react'

interface ProjectFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    initialData?: any
    mode: 'create' | 'edit'
}

const ProjectForm: React.FC<ProjectFormProps> = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        cost: '',
        duration: '',
        seats: '',
        tags: '',
        requirements: '',
        deliverables: '',
        coverImage: ''
    })

    // Update form data when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                cost: initialData.cost?.toString() || '',
                duration: initialData.duration || '',
                seats: initialData.totalSeats?.toString() || initialData.seatsAvailable?.toString() || '',
                tags: initialData.tags?.join(', ') || '',
                requirements: initialData.requirements?.join('\n') || '',
                deliverables: initialData.deliverables?.join('\n') || '',
                coverImage: initialData.coverImage || ''
            })
        } else {
            // Reset form for create mode
            setFormData({
                title: '',
                description: '',
                cost: '',
                duration: '',
                seats: '',
                tags: '',
                requirements: '',
                deliverables: '',
                coverImage: ''
            })
        }
    }, [initialData, isOpen])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const projectData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            requirements: formData.requirements.split('\n').filter(req => req.trim()),
            deliverables: formData.deliverables.split('\n').filter(del => del.trim())
        }
        onSubmit(projectData)
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '32px'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>
                        {mode === 'create' ? 'Create New Project' : 'Edit Project'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Project Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px'
                            }}
                            placeholder="Enter project title"
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            placeholder="Describe your project"
                        />
                    </div>

                    {/* Cost and Duration */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                Cost (₹) *
                            </label>
                            <input
                                type="number"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                                placeholder="5000"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                Duration *
                            </label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '15px'
                                }}
                                placeholder="e.g., 2 weeks"
                            />
                        </div>
                    </div>

                    {/* Seats */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Available Seats *
                        </label>
                        <input
                            type="number"
                            value={formData.seats}
                            onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                            required
                            min="1"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px'
                            }}
                            placeholder="Number of positions"
                        />
                    </div>

                    {/* Tags */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Tags (comma-separated) *
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px'
                            }}
                            placeholder="Frontend Dev, Backend Dev, UI/UX Designer"
                        />
                    </div>

                    {/* Requirements */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Requirements (one per line) *
                        </label>
                        <textarea
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            required
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            placeholder="List requirements, one per line"
                        />
                    </div>

                    {/* Deliverables */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Deliverables (one per line) *
                        </label>
                        <textarea
                            value={formData.deliverables}
                            onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                            required
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            placeholder="List deliverables, one per line"
                        />
                    </div>

                    {/* Cover Image URL */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                            Cover Image URL (optional)
                        </label>
                        <input
                            type="url"
                            value={formData.coverImage}
                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '15px'
                            }}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                backgroundColor: '#fff',
                                color: '#666',
                                fontSize: '15px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: '#647FBC',
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            {mode === 'create' ? 'Create Project' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectForm
