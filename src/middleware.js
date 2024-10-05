import { NextResponse } from 'next/server'

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/onboarding(.*)',
  '/dashboard(.*)',
  '/clients(.*)',
  '/orders(.*)',
  '/garments(.*)',
  '/appointments(.*)',
  '/services(.*)',
  '/finance(.*)',
  '/reports(.*)',
  '/settings(.*)'
])

const isOrdersRoute = createRouteMatcher(['/orders/:path*'])

export default clerkMiddleware((auth, req) => {
  const requestUrl = req.nextUrl

  if (!auth().userId && isOrdersRoute(req)) {
    const redirectUrl = requestUrl.pathname + requestUrl.search
    const signInUrl = new URL('/login', requestUrl.origin)

    signInUrl.searchParams.set('redirect_url', redirectUrl)

    return NextResponse.redirect(signInUrl)
  }

  if (!auth().userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn()
  }
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - Static files
     * - _next (Next.js internals)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
