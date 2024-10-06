'use client'

import { useState, useEffect } from 'react'

import { loadConnectAndInitialize } from '@stripe/connect-js'

export const useStripeConnect = connectedAccountId => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (connectedAccountId) {
      const initializeStripeConnect = async () => {
        try {
          // Fetch the client secret
          const fetchClientSecret = async () => {
            try {
              const response = await fetch('/api/stripe/account-session', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  account: connectedAccountId
                })
              })

              if (!response.ok) {
                const { error } = await response.json()

                throw new Error(`An error occurred: ${error}`)
              } else {
                const { client_secret: clientSecret } = await response.json()

                return clientSecret
              }
            } catch (error) {
              console.error('Error fetching client secret:', error)
              throw error
            }
          }

          // Initialize Stripe Connect
          const connectInstance = await loadConnectAndInitialize({
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            fetchClientSecret,
            appearance: {
              variables: {
                colorPrimary: '#635BFF'
              }
            }
          })

          // Set the Stripe Connect instance
          setStripeConnectInstance(connectInstance)
        } catch (error) {
          console.error('Error initializing Stripe Connect:', error)
          setError(error.message)
        }
      }

      // Call the async function
      initializeStripeConnect()
    }
  }, [connectedAccountId])

  return { stripeConnectInstance, error }
}
