// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CloseIcon from '@mui/icons-material/Close'

// Component Imports
import AddClientButton from '@components/garments/AddClientButton'
import AddContactForm from '@/components/clients/AddContactForm'
import ClientSearch from '@components/clients/ClientSearch'

const GarmentClientLookup = ({ userId }) => {
  const [open, setOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClientSelect = client => {
    setSelectedClient(client)
  }

  return (
    <Grid container spacing={12}>
      <Grid item xs={12} container justifyContent='center' alignItems='center'>
        <AddClientButton onClick={handleOpen} />
      </Grid>
      <Grid item xs={12} container justifyContent='center' alignItems='center'>
        {selectedClient && (
          <div>
            <p>Selected Client ID: {selectedClient.id}</p>
            <p>Selected Client Name: {selectedClient.full_name}</p>
            <p>Selected Client Email: {selectedClient.email}</p>
          </div>
        )}
      </Grid>
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} fullWidth maxWidth='md'>
        <DialogTitle>
          Add Client
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
          <h2>Find Existing Client</h2>
          <ClientSearch userId={userId} onClientSelect={handleClientSelect} />
          <Divider textAlign='center'>or</Divider>
          <h2>Add a New Client</h2>
          <AddContactForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default GarmentClientLookup
