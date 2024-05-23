import React, { useState } from 'react'

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  InputAdornment,
  IconButton
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
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm={1} sx={{ textAlign: 'left' }}>
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              height='100%'
              width='100%'
              sx={{
                width: '100%',
                height: '100px',
                overflow: 'hidden',
                borderRadius: '8px'
              }}
            >
              {imageError ? (
                <BrokenImageIcon style={{ fontSize: 50 }} />
              ) : (
                <Box
                  component='img'
                  src={service.image_url}
                  alt={service.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={handleImageError}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={7} sx={{ textAlign: 'left' }}>
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
              </Box>
            ) : (
              <Box display='flex' flexDirection='column' gap={2}>
                <Typography variant='h6'>{service.name}</Typography>
                <Typography>{service.description}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
            <Typography variant='body2' color='textSecondary'>
              Total Price
            </Typography>
            <Typography variant='h5' fontWeight='bold'>
              {calculateTotalPrice(updatedService)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={1} sx={{ textAlign: 'left' }}>
            <Box display='flex' justifyContent='space-between'>
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
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
