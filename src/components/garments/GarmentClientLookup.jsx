import { useState } from 'react'

import dynamic from 'next/dynamic'

import {
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useTheme,
  useMediaQuery
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { visuallyHidden } from '@mui/utils'

import LoadingSpinner from '@/components/ui/LoadingSpinner'

const AddClientButton = dynamic(() => import('@components/garments/AddClientButton'), {
  ssr: false,
  loading: LoadingSpinner
})

const AddClientInlineForm = dynamic(() => import('@/components/clients/AddClientInlineForm'), {
  ssr: false,
  loading: LoadingSpinner
})

const ClientSearch = dynamic(() => import('@components/clients/ClientSearch'), {
  ssr: false,
  loading: LoadingSpinner
})

const SelectedClientCard = dynamic(() => import('@components/garments/SelectedClientCard'), {
  ssr: false,
  loading: LoadingSpinner
})

const GarmentClientLookup = ({ userId, onClientSelect, selectedClient, setClients }) => {
  const [open, setOpen] = useState(false)
  const [clientType, setClientType] = useState('new')
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClientSelectInternal = client => {
    onClientSelect(client)
    handleClose()
  }

  const handleClientTypeChange = event => setClientType(event.target.value)

  // New function to remove client
  const handleRemoveClient = () => {
    onClientSelect(null) // Clear selected client in context
    localStorage.removeItem('selectedClient') // Remove from localStorage
  }

  return (
    <Grid container spacing={12}>
      <Grid item xs={12} container justifyContent='center' alignItems='center'>
        {selectedClient ? (
          <SelectedClientCard
            client={selectedClient}
            onChangeClient={handleOpen}
            onRemoveClient={handleRemoveClient} // Pass the remove handler
          />
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
              color: theme => theme.palette.grey[900]
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
                sx={{ my: 2, mb: 5 }}
              />
              <FormControlLabel
                value='existing'
                control={<Radio sx={{ transform: 'scale(1.5)' }} />}
                label='Existing client'
                sx={{ my: 2, mb: 5 }}
              />
            </RadioGroup>
          </FormControl>
          {clientType === 'new' ? (
            <AddClientInlineForm
              onClose={handleClose}
              onClientSelect={handleClientSelectInternal}
              setClients={setClients}
            />
          ) : (
            <ClientSearch
              userId={userId}
              onClientSelect={handleClientSelectInternal}
              onClose={handleClose}
              isClientListPage={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default GarmentClientLookup
