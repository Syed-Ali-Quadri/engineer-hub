import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    coverImage: { 
        type: String, 
        required: true 
    },
    cost: { 
        type: Number, 
        required: true 
    },
    duration: { 
        type: String, 
        required: true 
    },
    seatsAvailable: { 
        type: Number, 
        required: true 
    },
    totalSeats: { 
        type: Number, 
        required: true 
    },
    status: {
        type: String,
        enum: ["active", "inactive", "completed", "full"],
        default: "active"
    },
    tags: [{ 
        type: String 
    }],
    requirements: [{ 
        type: String 
    }],
    deliverables: [{ 
        type: String 
    }],
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);