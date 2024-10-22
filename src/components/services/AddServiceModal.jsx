import React from 'react'

import { Dialog, DialogTitle, DialogContent, IconButton, useMediaQuery, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import AddServiceForm from './AddServiceForm'

const AddServiceModal = ({ open, onClose }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth fullScreen={isMobile}>
      <DialogTitle>
        Add Service
        <IconButton
          aria-label='close'
          onClick={onClose}
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
        <AddServiceForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}

export default AddServiceModal
