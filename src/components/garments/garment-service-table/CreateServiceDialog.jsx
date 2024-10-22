'use client'

import { useState } from 'react'

import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  IconButton,
  InputAdornment,
  Typography,
  Tooltip,
  useMediaQuery
} from '@mui/material'

import InfoIcon from '@mui/icons-material/Info'
import CloseIcon from '@mui/icons-material/Close'

import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'

import { calculateTotalPrice, handleChange } from '@/utils/serviceUtils'
import { addService } from '@/app/actions/services'
import serviceUnitTypes from '@/utils/serviceUnitTypes'
import { formatAsCurrency, parseFloatFromCurrency, formatUnitPrice } from '@/utils/currencyUtils'

const CreateServiceDialog = ({ open, onClose, onServiceSelect }) => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const { userId } = useAuth()

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    qty: '0',
    unit: serviceUnitTypes.ITEM,
    unit_price: 0
  })

  const [isLoading, setIsLoading] = useState(false)
  const [displayUnitPrice, setDisplayUnitPrice] = useState('0.00')

  const [isUnitPriceFocused, setIsUnitPriceFocused] = useState(false)

  const handleUnitPriceChange = e => {
    const rawValue = e.target.value
    const formattedValue = formatAsCurrency(rawValue)

    setDisplayUnitPrice(formattedValue)
    setNewService(prev => ({ ...prev, unit_price: parseFloatFromCurrency(rawValue) }))
  }

  const handleUnitPriceFocus = () => {
    setIsUnitPriceFocused(true)

    if (displayUnitPrice === '0.00' || displayUnitPrice === '') {
      setDisplayUnitPrice('')
    }
  }

  const handleUnitPriceBlur = () => {
    setIsUnitPriceFocused(false)
    formatUnitPrice(displayUnitPrice, setDisplayUnitPrice, setNewService)
  }

  const handleSubmit = async () => {
    if (newService.name === '' || newService.unit_price <= 0) return

    setIsLoading(true)

    try {
      const newServiceItem = await addService(userId, newService)

      onServiceSelect(newServiceItem)
      setNewService({
        name: '',
        description: '',
        qty: '0',
        unit: serviceUnitTypes.ITEM,
        unit_price: 0
      })
      onClose()
      toast.success(`${newServiceItem.name} has been added to your service catalog.`, {
        hideProgressBar: false
      })
    } catch (error) {
      toast.error(`Error adding service: ${error.message}`, {
        hideProgressBar: false
      })
      console.error('Error adding service:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile}>
      <DialogTitle>
        Create New Service
        <Tooltip title='Service will be added to the service catalog' placement='right'>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
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
        <TextField
          margin='dense'
          label='Service Name'
          type='text'
          fullWidth
          variant='outlined'
          name='name'
          value={newService.name}
          onChange={e => handleChange(e, setNewService)}
          disabled={isLoading}
        />
        <TextField
          margin='dense'
          label='Description'
          type='text'
          fullWidth
          variant='outlined'
          name='description'
          value={newService.description}
          onChange={e => handleChange(e, setNewService)}
          disabled={isLoading}
        />
        <TextField
          margin='dense'
          label='Quantity'
          type='number'
          fullWidth
          variant='outlined'
          name='qty'
          value={newService.qty}
          onChange={e => handleChange(e, setNewService)}
          disabled={isLoading}
        />
        <TextField
          select
          margin='dense'
          label='Unit'
          fullWidth
          variant='outlined'
          name='unit'
          value={newService.unit}
          onChange={e => handleChange(e, setNewService)}
          disabled={isLoading}
        >
          {Object.values(serviceUnitTypes).map(unit => (
            <MenuItem key={unit} value={unit}>
              {unit}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin='dense'
          label='Unit Price'
          type='text'
          fullWidth
          variant='outlined'
          name='unit_price'
          value={isUnitPriceFocused ? displayUnitPrice : formatAsCurrency(displayUnitPrice)}
          onChange={handleUnitPriceChange}
          onFocus={handleUnitPriceFocus}
          onBlur={handleUnitPriceBlur}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>
          }}
          disabled={isLoading}
        />
        <Typography variant='h6' mt={2}>
          Total: {calculateTotalPrice(newService)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary' disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color='primary' disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Service'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateServiceDialog
