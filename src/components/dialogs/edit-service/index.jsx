import React, { useState } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Typography
} from '@mui/material'

import { handleChange, handleUnitPriceBlur, calculateTotalPrice } from '@/utils/serviceUtils'
import serviceUnitTypes from '@/utils/serviceUnitTypes'

const EditServiceModal = ({ service, onClose, onSave, onDelete }) => {
  const [updatedService, setUpdatedService] = useState({
    ...service,
    unit_price: parseFloat(service.unit_price).toFixed(2)
  })

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await onSave(service.id, updatedService)
    setLoading(false)
    onClose()
  }

  const handleDelete = async () => {
    setLoading(true)
    await onDelete(service.id)
    setLoading(false)
    onClose()
  }

  const handleQuantityChange = e => {
    const { value } = e.target
    const parsedValue = parseInt(value, 10)
    const formattedValue = isNaN(parsedValue) ? 0 : parsedValue

    setUpdatedService(prevService => ({
      ...prevService,
      qty: formattedValue
    }))
  }

  return (
    <Dialog open onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Edit Service</DialogTitle>
      <DialogContent>
        <Box display='flex' flexDirection='column' gap={2}>
          <TextField
            name='name'
            label='Name'
            value={updatedService.name}
            onChange={e => handleChange(e, setUpdatedService)}
            disabled={loading}
          />
          <TextField
            name='description'
            label='Description'
            value={updatedService.description}
            onChange={e => handleChange(e, setUpdatedService)}
            disabled={loading}
          />
          <TextField
            name='qty'
            label='Quantity'
            type='number'
            onChange={handleQuantityChange}
            value={updatedService.qty.toString()}
            disabled={loading}
          />
          <TextField
            select
            name='unit'
            label='Unit'
            value={updatedService.unit}
            onChange={e => handleChange(e, setUpdatedService)}
            disabled={loading}
          >
            {Object.values(serviceUnitTypes).map(unit => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name='unit_price'
            label='Unit Price'
            type='number'
            value={updatedService.unit_price}
            onChange={e => handleChange(e, setUpdatedService)}
            onBlur={() => handleUnitPriceBlur(updatedService, setUpdatedService)}
            disabled={loading}
            inputProps={{ step: '0.01' }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>
            }}
          />
          <Typography variant='h6'>Total: {calculateTotalPrice(updatedService)}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color='secondary' disabled={loading}>
          Delete
        </Button>
        <Button onClick={onClose} color='primary' disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} color='primary' disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditServiceModal
