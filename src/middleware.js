import { NextResponse } from 'next/server'

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isOrdersRoute = createRouteMatcher(['/orders/:path*'])

export default clerkMiddleware((auth, req) => {
  const { userId } = auth()
  const requestUrl = req.nextUrl

  if (!userId && isOrdersRoute(req)) {
    // Store the requested URL
    const redirectUrl = requestUrl.pathname + requestUrl.search

    // Redirect to sign-in page with `redirect_url` parameter
    const signInUrl = new URL('/login', requestUrl.origin)

    signInUrl.searchParams.set('redirect_url', redirectUrl)

    // Perform the redirect
    return NextResponse.redirect(signInUrl)
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
