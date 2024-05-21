'use client'

import React, { useEffect, useState } from 'react'

import { CircularProgress, Typography, Box } from '@mui/material'

import { useAuth } from '@clerk/nextjs'

import { fetchClientById } from '@actions/clients'

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
    <Box>
      <Typography variant='h4'>{client.full_name}</Typography>
      <Typography>Email: {client.email}</Typography>
      <Typography>Phone Number: {client.phone_number}</Typography>
      <Typography>Mailing Address: {client.mailing_address}</Typography>
      <Typography>Notes: {client.notes}</Typography>
    </Box>
  )
}

export default ClientProfile
