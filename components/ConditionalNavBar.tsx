"use client"

import { usePathname } from 'next/navigation'
import NavBar from './NavBar'

export default function ConditionalNavBar() {
    const pathname = usePathname()
    
    // Routes where navbar should be hidden
    const hiddenRoutes = ['/sign-in', '/sign-up', '/onboarding']
    
    // Hide navbar if current path starts with any of the hidden routes
    const hideNavbar = hiddenRoutes.some(route => pathname?.startsWith(route))
    
    if (hideNavbar) {
        return null
    }
    
    return <NavBar />
}
