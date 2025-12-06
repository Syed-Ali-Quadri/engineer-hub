import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import mongoose from "mongoose"
import { Project } from "@/models/project.model"
import { User } from "@/models/user.model"

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return
    await mongoose.connect(process.env.MONGODB_URI!)
}

// GET - Get single project by ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid project ID" },
                { status: 400 }
            )
        }

        const project = await Project.findById(id)
            .populate("clientId", "name email profilePicture")

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            project
        })
    } catch (error) {
        console.error("Error fetching project:", error)
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        )
    }
}

// PUT - Update project
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
        console.log("id", id)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid project ID" },
                { status: 400 }
            )
        }

        // Get user email from Clerk
        const clerkUser = await currentUser()
        const email = clerkUser?.emailAddresses?.[0]?.emailAddress
        console.log("email:", email)

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

        if (dbUser.role !== "client" && dbUser.role !== "admin") {
            return NextResponse.json(
                { error: "Only clients can update projects" },
                { status: 403 }
            )
        }

        const project = await Project.findById(id)
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        // Check if user is the owner
        if (project.clientId.toString() !== dbUser._id.toString()) {
            return NextResponse.json(
                { error: "You can only update your own projects" },
                { status: 403 }
            )
        }

        const body = await req.json()
        const {
            title,
            description,
            coverImage,
            cost,
            duration,
            seatsAvailable,
            totalSeats,
            tags,
            requirements,
            deliverables,
            status
        } = body

        // Update fields if provided
        if (title !== undefined) project.title = title
        if (description !== undefined) project.description = description
        if (coverImage !== undefined) project.coverImage = coverImage
        if (cost !== undefined) project.cost = cost
        if (duration !== undefined) project.duration = duration
        if (seatsAvailable !== undefined) project.seatsAvailable = seatsAvailable
        if (totalSeats !== undefined) project.totalSeats = totalSeats
        if (tags !== undefined) project.tags = tags
        if (requirements !== undefined) project.requirements = requirements
        if (deliverables !== undefined) project.deliverables = deliverables
        if (status !== undefined) project.status = status

        await project.save()

        const updatedProject = await Project.findById(id)
            .populate("clientId", "name email profilePicture")

        return NextResponse.json({
            success: true,
            project: updatedProject,
            message: "Project updated successfully"
        })
    } catch (error) {
        console.error("Error updating project:", error)
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        )
    }
}

// DELETE - Delete project
export async function DELETE(
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid project ID" },
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

        if (dbUser.role !== "client" && dbUser.role !== "admin") {
            return NextResponse.json(
                { error: "Only clients can delete projects" },
                { status: 403 }
            )
        }

        const project = await Project.findById(id)
        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            )
        }

        // Check if user is the owner
        if (project.clientId.toString() !== dbUser._id.toString()) {
            return NextResponse.json(
                { error: "You can only delete your own projects" },
                { status: 403 }
            )
        }

        await Project.findByIdAndDelete(id)

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting project:", error)
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        )
    }
}
