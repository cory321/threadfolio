import React, { useState } from 'react'

import {
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import BrokenImageIcon from '@mui/icons-material/BrokenImage'

import { handleChange, handleUnitPriceBlur, calculateTotalPrice } from '@/utils/serviceUtils'

const units = ['item', 'hour', 'day', 'week', 'month', 'none']

const ServiceItem = ({ service, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [updatedService, setUpdatedService] = useState(service)
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await onEdit(service.id, updatedService)
    setLoading(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setUpdatedService(service)
  }

  const handleDelete = async () => {
    setLoading(true)
    await onDelete(service.id)
    setLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Card variant='outlined' sx={{ mb: 2, width: '100%' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
              {imageError ? (
                <BrokenImageIcon style={{ fontSize: 50 }} />
              ) : (
                <img
                  src={service.image_url}
                  alt={service.name}
                  style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
                  onError={handleImageError}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            {isEditing ? (
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
                  onChange={e => handleChange(e, setUpdatedService)}
                  value={updatedService.qty}
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
                  {units.map(unit => (
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
                <TextField
                  name='image_url'
                  label='Image URL'
                  value={updatedService.image_url}
                  onChange={e => handleChange(e, setUpdatedService)}
                  disabled={loading}
                />
                <Typography variant='h6'>Total: {calculateTotalPrice(updatedService)}</Typography>
              </Box>
            ) : (
              <Box display='flex' flexDirection='column' gap={2}>
                <Typography variant='h6'>{service.name}</Typography>
                <Typography>{service.description}</Typography>
                <Typography>Total: {calculateTotalPrice(updatedService)}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        {isEditing ? (
          <>
            <IconButton onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <SaveIcon />}
            </IconButton>
            <IconButton onClick={handleCancel} disabled={loading}>
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={() => setIsEditing(true)} disabled={loading}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  )
}

export default ServiceItem
