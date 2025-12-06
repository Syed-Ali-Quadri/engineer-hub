import { NextRequest, NextResponse } from 'next/server'
import { sendApprovalEmail, sendRejectionEmail } from '@/helper/emailHelper'

export async function POST(request: NextRequest) {
    try {
        const { 
            employeeEmail, 
            employeeName, 
            projectTitle, 
            clientName,
            action // 'approve' or 'reject'
        } = await request.json()

        if (!employeeEmail || !employeeName || !projectTitle || !clientName || !action) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        let result
        if (action === 'approve') {
            result = await sendApprovalEmail(employeeEmail, employeeName, projectTitle, clientName)
        } else if (action === 'reject') {
            result = await sendRejectionEmail(employeeEmail, employeeName, projectTitle, clientName)
        } else {
            return NextResponse.json(
                { error: 'Invalid action. Must be "approve" or "reject"' },
                { status: 400 }
            )
        }

        if (result.success) {
            return NextResponse.json({ success: true, message: result.message })
        } else {
            return NextResponse.json(
                { success: false, error: result.message },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
