import React from 'react'

import { Card, CardContent, Typography, Box, Grid, Button, Divider, Chip } from '@mui/material'
import { CldImage } from 'next-cloudinary'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EventIcon from '@mui/icons-material/Event'

const OrderFlowGarmentCard = ({ garment, onEdit }) => {
  return (
    <Card
      sx={{
        width: '100%',
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        boxShadow: 1,
        transition: '0.3s',
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        {/* Garment Name */}
        <Typography variant='h6' gutterBottom>
          {garment.name}
        </Typography>
        <Divider />

        {/* Image and Details */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Image Column */}
          <Grid item xs={12} md={4}>
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
                  crop='fill'
                  quality='auto'
                  fetchformat='auto'
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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
          <Grid item xs={12} md={8}>
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

              {/* Instructions and Notes */}
              {garment.notes && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
                    Instructions:
                  </Typography>
                  <Typography variant='body2'>{garment.notes}</Typography>
                </Box>
              )}

              {/* Edit Button */}
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' size='small' onClick={() => onEdit(garment)}>
                  Edit Garment
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OrderFlowGarmentCard
