import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
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
    coverLetter: { 
        type: String, 
        required: true 
    },
    expectedSalary: { 
        type: Number, 
        required: true 
    },
    portfolioLink: { 
        type: String 
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    reviewedAt: { 
        type: Date 
    },
    rejectionReason: { 
        type: String 
    },
}, { timestamps: true });

// Indexes for faster queries
applicationSchema.index({ projectId: 1, employeeId: 1 });
applicationSchema.index({ status: 1 });

export const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);