'use client'

import { useState } from 'react'

import { useAuth } from '@clerk/nextjs'
import { Box, Button, TextField, MenuItem, InputAdornment, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import { addService } from '@/app/actions/services'
import { handleChange, calculateTotalPrice } from '@/utils/serviceUtils'
import serviceUnitTypes from '@/utils/serviceUnitTypes'
import { formatAsCurrency, parseFloatFromCurrency, formatUnitPrice } from '@/utils/currencyUtils'

const AddServiceForm = ({ setServices, onClose }) => {
  const { userId } = useAuth()

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    qty: 0,
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

  const handleSubmit = async e => {
    e.preventDefault()
    if (newService.name === '' || newService.unit_price <= 0) return

    setIsLoading(true)

    try {
      const newServiceItem = await addService(userId, newService)

      // Update the services state in ServicePage
      setServices(prevServices => [...prevServices, newServiceItem])

      setNewService({ name: '', description: '', qty: 0, unit: serviceUnitTypes.ITEM, unit_price: 0 })
      setDisplayUnitPrice('0.00')
      onClose()
      toast.success(`${newServiceItem.name} has been added to your service catalog.`)
    } catch (error) {
      toast.error(`Error adding service: ${error}`)
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
        width: '100%',
        position: 'relative'
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
        type='text'
        onChange={handleUnitPriceChange}
        onFocus={handleUnitPriceFocus}
        onBlur={handleUnitPriceBlur}
        value={isUnitPriceFocused ? displayUnitPrice : formatAsCurrency(displayUnitPrice)}
        disabled={isLoading}
        InputProps={{
          startAdornment: <InputAdornment position='start'>$</InputAdornment>
        }}
      />
      <Typography variant='h6'>Total: {calculateTotalPrice(newService)}</Typography>
      <Box mt={2} display='flex' justifyContent='flex-end' gap={2}>
        <Button variant='outlined' onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' type='submit' disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Service'}
        </Button>
      </Box>
    </Box>
  )
}

export default AddServiceForm
