'use client'

import React, { useState } from 'react'

import { Button, Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import AddServiceForm from '@/components/services/AddServiceForm'

const AddServiceDialog = ({ setServices }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button variant='contained' color='primary' onClick={handleOpen}>
        Add Service
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby='add-service-dialog-title' maxWidth='xs' fullWidth>
        <DialogTitle id='add-service-dialog-title'>
          Add Service
          <IconButton
            aria-label='close'
            onClick={handleClose}
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
          <Box sx={{ mt: 2 }}>
            <AddServiceForm onClose={handleClose} setServices={setServices} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddServiceDialog
