'use client'

import React from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, useMediaQuery, useTheme } from '@mui/material'

import AddServiceForm from '@/components/services/AddServiceForm'

const AddServiceDialog = ({ open, handleClose, setServices }) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby='add-service-dialog-title'
      aria-describedby='add-service-dialog-description'
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle id='add-service-dialog-title'>Add Service</DialogTitle>
      <DialogContent>
        <AddServiceForm setServices={setServices} onClose={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddServiceDialog
