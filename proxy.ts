// middleware/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  const path = req.nextUrl.pathname

  if (path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/api/webhooks")) {
    return NextResponse.next()
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  const role = (sessionClaims?.unsafeMetadata as any)?.role
  if (!role && !path.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
