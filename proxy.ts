// middleware/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import dbConnect from "@/db"
import {User} from "@/models/user.model"

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const path = req.nextUrl.pathname

  if (path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/api/webhooks")) {
    return NextResponse.next()
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  // Get user email from Clerk
  const clerkClient = (await import('@clerk/nextjs/server')).clerkClient
  const clerkUser = await (await clerkClient()).users.getUser(userId)
  const userEmail = clerkUser.emailAddresses[0].emailAddress

  // Check database for user role
  await dbConnect()
  const dbUser = await User.findOne({ email: userEmail })
  
  // Redirect to onboarding if user doesn't exist in database or has no role
  if ((!dbUser || !dbUser.role) && !path.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }

  // Prevent access to onboarding if role is already set
  if (dbUser && dbUser.role && path.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
