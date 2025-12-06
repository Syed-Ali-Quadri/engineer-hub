import nodemailer from 'nodemailer'

interface EmailOptions {
    to: string
    subject: string
    html: string
}

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })
}

// Send approval email to employee
export const sendApprovalEmail = async (
    employeeEmail: string,
    employeeName: string,
    projectTitle: string,
    clientName: string
) => {
    const transporter = createTransporter()

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #647FBC 0%, #91ADC8 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #ffffff;
                    padding: 30px;
                    border: 1px solid #e0e0e0;
                    border-top: none;
                }
                .footer {
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-radius: 0 0 10px 10px;
                    border: 1px solid #e0e0e0;
                    border-top: none;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #647FBC;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    margin: 20px 0;
                    font-weight: 600;
                }
                .check-icon {
                    background: #28a745;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                }
                .project-details {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .detail-row:last-child {
                    border-bottom: none;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div style="background: #28a745; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h1 style="margin: 0; font-size: 28px;">Congratulations! 🎉</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Your application has been approved</p>
            </div>
            
            <div class="content">
                <p style="font-size: 16px;">Hi <strong>${employeeName}</strong>,</p>
                
                <p>Great news! Your application for the following project has been <strong style="color: #28a745;">approved</strong> by the client.</p>
                
                <div class="project-details">
                    <div class="detail-row">
                        <span style="color: #666; font-weight: 500;">Project:</span>
                        <strong>${projectTitle}</strong>
                    </div>
                    <div class="detail-row">
                        <span style="color: #666; font-weight: 500;">Client:</span>
                        <strong>${clientName}</strong>
                    </div>
                    <div class="detail-row">
                        <span style="color: #666; font-weight: 500;">Status:</span>
                        <span style="color: #28a745; font-weight: 600;">✓ Approved</span>
                    </div>
                </div>
                
                <p>You can now proceed with the project. The client will contact you shortly with further details and next steps.</p>
                
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/projects" class="button">
                        View Project Details
                    </a>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    <strong>Next Steps:</strong><br/>
                    1. Check your project dashboard for detailed requirements<br/>
                    2. Wait for the client to initiate communication<br/>
                    3. Review and sign any necessary agreements<br/>
                    4. Begin work according to the project timeline
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated message from our platform. Please do not reply to this email.</p>
                <p style="margin-top: 10px;">
                    © ${new Date().getFullYear()} Project Management Platform. All rights reserved.
                </p>
            </div>
        </body>
        </html>
    `

    const mailOptions: EmailOptions = {
        to: employeeEmail,
        subject: `🎉 Application Approved: ${projectTitle}`,
        html: htmlContent,
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Project Platform" <noreply@projectplatform.com>',
            ...mailOptions,
        })
        return { success: true, message: 'Email sent successfully' }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, message: 'Failed to send email', error }
    }
}

// Send rejection email to employee
export const sendRejectionEmail = async (
    employeeEmail: string,
    employeeName: string,
    projectTitle: string,
    clientName: string
) => {
    const transporter = createTransporter()

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #6c757d 0%, #adb5bd 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #ffffff;
                    padding: 30px;
                    border: 1px solid #e0e0e0;
                    border-top: none;
                }
                .footer {
                    background: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-radius: 0 0 10px 10px;
                    border: 1px solid #e0e0e0;
                    border-top: none;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background-color: #647FBC;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    margin: 20px 0;
                    font-weight: 600;
                }
                .project-details {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Application Update</h1>
            </div>
            
            <div class="content">
                <p style="font-size: 16px;">Hi <strong>${employeeName}</strong>,</p>
                
                <p>Thank you for your interest in the <strong>${projectTitle}</strong> project.</p>
                
                <p>After careful consideration, the client (<strong>${clientName}</strong>) has decided to move forward with other candidates for this particular project.</p>
                
                <p>We encourage you to keep exploring other opportunities on our platform. Your skills and experience are valuable, and we're confident you'll find the right project match soon.</p>
                
                <div style="text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/available-projects" class="button">
                        Browse Available Projects
                    </a>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    <strong>Keep in mind:</strong><br/>
                    • New projects are posted regularly<br/>
                    • Update your profile to showcase your best work<br/>
                    • Apply to projects that match your expertise<br/>
                    • Stay positive and keep applying!
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated message from our platform. Please do not reply to this email.</p>
                <p style="margin-top: 10px;">
                    © ${new Date().getFullYear()} Project Management Platform. All rights reserved.
                </p>
            </div>
        </body>
        </html>
    `

    const mailOptions: EmailOptions = {
        to: employeeEmail,
        subject: `Application Update: ${projectTitle}`,
        html: htmlContent,
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Project Platform" <noreply@projectplatform.com>',
            ...mailOptions,
        })
        return { success: true, message: 'Email sent successfully' }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, message: 'Failed to send email', error }
    }
}
