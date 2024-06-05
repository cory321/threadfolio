'use client'

import React, { useState } from 'react'

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  useMediaQuery,
  Card
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AddClientForm from '@/components/clients/AddClientForm'
import ClientList from '@/components/clients/ClientList'

const ClientDashboard = () => {
  const [open, setOpen] = useState(false)
  const [clients, setClients] = useState([])
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
        <Card sx={{ p: 2, mt: 2 }}>
          TODO: Handle Pagination, Handle attempts at creating a user with a duplicate email
        </Card>
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
        <DialogTitle id='add-client-dialog-title'>Add Client</DialogTitle>
        <DialogContent>
          <AddClientForm onClose={handleClose} setClients={setClients} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ClientDashboard
