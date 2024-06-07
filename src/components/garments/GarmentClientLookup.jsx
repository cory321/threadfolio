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

const AddClientForm = dynamic(() => import('@components/clients/AddClientForm'), {
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

const GarmentClientLookup = ({ userId, onClientSelect, selectedClient }) => {
  const [open, setOpen] = useState(false)
  const [clientType, setClientType] = useState('new')
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClientSelect = client => {
    onClientSelect(client)
    handleClose()
  }

  const handleClientTypeChange = event => setClientType(event.target.value)

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
