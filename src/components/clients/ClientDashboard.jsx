'use client'

import { useState, useCallback } from 'react'

import { Box, Grid, Button } from '@mui/material'

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
