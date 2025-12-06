"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import DashboardSidebar from '@/components/DashboardSidebar'

const DashboardPage = () => {
  const { user } = useUser()
  const userRole = (user?.unsafeMetadata?.role as 'client' | 'employee' | 'admin') || 'client'

  // Client-specific data
  const [clientStats] = useState({
    total: 24,
    active: 12,
    completed: 8,
    inactive: 4,
    approved: 15,
    pending: 5
  })

  // Employee-specific data
  const [employeeStats] = useState({
    myProjects: 6,
    inProgress: 3,
    completed: 2,
    pending: 1,
    totalEarnings: 125000,
    thisMonthEarnings: 35000,
    avgRating: 4.8,
    totalReviews: 23
  })

  // Render Employee Dashboard
  if (userRole === 'employee') {
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
              Employee Dashboard
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Welcome back, {user?.firstName || 'Employee'}! Track your projects and earnings.
            </p>
          </div>

          {/* Stats Grid - Employee */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {/* My Projects */}
            <div style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>My Projects</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#647FBC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p style={{ fontSize: '36px', fontWeight: '700', color: '#647FBC' }}>{employeeStats.myProjects}</p>
              <p style={{ fontSize: '12px', color: '#28a745', marginTop: '8px' }}>Active assignments</p>
            </div>

            {/* In Progress */}
            <div style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>In Progress</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <p style={{ fontSize: '36px', fontWeight: '700', color: '#ffc107' }}>{employeeStats.inProgress}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Currently working on</p>
            </div>

            {/* Completed */}
            <div style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Completed</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
              </div>
              <p style={{ fontSize: '36px', fontWeight: '700', color: '#28a745' }}>{employeeStats.completed}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Successfully finished</p>
            </div>

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
              <p style={{ fontSize: '36px', fontWeight: '700', color: '#ffc107' }}>{employeeStats.avgRating}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>{employeeStats.totalReviews} reviews</p>
            </div>
          </div>

          {/* Earnings Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {/* Total Earnings */}
            <div style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                Earnings Overview
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Earnings</p>
                <p style={{ fontSize: '32px', fontWeight: '700', color: '#647FBC' }}>₹{employeeStats.totalEarnings.toLocaleString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>This Month</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#28a745' }}>₹{employeeStats.thisMonthEarnings.toLocaleString()}</p>
              </div>
            </div>

            {/* Project Status Chart */}
            <div style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
                Project Status
              </h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '150px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: `${(employeeStats.inProgress / employeeStats.myProjects) * 100}%`,
                    backgroundColor: '#ffc107',
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '600',
                    minHeight: '40px'
                  }}>
                    {employeeStats.inProgress}
                  </div>
                  <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>In Progress</p>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: `${(employeeStats.completed / employeeStats.myProjects) * 100}%`,
                    backgroundColor: '#28a745',
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '600',
                    minHeight: '40px'
                  }}>
                    {employeeStats.completed}
                  </div>
                  <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Completed</p>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: `${(employeeStats.pending / employeeStats.myProjects) * 100}%`,
                    backgroundColor: '#6c757d',
                    borderRadius: '8px 8px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '600',
                    minHeight: '40px'
                  }}>
                    {employeeStats.pending}
                  </div>
                  <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity - Employee */}
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { action: 'Started working on', project: 'E-Commerce Platform', time: '1 hour ago', type: 'info' },
                { action: 'Submitted deliverables for', project: 'Mobile Banking App', time: '3 hours ago', type: 'success' },
                { action: 'Applied to', project: 'AI Healthcare System', time: '1 day ago', type: 'info' },
                { action: 'Received payment for', project: 'Smart Home Automation', time: '2 days ago', type: 'success' }
              ].map((activity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: activity.type === 'success' ? '#28a745' : '#647FBC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: '500', color: '#333', marginBottom: '2px' }}>
                      {activity.action}
                    </p>
                    <p style={{ fontSize: '13px', color: '#666' }}>
                      {activity.project}
                    </p>
                  </div>
                  <span style={{ fontSize: '13px', color: '#999' }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render Client Dashboard
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
            Client Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Welcome back, {user?.firstName || 'User'}! Here's your overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Total Projects */}
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Total Projects</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#647FBC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              </svg>
            </div>
            <p style={{ fontSize: '36px', fontWeight: '700', color: '#647FBC' }}>{clientStats.total}</p>
            <p style={{ fontSize: '12px', color: '#28a745', marginTop: '8px' }}>↑ 12% from last month</p>
          </div>

          {/* Active Projects */}
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Active Projects</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#91ADC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p style={{ fontSize: '36px', fontWeight: '700', color: '#91ADC8' }}>{clientStats.active}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>{((clientStats.active / clientStats.total) * 100).toFixed(0)}% of total</p>
          </div>

          {/* Completed Projects */}
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Completed</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AED6CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              </svg>
            </div>
            <p style={{ fontSize: '36px', fontWeight: '700', color: '#AED6CF' }}>{clientStats.completed}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Success rate: 95%</p>
          </div>

          {/* Inactive Projects */}
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Inactive</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
            </div>
            <p style={{ fontSize: '36px', fontWeight: '700', color: '#dc3545' }}>{clientStats.inactive}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Needs attention</p>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Bar Chart - Project Status */}
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
              Project Status Overview
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '200px' }}>
              {/* Active Bar */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{
                  width: '100%',
                  height: `${(clientStats.active / clientStats.total) * 100}%`,
                  backgroundColor: '#91ADC8',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '600',
                  minHeight: '40px'
                }}>
                  {clientStats.active}
                </div>
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Active</p>
              </div>

              {/* Completed Bar */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{
                  width: '100%',
                  height: `${(clientStats.completed / clientStats.total) * 100}%`,
                  backgroundColor: '#AED6CF',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '600',
                  minHeight: '40px'
                }}>
                  {clientStats.completed}
                </div>
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Completed</p>
              </div>

              {/* Inactive Bar */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{
                  width: '100%',
                  height: `${(clientStats.inactive / clientStats.total) * 100}%`,
                  backgroundColor: '#dc3545',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '600',
                  minHeight: '40px'
                }}>
                  {clientStats.inactive}
                </div>
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>Inactive</p>
              </div>
            </div>
          </div>

          {/* Pie Chart - Approval Status */}
          <div style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
              Approval Status
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Simple pie visualization */}
              <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: `conic-gradient(
                    #AED6CF 0% ${(clientStats.approved / clientStats.total) * 100}%,
                    #ffc107 ${(clientStats.approved / clientStats.total) * 100}% 100%
                  )`
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#fff',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>{clientStats.total}</p>
                  <p style={{ fontSize: '12px', color: '#666' }}>Total</p>
                </div>
              </div>

              {/* Legend */}
              <div style={{ flex: 1, paddingLeft: '30px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#AED6CF', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>Approved</span>
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginLeft: '20px' }}>{clientStats.approved}</p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#ffc107', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>Pending</span>
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#333', marginLeft: '20px' }}>{clientStats.pending}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { action: 'Project submitted', project: 'E-Commerce Platform', time: '2 hours ago', type: 'success' },
              { action: 'New application received', project: 'Mobile Banking App', time: '5 hours ago', type: 'info' },
              { action: 'Project approved', project: 'AI Healthcare System', time: '1 day ago', type: 'success' },
              { action: 'Project marked inactive', project: 'Social Media Dashboard', time: '2 days ago', type: 'warning' }
            ].map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: activity.type === 'success' ? '#AED6CF' : activity.type === 'warning' ? '#ffc107' : '#647FBC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#333', marginBottom: '2px' }}>
                    {activity.action}
                  </p>
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    {activity.project}
                  </p>
                </div>
                <span style={{ fontSize: '13px', color: '#999' }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage