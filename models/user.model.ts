import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ["admin", "client", "employee"],
    },
    employeeType: {
        type: String,
        enum: ["freelancer", "professional"],
    },
    engineeringField: {
        type: String,
    },
    profilePicture: {
        type: String,
    }
}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model("User", userSchema);