"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
    const router = useRouter()
    const { user } = useUser()
    const [role, setRole] = useState("")
    const [employeeType, setEmployeeType] = useState("")
    const [showEmployeeOptions, setShowEmployeeOptions] = useState(false)

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
        const metadata: any = { role }
        
        if (role === "employee" && employeeType) {
            metadata.employeeType = employeeType
        }

        await user?.update({
            unsafeMetadata: metadata,
        })

        router.push("/")
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
                </div>
            )}

            <button
                onClick={handleSave}
                disabled={!canProceed}
                style={{
                    padding: "10px 20px",
                    marginTop: 20,
                    background: canProceed ? "black" : "#ccc",
                    color: "white",
                    cursor: canProceed ? "pointer" : "not-allowed",
                }}
            >
                Continue
            </button>
        </div>
    )
}
