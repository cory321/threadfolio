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
import AddClientForm from '@/components/clients/AddClientForm'

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
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby='add-client-dialog-title'
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle id='add-client-dialog-title'>
          Add Client
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[900]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AddClientForm onClose={handleClose} setClients={setClients} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ClientDashboard
