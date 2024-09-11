'use client'

import React, { useState, useCallback, useEffect } from 'react'

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '@clerk/nextjs'

import { fetchClients } from '@actions/clients'
import ClientList from '@/components/clients/ClientList'
import AddClientModal from '@/components/clients/AddClientModal'

const ClientDashboard = () => {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState(null)
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { getToken, userId } = useAuth()

  const loadClients = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    try {
      const token = await getToken({ template: 'supabase' })
      const { clients: clientsData } = await fetchClients(token, 1, 10, userId)

      setClients(clientsData)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }, [getToken, userId])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Grid container justifyContent='space-between' alignItems='center' mb={4}>
        <Grid item>
          <h1>Clients</h1>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' onClick={handleOpen}>
            Add Client
          </Button>
        </Grid>
      </Grid>
      <Box>
        <ClientList clients={clients} setClients={setClients} />
      </Box>
      <AddClientModal open={open} onClose={handleClose} setClients={setClients} />
    </>
  )
}

export default ClientDashboard
