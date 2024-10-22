'use client'

import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'

import {
  Grid,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery
} from '@mui/material'

import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import UserLeftOverview from '@/app/apps/user/view/user-left-overview'
import UserRight from '@/app/apps/user/view/user-right'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { fetchClientById } from '@actions/clients'
import EditClientForm from '@/components/clients/EditClientForm'

const OrdersTab = dynamic(() => import('@/app/apps/user/view/user-right/orders'))
const SecurityTab = dynamic(() => import('@/app/apps/user/view/user-right/security'))
const ClientAppointments = dynamic(() => import('@/app/apps/user/view/user-right/appointments'))
const NotificationsTab = dynamic(() => import('@/app/apps/user/view/user-right/notifications'))
const ConnectionsTab = dynamic(() => import('@/app/apps/user/view/user-right/connections'))

const tabContentList = () => ({
  orders: <OrdersTab />,
  security: <SecurityTab />,
  appointments: <ClientAppointments />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const ClientProfile = () => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { id } = useParams()

  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const loadClient = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const clientData = await fetchClientById(id)

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

  const handleClientUpdate = updatedClient => {
    setClient(updatedClient)
    setIsEditModalOpen(false)
  }

  const handleEditButtonClick = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
  }

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity='error' variant='standard'>
        {error}
      </Alert>
    )
  }

  if (!client) {
    return <Typography>No client found</Typography>
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Clients', href: '/clients' },
          { label: client.full_name || `Client #${client.id}`, href: `/clients/${client.id}` }
        ]}
      />
      <Grid container spacing={6} sx={{ mt: 2 }}>
        <Grid item xs={12} lg={4} md={5}>
          <UserLeftOverview userData={client} />
          <Button variant='contained' color='primary' onClick={handleEditButtonClick} sx={{ mt: 2 }} fullWidth>
            Edit Client Information
          </Button>
        </Grid>
        <Grid item xs={12} lg={8} md={7}>
          <UserRight tabContentList={tabContentList()} clientId={id} clientName={client.full_name} />
        </Grid>
      </Grid>

      <Dialog open={isEditModalOpen} onClose={handleCloseModal} maxWidth='sm' fullWidth fullScreen={isMobile}>
        <DialogTitle>
          Edit Client Information
          <IconButton
            aria-label='close'
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <EditClientForm client={client} onUpdate={handleClientUpdate} onCancel={handleCloseModal} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ClientProfile
