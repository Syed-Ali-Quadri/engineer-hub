import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import mongoose from "mongoose"
import { Application } from "@/models/application.model"
import { Project } from "@/models/project.model"
import { User } from "@/models/user.model"

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return
    await mongoose.connect(process.env.MONGODB_URI!)
}

// PUT - Approve or Reject application
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const authResult = await auth()
        const userId = authResult?.userId

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()
        const { action, rejectionReason } = body // action: 'approve' or 'reject'

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid application ID" },
                { status: 400 }
            )
        }

        // Get user email from Clerk
        const clerkUser = await currentUser()
        const email = clerkUser?.emailAddresses?.[0]?.emailAddress

        if (!email) {
            return NextResponse.json(
                { error: "User email not found" },
                { status: 400 }
            )
        }

        // Get user from database
        const dbUser = await User.findOne({ email })
        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found in database" },
                { status: 404 }
            )
        }

        // Check if user is a client
        if (dbUser.role !== "client" && dbUser.role !== "admin") {
            return NextResponse.json(
                { error: "Only clients can approve/reject applications" },
                { status: 403 }
            )
        }

        // Get application
        const application = await Application.findById(id).populate('projectId')
        if (!application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            )
        }

        // Check if user owns the project
        if (application.projectId.clientId.toString() !== dbUser._id.toString()) {
            return NextResponse.json(
                { error: "You can only manage applications for your own projects" },
                { status: 403 }
            )
        }

        // Check if already processed
        if (application.status !== "pending") {
            return NextResponse.json(
                { error: "Application has already been processed" },
                { status: 400 }
            )
        }

        if (action === "approve") {
            // Check if seats are available
            const project = await Project.findById(application.projectId._id)
            if (!project) {
                return NextResponse.json(
                    { error: "Project not found" },
                    { status: 404 }
                )
            }

            if (project.seatsAvailable <= 0) {
                return NextResponse.json(
                    { error: "No seats available" },
                    { status: 400 }
                )
            }

            // Approve application
            application.status = "approved"
            application.reviewedAt = new Date()
            await application.save()

            // Decrement seats
            project.seatsAvailable -= 1
            
            // If no seats left, mark project as full
            if (project.seatsAvailable === 0) {
                project.status = "full"
            }
            
            await project.save()

            return NextResponse.json({
                success: true,
                message: "Application approved successfully",
                application
            })
        } else if (action === "reject") {
            // Reject application
            application.status = "rejected"
            application.reviewedAt = new Date()
            application.rejectionReason = rejectionReason || ""
            await application.save()

            return NextResponse.json({
                success: true,
                message: "Application rejected successfully",
                application
            })
        } else {
            return NextResponse.json(
                { error: "Invalid action. Use 'approve' or 'reject'" },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error("Error processing application:", error)
        return NextResponse.json(
            { error: "Failed to process application" },
            { status: 500 }
        )
    }
}
