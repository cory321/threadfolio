import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware((auth, req, event) => {
  console.log('Middleware triggered for:', req.url)

  const userId = auth().userId

  if (userId) {
    console.log('User is logged in with ID:', userId)
  } else {
    console.log('User is not logged in')
  }

  // You can add additional logic here based on authentication status
  // For example, redirect to sign-in page if not logged in
})

export const config = {
  // Apply middleware to all routes except for static files and Next.js internals
  matcher: '/((?!.*\\..*|_next).*)'
}
