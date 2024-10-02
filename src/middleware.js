import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  // Specify public routes - these do not require authentication
  publicRoutes: [
    '/', // Public landing page
    '/login(.*)', // Login routes
    '/register(.*)' // Registration routes
  ]
})

export const config = {
  // Apply middleware to all routes except for static files and Next.js internals
  matcher: '/((?!.*\\..*|_next).*)'
}
