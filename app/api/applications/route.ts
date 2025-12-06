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

// POST - Create new application
export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const authResult = await auth()
        const userId = authResult?.userId

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { projectId, coverLetter, expectedSalary, portfolioLink } = body

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

        // Validate project ID
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return NextResponse.json(
                { error: "Invalid project ID" },
                { status: 400 }
            )
        }

        // Check if project exists
        const project = await Project.findById(projectId)
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        // Check if project is active and has seats available
        if (project.status !== "active") {
            return NextResponse.json(
                { error: "This project is not accepting applications" },
                { status: 400 }
            )
        }

        if (project.seatsAvailable <= 0) {
            return NextResponse.json(
                { error: "No seats available for this project" },
                { status: 400 }
            )
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({
            projectId,
            employeeId: dbUser._id
        })

        if (existingApplication) {
            return NextResponse.json(
                { error: "You have already applied to this project" },
                { status: 400 }
            )
        }

        // Create application
        const application = await Application.create({
            projectId,
            employeeId: dbUser._id,
            coverLetter: coverLetter || "",
            expectedSalary: expectedSalary || 0,
            portfolioLink: portfolioLink || "",
            status: "pending"
        })

        // Populate the application
        const populatedApplication = await Application.findById(application._id)
            .populate("projectId", "title clientId")
            .populate("employeeId", "name email profilePicture")

        return NextResponse.json({
            success: true,
            application: populatedApplication,
            message: "Application submitted successfully"
        }, { status: 201 })
    } catch (error) {
        console.error("Error creating application:", error)
        return NextResponse.json(
            { error: "Failed to submit application" },
            { status: 500 }
        )
    }
}

// GET - Get applications (for employees - their applications)
export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const authResult = await auth()
        const userId = authResult?.userId

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

        // Get applications for this employee
        const applications = await Application.find({ employeeId: dbUser._id })
            .populate("projectId", "title clientId status")
            .populate("employeeId", "name email profilePicture")
            .sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            applications
        })
    } catch (error) {
        console.error("Error fetching applications:", error)
        return NextResponse.json(
            { error: "Failed to fetch applications" },
            { status: 500 }
        )
    }
}
