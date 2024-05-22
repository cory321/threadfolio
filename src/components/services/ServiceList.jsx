'use client'

import { useState, Suspense } from 'react'

import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  Typography,
  TextField,
  MenuItem
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import { useAuth } from '@clerk/nextjs'

import { deleteService, editService } from '@/app/actions/services'

const units = ['item', 'hour', 'day', 'week', 'month', 'none']

const ServiceListContent = ({ services, setServices }) => {
  const { getToken } = useAuth()

  const handleDelete = async id => {
    const token = await getToken({ template: 'supabase' })

    try {
      await deleteService(id, token)
      setServices(prevServices => prevServices.filter(service => service.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleEdit = async (id, updatedService) => {
    const token = await getToken({ template: 'supabase' })

    try {
      const updatedServiceItem = await editService(id, updatedService, token)

      setServices(prevServices => prevServices.map(service => (service.id === id ? updatedServiceItem : service)))
    } catch (error) {
      console.error('Error editing service:', error)
    }
  }

  return (
    <Box>
      {services && services.length > 0 ? (
        <List>
          {services.map(service => (
            <ListItem key={service.id}>
              <ServiceItem service={service} onDelete={handleDelete} onEdit={handleEdit} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No services available!</Typography>
      )}
    </Box>
  )
}

const ServiceItem = ({ service, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [updatedService, setUpdatedService] = useState(service)
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target

    setUpdatedService(prevService => ({
      ...prevService,
      [name]: value
    }))
  }

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
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  name='description'
                  label='Description'
                  value={updatedService.description}
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  name='qty'
                  label='Quantity'
                  type='number'
                  value={updatedService.qty}
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  select
                  name='unit'
                  label='Unit'
                  value={updatedService.unit}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  name='image_url'
                  label='Image URL'
                  value={updatedService.image_url}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
            ) : (
              <Box display='flex' flexDirection='column' gap={2}>
                <Typography variant='h6'>{service.name}</Typography>
                <Typography>{service.description}</Typography>
                <Typography>Quantity: {service.qty}</Typography>
                <Typography>Unit: {service.unit}</Typography>
                <Typography>Unit Price: {service.unit_price}</Typography>
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

const ServiceList = ({ services, setServices }) => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ServiceListContent services={services} setServices={setServices} />
    </Suspense>
  )
}

export default ServiceList
