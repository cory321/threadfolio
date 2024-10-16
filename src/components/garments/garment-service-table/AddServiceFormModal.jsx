'use client'

import { useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Box, Button, TextField, MenuItem, InputAdornment, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import { addService } from '@/app/actions/services'
import { handleChange, handleUnitPriceBlur, calculateTotalPrice } from '@/utils/serviceUtils'
import serviceUnitTypes from '@/utils/serviceUnitTypes'

const AddServiceFormModal = ({ setResults, onClose }) => {
  const { userId } = useAuth()

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    qty: 0,
    unit: serviceUnitTypes.ITEM,
    unit_price: 0
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (newService.name === '' || newService.unit_price <= 0) return

    setIsLoading(true)

    try {
      const newServiceItem = await addService(userId, newService)

      setResults(prevResults => [...prevResults, newServiceItem])
      setNewService({ name: '', description: '', qty: 0, unit: serviceUnitTypes.ITEM, unit_price: 0 })
      onClose()
      toast.success(`${newServiceItem.name} has been added to your service catalog.`, {
        hideProgressBar: false
      })
    } catch (error) {
      toast.error(`Error adding service: ${error}`, {
        hideProgressBar: false
      })
      console.error('Error adding service:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      component='form'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%'
      }}
      noValidate
      autoComplete='off'
      onSubmit={handleSubmit}
    >
      <TextField
        label='Name'
        name='name'
        onChange={e => handleChange(e, setNewService)}
        value={newService.name}
        disabled={isLoading}
      />
      <TextField
        label='Description'
        name='description'
        onChange={e => handleChange(e, setNewService)}
        value={newService.description}
        disabled={isLoading}
      />
      <TextField
        label='Quantity'
        name='qty'
        type='number'
        onChange={e => handleChange(e, setNewService)}
        value={newService.qty.toString()}
        disabled={isLoading}
      />
      <TextField
        select
        label='Unit'
        name='unit'
        onChange={e => handleChange(e, setNewService)}
        value={newService.unit}
        disabled={isLoading}
      >
        {Object.values(serviceUnitTypes).map(unit => (
          <MenuItem key={unit} value={unit}>
            {unit}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label='Unit Price'
        name='unit_price'
        type='number'
        onChange={e => handleChange(e, setNewService)}
        onBlur={() => handleUnitPriceBlur(newService, setNewService)}
        value={newService.unit_price}
        disabled={isLoading}
        inputProps={{ step: '0.01' }}
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>
        }}
      />
      <Typography variant='h6'>Total: {calculateTotalPrice(newService)}</Typography>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Service'}
      </Button>
    </Box>
  )
}

export default AddServiceFormModal
