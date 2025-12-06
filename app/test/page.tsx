// // app/page.tsx
// "use client"

// import { useRazorpayCheckout } from "@/hooks/Razorpay.hook"
// import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from "@clerk/nextjs"
// import { useState, useEffect } from "react"

// export default function HomePage() {
//     const [userData, setUserData] = useState()
//     const { user } = useUser()
//     const { checkout } = useRazorpayCheckout();

//     useEffect(() => {
//         if (user) {
//             setUserData(user)
//         }

//     }, [user])

//     console.log(userData);
//     return (
//         <main style={{ padding: "40px", fontSize: "1.3rem" }}>
//             {/* Logged-in UI */}
//             <SignedIn>
//                 <h1>Dashboard</h1>
//                 <p>You’re signed in with Google.</p>

//                 <div style={{ marginTop: "20px" }}>
//                     {
//                         userData?.emailAddresses.map((emailObj: any) => (
//                             <div key={emailObj.id} style={{ marginBottom: "10px" }}>
//                                 <strong>Email:</strong> {emailObj.emailAddress} {emailObj.primary && "(Primary)"}
//                             </div>
//                         ))
//                     }
//                     <br />
//                     Username: {
//                         userData?.username
//                     }
//                     <br />
//                     Id: {
//                         userData?.id
//                     }
//                 </div>
//                 <br />
//                 Role: {
//                     userData?.unsafeMetadata?.role || "Not Set"
//                 }
//                 <br />
//                 Employee Type: {
//                     userData?.unsafeMetadata?.employeeType || "Not Set"
//                 }
//                 <br />
//                 <br />

//                 <button
//                     onClick={() => checkout({ amount: 5000 })}
//                 >
//                     Pay ₹5000
//                 </button>

//             </SignedIn>

//             {/* Logged-out UI */}
//             <SignedOut>
//                 <h1>Welcome</h1>
//                 <p>Please sign in to continue.</p>

//                 <SignInButton redirectUrl="/">
//                     <button
//                         style={{
//                             marginTop: "20px",
//                             padding: "10px 20px",
//                             fontSize: "1rem",
//                             background: "black",
//                             color: "white",
//                             borderRadius: "8px",
//                         }}
//                     >
//                         Sign In with Google
//                     </button>
//                 </SignInButton>
//             </SignedOut>
//         </main>
//     )
// }


import React from 'react'

const Home = () => {
    return (
        <div>Home</div>
    )
}

export default Home
