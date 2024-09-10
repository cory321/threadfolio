'use client'

import { useState } from 'react'

import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material'

import AddServiceForm from '@/components/services/AddServiceForm'

const AddServiceDialog = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button variant='contained' color='primary' onClick={handleOpen}>
        Add Service
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby='add-service-dialog-title' maxWidth='xs' fullWidth>
        <DialogTitle id='add-service-dialog-title'>Add Service</DialogTitle>
        <DialogContent>
          <AddServiceForm onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddServiceDialog
