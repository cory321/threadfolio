'use client'

// Next Imports
import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import { CircularProgress, Typography, Box, Card, Avatar } from '@mui/material'

import { useAuth } from '@clerk/nextjs'

import UserLeftOverview from '@/app/apps/user/view/user-left-overview/'
import UserRight from '@/app/apps/user/view/user-right'

import { getInitials } from '@/utils/getInitials'

import { fetchClientById } from '@actions/clients'

const OverViewTab = dynamic(() => import('@/app/apps/user/view/user-right/overview'))
const SecurityTab = dynamic(() => import('@/app/apps/user/view/user-right/security'))
const BillingPlans = dynamic(() => import('@/app/apps/user/view/user-right/billing-plans'))
const NotificationsTab = dynamic(() => import('@/app/apps/user/view/user-right/notifications'))
const ConnectionsTab = dynamic(() => import('@/app/apps/user/view/user-right/connections'))

const tabContentList = () => ({
  overview: <OverViewTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlans />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const ClientProfile = ({ params }) => {
  const { id } = params
  const { getToken } = useAuth()
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadClient = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = await getToken({ template: 'supabase' })

        if (!token) throw new Error('Failed to retrieve token')

        const clientData = await fetchClientById(id, token)

        setClient(clientData)
      } catch (err) {
        console.error('Error fetching client:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadClient()
    }
  }, [id])

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  if (!client) {
    return <Typography>No client found</Typography>
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={4} md={5}>
        <UserLeftOverview userData={client} />
      </Grid>
      <Grid item xs={12} lg={8} md={7}>
        <UserRight />
      </Grid>
    </Grid>
  )
}

export default ClientProfile
