'use client'

import { useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Box, Button, TextField, MenuItem, InputAdornment, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import { addService } from '@/app/actions/services'
import { handleChange, handleUnitPriceBlur, calculateTotalPrice } from '@/utils/serviceUtils'

const units = ['item', 'hour', 'day', 'week', 'month', 'none']

const AddServiceForm = ({ setServices, onClose }) => {
  const { userId, getToken } = useAuth()

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    qty: 0,
    unit: 'item',
    unit_price: 0,
    image_url: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (newService.name === '' || newService.unit_price <= 0) return

    const token = await getToken({ template: 'supabase' })

    setIsLoading(true)

    try {
      const newServiceItem = await addService(userId, newService, token)

      setServices(prevServices => (prevServices ? [...prevServices, newServiceItem] : [newServiceItem]))
      setNewService({ name: '', description: '', qty: 0, unit: 'item', unit_price: 0, image_url: '' })
      onClose()
      toast.success(`${newServiceItem.name} has been added!`)
    } catch (error) {
      toast.error(`Error adding service: ${err}`)
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
        value={newService.qty}
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
        {units.map(unit => (
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
      <TextField
        label='Image URL'
        name='image_url'
        onChange={e => handleChange(e, setNewService)}
        value={newService.image_url}
        disabled={isLoading}
      />
      <Typography variant='h6'>Total: {calculateTotalPrice(newService)}</Typography>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Service'}
      </Button>
    </Box>
  )
}

export default AddServiceForm
