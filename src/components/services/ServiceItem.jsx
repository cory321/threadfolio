import React, { useState } from 'react'

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DuplicateIcon from '@mui/icons-material/FileCopy'

import EditServiceModal from '@/components/dialogs/edit-service/'

import { calculateTotalPrice } from '@/utils/serviceUtils'

const ServiceItem = ({ service, onDelete, onEdit, onDuplicate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleSave = async (id, updatedService) => {
    setLoading(true)
    await onEdit(id, updatedService)
    setLoading(false)
    setIsEditing(false)
  }

  const handleDelete = async id => {
    setLoading(true)
    await onDelete(id)
    setLoading(false)
    setIsEditing(false)
  }

  const handleDuplicate = async id => {
    setLoading(true)
    await onDuplicate(id)
    setLoading(false)
    setAnchorEl(null)
  }

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    setIsEditing(true)
    handleMenuClose()
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <Card
        variant='outlined'
        sx={{
          mb: 2,
          width: '100%',
          cursor: 'pointer',
          transition: 'box-shadow 0.1s',
          '&:hover': {
            boxShadow: 3
          }
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={11.5} sx={{ textAlign: 'left' }} onClick={() => !loading && setIsEditing(true)}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} sm={5} sx={{ textAlign: 'left' }}>
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Typography variant='h6'>{service.name}</Typography>
                    <Typography>{service.description}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ textAlign: 'left' }}>
                  <Typography variant='body2' color='textSecondary'>
                    Total Price
                  </Typography>
                  <Typography variant='h5' fontWeight='bold'>
                    {calculateTotalPrice(service)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={0.5} sx={{ textAlign: 'left' }}>
              <Box display='flex' justifyContent='flex-end'>
                <IconButton onClick={handleMenuClick} disabled={loading}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <EditIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary='Edit service' />
                  </MenuItem>
                  <MenuItem onClick={() => handleDuplicate(service.id)}>
                    <ListItemIcon>
                      <DuplicateIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary='Duplicate' />
                  </MenuItem>
                  <MenuItem onClick={() => handleDelete(service.id)}>
                    <ListItemIcon>
                      <DeleteIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary='Delete' />
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {isEditing && (
        <EditServiceModal
          service={service}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}

export default ServiceItem
