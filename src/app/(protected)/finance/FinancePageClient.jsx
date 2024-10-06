// src/app/(protected)/finance/FinancePageClient.jsx

'use client'

import { useState, useEffect } from 'react'

import { ConnectAccountOnboarding, ConnectPayments, ConnectComponentsProvider } from '@stripe/react-connect-js'
import { Button, Typography, CircularProgress } from '@mui/material'

import { useStripeConnect } from '@/hooks/useStripeConnect'

export default function FinancePageClient({ initialStripeAccountId }) {
  const [onboardingExited, setOnboardingExited] = useState(false)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [error, setError] = useState(null)
  const [connectedAccountId, setConnectedAccountId] = useState(initialStripeAccountId)
  const { stripeConnectInstance, error: connectError } = useStripeConnect(connectedAccountId)

  useEffect(() => {
    if (connectedAccountId === null) {
      const createStripeAccount = async () => {
        try {
          const response = await fetch('/api/stripe/accounts', {
            method: 'POST'
          })

          const { account, error: createError } = await response.json()

          if (createError) {
            setError(createError)
          } else if (account) {
            setConnectedAccountId(account)
          }
        } catch (err) {
          console.error('Error creating stripe account:', err)
          setError(err.message)
        }
      }

      createStripeAccount()
    }
  }, [connectedAccountId])

  // Render the component based on whether the Stripe Connect instance is ready
  return (
    <div>
      {error && (
        <Typography color='error' variant='body1'>
          Something went wrong: {error}
        </Typography>
      )}
      {!connectedAccountId && !error && <CircularProgress />}
      {connectedAccountId && !stripeConnectInstance && <CircularProgress />}
      {stripeConnectInstance && (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          {!onboardingCompleted ? (
            <ConnectAccountOnboarding
              onComplete={() => {
                setOnboardingCompleted(true)
              }}
              onExit={() => {
                setOnboardingExited(true)
              }}
            />
          ) : (
            <ConnectPayments
              onError={error => {
                console.error('Error in ConnectPayments component:', error)
              }}
            />
          )}
        </ConnectComponentsProvider>
      )}
      {connectError && <Typography color='error'>Error initializing Stripe Connect: {connectError}</Typography>}
      {onboardingExited && <Typography>The Account Onboarding component has exited.</Typography>}
    </div>
  )
}
