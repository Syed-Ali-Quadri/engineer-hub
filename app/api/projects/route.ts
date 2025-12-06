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

// GET - Get all projects
export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status")
        const clientId = searchParams.get("clientId")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const skip = (page - 1) * limit

        // Build query
        const query: any = {}
        if (status && status !== "all") {
            query.status = status
        }
        if (clientId) {
            query.clientId = clientId
        }

        const projects = await Project.find(query)
            .populate("clientId", "name email profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Project.countDocuments(query)

        return NextResponse.json({
            success: true,
            projects,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching projects:", error)
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        )
    }
}

// POST - Create new project
export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const authResult = await auth()
        const userId = authResult?.userId

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
            deliverables
        } = body

        // Validation
        if (!title || !description || !cost || !duration || !seatsAvailable || !totalSeats) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Get user from database using email from Clerk
        // For now, we'll find by email (assuming user was created during onboarding)
        const clerkUser = await currentUser()
        const email = clerkUser?.emailAddresses?.[0]?.emailAddress
        console.log("email", email)

        if (!email) {
            return NextResponse.json(
                { error: "User email not found" },
                { status: 400 }
            )
        }

        const dbUser = await User.findOne({ email })

        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found in database. Please complete onboarding." },
                { status: 404 }
            )
        }

        // Check if user is a client
        if (dbUser.role !== "client" && dbUser.role !== "admin") {
            return NextResponse.json(
                { error: "Only clients can create projects" },
                { status: 403 }
            )
        }

        const project = await Project.create({
            clientId: dbUser._id,
            title,
            description,
            coverImage: coverImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
            cost,
            duration,
            seatsAvailable,
            totalSeats,
            tags: tags || [],
            requirements: requirements || [],
            deliverables: deliverables || [],
            status: "active"
        })

        const populatedProject = await Project.findById(project._id)
            .populate("clientId", "name email profilePicture")

        return NextResponse.json({
            success: true,
            project: populatedProject,
            message: "Project created successfully"
        }, { status: 201 })
    } catch (error) {
        console.error("Error creating project:", error)
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        )
    }
}
