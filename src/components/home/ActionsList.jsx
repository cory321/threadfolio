'use client'

import React, { useState } from 'react'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import {
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  ButtonBase,
  CircularProgress,
  Box
} from '@mui/material'
import { styled } from '@mui/material/styles'

const AddClientModal = dynamic(() => import('@/components/clients/AddClientModal'), {
  ssr: false,
  loading: () => <CircularProgress />
})

const AddAppointmentModal = dynamic(() => import('@/views/apps/calendar/AddAppointmentModal'), {
  ssr: false,
  loading: () => <CircularProgress />
})

const AddServiceModal = dynamic(() => import('@/components/services/AddServiceModal'), {
  ssr: false,
  loading: () => <CircularProgress />
})

const BlendedImage = dynamic(() => import('@/components/ui/BlendedImage'), {
  ssr: false,
  loading: () => (
    <Box display='flex' justifyContent='center' alignItems='center' height={400}>
      <CircularProgress />
    </Box>
  )
})

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: '18px',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4]
  }
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(5px)'
  }
}))

const actions = [
  { icon: 'ri-file-add-line', text: 'New Order', link: '/orders/create', modal: null },
  { icon: 'ri-user-add-line', text: 'New Client', link: '/clients', modal: 'client' },
  { icon: 'ri-calendar-line', text: 'New Appointment', link: '/appointments', modal: 'appointment' },
  { icon: 'ri-service-line', text: 'New Service', link: '/services', modal: 'service' },
  { icon: 'ri-file-list-line', text: 'New Invoice', link: '/finance', modal: null }
]

const ActionsList = ({ isMobile }) => {
  const [modalStates, setModalStates] = useState({
    client: false,
    appointment: false,
    service: false
  })

  const handleNavigation = (link, modal) => {
    if (modal) {
      setModalStates(prev => ({ ...prev, [modal]: true }))
    }
  }

  const handleCloseModal = modal => {
    setModalStates(prev => ({ ...prev, [modal]: false }))
  }

  const renderActionItem = (action, index) => {
    const ActionComponent = isMobile ? StyledButton : StyledListItem

    const commonProps = {
      key: index,
      ...(isMobile
        ? {
            fullWidth: true,
            variant: 'contained',
            startIcon: <i className={action.icon} />
          }
        : {
            component: action.modal ? ButtonBase : 'a',
            sx: { width: '100%' }
          }),
      onClick: action.modal ? () => handleNavigation(action.link, action.modal) : undefined
    }

    const content = isMobile ? (
      action.text
    ) : (
      <>
        <ListItemIcon>
          <i className={action.icon} />
        </ListItemIcon>
        <ListItemText primary={action.text} />
      </>
    )

    return action.modal ? (
      <ActionComponent {...commonProps}>{content}</ActionComponent>
    ) : (
      <Link href={action.link} passHref style={{ textDecoration: 'none', width: '100%' }}>
        <ActionComponent {...commonProps}>{content}</ActionComponent>
      </Link>
    )
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <Typography variant='h6' gutterBottom>
              Quick actions
            </Typography>
            {isMobile ? actions.map(renderActionItem) : <List>{actions.map(renderActionItem)}</List>}
          </Grid>
          {!isMobile && (
            <Grid item sm={7}>
              <BlendedImage
                src='/images/illustrations/seamstress-organizing-clothes.webp'
                alt='Seamstress organizing clothes'
                width={400}
                height={400}
                loading='lazy'
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
      <AddClientModal open={modalStates.client} onClose={() => handleCloseModal('client')} />
      <AddAppointmentModal
        addEventModalOpen={modalStates.appointment}
        handleAddEventModalToggle={() => handleCloseModal('appointment')}
        selectedDate={new Date()}
        onAddAppointment={() => {}}
      />
      <AddServiceModal open={modalStates.service} onClose={() => handleCloseModal('service')} />
    </Card>
  )
}

export default ActionsList
