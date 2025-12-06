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

// GET - Get applications for client's projects
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
        console.log("email", email)

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
                { error: "Only clients can view approvals" },
                { status: 403 }
            )
        }

        // Get all projects for this client
        const projects = await Project.find({ clientId: dbUser._id }).select('_id')
        const projectIds = projects.map(p => p._id)

        // Get all applications for these projects
        const applications = await Application.find({ 
            projectId: { $in: projectIds }
        })
            .populate("projectId", "title coverImage cost duration")
            .populate("employeeId", "name email profilePicture engineeringField employeeType")
            .sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            applications
        })
    } catch (error) {
        console.error("Error fetching approvals:", error)
        return NextResponse.json(
            { error: "Failed to fetch approvals" },
            { status: 500 }
        )
    }
}
