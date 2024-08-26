'use client'

import React, { useState, useCallback } from 'react'

import dynamic from 'next/dynamic'

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  IconButton,
  useMediaQuery,
  Card,
  CircularProgress
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Dynamically import AddClientForm and ClientList components with loading spinner
const AddClientForm = dynamic(() => import('@/components/clients/AddClientForm'), {
  ssr: false,
  loading: LoadingSpinner
})

const ClientList = dynamic(() => import('@/components/clients/ClientList'), {
  ssr: false,
  loading: LoadingSpinner
})

const ClientDashboard = () => {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState([])
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <div>
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          <h1>Clients</h1>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' onClick={handleOpen}>
            Add Client
          </Button>
        </Grid>
      </Grid>
      <Box pt={6}>
        <ClientList clients={clients} setClients={setClients} />
      </Box>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby='add-client-dialog-title'
        aria-describedby='add-client-dialog-description'
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
    </div>
  )
}

export default ClientDashboard
