'use client'

import React, { useState, useCallback } from 'react'

import dynamic from 'next/dynamic'

import { Typography, Card, CardContent, List, CircularProgress, Grid } from '@mui/material'

import ActionItem from './ActionItem'

// Dynamically Imported Modals
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

// Actions Array with Remix Icon class names
const actions = [
  { id: 'new-order', icon: 'ri-file-add-line', text: 'New Order', link: '/orders/create', modal: null },
  { id: 'new-client', icon: 'ri-user-add-line', text: 'New Client', link: '/clients', modal: 'client' },
  {
    id: 'new-appointment',
    icon: 'ri-calendar-line',
    text: 'New Appointment',
    link: '/appointments',
    modal: 'appointment'
  },
  { id: 'new-service', icon: 'ri-service-line', text: 'New Service', link: '/services', modal: 'service' },
  { id: 'new-invoice', icon: 'ri-file-list-line', text: 'New Invoice', link: '/finance', modal: null }
]

// Modal Components Mapping
const modalComponents = {
  client: AddClientModal,
  appointment: AddAppointmentModal,
  service: AddServiceModal
}

const ActionsList = ({ isMobile }) => {
  const [modalStates, setModalStates] = useState({
    client: false,
    appointment: false,
    service: false
  })

  const handleNavigation = useCallback((link, modal) => {
    if (modal) {
      setModalStates(prev => ({ ...prev, [modal]: true }))
    }
  }, [])

  const handleCloseModal = useCallback(modal => {
    setModalStates(prev => ({ ...prev, [modal]: false }))
  }, [])

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={isMobile ? 12 : 5}>
            <Typography variant='h6' gutterBottom>
              Quick Actions
            </Typography>
            {isMobile ? (
              actions.map((action, index) => (
                <ActionItem key={index} action={action} isMobile={isMobile} handleNavigation={handleNavigation} />
              ))
            ) : (
              <List>
                {actions.map((action, index) => (
                  <ActionItem key={index} action={action} isMobile={isMobile} handleNavigation={handleNavigation} />
                ))}
              </List>
            )}
          </Grid>
          {!isMobile && (
            <Grid item sm={7}>
              {/* Add your BlendedImage component here */}
            </Grid>
          )}
        </Grid>
      </CardContent>
      {/* Modal Components */}
      {Object.entries(modalComponents).map(([key, ModalComponent]) => (
        <ModalComponent
          key={key}
          open={modalStates[key]}
          onClose={() => handleCloseModal(key)}
          {...(key === 'appointment' && {
            addEventModalOpen: modalStates[key],
            handleAddEventModalToggle: () => handleCloseModal(key),
            selectedDate: new Date(),
            onAddAppointment: () => {}
          })}
        />
      ))}
    </Card>
  )
}

export default ActionsList
