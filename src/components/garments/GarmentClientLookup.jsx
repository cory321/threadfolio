// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CloseIcon from '@mui/icons-material/Close'
import { visuallyHidden } from '@mui/utils'

// Component Imports
import AddClientButton from '@components/garments/AddClientButton'
import AddClientForm from '@components/clients/AddClientForm'
import ClientSearch from '@components/clients/ClientSearch'
import SelectedClientCard from '@components/garments/SelectedClientCard'

const GarmentClientLookup = ({ userId, onClientSelect, selectedClient }) => {
  const [open, setOpen] = useState(false)
  const [clientType, setClientType] = useState('new') // new or existing
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClientSelect = client => {
    onClientSelect(client) // Pass the selected client to the parent
    handleClose()
  }

  const handleClientTypeChange = event => {
    setClientType(event.target.value)
  }

  return (
    <Grid container spacing={12}>
      <Grid item xs={12} container justifyContent='center' alignItems='center'>
        {selectedClient ? (
          <SelectedClientCard client={selectedClient} onChangeClient={handleOpen} />
        ) : (
          <AddClientButton onClick={handleOpen} />
        )}
      </Grid>
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} fullWidth maxWidth='sm'>
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
          <FormControl component='fieldset'>
            <FormLabel component='legend' sx={visuallyHidden}>
              Select Client Type
            </FormLabel>
            <RadioGroup
              row
              aria-label='clientType'
              name='clientType'
              value={clientType}
              onChange={handleClientTypeChange}
            >
              <FormControlLabel
                value='new'
                control={<Radio sx={{ transform: 'scale(1.5)' }} />}
                label='Create new client'
                sx={{ my: 2, mb: 5 }} // Add top and bottom margin
              />
              <FormControlLabel
                value='existing'
                control={<Radio sx={{ transform: 'scale(1.5)' }} />}
                label='Existing client'
                sx={{ my: 2, mb: 5 }} // Add top and bottom margin
              />
            </RadioGroup>
          </FormControl>
          {clientType === 'new' ? (
            <AddClientForm onClientSelect={handleClientSelect} onClose={handleClose} />
          ) : (
            <ClientSearch userId={userId} onClientSelect={handleClientSelect} onClose={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default GarmentClientLookup
