import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Typography
} from '@mui/material'

import serviceUnitTypes from '@/utils/serviceUnitTypes'
import { formatAsCurrency, parseFloatFromCurrency, formatUnitPrice } from '@/utils/currencyUtils'
import { calculateTotalPrice } from '@/utils/serviceUtils'

export default function EditServiceDialog({ open, onClose, service, onSave }) {
  const [updatedService, setUpdatedService] = useState({ ...service })

  const [isUnitPriceFocused, setIsUnitPriceFocused] = useState(false)

  const [displayUnitPrice, setDisplayUnitPrice] = useState(formatAsCurrency(parseFloat(service.unit_price).toFixed(2)))

  const [loading, setLoading] = useState(false)

  // Prevent editing if is_done or is_paid is true
  const isEditable = !service.is_done && !service.is_paid

  const handleChange = e => {
    const { name, value } = e.target

    setUpdatedService(prev => ({ ...prev, [name]: value }))
  }

  const handleUnitPriceChange = e => {
    const rawValue = e.target.value
    const formattedValue = formatAsCurrency(rawValue)

    setDisplayUnitPrice(formattedValue)
    setUpdatedService(prev => ({ ...prev, unit_price: parseFloatFromCurrency(rawValue) }))
  }

  const handleUnitPriceFocus = () => {
    setIsUnitPriceFocused(true)

    if (displayUnitPrice === '0.00' || displayUnitPrice === '') {
      setDisplayUnitPrice('')
    }
  }

  const handleUnitPriceBlur = () => {
    setIsUnitPriceFocused(false)
    formatUnitPrice(displayUnitPrice, setDisplayUnitPrice, setUpdatedService)
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      await onSave(updatedService)
      setLoading(false)
    } catch (error) {
      console.error('Error saving service:', error)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Edit Service</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Service Name'
          type='text'
          fullWidth
          variant='outlined'
          name='name'
          value={updatedService.name}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <TextField
          margin='dense'
          label='Description'
          type='text'
          fullWidth
          variant='outlined'
          name='description'
          value={updatedService.description}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <TextField
          margin='dense'
          label='Quantity'
          type='number'
          fullWidth
          variant='outlined'
          name='qty'
          value={updatedService.qty}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <TextField
          select
          margin='dense'
          label='Unit'
          fullWidth
          variant='outlined'
          name='unit'
          value={updatedService.unit}
          onChange={handleChange}
          disabled={!isEditable}
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
          disabled={!isEditable}
        />
        <Typography variant='h6' mt={2}>
          Total: {calculateTotalPrice(updatedService)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {isEditable && (
          <Button onClick={handleSave} variant='contained' color='primary' disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
