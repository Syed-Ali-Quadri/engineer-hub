import mongoose from "mongoose";

const projectAssignmentSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project", 
        required: true 
    },
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    applicationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Application", 
        required: true 
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "cancelled"],
        default: "pending"
    },
    progress: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 100
    },
    payment: { 
        type: Number, 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    deadline: { 
        type: Date, 
        required: true 
    },
    completedAt: { 
        type: Date 
    },
    progressNotes: [{
        note: String,
        progress: Number,
        updatedAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

// Indexes for faster queries
projectAssignmentSchema.index({ projectId: 1, employeeId: 1 });
projectAssignmentSchema.index({ status: 1 });

export const ProjectAssignment = mongoose.models.ProjectAssignment || mongoose.model("ProjectAssignment", projectAssignmentSchema);