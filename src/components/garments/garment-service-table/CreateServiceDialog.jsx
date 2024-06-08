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

import { handleUnitPriceBlur, calculateTotalPrice, handleChange } from '@/utils/serviceUtils'
import serviceUnitTypes from '@/utils/serviceUnitTypes'

const CreateServiceDialog = ({ open, onClose, onServiceSelect }) => {
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    qty: '0',
    unit: serviceUnitTypes.ITEM,
    unit_price: 0,
    image_url: ''
  })

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
        />
        <TextField
          margin='dense'
          label='Image URL'
          type='text'
          fullWidth
          variant='outlined'
          name='image_url'
          value={newService.image_url}
          onChange={e => handleChange(e, setNewService)}
        />
        <Typography variant='h6' mt={2}>
          Total: {calculateTotalPrice(newService)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onServiceSelect(newService)
            onClose()
          }}
          color='primary'
        >
          Add Service
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateServiceDialog
