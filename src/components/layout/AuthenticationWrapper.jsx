'use client'

// Hook Imports
import { useEffect, Suspense } from 'react'

import { redirect } from 'next/navigation'

import { useUser } from '@clerk/nextjs'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Loading Component
const Loading = () => (
  <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
    <CircularProgress />
  </Box>
)

// AuthenticatedContent Component
const AuthenticatedContent = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/login')
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) {
    return <Loading />
  }

  return <>{children}</>
}

// AuthenticationWrapper Component
const AuthenticationWrapper = ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      <AuthenticatedContent>{children}</AuthenticatedContent>
    </Suspense>
  )
}

export default AuthenticationWrapper
