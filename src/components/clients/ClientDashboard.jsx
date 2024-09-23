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
  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

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
        <ClientList />
      </Box>
      <AddClientModal open={open} onClose={handleClose} />
    </>
  )
}

export default ClientDashboard
