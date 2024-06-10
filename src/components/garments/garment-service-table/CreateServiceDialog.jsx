'use client'

import React, { useState } from 'react'

import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  InputAdornment,
  Typography
} from '@mui/material'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'react-toastify'

import { handleUnitPriceBlur, calculateTotalPrice, handleChange } from '@/utils/serviceUtils'
import { addService } from '@/app/actions/services'
import serviceUnitTypes from '@/utils/serviceUnitTypes'

const CreateServiceDialog = ({ open, onClose, onServiceSelect }) => {
  const { userId, getToken } = useAuth()

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    qty: '0',
    unit: serviceUnitTypes.ITEM,
    unit_price: 0
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (newService.name === '' || newService.unit_price <= 0) return

    const token = await getToken({ template: 'supabase' })

    setIsLoading(true)

    try {
      const newServiceItem = await addService(userId, newService, token)

      onServiceSelect(newServiceItem) // Add the new service to the table
      setNewService({
        name: '',
        description: '',
        qty: '0',
        unit: serviceUnitTypes.ITEM,
        unit_price: 0
      })
      onClose()
      toast.success(`${newServiceItem.name} has been added!`)
    } catch (error) {
      toast.error(`Error adding service: ${error.message}`)
      console.error('Error adding service:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Service</DialogTitle>
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
          type='number'
          fullWidth
          variant='outlined'
          name='unit_price'
          value={newService.unit_price}
          onChange={e => handleChange(e, setNewService)}
          onBlur={() => handleUnitPriceBlur(newService, setNewService)}
          inputProps={{ step: '0.01' }}
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
