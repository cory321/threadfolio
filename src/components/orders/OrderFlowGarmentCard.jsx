import React, { useContext, useState } from 'react'

import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton
} from '@mui/material'
import { CldImage } from 'next-cloudinary'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EventIcon from '@mui/icons-material/Event'
import CloseIcon from '@mui/icons-material/Close'
import { WarningAmberRounded } from '@mui/icons-material'

import { GarmentServiceOrderContext } from '@/app/contexts/GarmentServiceOrderContext'

const OrderFlowGarmentCard = ({ garment, onEdit }) => {
  const { removeGarment } = useContext(GarmentServiceOrderContext)
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleRemove = () => {
    setConfirmDialogOpen(true)
  }

  const handleConfirmRemove = () => {
    removeGarment(garment.id)
    setConfirmDialogOpen(false)
  }

  const handleCancelRemove = () => {
    setConfirmDialogOpen(false)
  }

  return (
    <Card
      sx={{
        width: '100%',
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        boxShadow: 1,
        position: 'relative', // Make the card position relative for absolute positioning of the close icon
        transition: '0.3s',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      {/* Close Icon Button */}
      <IconButton
        aria-label='remove garment'
        onClick={handleRemove}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'grey.500',
          '&:hover': {
            color: 'grey.800'
          }
        }}
      >
        <CloseIcon />
      </IconButton>

      <CardContent>
        {/* Garment Name */}
        <Typography variant='h6' gutterBottom>
          {garment.name}
        </Typography>
        <Divider />

        {/* Image and Details */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Image Column */}
          <Grid item xs={12} sm={7} md={3} lg={2}>
            <Box
              sx={{
                width: '100%',
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid grey',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              {garment.image_cloud_id ? (
                <CldImage
                  src={garment.image_cloud_id}
                  alt={garment.name}
                  width={150}
                  height={150}
                  crop='fit'
                  quality='auto'
                  fetchformat='auto'
                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100'
                  }}
                >
                  <i className='ri-t-shirt-line' style={{ fontSize: '2rem', color: 'grey' }} />
                </Box>
              )}
            </Box>
          </Grid>

          {/* Details Column */}
          <Grid item xs={12} sm={5} md={9} lg={10}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* Due Date */}
              {garment.due_date && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant='body2'>
                    Due:{' '}
                    {new Date(garment.due_date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Typography>
                </Box>
              )}

              {/* Event Date */}
              {garment.is_event && garment.event_date && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon fontSize='small' sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant='body2'>
                    Event:{' '}
                    {new Date(garment.event_date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Typography>
                </Box>
              )}

              {/* Services */}
              {garment.services && garment.services.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
                    Services:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {garment.services.slice(0, 3).map(service => (
                      <Chip key={service.id} label={service.name} size='small' variant='outlined' />
                    ))}
                    {garment.services.length > 3 && (
                      <Chip label={`+${garment.services.length - 3} more`} size='small' variant='outlined' />
                    )}
                  </Box>
                </Box>
              )}
              {garment.services.length === 0 && (
                <Typography variant='body1' color='error' sx={{ p: 2 }}>
                  Please add services to this garment
                </Typography>
              )}

              {/* Action Buttons: Edit and Remove */}
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant='text' size='small' color='primary' onClick={handleRemove}>
                  Remove
                </Button>
                <Button variant='contained' size='small' onClick={() => onEdit(garment)}>
                  Edit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmDialogOpen}
        onClose={handleCancelRemove}
        aria-labelledby='confirm-remove-title'
        aria-describedby='confirm-remove-description'
      >
        <DialogTitle id='confirm-remove-title'>
          Remove Garment
          {/* Close Icon in Dialog Title */}
          <IconButton
            aria-label='close'
            onClick={handleCancelRemove}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
              '&:hover': {
                color: 'grey.800'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <WarningAmberRounded sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
            <DialogContentText id='confirm-remove-description'>
              Are you sure you want to remove this garment? This action cannot be undone.
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemove} color='primary'>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleConfirmRemove} color='error' autoFocus>
            Remove Garment
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default OrderFlowGarmentCard
