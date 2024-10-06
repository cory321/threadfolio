'use client'

import { ConnectAccountOnboarding, ConnectComponentsProvider } from '@stripe/react-connect-js'

import { CircularProgress, Typography } from '@mui/material'

import { useStripeConnect } from '@/hooks/useStripeConnect'

const StripeOnboarding = () => {
  const { stripeConnectInstance, error } = useStripeConnect()

  if (error) {
    return (
      <Typography color='error' variant='body1'>
        Error: {error}
      </Typography>
    )
  }

  if (!stripeConnectInstance) {
    return <CircularProgress />
  }

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onComplete={() => {
          // Handle successful onboarding completion
        }}
        onExit={() => {
          // Handle onboarding exit
        }}
      />
    </ConnectComponentsProvider>
  )
}

export default StripeOnboarding
