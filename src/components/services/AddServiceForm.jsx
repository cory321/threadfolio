'use client'

import { useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Box, Button, TextField, MenuItem } from '@mui/material'

import { addService } from '@/app/actions/services'

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

  const handleChange = e => {
    const { name, value } = e.target

    setNewService(prevService => ({
      ...prevService,
      [name]: value
    }))
  }

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
    } catch (error) {
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
      <TextField label='Name' name='name' onChange={handleChange} value={newService.name} disabled={isLoading} />
      <TextField
        label='Description'
        name='description'
        onChange={handleChange}
        value={newService.description}
        disabled={isLoading}
      />
      <TextField
        label='Quantity'
        name='qty'
        type='number'
        onChange={handleChange}
        value={newService.qty}
        disabled={isLoading}
      />
      <TextField select label='Unit' name='unit' onChange={handleChange} value={newService.unit} disabled={isLoading}>
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
        onChange={handleChange}
        value={newService.unit_price}
        disabled={isLoading}
      />
      <TextField
        label='Image URL'
        name='image_url'
        onChange={handleChange}
        value={newService.image_url}
        disabled={isLoading}
      />
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Service'}
      </Button>
    </Box>
  )
}

export default AddServiceForm
