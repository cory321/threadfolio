'use client'

import React, { useState } from 'react'

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AddContactForm from '@/components/clients/AddContactForm'
import ClientList from '@/components/clients/ClientList'
import UserListTable from '@views/apps/clients/list/UserListTable'

const ClientDashboard = () => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Typography variant='h1'>Clients</Typography>
      <Button variant='contained' color='primary' onClick={handleOpen}>
        Add Client
      </Button>
      <ClientList />
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
          <AddContactForm onClose={handleClose} />
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
