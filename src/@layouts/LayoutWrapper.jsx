'use client'

// Hook Imports
import { useState, useEffect } from 'react'

import { useUser } from '@clerk/nextjs'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import useLayoutInit from '@core/hooks/useLayoutInit'
import { useSettings } from '@core/hooks/useSettings'

const LayoutWrapper = props => {
  // Props
  const { systemMode, verticalLayout, horizontalLayout } = props

  // Hooks
  const { settings } = useSettings()
  const { isSignedIn, isLoading, user } = useUser()
  const [authLoading, setAuthLoading] = useState(true)

  useLayoutInit(systemMode)

  useEffect(() => {
    if (!isLoading) {
      setAuthLoading(false)
    }
  }, [isLoading])

  if (authLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  if (!isSignedIn) {
    return null // or you can redirect to sign-in page or show a message
  }

  return (
    <div className='flex flex-col flex-auto' data-skin={settings.skin}>
      {settings.layout === 'horizontal' ? horizontalLayout : verticalLayout}
    </div>
  )
}

export default LayoutWrapper
