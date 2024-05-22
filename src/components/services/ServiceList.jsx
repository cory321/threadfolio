'use client'

import { useState, Suspense } from 'react'

import { Box, CircularProgress, IconButton, List, ListItem, TextField, MenuItem } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
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
        <Box>No services available!</Box>
      )}
    </Box>
  )
}

const ServiceItem = ({ service, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [updatedService, setUpdatedService] = useState(service)
  const [loading, setLoading] = useState(false)

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

  return (
    <Box display='flex' alignItems='center' justifyContent='space-between'>
      {isEditing ? (
        <>
          <TextField name='name' value={updatedService.name} onChange={handleChange} disabled={loading} />
          <TextField name='description' value={updatedService.description} onChange={handleChange} disabled={loading} />
          <TextField name='qty' type='number' value={updatedService.qty} onChange={handleChange} disabled={loading} />
          <TextField select name='unit' value={updatedService.unit} onChange={handleChange} disabled={loading}>
            {units.map(unit => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name='unit_price'
            type='number'
            value={updatedService.unit_price}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField name='image_url' value={updatedService.image_url} onChange={handleChange} disabled={loading} />
          <IconButton onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <SaveIcon />}
          </IconButton>
          <IconButton onClick={handleCancel} disabled={loading}>
            <CancelIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Box>{service.name}</Box>
          <Box>{service.description}</Box>
          <Box>{service.qty}</Box>
          <Box>{service.unit}</Box>
          <Box>{service.unit_price}</Box>
          <Box>
            <img src={service.image_url} alt={service.name} width={50} />
          </Box>
          <IconButton onClick={() => setIsEditing(true)} disabled={loading}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleDelete} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
          </IconButton>
        </>
      )}
    </Box>
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
