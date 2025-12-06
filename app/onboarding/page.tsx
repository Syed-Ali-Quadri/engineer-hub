"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
    const router = useRouter()
    const { user } = useUser()
    const [role, setRole] = useState("")
    const [employeeType, setEmployeeType] = useState("")
    const [engineeringField, setEngineeringField] = useState("")
    const [showEmployeeOptions, setShowEmployeeOptions] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleRoleChange = (selectedRole: string) => {
        setRole(selectedRole)
        if (selectedRole === "employee") {
            setShowEmployeeOptions(true)
            // setEmployeeType("")
        } else {
            setShowEmployeeOptions(false)
            setEmployeeType("")
        }
    }

    const handleSave = async () => {
        if (!canProceed || loading) return

        setLoading(true)

        try {
            const metadata: any = { role }
            
            if (role === "employee" && employeeType) {
                metadata.employeeType = employeeType
                if (engineeringField) {
                    metadata.engineeringField = engineeringField
                }
            }

            console.log("Saving metadata:", metadata)

            await user?.update({
                unsafeMetadata: metadata,
            })

            console.log("Metadata saved, reloading user...")
            
            // Reload the user to get fresh session data
            await user?.reload()
            
            console.log("User reloaded, current metadata:", user?.unsafeMetadata)
            
            // Wait a moment for session to propagate
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            console.log("Redirecting to home...")
            
            // Use window.location for a hard redirect to force middleware re-check
            window.location.href = "/"
        } catch (error) {
            console.error("Error saving role:", error)
            alert("Failed to save role. Please try again.")
            setLoading(false)
        }
    }

    const canProceed = role === "client" || (role === "employee" && employeeType !== "")

    return (
        <div style={{ padding: 40 }}>
            <h1>Select Your Role</h1>

            <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                style={{ padding: 10, marginTop: 20, width: 200 }}
            >
                <option value="">-- Select Role --</option>
                <option value="client">Client</option>
                <option value="employee">Employee</option>
            </select>

            {showEmployeeOptions && (
                <div style={{ marginTop: 20 }}>
                    <h3>Select Employee Type</h3>
                    <label style={{ display: "block", marginTop: 10 }}>
                        <input
                            type="radio"
                            name="employeeType"
                            value="freelancer"
                            checked={employeeType === "freelancer"}
                            onChange={(e) => setEmployeeType(e.target.value)}
                            style={{ marginRight: 8 }}
                        />
                        Freelancer
                    </label>
                    <label style={{ display: "block", marginTop: 10 }}>
                        <input
                            type="radio"
                            name="employeeType"
                            value="professional"
                            checked={employeeType === "professional"}
                            onChange={(e) => setEmployeeType(e.target.value)}
                            style={{ marginRight: 8 }}
                        />
                        Professional Jobs
                    </label>
                    <label style={{ display: "block", marginTop: 10 }}>
                        <input
                            type="text"
                            name="employeeType"
                            placeholder="Engineering Field"
                            onChange={(e) => setEngineeringField(e.target.value)}
                            style={{ marginRight: 8 }}
                        />
                        engineeringField
                    </label>
                </div>
            )}

            <button
                onClick={handleSave}
                disabled={!canProceed || loading}
                style={{
                    padding: "10px 20px",
                    marginTop: 20,
                    background: canProceed && !loading ? "black" : "#ccc",
                    color: "white",
                    cursor: canProceed && !loading ? "pointer" : "not-allowed",
                }}
            >
                {loading ? "Saving..." : "Continue"}
            </button>
        </div>
    )
}
